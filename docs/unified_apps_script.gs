/**
 * 豊中修猷館 統合API & ユーティリティ (Apps Script)
 * 会員管理（会員マスター対応）、お知らせ管理、CORSエラー修正対応、フォルダ作成
 */

// 1. 基本設定とルーティング
function doGet(e) {
  const params = e.parameter;
  const action = params.action;
  
  if (action === 'debug') {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    return createJsonResponse({
      connected: ss ? "Yes" : "No (Standalone Script)",
      spreadsheetName: ss ? ss.getName() : "None",
      sheets: ss ? ss.getSheets().map(s => s.getName()) : []
    });
  }

  if (action === 'getMembers') {
    return createJsonResponse(getMembers());
  } else if (action === 'getNews') {
    return createJsonResponse(getNews());
  }
  
  return createJsonResponse(getMembers());
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
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
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/* --- 会員管理（会員マスター・日本語ヘッダー対応） --- */

const MEMBER_SHEET_NAME = '会員マスター';
const MEMBER_KEY_MAP = {
  '会員番号': 'id',
  '世帯ID': 'familyId',
  '氏名': 'name',
  'ふりがな': 'furigana',
  '生年月日': 'birthDate',
  '性別': 'gender',
  '会員種別': 'memberType',
  '段級位': 'rank',
  '入会日': 'joinDate',
  'ステータス': 'status',
  '備考': 'notes',
  '年齢': 'age',
  '主保護者': 'guardian'
};

function getMembers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(MEMBER_SHEET_NAME);
  if (!sheet) return { error: MEMBER_SHEET_NAME + "シートが見つかりません" };
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      const key = MEMBER_KEY_MAP[header] || header;
      obj[key] = row[index];
    });
    return obj;
  }).filter(row => row.id);
}

function addMember(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(MEMBER_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // ID自動生成 (もしparams.idがなければ)
  let nextId = params.id;
  if (!nextId) {
    const prefix = params.memberType === '少年部' ? 'S' : 'A';
    const idIndex = headers.indexOf('会員番号');
    const existingIds = data.slice(1)
      .map(row => row[idIndex])
      .filter(id => typeof id === 'string' && id.startsWith(prefix))
      .map(id => parseInt(id.slice(1), 10));
    const nextIdNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    nextId = prefix + String(nextIdNum).padStart(3, '0');
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
}

function updateMember(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(MEMBER_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('会員番号');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] == params.id) {
      headers.forEach((header, index) => {
        const key = MEMBER_KEY_MAP[header];
        if (key && params[key] !== undefined && header !== '会員番号') {
          sheet.getRange(i + 1, index + 1).setValue(params[key]);
        }
      });
      return { success: true };
    }
  }
  return { success: false, error: "Member not found" };
}

function deleteMember(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(MEMBER_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const idIndex = headers.indexOf('会員番号');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] == params.id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false };
}

/* --- お知らせ管理（お知らせシート必須） --- */

function getNews() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('お知らせ');
  if (!sheet) return []; // お知らせシートがない場合は空を返す
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function addNews(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('お知らせ');
  if (!sheet) return { success: false, error: "お知らせシートがありません" };
  const data = sheet.getDataRange().getValues();
  const nextId = data.length > 1 ? Math.max(...data.slice(1).map(r => r[0])) + 1 : 1;
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
}

function updateNews(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('お知らせ');
  if (!sheet) return { success: false };
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
  return { success: false };
}

function deleteNews(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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
}

/* --- ユーティリティ: フォルダ作成 --- */

function createKendoFolders() {
  const rootFolderName = "剣道部_運用（2026-）";
  let rootFolder;
  const folders = DriveApp.getFoldersByName(rootFolderName);
  if (folders.hasNext()) {
    rootFolder = folders.next();
  } else {
    rootFolder = DriveApp.createFolder(rootFolderName);
  }
  const structure = [
    { name: "00_運用マニュアル（編集手順）" },
    { name: "01_公開（誰でも見せてOK）", children: ["01_画像（公開用）", "02_PDF（公開用）", "03_実績・紹介（公開用）"] },
    { name: "02_部員（部員だけ）", children: ["01_資料（部員配布）", "02_遠征・大会", "03_写真（部員限定）"] },
    { name: "03_管理者（顧問/主務のみ）", children: ["00_フォーム回答", "01_名簿（個人情報）", "02_連絡網", "03_会計（必要なら）", "04_引継ぎ"] },
    { name: "99_アーカイブ（過去年度）" }
  ];
  structure.forEach(item => {
    let subFolder = rootFolder.createFolder(item.name);
    if (item.children) item.children.forEach(childName => subFolder.createFolder(childName));
  });
  console.log("フォルダ作成が完了しました！");
}
