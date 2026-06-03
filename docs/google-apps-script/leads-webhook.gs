/**
 * Bao Service — leads webhook for Google Sheets
 *
 * Setup:
 * 1. Create a sheet with headers: Timestamp | Name | Email | Phone | Message | Locale | Need
 * 2. Extensions → Apps Script → paste this file
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Set the /exec URL as LEADS_WEBHOOK_URL in AWS Amplify (do not commit the URL to git)
 *
 * Test (POST, not browser GET):
 * curl -L -X POST "YOUR_EXEC_URL" \
 *   -H "Content-Type: application/json" \
 *   -d '{"name":"Test","email":"test@example.com","phone":"123","message":"Hello","locale":"en","need":"","createdAt":"2026-01-01T00:00:00.000Z"}'
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.createdAt || new Date().toISOString(),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.message || "",
      data.locale || "",
      data.need || "",
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Leads webhook ready");
}
