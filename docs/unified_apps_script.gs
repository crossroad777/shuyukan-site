/**
 * 豊中修猷館 統合API & ユーティリティ (Apps Script)
 * 2026-01-18 最終統合版: 重複宣言の削除、全サービスAPIの完全実装
 */

// --- 設定エリア ---
var MEMBER_SPREADSHEET_ID = "1zL1AS5c4kaC5shYz0RVDy3M8ZvX6Zqk_KtbrjVPQc_E"; 
var NEWS_SPREADSHEET_ID = "1ERZDlFWtFl6R-bp04M1WtSqLiORxUGJAn-BaSlZWW5A";

var MEMBER_SHEET_NAME = "会員マスター";
var ATTENDANCE_SHEET_NAME = '出欠管理';
var ACCOUNTING_SHEET_NAME = '会費管理';
var NEWS_SHEET_NAME = 'お知らせ';
var INTERNAL_ANNOUNCEMENTS_SHEET_NAME = '部員向けお知らせ';

// メール権限承認用のダミー関数
function testMailAuthorization() {
  // 管理者メール宛にテスト送信を行い、承認を促します
  GmailApp.sendEmail("shuyukan.info@gmail.com", "権限確認", "このメールが届けば、メール送信権限の承認は完了です。");
}

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
    '会員マスター': ['会員マスター', '会員マスタ', 'Members', 'members'],
    '出欠管理': ['出欠管理', '出席管理', 'Attendance', 'attendance'],
    '会費管理': ['会費管理', '会計管理', 'Accounting', 'accounting'],
    '世帯マスター': ['世帯マスター', '世帯マスタ', 'Families', 'families'],
    '問い合わせ': ['問い合わせ', 'お問い合わせ', '回答_お問い合わせ', 'フォームの回答 1']
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
      case 'getAttendance':
        const attendDate = e.parameter.date || Utilities.formatDate(new Date(), "JST", "yyyy-MM-dd");
        return createJsonResponse(getAttendance(attendDate));
      case 'getAccounting': return createJsonResponse(getAccounting());
      case 'getDocuments': return createJsonResponse(getDocuments(params.folderId));
      case 'getSummaryCounts': return createJsonResponse(getSummaryCountsEnhanced()); // Use enhanced version
      case 'debugInquiry': return createJsonResponse(debugInquiry());
      case 'submitInquiry': return createJsonResponse(submitInquiry(JSON.parse(params.data)));
      case 'getDebugInfo': return createJsonResponse(getDebugInfo());
      case 'getSheets': return createJsonResponse(getSheetsInfo()); // New debug action
      
      // GET経由の更新（CORS回避用ワークアラウンド）
      case 'add': return createJsonResponse(addMember(JSON.parse(params.data)));
      case 'update': return createJsonResponse(updateMember(params.id, JSON.parse(params.data)));
      case 'approveMember': return createJsonResponse(approveMember(params.id));
      case 'delete': return createJsonResponse(deleteMember(params.id));
      case 'getInquiries': return createJsonResponse(getInquiries());
      case 'replyToInquiry': return createJsonResponse(replyToInquiry(params.id, params.email, params.message));
      case 'deleteInquiry': return createJsonResponse(deleteInquiry(params.id));
      case 'setupProfile': return createJsonResponse(setupProfile(params.email, JSON.parse(params.data)));
      case 'addNews': return createJsonResponse(addNews(JSON.parse(params.newsData)));
      case 'updateNews': return createJsonResponse(updateNews(params.id, JSON.parse(params.newsData)));
      case 'deleteNews': return createJsonResponse(deleteNews(params.id));
      
      // 部員向けお知らせ
      case 'getInternalAnnouncements': return createJsonResponse({ success: true, data: getInternalAnnouncements() });
      case 'addInternalAnnouncement': return createJsonResponse(addInternalAnnouncement(JSON.parse(params.announcementData)));
      case 'deleteInternalAnnouncement': return createJsonResponse(deleteInternalAnnouncement(params.id));
      
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
      // 会員管理
      case 'getMembers': return createJsonResponse({ success: true, data: getMembers() });
      case 'add': return createJsonResponse(addMember(params.data));
      case 'update': return createJsonResponse(updateMember(params.id, params.data));
      case 'approveMember': return createJsonResponse(approveMember(params.id));
      case 'delete': return createJsonResponse(deleteMember(params.id, params.data));
      case 'getInquiries': return createJsonResponse(getInquiries());
      case 'replyToInquiry': return createJsonResponse(replyToInquiry(params.id, params.email, params.message));
      case 'deleteInquiry': return createJsonResponse(deleteInquiry(params.id));
      case 'setupProfile': return createJsonResponse(setupProfile(params.email, params.data));
      
      // ニュース管理
      case 'getNews': return createJsonResponse({ success: true, data: getNews() });
      case 'addNews': return createJsonResponse(addNews(params.newsData));
      case 'updateNews': return createJsonResponse(updateNews(params.id, params.newsData));
      case 'deleteNews': return createJsonResponse(deleteNews(params.id));
      
      // その他
      case 'updateAttendance': return createJsonResponse(updateAttendance(params));
      case 'updateAccounting': return createJsonResponse(updateAccounting(params));
      case 'uploadFile': return createJsonResponse(uploadFile(params));
      case 'submitInquiry': return createJsonResponse(submitInquiry(params.data));
      
      // 部員向けお知らせ
      case 'getInternalAnnouncements': return createJsonResponse({ success: true, data: getInternalAnnouncements() });
      case 'addInternalAnnouncement': return createJsonResponse(addInternalAnnouncement(params.announcementData));
      case 'deleteInternalAnnouncement': return createJsonResponse(deleteInternalAnnouncement(params.id));
      
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
  '権限': 'role', 'Role': 'role',
  'メールアドレス': 'email', 'アドレス': 'email', 'Email': 'email',
  '生年月日': 'birthDate', '誕生日': 'birthDate', 'BirthDate': 'birthDate',
  '性別': 'gender', 'Gender': 'gender',
  '学年': 'grade', 'Grade': 'grade',
  '会員種別': 'memberType', '区分': 'memberType', 'Type': 'memberType',
  '段位': 'rank', '段級位': 'rank', 'Rank': 'rank',
  '入会日': 'joinDate', 'JoinDate': 'joinDate',
  'ステータス': 'status', '状態': 'status', 'Status': 'status',
  '備考': 'notes', 'Note': 'notes', 'Notes': 'notes',
  '年齢': 'age', 'Age': 'age',
  '保護者': 'guardianName', '主保護者': 'guardianName', 'GuardianName': 'guardianName',
  'プロフィール登録済': 'profileSetupDone', 'ProfileSetupDone': 'profileSetupDone'
};

