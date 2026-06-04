/**
 * Bao Service — hiring hero updates feed (read-only)
 *
 * Supported sheet layouts (tab: HiringUpdates, updates_bullet, or first tab):
 *
 * A) Structured (row 1 headers): Sort | Active | Text
 * B) Simple list: one bullet per row in column A (no headers required)
 *
 * Deploy as Web app (Execute as: Me, Anyone) → use /exec URL as HIRING_UPDATES_URL
 */

var SHEET_NAMES = ["HiringUpdates", "updates_bullet", "Sheet1"];
var MAX_ITEMS = 20;
var MAX_TEXT_LENGTH = 280;

function isActive(value) {
  if (value === true) return true;
  var s = String(value || "")
    .trim()
    .toLowerCase();
  return s === "true" || s === "yes" || s === "1";
}

function sanitizeText(value) {
  if (value === null || value === undefined) return "";
  var s = String(value).trim().slice(0, MAX_TEXT_LENGTH);
  if (s.length > 0 && "=+-@".indexOf(s.charAt(0)) !== -1) {
    return "'" + s;
  }
  return s;
}

function parseSort(value) {
  var n = Number(value);
  return isNaN(n) ? 9999 : n;
}

function findUpdatesSheet(spreadsheet) {
  for (var i = 0; i < SHEET_NAMES.length; i++) {
    var sheet = spreadsheet.getSheetByName(SHEET_NAMES[i]);
    if (sheet) return sheet;
  }
  var sheets = spreadsheet.getSheets();
  return sheets.length > 0 ? sheets[0] : null;
}

function isStructuredHeader(header) {
  return header.indexOf("sort") !== -1 && header.indexOf("active") !== -1 && header.indexOf("text") !== -1;
}

function getStructuredUpdates(sheet) {
  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];

  var header = rows[0].map(function (h) {
    return String(h).trim().toLowerCase();
  });

  if (!isStructuredHeader(header)) return null;

  var sortCol = header.indexOf("sort");
  var activeCol = header.indexOf("active");
  var textCol = header.indexOf("text");
  var items = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (!isActive(row[activeCol])) continue;

    var text = sanitizeText(row[textCol]);
    if (!text) continue;

    items.push({
      sort: parseSort(row[sortCol]),
      text: text,
    });
  }

  items.sort(function (a, b) {
    return a.sort - b.sort;
  });

  return items.slice(0, MAX_ITEMS).map(function (item) {
    return { text: item.text };
  });
}

function getSimpleListUpdates(sheet) {
  var rows = sheet.getDataRange().getValues();
  var items = [];

  for (var i = 0; i < rows.length; i++) {
    var text = sanitizeText(rows[i][0]);
    if (!text) continue;

    // Skip a lone header row if someone adds "Text" later
    if (i === 0 && text.toLowerCase() === "text") continue;

    items.push({
      sort: i,
      text: text,
    });
  }

  return items.slice(0, MAX_ITEMS).map(function (item) {
    return { text: item.text };
  });
}

function getHiringUpdates() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = findUpdatesSheet(spreadsheet);
  if (!sheet) {
    throw new Error(
      "No sheet found. Use tab HiringUpdates or put bullets in column A on the first tab."
    );
  }

  var structured = getStructuredUpdates(sheet);
  if (structured !== null) return structured;

  return getSimpleListUpdates(sheet);
}

function doGet() {
  try {
    var items = getHiringUpdates();
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, items: items })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err), items: [] })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
