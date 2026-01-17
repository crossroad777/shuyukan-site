/**
 * 豊中修猷館 統合API & ユーティリティ (Apps Script)
 * 2026-01-17 改訂版: アカウント跨ぎのパーミッション対応、ID指定対応
 */

// --- 設定エリア ---
// 会員マスターが入っているスプレッドシートのID
const MEMBER_SPREADSHEET_ID = "1zL1AS5c4kaC5shYz0RVDy3M8ZvX6Zqk_KtbrjVPQc_E"; 

// お知らせが入っているスプレッドシートのID
const NEWS_SPREADSHEET_ID = "1ERZDlFWtFl6R-bp04M1WtSqLiORxUGJAn-BaSlZWW5A";

// 1. 基本設定とルーティング
function doGet(e) {
  const params = e.parameter;
  const action = params.action;
  
  if (action === 'debug') {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      connected: {},
      sheets: {},
      sheetNames: {}
    };

    // Member SS Check
    try {
      const ssMember = getSS(MEMBER_SPREADSHEET_ID);
      debugInfo.connected.member = ssMember ? "Yes" : "No";
      if (ssMember) {
        debugInfo.memberSSName = ssMember.getName();
        debugInfo.sheetNames.member = ssMember.getSheets().map(s => s.getName());
        const sheet = ssMember.getSheetByName(MEMBER_SHEET_NAME);
        if (sheet) {
          debugInfo.sheets.member = {
            name: MEMBER_SHEET_NAME,
            rowCount: sheet.getLastRow(),
            lastColumn: sheet.getLastColumn(),
            headers: sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0]
          };
        } else {
          debugInfo.sheets.member = "Not Found";
        }
      }
    } catch (err) {
      debugInfo.connected.member = "Error: " + err.toString();
    }

    // News SS Check
    try {
      const ssNews = getSS(NEWS_SPREADSHEET_ID);
      debugInfo.connected.news = ssNews ? "Yes" : "No";
      if (ssNews) {
        debugInfo.newsSSName = ssNews.getName();
        debugInfo.sheetNames.news = ssNews.getSheets().map(s => s.getName());
        
        // 全シートの詳細情報を取得
        debugInfo.newsSheetDetails = ssNews.getSheets().map(s => ({
          name: s.getName(),
          rowCount: s.getLastRow(),
          columnCount: s.getLastColumn()
        }));
        
        const sheet = getSheetAllowAliases(ssNews, 'お知らせ');
        if (sheet) {
          debugInfo.sheets.news = {
            name: sheet.getName(), // 実際に見つかったシート名
            rowCount: sheet.getLastRow(),
            columnCount: sheet.getLastColumn(),
            headers: sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0],
            sampleData: sheet.getLastRow() > 1 ? sheet.getRange(2, 1, Math.min(3, sheet.getLastRow() - 1), sheet.getLastColumn()).getValues() : []
          };
        } else {
          debugInfo.sheets.news = "Sheet 'お知らせ' not found";
        }
      }
    } catch (err) {
      debugInfo.connected.news = "Error: " + err.toString();
    }

    return createJsonResponse(debugInfo);
  }

  if (action === 'diagnose') {
    const ss = getSS(MEMBER_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(MEMBER_SHEET_NAME);
    if (!sheet) return createJsonResponse({ success: false, error: "Sheet not found" });
    const rawData = sheet.getRange(1, 1, Math.min(6, sheet.getLastRow()), sheet.getLastColumn()).getValues();
    return createJsonResponse({
      success: true,
      headers: rawData[0],
      sampleRows: rawData.slice(1)
    });
  }

  if (action === 'getMembers') {
    return createJsonResponse(getMembers());
  } else if (action === 'getNews') {
    return createJsonResponse(getNews());
  } else if (action === 'getDocuments') {
    const folderId = params.folderId;
    return createJsonResponse(getDocuments(folderId));
  } else if (action === 'setupFolders') {
    return createJsonResponse(createKendoFolders());
  }
  
  // 会員管理 - GETワークアラウンド（CORS対策）
  // dataパラメータにJSONが入っている場合はパースする
  let memberData = {};
  if (params.data) {
    try {
      memberData = JSON.parse(params.data);
    } catch (e) {
      return createJsonResponse({ success: false, error: "Invalid JSON data: " + e.toString() });
    }
  }
  
  if (action === 'add') {
    return createJsonResponse(addMember(memberData));
  } else if (action === 'update') {
    const memberId = params.id || memberData.id;
    return createJsonResponse(updateMember({ id: memberId, ...memberData }));
  } else if (action === 'delete') {
    const memberId = params.id || memberData.id;
    return createJsonResponse(deleteMember({ id: memberId }));
  }
  
  // お知らせ管理 - GETワークアラウンド（CORS対策）
  let newsData = {};
  if (params.newsData) {
    try {
      newsData = JSON.parse(params.newsData);
    } catch (e) {
      return createJsonResponse({ success: false, error: "Invalid news JSON data: " + e.toString() });
    }
  }
  
  if (action === 'addNews') {
    return createJsonResponse(addNews(newsData));
  } else if (action === 'updateNews') {
    const newsId = params.id || newsData.id;
    return createJsonResponse(updateNews({ id: newsId, ...newsData }));
  } else if (action === 'deleteNews') {
    const newsId = params.id || newsData.id;
    return createJsonResponse(deleteNews({ id: newsId }));
  }
  
  return createJsonResponse({ success: false, error: "Unknown action: " + action });
}