const NEWS_KEY_MAP = {
  'ID': 'id', 'id': 'id', '番号': 'id',
  '日付': 'date', 'Date': 'date', 'タイムスタンプ': 'date', 'Timestamp': 'date',
  'タイトル': 'title', 'Title': 'title', '見出し': 'title',
  'カテゴリ': 'category', 'Category': 'category', '分類': 'category',
  '内容': 'content', '本文': 'content', 'Content': 'content', '詳細': 'content',
  '画像': 'image', 'Image': 'image', '写真': 'image', '画像（任意）': 'image',
  '固定': 'isPinned', '固定表示': 'isPinned', 'Pinned': 'isPinned',
  'リンク': 'link', 'Link': 'link', 'URL': 'link', 'link': 'link'
};

/**
 * 会員種別から少年部/一般部を判定するヘルパー関数
 */
function determineMemberCategory(value) {
  if (!value) return '一般部';
  const v = String(value);
  // 少年部: 小, 中, 幼, 年少, 年中, 年長
  if (v.includes('小') || v.includes('中') || v.includes('幼') || 
      v.includes('年少') || v.includes('年中') || v.includes('年長')) {
    return '少年部';
  }
  // 一般部: 高, 一般, 大学, その他
  return '一般部';
}

function getMembers() {
  const ss = getSS(MEMBER_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, MEMBER_SHEET_NAME);
  if (!sheet) return [];
  
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  
  return values.map((row, rowIndex) => {
    const obj = {};
    headers.forEach((h, i) => {
      const key = MEMBER_KEY_MAP[h] || h;
      obj[key] = row[i];
      if (row[i] instanceof Date) {
        obj[key] = Utilities.formatDate(row[i], "JST", "yyyy-MM-dd");
      }
    });
    // IDがない場合は行番号をIDとして使用（行番号は2から始まる：ヘッダー+1）
    if (!obj.id) {
      obj.id = String(rowIndex + 2);
    }
    
    // 「会員種別」列の値を grade にコピーし、memberType を自動判定
    // スプレッドシートの「会員種別」には学年データ（一般、高3、小6等）が入っている
    if (obj.memberType && !obj.grade) {
      obj.grade = obj.memberType; // 元の値を grade に保持
    }
    // memberType を「少年部」/「一般部」に正規化
    const originalValue = obj.grade || obj.memberType;
    obj.memberType = determineMemberCategory(originalValue);
    
    return obj;
  });
}


function addMember(data) {
  const ss = getSS(MEMBER_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, MEMBER_SHEET_NAME);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // フロントエンドから送信されたデータを調整
  // 「会員種別」列には grade (学年データ) を書き込む
  const adjustedData = { ...data };
  if (adjustedData.grade) {
    adjustedData.memberType = adjustedData.grade;
  }
  
  const newRow = headers.map(h => {
    const key = MEMBER_KEY_MAP[h] || h;
    return adjustedData[key] || "";
  });
  sheet.appendRow(newRow);
  
  // 申請受付メールを送信
  if (data.email) {
    try {
      // 申請者本人への確認メール
      sendApplicationConfirmation(data.email, data.name || data.guardianName || '申請者');
      
      // 管理者への通知メール
      notifyAdminNewApplication(data);
    } catch (e) {
      console.error("メール送信プロセスエラー:", e);
    }
  }
  
  return { success: true, data: data };
}

/**
 * 会員承認（ステータスを「在籍」に変更）
 * 承認完了後、メールで通知
 */
