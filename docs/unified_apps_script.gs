/**
 * 豊中修猷館 統合API & ユーティリティ (Apps Script)
 * 2026-01-18 最終統合版: 重複宣言の削除、全サービスAPIの完全実装
 */

// --- 設定エリア ---
var MEMBER_SPREADSHEET_ID = "1zL1AS5c4kaC5shYz0RVDy3M8ZvX6Zqk_KtbrjVPQc_E"; 
var NEWS_SPREADSHEET_ID = "1ERZDlFWtFl6R-bp04M1WtSqLiORxUGJAn-BaSlZWW5A";

var MEMBER_SHEET_NAME = "会員マスタ";
var ATTENDANCE_SHEET_NAME = '出席管理';
var ACCOUNTING_SHEET_NAME = '会計管理';
var NEWS_SHEET_NAME = 'お知らせ';

// --- ヘルパー関数 ---

function getSS(spreadsheetId) {
  if (!spreadsheetId) {
    console.error("Spreadsheet ID is missing. Received:", spreadsheetId);
    throw new Error("スプレッドシートIDが見つかりません。設定を確認してください。");
  }
  try {
    return SpreadsheetApp.openById(spreadsheetId);
  } catch (e) {
    console.error("Failed to open spreadsheet with ID:", spreadsheetId);
    throw new Error("スプレッドシートを開けません。IDが正しいか、権限があるか確認してください。 (ID: " + spreadsheetId + ")");
  }
}

