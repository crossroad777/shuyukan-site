/**
 * お知らせAPI (Apps Script) の doPOST 関数に追記するコード
 * スプレッドシートの「お知らせ」シートを操作します。
 */

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('お知らせ'); // シート名を確認してください
  const params = JSON.parse(e.postData.contents);
  const action = params.action;

  let result = { success: false };

  try {
    if (action === 'add') {
      // IDの生成（最大ID + 1）
      const data = sheet.getDataRange().getValues();
      const ids = data.slice(1).map(row => row[0]).filter(id => !isNaN(id));
      const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
      
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
      result = { success: true, id: nextId };
      
    } else if (action === 'update') {
      const id = params.id;
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] == id) {
          // 列の順番に合わせて更新
          if (params.date) sheet.getRange(i + 1, 2).setValue(params.date);
          if (params.category) sheet.getRange(i + 1, 3).setValue(params.category);
          if (params.title) sheet.getRange(i + 1, 4).setValue(params.title);
          sheet.getRange(i + 1, 5).setValue(params.isPinned ? "TRUE" : "FALSE");
          if (params.image !== undefined) sheet.getRange(i + 1, 6).setValue(params.image);
          if (params.link !== undefined) sheet.getRange(i + 1, 7).setValue(params.link);
          if (params.content !== undefined) sheet.getRange(i + 1, 8).setValue(params.content);
          result = { success: true };
          break;
        }
      }
      
    } else if (action === 'delete') {
      const id = params.id;
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] == id) {
          sheet.deleteRow(i + 1);
          result = { success: true };
          break;
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