// スプレッドシート取得用共通関数 (ID指定に対応)
function getSS(id) {
  if (id) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (e) {
      console.error("ID指定でのSS取得に失敗 (" + id + "): " + e.toString());
      throw e; // エラーを投げて上位でキャッチさせる
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function doPost(e) {
  try {
    // text/plain で送信された場合も対応
    let params;
    if (e.postData && e.postData.contents) {
      params = JSON.parse(e.postData.contents);
    } else {
      params = e.parameter || {};
    }
    
    const action = params.action;
    let result = { success: false };

    if (action === 'add') {
      result = addMember(params);
    } else if (action === 'update') {
      result = updateMember(params);
    } else if (action === 'delete') {
      result = deleteMember(params);
    } else if (action === 'addNews') {
      result = addNews(params);
    } else if (action === 'updateNews') {
      result = updateNews(params);
    } else if (action === 'deleteNews') {
      result = deleteNews(params);
    }

    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

function doOptions(e) {
  return createJsonResponse({ success: true, method: "OPTIONS" });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/* --- 会員管理（会員マスター・日本語ヘッダー対応） --- */

const MEMBER_SHEET_NAME = '会員マスター';
const MEMBER_KEY_MAP = {
  '会員番号': 'id',
  'ID': 'id',
  'MemberID': 'id',
  'No': 'id',
  '世帯ID': 'familyId',
  'FamilyID': 'familyId',
  '氏名': 'name',
  'Name': 'name',
  '名前': 'name',
  'ふりがな': 'furigana',
  'フリガナ': 'furigana',
  'Furigana': 'furigana',
  '生年月日': 'birthDate',
  'BirthDate': 'birthDate',
  'Birthday': 'birthDate',
  '性別': 'gender',
  'Gender': 'gender',
  '会員種別': 'memberType',
  'Type': 'memberType',
  'MemberType': 'memberType',
  '段級位': 'rank',
  'Rank': 'rank',
  '入会日': 'joinDate',
  'JoinDate': 'joinDate',
  'ステータス': 'status',
  'Status': 'status',
  '備考': 'notes',
  'Notes': 'notes',
  'Note': 'notes',
  '年齢': 'age',
  'Age': 'age',
  '主保護者': 'guardian',
  'Guardian': 'guardian',
  'メールアドレス': 'email',
  'アドレス': 'email',
  'Email': 'email',
  'E-mail': 'email'
};

function getMembers() {
  try {
    const ss = getSS(MEMBER_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(MEMBER_SHEET_NAME);
    if (!sheet) return { success: false, error: MEMBER_SHEET_NAME + "シートが見つかりません" };
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, data: [] }; // ヘッダーのみ

    const headers = data[0];
    
    const result = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        const key = MEMBER_KEY_MAP[header] || header;
        // 日付オブジェクトなどの処理（JSONで崩れないように文字列化）
        let val = row[index];
        if (val instanceof Date) {
          val = Utilities.formatDate(val, "JST", "yyyy-MM-dd");
        }
        obj[key] = val;
      });
      return obj;
    }).filter(row => {
      // 完全に空の行を除外（ID または 名前 があれば有効）
      return (row.id || row.name || row.furigana);
    });
    
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function addMember(params) {
  try {
    const ss = getSS(MEMBER_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(MEMBER_SHEET_NAME);
    if (!sheet) return { success: false, error: "シート名 '" + MEMBER_SHEET_NAME + "' が見つかりません" };

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // ID自動生成 (もしparams.idがなければ)
    let nextId = params.id;
    if (!nextId) {
      const prefix = params.memberType === '少年部' ? 'S' : 'A';
      const idIndex = headers.indexOf('会員番号');
      if (idIndex !== -1) {
        const existingIds = data.slice(1)
          .map(row => row[idIndex])
          .filter(id => typeof id === 'string' && id.startsWith(prefix))
          .map(id => {
            const num = parseInt(id.slice(1), 10);
            return isNaN(num) ? 0 : num;
          });
        const nextIdNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
        nextId = prefix + String(nextIdNum).padStart(3, '0');
      }
    }

    // 逆マッピング（日本語ヘッダーに合わせて行を作成）
    const newRow = headers.map(header => {
      const key = MEMBER_KEY_MAP[header];
      if (header === '会員番号') return nextId;
      if (header === 'ステータス') return params.status || '承認待ち';
      if (header === '入会日') return params.joinDate || Utilities.formatDate(new Date(), "JST", "yyyy-MM-dd");
      return params[key] || "";
    });
    
    sheet.appendRow(newRow);
    return { success: true, id: nextId };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function updateMember(params) {
  try {
    const ss = getSS(MEMBER_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(MEMBER_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIndex = headers.indexOf('会員番号');
    const statusIndex = headers.indexOf('ステータス');
    const emailIndex = headers.findIndex(h => MEMBER_KEY_MAP[h] === 'email');
    const nameIndex = headers.findIndex(h => MEMBER_KEY_MAP[h] === 'name');
    
    if (idIndex === -1) return { success: false, error: "会員番号カラムが見つかりません" };

    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex] == params.id) {
        // 承認チェック（ステータスが「承認待ち」から「在籍」に変わった場合）
        const oldStatus = data[i][statusIndex];
        const newStatus = params.status;
        const isApproval = (oldStatus === '承認待ち' || oldStatus === 'pending') && 
                           (newStatus === '在籍' || newStatus === 'active' || newStatus === '在籍中');
        
        // データ更新
        headers.forEach((header, index) => {
          const key = MEMBER_KEY_MAP[header];
          if (key && params[key] !== undefined && header !== '会員番号') {
            sheet.getRange(i + 1, index + 1).setValue(params[key]);
          }
        });
        
        // 承認の場合はメール通知
        if (isApproval && emailIndex !== -1 && data[i][emailIndex]) {
          const memberEmail = data[i][emailIndex];
          const memberName = nameIndex !== -1 ? data[i][nameIndex] : '';
          sendApprovalEmail(memberEmail, memberName);
        }
        
        return { success: true, approvalSent: isApproval };
      }
    }
    return { success: false, error: "Member not found: " + params.id };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * 会員承認時に送信するメール
 * @param {string} email - 送信先メールアドレス
 * @param {string} name - 会員名
 */
function sendApprovalEmail(email, name) {
  try {
    const subject = '【修猷館剣道部】会員登録が承認されました';
    const body = `
${name || '会員'} 様

豊中修猷館剣道部へのご入会ありがとうございます。

このたび、会員登録が承認されましたのでお知らせいたします。
部員ポータルにログインすると、稽古日程やお知らせ、各種ドキュメントを閲覧できます。

▼ 部員ポータル
https://shuyukan-kendo.vercel.app/login

ご不明な点がございましたら、お気軽にお問い合わせください。

---
豊中修猷館剣道部
https://shuyukan-kendo.vercel.app
`.trim();

    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body
    });
    
    console.log('承認メール送信完了: ' + email);
    return true;
  } catch (err) {
    console.error('承認メール送信エラー: ' + err.toString());
    return false;
  }
}

function deleteMember(params) {
  try {
    const ss = getSS(MEMBER_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(MEMBER_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIndex = headers.indexOf('会員番号');
    
    if (idIndex === -1) return { success: false, error: "会員番号カラムが見つかりません" };
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][idIndex] == params.id) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false, error: "Member not found" };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/* --- お知らせ管理（お知らせシート必須） --- */

// シート名があいまいでも取得できるようにするヘルパー
function getSheetAllowAliases(ss, primaryName, aliases) {
  let sheet = ss.getSheetByName(primaryName);
  if (sheet) return sheet;
  
  if (!aliases) aliases = ['Sheet1', 'シート1', 'フォームの回答 1', 'Form Responses 1'];
  for (const alias of aliases) {
    sheet = ss.getSheetByName(alias);
    if (sheet) return sheet;
  }
  return null;
}

function getNews() {
  try {
    const ss = getSS(NEWS_SPREADSHEET_ID);
    // お知らせシート（またはエイリアス）を取得
    const sheet = getSheetAllowAliases(ss, 'お知らせ');
    
    if (!sheet) {
      console.warn("お知らせシートが見つかりません");
      // シートがない場合は空配列を返す
      return { success: true, data: [] };
    }
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, data: [] }; // ヘッダーのみの場合
    
    // ヘッダー行を取得
    const headers = data[0];
    
    // データ行をオブジェクトに変換
    const result = data.slice(1).map(row => {
      const obj = {};
      // カラムマッピング（ヘッダー名ベース）
      headers.forEach((h, i) => {
        if (h) {
          let val = row[i];
          if (val instanceof Date) {
            val = Utilities.formatDate(val, "JST", "yyyy.MM.dd");
          }
          obj[h] = val;
        }
      });
      
      // 必須フィールドの補完（ヘッダーが英語/日本語混在の場合の対応）
      // タイトル(Title/タイトル), ID(ID/No), Date(Date/日付) など
      if (!obj.id && obj['ID']) obj.id = obj['ID'];
      if (!obj.id && obj['No']) obj.id = obj['No'];
      
      if (!obj.title && obj['Title']) obj.title = obj['Title'];
      if (!obj.title && obj['タイトル']) obj.title = obj['タイトル'];
      
      if (!obj.date && obj['Date']) obj.date = obj['Date'];
      if (!obj.date && obj['日付']) obj.date = obj['日付'];
      if (!obj.date && obj['タイムスタンプ']) {
        // タイムスタンプを日付形式に変換
        const timestamp = obj['タイムスタンプ'];
        if (timestamp instanceof Date) {
          obj.date = Utilities.formatDate(timestamp, "JST", "yyyy.MM.dd");
        } else {
          obj.date = timestamp;
        }
      }
      
      if (!obj.category && obj['Category']) obj.category = obj['Category'];
      if (!obj.category && obj['カテゴリ']) obj.category = obj['カテゴリ'];
      
      if (obj.isPinned === undefined) {
         if (obj['固定'] !== undefined) obj.isPinned = (obj['固定'] === true || obj['固定'] === "TRUE");
         if (obj['Pinned'] !== undefined) obj.isPinned = (obj['Pinned'] === true || obj['Pinned'] === "TRUE");
         if (obj['固定表示'] !== undefined) {
           // 固定表示のテキストを boolean に変換
           const pinnedText = String(obj['固定表示']).toLowerCase();
           obj.isPinned = (pinnedText.includes('固定') || pinnedText.includes('true') || pinnedText.includes('はい'));
         }
      }
      
      if (!obj.image && obj['Image']) obj.image = obj['Image'];
      if (!obj.image && obj['画像']) obj.image = obj['画像'];
      if (!obj.image && obj['画像（任意）']) obj.image = obj['画像（任意）'];
      
      if (!obj.link && obj['Link']) obj.link = obj['Link'];
      if (!obj.link && obj['リンク']) obj.link = obj['リンク'];
      
      if (!obj.content && obj['Content']) obj.content = obj['Content'];
      if (!obj.content && obj['本文']) obj.content = obj['本文'];

      
      return obj;
    });
    
    return { success: true, data: result };
  } catch (e) {
    console.error("getNews Error: " + e.toString());
    return { success: false, error: e.toString() };
  }
}

function addNews(params) {
  try {
    const ss = getSS(NEWS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName('お知らせ');
    if (!sheet) return { success: false, error: "お知らせシートがありません" };
    const data = sheet.getDataRange().getValues();
    const nextId = data.length > 1 ? Math.max(...data.slice(1).map(r => {
      const id = parseInt(r[0]);
      return isNaN(id) ? 0 : id;
    })) + 1 : 1;
    const newRow = [
      nextId,
      params.date || Utilities.formatDate(new Date(), "JST", "yyyy.MM.dd"),
      params.category,
      params.title,
      params.isPinned ? "TRUE" : "FALSE",
      params.image || "",
      params.link || "",
      params.content || ""
    ];
    sheet.appendRow(newRow);
    return { success: true, id: nextId };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function updateNews(params) {
  try {
    const ss = getSS(NEWS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName('お知らせ');
    if (!sheet) return { success: false, error: "お知らせシートが見つかりません" };
    const data = sheet.getRange("A:A").getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == params.id) {
        if (params.date) sheet.getRange(i + 1, 2).setValue(params.date);
        if (params.category) sheet.getRange(i + 1, 3).setValue(params.category);
        if (params.title) sheet.getRange(i + 1, 4).setValue(params.title);
        sheet.getRange(i + 1, 5).setValue(params.isPinned ? "TRUE" : "FALSE");
        if (params.image !== undefined) sheet.getRange(i + 1, 6).setValue(params.image);
        if (params.link !== undefined) sheet.getRange(i + 1, 7).setValue(params.link);
        if (params.content !== undefined) sheet.getRange(i + 1, 8).setValue(params.content);
        return { success: true };
      }
    }
    return { success: false, error: "News not found" };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

function deleteNews(params) {
  try {
    const ss = getSS(NEWS_SPREADSHEET_ID);
    const sheet = ss.getSheetByName('お知らせ');
    if (!sheet) return { success: false };
    const data = sheet.getRange("A:A").getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == params.id) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: false };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/* --- ドキュメント管理（Google Drive連携） --- */

function getDocuments(folderId) {
  if (!folderId) return { error: "フォルダIDが指定されていません" };
  try {
    const folder = DriveApp.getFolderById(folderId);
    
    // フォルダ一覧の取得
    const subFolders = folder.getFolders();
    const foldersResult = [];
    while (subFolders.hasNext()) {
      const f = subFolders.next();
      foldersResult.push({
        id: f.getId(),
        name: f.getName(),
        type: 'folder',
        updated: f.getLastUpdated()
      });
    }

    // ファイル一覧の取得
    const files = folder.getFiles();
    const filesResult = [];
    while (files.hasNext()) {
      const file = files.next();
      filesResult.push({
        id: file.getId(),
        name: file.getName(),
        type: 'file',
        mimeType: file.getMimeType(),
        size: file.getSize(),
        url: file.getUrl(),
        downloadUrl: file.getDownloadUrl(),
        updated: file.getLastUpdated()
      });
    }

    // フォルダを先、ファイルを後に並べて結合
    return { 
      success: true, 
      data: [...foldersResult.sort((a,b) => a.name.localeCompare(b.name)), ...filesResult.sort((a,b) => a.name.localeCompare(b.name))] 
    };
  } catch (error) {
    return { success: false, error: error.toString(), data: [] };
  }
}

/**
 * フォルダ構造のセットアップ
 * 不足しているフォルダがあれば作成します
 */
function createKendoFolders() {
  const rootFolderName = "剣道部_運用（2026-）";
  const parentFolderId = "1x9FIadqvK9XjAWx6iKtBkuMXfq9He8kh"; // ユーザー指定の親フォルダID
  
  let rootFolder;
  try {
    rootFolder = DriveApp.getFolderById(parentFolderId);
  } catch (e) {
    // IDで取得できない場合は名前で探す/作成
    const folders = DriveApp.getFoldersByName(rootFolderName);
    if (folders.hasNext()) {
      rootFolder = folders.next();
    } else {
      rootFolder = DriveApp.createFolder(rootFolderName);
    }
  }

  const structure = [
    { name: "00_運用マニュアル（編集手順）" },
    { name: "01_公開（誰でも見せてOK）", children: ["01_画像（公開用）", "02_PDF（公開用）", "03_実績・紹介（公開用）"] },
    { name: "02_部員（部員だけ）", children: ["01_資料（部員配布）", "02_遠征・大会", "03_写真（部員限定）"] },
    { name: "03_管理者（顧問/主務のみ）", children: ["00_フォーム回答", "01_名簿（個人情報）", "02_連絡網", "03_会計（必要なら）", "04_引継ぎ"] },
    { name: "99_アーカイブ（過去年度）" }
  ];

  const results = [];
  structure.forEach(item => {
    let subFolder;
    const existing = rootFolder.getFoldersByName(item.name);
    if (existing.hasNext()) {
      subFolder = existing.next();
      results.push("Existing: " + item.name);
    } else {
      subFolder = rootFolder.createFolder(item.name);
      results.push("Created: " + item.name);
    }

    if (item.children) {
      item.children.forEach(childName => {
        if (!subFolder.getFoldersByName(childName).hasNext()) {
          subFolder.createFolder(childName);
          results.push("  Created child: " + childName);
        }
      });
    }
  });

  return { success: true, log: results };
}