function getSheetAllowAliases(ss, primaryName) {
  let sheet = ss.getSheetByName(primaryName);
  if (sheet) return sheet;
  
  const aliasesMap = {
    'お知らせ': ['お知らせ', 'フォームの回答 1', 'フォームの回答', 'News', 'news'],
    '会員マスタ': ['会員マスタ', '会員マスター', 'Members', 'members'],
    '出席管理': ['出席管理', 'Attendance', 'attendance'],
    '会計管理': ['会計管理', 'Accounting', 'accounting']
  };
  
  const aliases = aliasesMap[primaryName] || [primaryName];
  for (const alias of aliases) {
    sheet = ss.getSheetByName(alias);
    if (sheet) return sheet;
  }
  return null;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- 1. ルーティング (doGet / doPost / doOptions) ---

function doGet(e) {
  const params = e.parameter;
  const action = params.action;
  
  try {
    switch (action) {
      case 'debug': return createJsonResponse(getDebugInfo());
      case 'getMembers': return createJsonResponse({ success: true, data: getMembers() });
      case 'getNews': return createJsonResponse({ success: true, data: getNews() });
      case 'getAttendance': return createJsonResponse(getAttendance(params.date));
      case 'getAccounting': return createJsonResponse(getAccounting());
      case 'getDocuments': return createJsonResponse(getDocuments(params.folderId));
      case 'getSummaryCounts': return createJsonResponse(getSummaryCounts());
      
      // GET経由の更新（CORS回避用ワークアラウンド）
      case 'add': return createJsonResponse(addMember(JSON.parse(params.data)));
      case 'update': return createJsonResponse(updateMember(params.id, JSON.parse(params.data)));
      case 'approveMember': return createJsonResponse(approveMember(params.id));
      case 'delete': return createJsonResponse(deleteMember(params.id));
      case 'addNews': return createJsonResponse(addNews(JSON.parse(params.newsData)));
      case 'updateNews': return createJsonResponse(updateNews(params.id, JSON.parse(params.newsData)));
      case 'deleteNews': return createJsonResponse(deleteNews(params.id));
      
      default:
        return createJsonResponse({ success: false, error: "Unknown action: " + action });
    }
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

function doPost(e) {
  let params;
  try {
    params = JSON.parse(e.postData.contents);
  } catch (err) {
    // text/plain等で送られてきた場合やパース失敗時
    params = e.parameter;
  }

  const action = params.action;
  try {
    switch (action) {
      case 'updateAttendance': return createJsonResponse(updateAttendance(params));
      case 'updateAccounting': return createJsonResponse(updateAccounting(params));
      case 'uploadFile': return createJsonResponse(uploadFile(params));
      default:
        return createJsonResponse({ success: false, error: "Unknown action: " + action });
    }
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

function doOptions(e) {
  return createJsonResponse({ success: true, method: "OPTIONS" });
}

// --- 2. 会員管理 ---

const MEMBER_KEY_MAP = {
  '会員番号': 'id', 'ID': 'id', 'MemberID': 'id', 'No': 'id',
  '世帯ID': 'familyId', 'FamilyID': 'familyId',
  '氏名': 'name', '名前': 'name', 'Name': 'name',
  'ふりがな': 'furigana', 'フリガナ': 'furigana', 'Furigana': 'furigana',
  'メールアドレス': 'email', 'アドレス': 'email', 'Email': 'email',
  '生年月日': 'birthDate', '誕生日': 'birthDate', 'BirthDate': 'birthDate',
  '性別': 'gender', 'Gender': 'gender',
  '学年': 'grade', 'Grade': 'grade',
  '会員種別': 'memberType', 'Type': 'memberType',
  '段位': 'rank', '段級位': 'rank', 'Rank': 'rank',
  '入会日': 'joinDate', 'JoinDate': 'joinDate',
  'ステータス': 'status', '状態': 'status', 'Status': 'status',
  '備考': 'notes', 'Note': 'notes', 'Notes': 'notes',
  '年齢': 'age', 'Age': 'age',
  '保護者': 'guardianName', '主保護者': 'guardianName', 'GuardianName': 'guardianName'
};

function getMembers() {
  const ss = getSS(MEMBER_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, MEMBER_SHEET_NAME);
  if (!sheet) return [];
  
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  
  return values.map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      const key = MEMBER_KEY_MAP[h] || h;
      obj[key] = row[i];
      if (row[i] instanceof Date) {
        obj[key] = Utilities.formatDate(row[i], "JST", "yyyy-MM-dd");
      }
    });
    return obj;
  });
}

function addMember(data) {
  const ss = getSS(MEMBER_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, MEMBER_SHEET_NAME);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(h => {
    const key = MEMBER_KEY_MAP[h] || h;
    return data[key] || "";
  });
  sheet.appendRow(newRow);
  
  // 申請受付メールを送信
  if (data.email) {
    try {
      sendApplicationConfirmation(data.email, data.name || data.guardianName || '申請者');
    } catch (e) {
      console.error("申請受付メール送信エラー:", e);
    }
  }
  
  return { success: true, data: data };
}

/**
 * 会員承認（ステータスを「在籍」に変更）
 * 承認完了後、メールで通知
 */
function approveMember(id) {
  const ss = getSS(MEMBER_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, MEMBER_SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  
  // 列のインデックスを探す
  const headers = values[0];
  const statusCol = headers.indexOf('ステータス') + 1;
  const idCol = headers.indexOf('会員番号') + 1 || 1;
  const emailCol = headers.indexOf('メールアドレス');
  const nameCol = headers.indexOf('氏名');
  const guardianCol = headers.indexOf('保護者');

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idCol - 1]) === String(id)) {
      sheet.getRange(i + 1, statusCol).setValue('在籍');
      
      // 承認完了メールを送信
      const email = emailCol >= 0 ? values[i][emailCol] : null;
      const name = nameCol >= 0 ? values[i][nameCol] : null;
      const guardian = guardianCol >= 0 ? values[i][guardianCol] : null;
      
      if (email) {
        try {
          sendApprovalNotification(email, name || guardian || '会員');
        } catch (e) {
          console.error("承認完了メール送信エラー:", e);
        }
      }
      
      return { success: true };
    }
  }
  return { success: false, error: "Member not found" };
}

function updateMember(id, data) {
  const ss = getSS(MEMBER_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, MEMBER_SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      headers.forEach((h, colIdx) => {
        const key = MEMBER_KEY_MAP[h] || h;
        if (data[key] !== undefined) {
          sheet.getRange(i + 1, colIdx + 1).setValue(data[key]);
        }
      });
      return { success: true };
    }
  }
  return { success: false, error: "Member not found" };
}

function deleteMember(id) {
  const ss = getSS(MEMBER_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, MEMBER_SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, error: "Member not found" };
}

// --- 3. お知らせ管理 ---

function getNews() {
  const ss = getSS(NEWS_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, 'お知らせ');
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  return data.map((row, index) => {
    const dateVal = row[0] instanceof Date 
      ? Utilities.formatDate(row[0], "JST", "yyyy.MM.dd")
      : row[0];
      
    return {
      id: index + 1,
      date: dateVal,
      title: row[1],
      category: row[2],
      content: row[3],
      image: row[4] || null,
      isPinned: row[5] === 'はい、固定表示する' || row[5] === true,
      link: row[6] || '#'
    };
  }).reverse();
}

