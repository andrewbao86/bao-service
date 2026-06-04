/**
 * Bao Service — leads + hiring webhook for Google Sheets
 *
 * Setup:
 * 1. Create two tabs in one spreadsheet:
 *    - Leads:  Timestamp | Name | Email | Phone | Message | Locale | Need
 *    - Hiring: Timestamp | Name | Email | Phone | Locale | Direction | StudiedMostClosely |
 *              StudiedSolutions | PreferredEngagement | Contribution | ValuePitch | Proof |
 *              First30DaysIdea | CVLink | PortfolioLink | SourcePage | UtmSource | UtmMedium |
 *              UtmCampaign | Referrer | LandingLocale
 * 2. Extensions → Apps Script → paste this file (replace ALL existing code)
 * 3. Deploy → Manage deployments → Edit → New version → Deploy
 *    (Saving the editor alone does NOT update the live /exec URL)
 * 4. Set the /exec URL as LEADS_WEBHOOK_URL in AWS Amplify
 *
 * Routing: submissions with need/submissionType "hiring", or hiring-specific fields
 * (direction + first30DaysIdea + cvLink), go to the Hiring tab. All others → Leads tab.
 */

var HIRING_HEADERS = [
  "Timestamp",
  "Name",
  "Email",
  "Phone",
  "Locale",
  "Direction",
  "StudiedMostClosely",
  "StudiedSolutions",
  "PreferredEngagement",
  "Contribution",
  "ValuePitch",
  "Proof",
  "First30DaysIdea",
  "CVLink",
  "PortfolioLink",
  "SourcePage",
  "UtmSource",
  "UtmMedium",
  "UtmCampaign",
  "Referrer",
  "LandingLocale",
];

/** Prevent Sheets from treating user text as formulas (=, +, -, @). */
function sanitizeCell(value) {
  if (value === null || value === undefined) return "";
  var s = String(value);
  if (s.length > 0 && "=+-@".indexOf(s.charAt(0)) !== -1) {
    return "'" + s;
  }
  return s;
}

function isHiringSubmission(data) {
  var need = String(data.need || data.submissionType || "")
    .trim()
    .toLowerCase();
  if (need === "hiring") return true;
  // Fallback if need field missing but structured hiring payload present
  return Boolean(data.direction && data.first30DaysIdea && data.cvLink);
}

function getSheetOrThrow(spreadsheet, sheetName) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(
      'Sheet not found: "' +
        sheetName +
        '". Create a tab named exactly "' +
        sheetName +
        '" with row-1 headers, then redeploy the web app.'
    );
  }
  return sheet;
}

function getOrCreateHiringSheet(spreadsheet) {
  var sheet = spreadsheet.getSheetByName("Hiring");
  if (sheet) return sheet;

  sheet = spreadsheet.insertSheet("Hiring");
  sheet.appendRow(HIRING_HEADERS);
  return sheet;
}

function appendLeadRow(spreadsheet, data) {
  var sheet = getSheetOrThrow(spreadsheet, "Leads");
  sheet.appendRow([
    sanitizeCell(data.createdAt || new Date().toISOString()),
    sanitizeCell(data.name || ""),
    sanitizeCell(data.email || ""),
    sanitizeCell(data.phone || ""),
    sanitizeCell(data.message || ""),
    sanitizeCell(data.locale || ""),
    sanitizeCell(data.need || data.submissionType || ""),
  ]);
}

function appendHiringRow(spreadsheet, data) {
  var sheet = getOrCreateHiringSheet(spreadsheet);
  var studied = "";
  if (Array.isArray(data.studiedSolutions)) {
    studied = data.studiedSolutions.join(", ");
  } else if (data.studiedSolutions) {
    studied = String(data.studiedSolutions);
  }

  sheet.appendRow([
    sanitizeCell(data.createdAt || new Date().toISOString()),
    sanitizeCell(data.name || ""),
    sanitizeCell(data.email || ""),
    sanitizeCell(data.phone || ""),
    sanitizeCell(data.locale || data.landingLocale || ""),
    sanitizeCell(data.direction || ""),
    sanitizeCell(data.studiedMostClosely || ""),
    sanitizeCell(studied),
    sanitizeCell(data.preferredEngagement || ""),
    sanitizeCell(data.contribution || ""),
    sanitizeCell(data.valuePitch || ""),
    sanitizeCell(data.proof || ""),
    sanitizeCell(data.first30DaysIdea || ""),
    sanitizeCell(data.cvLink || ""),
    sanitizeCell(data.portfolioLink || ""),
    sanitizeCell(data.sourcePage || ""),
    sanitizeCell(data.utmSource || ""),
    sanitizeCell(data.utmMedium || ""),
    sanitizeCell(data.utmCampaign || ""),
    sanitizeCell(data.referrer || ""),
    sanitizeCell(data.landingLocale || data.locale || ""),
  ]);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Missing POST body");
    }

    var data = JSON.parse(e.postData.contents);
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    if (isHiringSubmission(data)) {
      appendHiringRow(spreadsheet, data);
    } else {
      appendLeadRow(spreadsheet, data);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, routed: isHiringSubmission(data) ? "hiring" : "leads" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    "Leads + hiring webhook ready (POST JSON to submit). Deploy version must include isHiringSubmission routing."
  );
}