function approveMember(id) {
  try {
    const ss = getSS(MEMBER_SPREADSHEET_ID);
    const sheet = getSheetAllowAliases(ss, MEMBER_SHEET_NAME);
    if (!sheet) throw new Error("Member sheet not found");
    const values = sheet.getDataRange().getValues();
    
    // 列のインデックスを探す
    const headers = values[0];
    const statusCol = headers.indexOf('ステータス') + 1;
    const idCol = headers.indexOf('会員番号');
    const emailCol = headers.indexOf('メールアドレス');
    const nameCol = headers.indexOf('氏名');
    const guardianCol = headers.indexOf('保護者');

    if (statusCol <= 0) throw new Error("Status column not found");

    // IDを安全に文字列化
    const targetId = String(id).trim();
    const isRowBasedId = /^\d+$/.test(targetId);
    
    for (let i = 1; i < values.length; i++) {
      const rowNumber = i + 1;
      let matched = false;
      
      if (isRowBasedId && String(rowNumber) === targetId) {
        matched = true;
      } else if (idCol >= 0 && String(values[i][idCol]).trim() === targetId) {
        matched = true;
      }
      
      if (matched) {
        sheet.getRange(rowNumber, statusCol).setValue('在籍');
        
        // 承認完了メールを送信
        const email = emailCol >= 0 ? values[i][emailCol] : null;
        const name = nameCol >= 0 ? values[i][nameCol] : null;
        const guardian = guardianCol >= 0 ? values[i][guardianCol] : null;
        
        if (email) {
          try {
            sendApprovalNotification(email, name || guardian || '会員');
          } catch (e) {
            console.error("承認完了メール送信エラー:", e.toString());
          }
        }
        
        return { success: true };
      }
    }
    return { success: false, error: "Member not found: " + targetId };
  } catch (err) {
    console.error("approveMember error:", err.toString());
    return { success: false, error: err.toString() };
  }
}



function updateMember(id, data) {
  try {
    const ss = getSS(MEMBER_SPREADSHEET_ID);
    const sheet = getSheetAllowAliases(ss, MEMBER_SHEET_NAME);
    if (!sheet) throw new Error("Member sheet not found");
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const idCol = headers.indexOf('会員番号');
    
    const targetId = String(id).trim();
    const isRowBasedId = /^\d+$/.test(targetId);
    
    // フロントエンドから送信されたデータを調整
    // 「会員種別」列には grade (学年データ) を書き込む
    // memberType (少年部/一般部) は自動計算なので無視
    const adjustedData = { ...data };
    if (adjustedData.grade) {
      // grade の値を「会員種別」列に書き込むため memberType にコピー
      adjustedData.memberType = adjustedData.grade;
    }
    
    for (let i = 1; i < values.length; i++) {
      const rowNumber = i + 1;
      let matched = false;
      
      // IDマッチングロジック
      if (isRowBasedId && String(rowNumber) === targetId) {
        matched = true;
      } else if (idCol >= 0 && String(values[i][idCol]).trim() === targetId) {
        matched = true;
      } else if (String(values[i][0]).trim() === targetId) {
        matched = true;
      }
      
      if (matched) {
        // 現在の行データを取得し、渡されたデータで上書き
        const currentRow = values[i];
        const newRow = headers.map((h, colIdx) => {
          const key = MEMBER_KEY_MAP[h] || h;
          if (adjustedData[key] !== undefined) {
            let value = adjustedData[key];
            // 日付文字列をDate型に変換
            if (h.includes('日') && typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
              return new Date(value);
            }
            return value;
          }
          return currentRow[colIdx]; // 更新データにない場合は既存の値を保持
        });

        // 1つの範囲（Range）に対して一度に書き込むことで高速化（タイムアウト・CORS対策）
        sheet.getRange(rowNumber, 1, 1, newRow.length).setValues([newRow]);
        return { success: true };
      }
    }
    return { success: false, error: "Member not found: " + targetId };
  } catch (err) {
    console.error("updateMember error:", err.toString());
    return { success: false, error: err.toString() };
  }
}