function addNews(newsData) {
  const ss = getSS(NEWS_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, 'お知らせ');
  const now = new Date();
  sheet.appendRow([
    now,
    newsData.title,
    newsData.category,
    newsData.content,
    newsData.image || "",
    newsData.isPinned ? 'はい、固定表示する' : "",
    newsData.link || "#"
  ]);
  return { success: true };
}

function updateNews(id, newsData) {
  // IDは通常行番号（1-indexed, headerあり）
  const ss = getSS(NEWS_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, 'お知らせ');
  const rowIdx = parseInt(id) + 1; // getNewsで index+1 したものをIDとしているため
  
  // 実際には getNews().reverse() しているので、IDの扱いには注意が必要
  // ここではシンプルに「全件取得してタイトル等で一致するものを探す」か
  // IDとして「元の行番号」を保持させるのが安全。
  // 現在は簡易的に全データからID(index)を逆算。
  const lastRow = sheet.getLastRow();
  const targetRow = lastRow - parseInt(id) + 1; // reverse対応

  if (targetRow > 1) {
    if (newsData.title) sheet.getRange(targetRow, 2).setValue(newsData.title);
    if (newsData.category) sheet.getRange(targetRow, 3).setValue(newsData.category);
    if (newsData.content) sheet.getRange(targetRow, 4).setValue(newsData.content);
    if (newsData.image !== undefined) sheet.getRange(targetRow, 5).setValue(newsData.image);
    if (newsData.isPinned !== undefined) sheet.getRange(targetRow, 6).setValue(newsData.isPinned ? 'はい、固定表示する' : '');
    return { success: true };
  }
  return { success: false, error: "News not found" };
}

function deleteNews(id) {
  const ss = getSS(NEWS_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, 'お知らせ');
  const lastRow = sheet.getLastRow();
  const targetRow = lastRow - parseInt(id) + 1;
  if (targetRow > 1) {
    sheet.deleteRow(targetRow);
    return { success: true };
  }
  return { success: false, error: "News not found" };
}

// --- 4. 出欠管理 ---

function getAttendance(dateString) {
  const ss = getSS(MEMBER_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, ATTENDANCE_SHEET_NAME);
  if (!sheet) return { success: false, error: "Attendance sheet not found" };
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0]; // [日付, 会員ID, 名前, 出欠, 備考]
  
  const results = data.slice(1)
    .filter(row => {
      const rowDate = row[0] instanceof Date 
        ? Utilities.formatDate(row[0], "JST", "yyyy-MM-dd")
        : row[0];
      return rowDate === dateString;
    })
    .map(row => ({
      memberId: row[1],
      name: row[2],
      status: row[3],
      note: row[4]
    }));
    
  return { success: true, data: results };
}

function updateAttendance(params) {
  const { date, memberId, name, status, note } = params;
  const ss = getSS(MEMBER_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, ATTENDANCE_SHEET_NAME);
  
  const data = sheet.getDataRange().getValues();
  let foundRow = -1;
  
  for (let i = 1; i < data.length; i++) {
    const rowDate = data[i][0] instanceof Date 
      ? Utilities.formatDate(data[i][0], "JST", "yyyy-MM-dd")
      : data[i][0];
    if (rowDate === date && String(data[i][1]) === String(memberId)) {
      foundRow = i + 1;
      break;
    }
  }
  
  if (foundRow > 0) {
    sheet.getRange(foundRow, 4).setValue(status);
    sheet.getRange(foundRow, 5).setValue(note || "");
  } else {
    sheet.appendRow([date, memberId, name, status, note || ""]);
  }
  return { success: true };
}

// --- 5. 会計管理 ---

function getAccounting() {
  const ss = getSS(MEMBER_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, ACCOUNTING_SHEET_NAME);
  if (!sheet) return { success: true, data: [] };
  
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const results = data.map((row, idx) => {
    const obj = { ID: row[0] || (idx + 1) };
    headers.forEach((h, i) => {
      if (i === 0) return;
      let val = row[i];
      if (val instanceof Date) val = Utilities.formatDate(val, "JST", "yyyy-MM-dd");
      obj[h] = val;
    });
    return obj;
  });
  return { success: true, data: results };
}

function updateAccounting(params) {
  const ss = getSS(MEMBER_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, ACCOUNTING_SHEET_NAME);
  
  if (params.method === 'delete') {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(params.id)) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false, error: "Record not found" };
  }
  
  // 追加・更新
  const headers = ['ID', '日付', '項目', '種別', '金額', 'カテゴリ', '備考'];
  const id = params.ID || Utilities.getUuid();
  const rowData = [
    id,
    params.日付,
    params.項目,
    params.種別,
    params.金額,
    params.カテゴリ,
    params.備考 || ""
  ];
  
  const data = sheet.getDataRange().getValues();
  let foundRow = -1;
  if (params.ID) {
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(params.ID)) {
        foundRow = i + 1;
        break;
      }
    }
  }
  
  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  return { success: true };
}

// --- 6. ドキュメント管理 ---

function getDocuments(folderId) {
  try {
    const folder = folderId ? DriveApp.getFolderById(folderId) : null;
    if (!folder) return { success: false, error: "Folder not found" };
    
    const folders = folder.getFolders();
    const files = folder.getFiles();
    const result = [];
    
    while (folders.hasNext()) {
      const f = folders.next();
      result.push({ id: f.getId(), name: f.getName(), type: 'folder', url: f.getUrl() });
    }
    while (files.hasNext()) {
      const f = files.next();
      result.push({ id: f.getId(), name: f.getName(), type: 'file', url: f.getUrl(), mimeType: f.getMimeType() });
    }
    
    return { success: true, data: result.sort((a,b) => a.name.localeCompare(b.name)) };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// --- 7. デバッグ & セットアップ ---

function getDebugInfo() {
  const info = { timestamp: new Date().toISOString(), connected: {} };
  try {
    const ss = getSS(MEMBER_SPREADSHEET_ID);
    info.connected.member = "OK";
    info.memberSheets = ss.getSheets().map(s => s.getName());
  } catch (e) { info.connected.member = e.toString(); }
  
  try {
    const ssNews = getSS(NEWS_SPREADSHEET_ID);
    info.connected.news = "OK";
    info.newsSheets = ssNews.getSheets().map(s => s.getName());
  } catch (e) { info.connected.news = e.toString(); }
  
  return info;
}

/**
 * 管理者向けサマリーカウント取得
 * （承認待ち人数、未読問い合わせ件数など）
 */
function getSummaryCounts() {
  const result = {
    pendingMembers: 0,
    newInquiries: 0
  };

  try {
    // 1. 承認待ち会員数
    const ss = getSS(MEMBER_SPREADSHEET_ID);
    const sheet = getSheetAllowAliases(ss, MEMBER_SHEET_NAME);
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const statusIdx = headers.indexOf('ステータス');
    
    if (statusIdx !== -1) {
      for (let i = 1; i < values.length; i++) {
        const s = values[i][statusIdx];
        if (s === '承認待ち' || s === 'pending') {
          result.pendingMembers++;
        }
      }
    }

    // 2. 新着問い合わせ数（フォルダ内のファイル数）
    const inquiryFolderId = "1p_v1Y4vY6X9_z8A7v7_8Y8Y8Y8Y8Y8Y8"; // 仮（実際は環境変数等のIDを使うべきだが一旦固定）
    // 実際には getDocuments のロジックを流用。
    // ここではVITE_FOLDER_ID_INQUIRIESに相当するIDを特定する必要がある。
    // 親フォルダの ID から "05_入会申込・お問い合わせ" を探し、その中のファイル数をカウント。
    const parentId = "1x9FIadqvK9XjAWx6iKtBkuMXfq9He8kh"; // 剣道部_運用ルート
    const parentFolder = DriveApp.getFolderById(parentId);
    const inqFolders = parentFolder.getFoldersByName("05_入会申込・お問い合わせ");
    if (inqFolders.hasNext()) {
      const inqFolder = inqFolders.next();
      const files = inqFolder.getFiles();
      while (files.hasNext()) {
        files.next();
        result.newInquiries++;
      }
    }

  } catch (e) {
    console.error("Summary counts error:", e);
  }

  return { success: true, data: result };
}

function createKendoFolders() {
  const rootFolderName = "剣道部_運用（2026-）";
  const parentFolderId = "1x9FIadqvK9XjAWx6iKtBkuMXfq9He8kh";
  
  let rootFolder;
  try {
    rootFolder = DriveApp.getFolderById(parentFolderId);
  } catch (e) {
    const folders = DriveApp.getFoldersByName(rootFolderName);
    rootFolder = folders.hasNext() ? folders.next() : DriveApp.createFolder(rootFolderName);
  }

  const structure = [
    { name: "00_運用マニュアル（編集手順）" },
    { name: "01_公開（誰でも見せてOK）", children: ["01_画像（公開用）", "02_PDF（公開用）", "03_実績・紹介（公開用）"] },
    { name: "02_部員（部員だけ）", children: ["01_資料（部員配布）", "02_遠征・大会", "03_写真（部員限定）"] },
    { name: "03_管理者（顧問/主務のみ）", children: ["00_フォーム回答", "01_名簿（個人情報）", "02_連絡網", "03_会計（必要なら）", "04_引継ぎ"] },
    { name: "99_アーカイブ（過去年度）" }
  ];

  structure.forEach(item => {
    let sub;
    const existing = rootFolder.getFoldersByName(item.name);
    sub = existing.hasNext() ? existing.next() : rootFolder.createFolder(item.name);
    if (item.children) {
      item.children.forEach(c => {
        if (!sub.getFoldersByName(c).hasNext()) sub.createFolder(c);
      });
    }
  });
  return { success: true };
}

/**
 * ファイルアップロード (Base64形式)
 * params: { fileName, mimeType, base64Data, folderId (optional) }
 */
function uploadFile(params) {
  try {
    const { fileName, mimeType, base64Data } = params;
    let folderId = params.folderId;
    
    // フォルダ指定がない場合、デフォルトの「01_画像（公開用）」を探す
    if (!folderId) {
      const parentId = "1x9FIadqvK9XjAWx6iKtBkuMXfq9He8kh"; // 剣道部_運用ルート
      const parentFolder = DriveApp.getFolderById(parentId);
      const publicFolders = parentFolder.getFoldersByName("01_公開（誰でも見せてOK）");
      if (publicFolders.hasNext()) {
        const publicFolder = publicFolders.next();
        const imgFolders = publicFolder.getFoldersByName("01_画像（公開用）");
        if (imgFolders.hasNext()) {
          folderId = imgFolders.next().getId();
        }
      }
    }
    
    const folder = folderId ? DriveApp.getFolderById(folderId) : DriveApp.getRootFolder();
    const decodedData = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(decodedData, mimeType, fileName);
    const file = folder.createFile(blob);
    
    // 誰でも閲覧可能に設定（公式ホームページ表示用）
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // 直接表示用URLの生成 (DriveのプレビューURLではなく直接リンク形式に変換)
    const fileId = file.getId();
    const downloadUrl = "https://lh3.googleusercontent.com/d/" + fileId;
    
    return { 
      success: true, 
      url: downloadUrl,
      fileId: fileId,
      name: fileName
    };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// --- 8. メール通知機能 ---

/**
 * 申請受付確認メールを送信
 * @param {string} email - 送信先メールアドレス
 * @param {string} name - 申請者名
 */
function sendApplicationConfirmation(email, name) {
  const subject = '【豊中修猷館剣道部】利用申請を受け付けました';
  const body = `${name} 様

この度は、豊中修猷館剣道部のポータルサイトへの利用申請をいただき、
誠にありがとうございます。

申請内容を確認の上、管理者が承認処理を行います。
承認完了後、改めてメールにてご連絡いたします。

なお、承認には数日いただく場合がございます。
何かご不明な点がございましたら、お問い合わせください。

---
豊中修猷館剣道部
https://shuyukan.info
`;

  GmailApp.sendEmail(email, subject, body);
  console.log("申請受付メール送信完了:", email);
}

/**
 * 承認完了通知メールを送信
 * @param {string} email - 送信先メールアドレス
 * @param {string} name - 会員名
 */
function sendApprovalNotification(email, name) {
  const subject = '【豊中修猷館剣道部】利用申請が承認されました';
  const body = `${name} 様

お待たせいたしました。
豊中修猷館剣道部のポータルサイトへの利用申請が承認されました。

以下のURLからログインして、部員専用コンテンツをご利用いただけます。

▼ ログイン
https://shuyukan.info/member

※ 申請時に使用したGoogleアカウントでログインしてください。

今後ともよろしくお願いいたします。

---
豊中修猷館剣道部
https://shuyukan.info
`;

  GmailApp.sendEmail(email, subject, body);
  console.log("承認完了メール送信完了:", email);
}