function deleteMember(id) {
  try {
    const ss = getSS(MEMBER_SPREADSHEET_ID);
    const sheet = getSheetAllowAliases(ss, MEMBER_SHEET_NAME);
    if (!sheet) throw new Error("Member sheet not found");
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const idCol = headers.indexOf('会員番号');
    
    const targetId = String(id).trim();
    const isRowBasedId = /^\d+$/.test(targetId);
    
    for (let i = 1; i < values.length; i++) {
      const rowNumber = i + 1;
      let matched = false;
      
      if (isRowBasedId && String(rowNumber) === targetId) {
        matched = true;
      } else if (idCol >= 0 && String(values[i][idCol]).trim() === targetId) {
        matched = true;
      } else if (String(values[i][0]).trim() === targetId) {
        matched = true;
      }
      
      if (matched) {
        sheet.deleteRow(rowNumber);
        return { success: true };
      }
    }
    return { success: false, error: "Member not found" };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// --- 3. お知らせ管理 ---

function getNews() {
  const ss = getSS(NEWS_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, 'お知らせ');
  if (!sheet) return [];
  
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  
  return values.map((row, index) => {
    const obj = {};
    headers.forEach((h, i) => {
      const key = NEWS_KEY_MAP[h] || h;
      let val = row[i];
      if (val instanceof Date) {
        val = Utilities.formatDate(val, "JST", "yyyy.MM.dd");
      }
      obj[key] = val;
    });
    
    // IDは「絶対行番号」とする (index 0 は values[0] = header なので row 2 は index 0+2)
    obj.id = index + 2;
    
    // 固定表示の判定
    if (obj.isPinned !== undefined) {
      obj.isPinned = (obj.isPinned === 'はい、固定表示する' || obj.isPinned === true || obj.isPinned === 'TRUE');
    }
    
    return obj;
  }).reverse();
}

function addNews(newsData) {
  try {
    const ss = getSS(NEWS_SPREADSHEET_ID);
    const sheet = getSheetAllowAliases(ss, 'お知らせ');
    if (!sheet) throw new Error("News sheet not found");

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = new Array(headers.length).fill("");
    const now = newsData.date ? new Date(newsData.date.replace(/\./g, '/')) : new Date();
    
    // 新しいIDを生成（最後の行番号 + 1）
    const lastRow = sheet.getLastRow();
    const newId = lastRow + 1;

    headers.forEach((h, i) => {
      const key = NEWS_KEY_MAP[h] || h;
      // ID列の処理を追加
      if (key === 'id' || h === 'ID' || h === 'id') {
        row[i] = newId;
      } else if (key === 'date') {
        row[i] = now;
      } else if (key === 'title') {
        row[i] = newsData.title || "";
      } else if (key === 'category') {
        row[i] = newsData.category || "お知らせ";
      } else if (key === 'content') {
        row[i] = newsData.content || "";
      } else if (key === 'image') {
        row[i] = newsData.image || "";
      } else if (key === 'isPinned') {
        row[i] = newsData.isPinned ? 'はい、固定表示する' : "";
      } else if (key === 'link') {
        row[i] = newsData.link || "#";
      }
    });

    sheet.appendRow(row);
    return { success: true, id: newId };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function updateNews(id, newsData) {
  const ss = getSS(NEWS_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, 'お知らせ');
  const targetRow = parseInt(id); 
  
  if (targetRow <= 1) return { success: false, error: "Invalid Row ID" };

  const values = sheet.getDataRange().getValues();
  if (targetRow > values.length) return { success: false, error: "Row not found" };
  
  const headers = values[0];
  
  // 各フィールドの値を更新 (NEWS_KEY_MAPに基づき列を特定)
  const keyToCol = {};
  headers.forEach((h, i) => {
    const key = NEWS_KEY_MAP[h] || h;
    keyToCol[key] = i + 1;
  });

  if (newsData.title && keyToCol['title']) sheet.getRange(targetRow, keyToCol['title']).setValue(newsData.title);
  if (newsData.category && keyToCol['category']) sheet.getRange(targetRow, keyToCol['category']).setValue(newsData.category);
  if (newsData.content !== undefined && keyToCol['content']) sheet.getRange(targetRow, keyToCol['content']).setValue(newsData.content);
  if (newsData.image !== undefined && keyToCol['image']) sheet.getRange(targetRow, keyToCol['image']).setValue(newsData.image);
  if (newsData.isPinned !== undefined && keyToCol['isPinned']) {
    sheet.getRange(targetRow, keyToCol['isPinned']).setValue(newsData.isPinned ? 'はい、固定表示する' : '');
  }
  if (newsData.link !== undefined && keyToCol['link']) sheet.getRange(targetRow, keyToCol['link']).setValue(newsData.link);
  if (newsData.date && keyToCol['date']) sheet.getRange(targetRow, keyToCol['date']).setValue(newsData.date);
  
  return { success: true };
}

function deleteNews(id) {
  try {
    const ss = getSS(NEWS_SPREADSHEET_ID);
    const sheet = getSheetAllowAliases(ss, 'お知らせ');
    if (!sheet) throw new Error("News sheet not found");
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const idCol = headers.indexOf('id');
    
    const targetId = String(id).trim();
    const rowId = parseInt(targetId);

    // 行番号でのマッチング
    if (!isNaN(rowId) && rowId > 1 && rowId <= values.length) {
      sheet.deleteRow(rowId);
      return { success: true };
    }

    // ID列があればそちらでも検索
    if (idCol >= 0) {
      for (let i = 1; i < values.length; i++) {
        if (String(values[i][idCol]).trim() === targetId) {
          sheet.deleteRow(i + 1);
          return { success: true };
        }
      }
    }

    return { success: false, error: "News record not found for ID: " + id };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// --- 3.5 部員向けお知らせ管理 ---

/**
 * 部員向けお知らせを取得（2週間以内のもののみ）
 */
function getInternalAnnouncements() {
  const ss = getSS(MEMBER_SPREADSHEET_ID);
  let sheet = ss.getSheetByName(INTERNAL_ANNOUNCEMENTS_SHEET_NAME);
  
  // シートがない場合は作成
  if (!sheet) {
    sheet = ss.insertSheet(INTERNAL_ANNOUNCEMENTS_SHEET_NAME);
    sheet.appendRow(['ID', '日付', 'タイトル', '本文', '投稿者', '重要度']);
    return [];
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0]; // ['ID', '日付', 'タイトル', '本文', '投稿者', '重要度']
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  
  const results = [];
  const rowsToDelete = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    let dateVal = row[1];
    
    // 日付をパース
    let announcementDate;
    if (dateVal instanceof Date) {
      announcementDate = dateVal;
    } else if (typeof dateVal === 'string') {
      announcementDate = new Date(dateVal);
    } else {
      continue; // 日付不正はスキップ
    }
    
    // 2週間以上古いものは削除候補
    if (announcementDate < twoWeeksAgo) {
      rowsToDelete.push(i + 1); // 1-indexed row number
      continue;
    }
    
    results.push({
      id: row[0] || (i + 1),
      date: Utilities.formatDate(announcementDate, "JST", "yyyy-MM-dd"),
      title: row[2] || '',
      body: row[3] || '',
      author: row[4] || '',
      priority: row[5] || 'normal'
    });
  }
  
  // 古い行を削除（下から削除しないとインデックスがずれる）
  rowsToDelete.reverse().forEach(rowNum => {
    sheet.deleteRow(rowNum);
  });
  
  // 新しい順にソート
  return results.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * 部員向けお知らせを追加
 */
function addInternalAnnouncement(data) {
  try {
    const ss = getSS(MEMBER_SPREADSHEET_ID);
    let sheet = ss.getSheetByName(INTERNAL_ANNOUNCEMENTS_SHEET_NAME);
    
    // シートがない場合は作成
    if (!sheet) {
      sheet = ss.insertSheet(INTERNAL_ANNOUNCEMENTS_SHEET_NAME);
      sheet.appendRow(['ID', '日付', 'タイトル', '本文', '投稿者', '重要度']);
    }
    
    const newId = Utilities.getUuid();
    const now = new Date();
    
    sheet.appendRow([
      newId,
      now,
      data.title || '',
      data.body || '',
      data.author || '',
      data.priority || 'normal'
    ]);
    
    return { success: true, id: newId };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * 部員向けお知らせを削除
 */
function deleteInternalAnnouncement(id) {
  try {
    const ss = getSS(MEMBER_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(INTERNAL_ANNOUNCEMENTS_SHEET_NAME);
    if (!sheet) return { success: false, error: 'Sheet not found' };
    
    const data = sheet.getDataRange().getValues();
    const targetId = String(id).trim();
    
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === targetId) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    
    return { success: false, error: 'Announcement not found' };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
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
    const targetId = String(params.id).trim();
    const isRowBasedId = /^\d+$/.test(targetId);

    for (let i = 1; i < data.length; i++) {
      const rowNumber = i + 1;
      let matched = false;
      if (String(data[i][0]).trim() === targetId) {
        matched = true;
      } else if (isRowBasedId && String(rowNumber - 1) === targetId) {
        // ID: row[0] || (idx + 1) -> Row 2 is idx 0, ID 1. So rowNumber - 1 is ID.
        matched = true;
      }

      if (matched) {
        sheet.deleteRow(rowNumber);
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
 * getSummaryCountsEnhancedの内容をこちらに統合
 */
function getSummaryCounts() {
  return getSummaryCountsEnhanced();
}

/**
 * スプレッドシートのシート名一覧を取得（デバッグ用）
 */
function getSheetsInfo() {
  const info = {
    memberSS: { id: MEMBER_SPREADSHEET_ID, sheets: [] },
    newsSS: { id: NEWS_SPREADSHEET_ID, sheets: [] }
  };
  
  try {
    const mss = getSS(MEMBER_SPREADSHEET_ID);
    info.memberSS.sheets = mss.getSheets().map(s => s.getName());
  } catch (e) {
    info.memberSS.error = e.toString();
  }
  
  try {
    const nss = getSS(NEWS_SPREADSHEET_ID);
    info.newsSS.sheets = nss.getSheets().map(s => s.getName());
  } catch (e) {
    info.newsSS.error = e.toString();
  }
  
  return { success: true, data: info };
}

/**
 * お問い合わせスプレッドシートのデバッグ情報を返す
 */
function debugInquiry() {
  const INQUIRY_SPREADSHEET_ID = "1OWk1yXIznUizhldbyzKRY5Xcs62edMwlubAGjP9rteQ";
  const debugInfo = {
    id: INQUIRY_SPREADSHEET_ID,
    accessible: false,
    sheetCount: 0,
    sheets: [],
    first5Rows: [],
    error: null
  };

  try {
    const ss = SpreadsheetApp.openById(INQUIRY_SPREADSHEET_ID);
    debugInfo.accessible = true;
    const sheets = ss.getSheets();
    debugInfo.sheetCount = sheets.length;
    debugInfo.sheets = sheets.map(s => s.getName());
    
    if (sheets.length > 0) {
      const sheet = sheets[0];
      const lastRow = sheet.getLastRow();
      const lastCol = sheet.getLastColumn();
      if (lastRow > 0 && lastCol > 0) {
        const range = sheet.getRange(1, 1, Math.min(lastRow, 5), lastCol);
        debugInfo.first5Rows = range.getValues();
      }
    }
  } catch (e) {
    debugInfo.error = e.toString();
  }

  return { success: true, data: debugInfo };
}

/**
 * お問い合わせを登録
 */
function submitInquiry(data) {
  const INQUIRY_SPREADSHEET_ID = "1OWk1yXIznUizhldbyzKRY5Xcs62edMwlubAGjP9rteQ";
  try {
    const ss = getSS(INQUIRY_SPREADSHEET_ID);
    let sheet = getSheetAllowAliases(ss, '問い合わせ');
    
    // シートが見つからない場合は最初のシートを使用
    if (!sheet) {
      sheet = ss.getSheets()[0];
    }
    
    const now = new Date();
    const headers = sheet.getDataRange().getValues()[0];
    const normalizedHeaders = headers.map(normalizeKey);
    
    // ヘッダーに基づいて行データを作成
    const newRow = headers.map((h, i) => {
      const key = normalizedHeaders[i];
      if (key === 'date') return now;
      if (key === 'name') return data.name || "";
      if (key === 'email') return data.email || "";
      if (key === 'memberType' || h.includes('種別')) return data.type || "";
      if (key === 'content') return data.content || "";
      if (key === 'status') return "未対応";
      return "";
    });
    
    // ヘッダーが全くない、あるいは期待した項目がない場合のフォールバック
    if (newRow.every(v => v === "")) {
      sheet.appendRow([now, data.name, data.email, data.type, data.content, "未対応"]);
    } else {
      sheet.appendRow(newRow);
    }

    // --- 追加: 管理者とユーザーへの通知 ---
    try {
      // 管理者通知
      sendMailNotification(
        ADMIN_EMAILS, 
        "新しいお問い合わせ/体験申し込みがあります", 
        "送信者: " + data.name + "\nメール: " + data.email + "\n種別: " + data.type + "\n\n内容:\n" + data.content
      );
      
      // ユーザーへの自動返信
      sendMailNotification(
        data.email, 
        "お問い合わせを受け付けました", 
        data.name + " 様\n\nお問い合わせいただきありがとうございます。\n内容を確認の上、担当者よりご連絡いたします。\n\n【お問い合わせ内容】\n種別: " + data.type + "\n内容: " + data.content
      );
    } catch (mailError) {
      console.error("submitInquiry mail error:", mailError);
    }
    
    return { success: true };
  } catch (e) {
    console.error("submitInquiry error:", e.toString());
    return { success: false, error: e.toString() };
  }
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
  const subject = '【豊中修猷館】利用申請を受け付けました';
  const body = `${name} 様

豊中修猷館 剣道部 ポータルサイトへの利用申請をいただき、ありがとうございます。

現在、管理者が内容を確認しております。
承認が完了次第、こちらのメールアドレスへ通知いたしますので、今しばらくお待ちください。

※数日経過しても返信がない場合は、お手数ですがお問い合わせください。

---
豊中修猷館
https://shuyukan-site.vercel.app
`;

  sendMailNotification(email, subject, body);
}

/**
 * 承認完了通知メールを送信
 * @param {string} email - 送信先メールアドレス
 * @param {string} name - 会員名
 */
function sendApprovalNotification(email, name) {
  const subject = '【豊中修猷館】利用申請が承認されました';
  const body = `${name} 様

お待たせいたしました。
豊中修猷館 剣道部 ポータルサイトへの利用申請が承認されました。

以下のリンクよりログインして、部員専用のコンテンツをご利用いただけます。

▼ 部員専用ポータル（ログイン）
https://shuyukan-site.vercel.app/member

※申請時と同じGoogleアカウントでログインしてください。

今後ともよろしくお願いいたします。

---
豊中修猷館
https://shuyukan-site.vercel.app
`;

  sendMailNotification(email, subject, body);
}

// --- 9. 拡張メール通知機能（2026-01-21 パッチ統合） ---

/**
 * 管理者メールアドレス（複数可）
 */
var ADMIN_EMAILS = "shuyukan.info@gmail.com, kotani.tatsuhiro@gmail.com";

/**
 * 汎用メール送信関数
 * @param {string} to - 送信先（カンマ区切りで複数可）
 * @param {string} subject - 件名
 * @param {string} body - 本文
 */
function sendMailNotification(to, subject, body) {
  if (!to) return;
  try {
    GmailApp.sendEmail(to, "[豊中修猷館ポータル] " + subject, body + "\n\n---\n豊中修猷館剣道部 ポータルシステム");
    console.log("Mail sent to:", to);
  } catch (e) { 
    console.error("Mail Error:", e); 
    throw e; // エラーを呼び出し元に伝える
  }
}

/**
 * カラム名の揺れを吸収するマッピング関数
 * スプレッドシートのヘッダー名を正規化されたキーに変換
 */
function normalizeKey(header) {
  const h = String(header).trim().toLowerCase();
  
  // 共通
  if (h.includes('タイム') || h.includes('日付') || h.includes('date')) return 'date';
  if (h.includes('ステータス') || h.includes('状態') || h.includes('status')) return 'status';
  if (h.includes('権限') || h.includes('role')) return 'role';
  if (h.includes('備考') || h.includes('メモ') || h.includes('notes')) return 'notes';

  // 会員向け
  if (h.includes('番号') || h.includes('id')) return 'id';
  if (h.includes('氏名') || h.includes('名前') || h.includes('name')) return 'name';
  if (h.includes('ふりがな') || h.includes('フリガナ')) return 'furigana';
  if (h.includes('メール') || h.includes('アドレス') || h.includes('email')) return 'email';
  if (h.includes('生年月日') || h.includes('誕生日')) return 'birthDate';
  if (h.includes('学年') || h.includes('grade')) return 'grade';
  if (h.includes('種別') || h.includes('区分') || h.includes('type')) return 'memberType';
  if (h.includes('段位') || h.includes('段級位') || h.includes('rank')) return 'rank';
  if (h.includes('保護者')) return 'guardianName';
  if (h.includes('緊急連絡') || h.includes('emergency')) return 'emergencyContact';

  // ニュース向け
  if (h.includes('タイトル') || h.includes('題名') || h.includes('title')) return 'title';
  if (h.includes('カテゴリ')) return 'category';
  if (h.includes('本文') || h.includes('内容') || h.includes('content')) return 'content';
  if (h.includes('画像') || h.includes('写真') || h.includes('image')) return 'image';
  if (h.includes('固定') || h.includes('pin')) return 'isPinned';
  if (h.includes('リンク') || h.includes('url')) return 'link';

  return h;
}

/**
 * 管理者への問い合わせ通知＋送信者への自動返信
 * submitInquiry の拡張版
 */
function submitInquiryWithNotification(data) {
  var INQUIRY_SPREADSHEET_ID = "1OWk1yXIznUizhldbyzKRY5Xcs62edMwlubAGjP9rteQ";
  const ss = getSS(INQUIRY_SPREADSHEET_ID);
  const sheet = getSheetAllowAliases(ss, '問い合わせ');
  
  // データ追加
  sheet.appendRow([new Date(), data.name, data.email, data.type, data.content, "未対応"]);
  
  // 管理者通知
  sendMailNotification(
    ADMIN_EMAILS, 
    "新しいお問い合わせ/体験申し込みがあります", 
    "送信者: " + data.name + "\nメール: " + data.email + "\n種別: " + data.type + "\n\n内容:\n" + data.content
  );
  
  // 送信者への自動返信
  sendMailNotification(
    data.email, 
    "お問い合わせを受け付けました", 
    data.name + " 様\n\nお問い合わせいただきありがとうございます。\n内容を確認の上、担当者よりご連絡いたします。\n\n【お問い合わせ内容】\n種別: " + data.type + "\n内容: " + data.content
  );
  
  return { success: true };
}

/**
 * 管理者への入会申請通知
 * addMember から呼び出し可能
 */
function notifyAdminNewApplication(data) {
  sendMailNotification(
    ADMIN_EMAILS, 
    "新規入会申請（承認依頼）があります", 
    "名前: " + data.name + "\nメール: " + data.email + "\n\n管理者ポータルで承認操作をしてください。\nhttps://shuyukan-site.vercel.app/admin"
  );
}

/**
 * 未読カウント取得（問い合わせ対応状況込み）
 * getSummaryCounts の拡張版
 */
function getSummaryCountsEnhanced() {
  var INQUIRY_SPREADSHEET_ID = "1OWk1yXIznUizhldbyzKRY5Xcs62edMwlubAGjP9rteQ";
  const res = { pendingMembers: 0, newInquiries: 0 };
  
  try {
    // 承認待ち会員のカウント
    const mSS = getSS(MEMBER_SPREADSHEET_ID);
    const mSheet = getSheetAllowAliases(mSS, MEMBER_SHEET_NAME);
    const mValues = mSheet.getDataRange().getValues();
    const mHeaders = mValues[0].map(normalizeKey);
    const sIdx = mHeaders.indexOf('status');
    if (sIdx > -1) {
      for (let i = 1; i < mValues.length; i++) {
        const status = String(mValues[i][sIdx]).trim();
        if (status === '承認待ち' || status === 'pending') res.pendingMembers++;
      }
    }
    
    // 未対応問い合わせのカウント（「未対応」または空のステータス）
    const iSS = getSS(INQUIRY_SPREADSHEET_ID);
    let iSheet = getSheetAllowAliases(iSS, '問い合わせ');
    if (!iSheet) iSheet = iSS.getSheets()[0];
    
    if (iSheet) {
      const iLastRow = iSheet.getLastRow();
      if (iLastRow > 1) {
        const iData = iSheet.getRange(2, 1, iLastRow - 1, iSheet.getLastColumn()).getValues();
        iData.forEach(row => { 
          const lastCol = row[row.length - 1];
          // ステータスカラムを特定（normalizeKeyでstatusになる列）
          if (lastCol === "未対応" || !lastCol) res.newInquiries++; 
        });
      }
    }
  } catch (e) { 
    console.error("getSummaryCountsEnhanced error:", e);
  }
  
  return { success: true, data: res };
}

/**
 * 問い合わせ一覧を取得
 */
function getInquiries() {
  var INQUIRY_SPREADSHEET_ID = "1OWk1yXIznUizhldbyzKRY5Xcs62edMwlubAGjP9rteQ";
  try {
    const ss = getSS(INQUIRY_SPREADSHEET_ID);
    let sheet = getSheetAllowAliases(ss, '問い合わせ');
    if (!sheet) sheet = ss.getSheets()[0];
    
    if (!sheet) return { success: false, error: "Inquiry sheet not found" };
    
    const values = sheet.getDataRange().getValues();
    const headers = values.shift();
    const normalizedHeaders = headers.map(normalizeKey);
    
    // ステータス列がない場合は、画面表示のために仮想的に追加（実際のスプレッドシートへの追加は更新時）
    if (normalizedHeaders.indexOf('status') === -1) {
      normalizedHeaders.push('status');
    }

    const inquiries = values.map((row, index) => {
      const obj = { id: index + 2 }; // 行番号をIDとする
      // ヘッダーとデータのペアリング（データの長さ分回す）
      const rowLength = Math.max(headers.length, row.length);
      for (let i = 0; i < rowLength; i++) {
        const h = headers[i] || ("列 " + (i + 1));
        const key = normalizeKey(h);
        const val = row[i];
        
        obj[key] = val;
        if (val instanceof Date) {
          obj[key] = Utilities.formatDate(val, "JST", "yyyy-MM-dd HH:mm:ss");
        }
      }
      // ステータスが未定義の場合は「未対応」として扱う
      if (!obj.status || String(obj.status).trim() === "") obj.status = "未対応";
      return obj;
    }).reverse(); // 新しい順
    
    return { success: true, data: inquiries };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * 問い合わせに返信する
 */
function replyToInquiry(id, email, message) {
  var INQUIRY_SPREADSHEET_ID = "1OWk1yXIznUizhldbyzKRY5Xcs62edMwlubAGjP9rteQ";
  try {
    // 1. メール送信
    sendMailNotification(email, "お問い合わせへの回答", message);
    
    // 2. ステータス更新（「対応済み」）
    const ss = getSS(INQUIRY_SPREADSHEET_ID);
    const sheet = getSheetAllowAliases(ss, '問い合わせ');
    const rowIdx = parseInt(id);
    const headersRows = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();
    const headers = headersRows[0];
    const normalizedHeaders = headers.map(normalizeKey);
    let statusCol = normalizedHeaders.indexOf('status') + 1;
    
    // ステータス列がない場合は新規作成
    if (statusCol <= 0) {
      statusCol = headers.length + 1;
      sheet.getRange(1, statusCol).setValue("ステータス");
    }
    
    sheet.getRange(rowIdx, statusCol).setValue("対応済み");

    // 3. 備考欄に返信内容を追記
    let notesCol = normalizedHeaders.indexOf('notes') + 1;
    // 備考列がない場合は新規作成
    if (notesCol <= 0) {
      notesCol = (statusCol >= headers.length + 1) ? statusCol + 1 : headers.length + 1;
      sheet.getRange(1, notesCol).setValue("備考");
    }

    const now = Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd HH:mm");
    const currentNotes = sheet.getRange(rowIdx, notesCol).getValue();
    const newNote = (currentNotes ? currentNotes + "\n" : "") + "[" + now + " 返信済み]\n" + message;
    sheet.getRange(rowIdx, notesCol).setValue(newNote);
    
    // 書き込みを確実に反映させる
    SpreadsheetApp.flush();
    
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * 問い合わせを削除
 */
function deleteInquiry(id) {
  var INQUIRY_SPREADSHEET_ID = "1OWk1yXIznUizhldbyzKRY5Xcs62edMwlubAGjP9rteQ";
  try {
    const ss = getSS(INQUIRY_SPREADSHEET_ID);
    const sheet = getSheetAllowAliases(ss, '問い合わせ');
    const rowIdx = parseInt(id);
    
    if (isNaN(rowIdx) || rowIdx < 2) {
      throw new Error("無効なIDです");
    }
    
    sheet.deleteRow(rowIdx);
    SpreadsheetApp.flush();
    
    return { success: true };
  } catch (e) {
    console.error("deleteInquiry error:", e);
    return { success: false, error: e.toString() };
  }
}

/**
 * 初回プロフィール登録・世帯連携
 * @param {string} email - 会員のメールアドレス
 * @param {Object} data - 入力されたプロフィールデータ
 */
function setupProfile(email, data) {
  try {
    const ss = getSS(MEMBER_SPREADSHEET_ID);
    const mSheet = getSheetAllowAliases(ss, MEMBER_SHEET_NAME);
    const fSheet = getSheetAllowAliases(ss, '世帯マスター');
    
    if (!mSheet || !fSheet) throw new Error("シートが見つかりません");
    
    // 1. 会員を探す
    const mValues = mSheet.getDataRange().getValues();
    const mHeaders = mValues[0].map(normalizeKey);
    const eIdx = mHeaders.indexOf('email');
    const fIdIdx = mHeaders.indexOf('familyId');
    const sDateIdx = mHeaders.indexOf('birthDate');
    const genderIdx = mHeaders.indexOf('gender');
    const rankIdx = mHeaders.indexOf('rank');
    const guardianIdx = mHeaders.indexOf('guardianName');
    
    let memberRow = -1;
    let familyId = "";
    
    for (let i = 1; i < mValues.length; i++) {
      if (String(mValues[i][eIdx]).toLowerCase().trim() === email.toLowerCase().trim()) {
        memberRow = i + 1;
        familyId = String(mValues[i][fIdIdx] || "").trim();
        break;
      }
    }
    
    if (memberRow === -1) throw new Error("会員が見つかりません: " + email);
    
    // 2. 世帯IDがない場合は新規発行 (F + 5桁)
    if (!familyId) {
      const fValues = fSheet.getDataRange().getValues();
      if (fValues.length <= 1) {
        familyId = "F00001";
      } else {
        const fIds = fValues.slice(1).map(r => String(r[0])); 
        let maxId = 0;
        fIds.forEach(id => {
          const num = parseInt(id.replace('F', ''));
          if (!isNaN(num) && num > maxId) maxId = num;
        });
        familyId = "F" + String(maxId + 1).padStart(5, '0');
      }
    }
    
    // 3. 会員マスターの更新
    if (fIdIdx > -1) mSheet.getRange(memberRow, fIdIdx + 1).setValue(familyId);
    if (sDateIdx > -1 && data.birthDate) mSheet.getRange(memberRow, sDateIdx + 1).setValue(data.birthDate);
    if (genderIdx > -1 && data.gender) mSheet.getRange(memberRow, genderIdx + 1).setValue(data.gender);
    if (rankIdx > -1 && data.rank) mSheet.getRange(memberRow, rankIdx + 1).setValue(data.rank);
    if (guardianIdx > -1 && data.guardianName) mSheet.getRange(memberRow, guardianIdx + 1).setValue(data.guardianName);
    
    // 4. 世帯マスターの更新/追加
    const fValues = fSheet.getDataRange().getValues();
    const fHeaders = fValues[0];
    const fNormalizedHeaders = fHeaders.map(normalizeKey);
    
    let fRow = -1;
    for (let i = 1; i < fValues.length; i++) {
      if (String(fValues[i][0]).trim() === familyId) {
        fRow = i + 1;
        break;
      }
    }
    
    const fData = {
      familyId: familyId,
      name: data.guardianName || data.name,
      furigana: data.guardianFurigana || data.furigana,
      relation: data.relation || "本人",
      phone: data.phone,
      email: data.email || email,
      zipCode: data.zipCode,
      address: data.address,
      emergencyContact: data.emergencyContact,
      notes: data.notes || "ポータルからの初回登録"
    };
    
    if (fRow > -1) {
      // 既存世帯の更新
      fNormalizedHeaders.forEach((key, i) => {
        if (fData[key] !== undefined) {
          fSheet.getRange(fRow, i + 1).setValue(fData[key]);
        }
      });
    } else {
      // 新規世帯の追加
      const newFRow = fHeaders.map((h, i) => {
        const key = fNormalizedHeaders[i];
        return fData[key] || "";
      });
      fSheet.appendRow(newFRow);
    }
    
    return { success: true, familyId: familyId };
  } catch (e) {
    console.error("setupProfile error:", e);
    return { success: false, error: e.toString() };
  }
}


