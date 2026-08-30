/**
 * Google Apps Script Web App for IEEE PEC Student Branch Auditions
 * 
 * Target Google Sheet: https://docs.google.com/spreadsheets/d/1p7AQ_zqR63bCzTO_eD9ehsxBuzAHCeXlg_BHwUqkmdM/edit
 * 
 * Instructions:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1p7AQ_zqR63bCzTO_eD9ehsxBuzAHCeXlg_BHwUqkmdM/edit
 * 2. Click on "Extensions" > "Apps Script".
 * 3. Replace all code in the editor with this script.
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type: "Web app".
 * 6. Set Description: "IEEE Auditions API".
 * 7. Set "Execute as": "Me (your email)".
 * 8. Set "Who has access": "Anyone" (IMPORTANT!).
 * 9. Click "Deploy" and authorize access.
 * 10. Copy the Web App URL (e.g. https://script.google.com/macros/s/AKfycb.../exec).
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // Check if headers exist, if not create them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Student ID (SID)",
        "College Email",
        "Phone / WhatsApp",
        "Department / Branch",
        "Academic Year",
        "Chapters Selected",
        "Domains of Interest",
        "GitHub Profile",
        "LinkedIn / Portfolio",
        "Motivation / Reason to Join"
      ]);
      // Format headers
      sheet.getRange(1, 1, 1, 12).setFontWeight("bold").setBackground("#00629B").setFontColor("#FFFFFF");
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      data = e.parameter;
    }

    var nextRow = sheet.getLastRow() + 1;
    var newRow = [
      new Date(),
      data.fullName || "",
      data.sid || "",
      data.email || "",
      data.phone || "",
      data.branch || "",
      data.year || "",
      data.chapters || "",
      data.domains || "",
      data.githubUrl || "",
      data.portfolioUrl || "",
      data.motivation || ""
    ];

    sheet.appendRow(newRow);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("IEEE PEC Student Branch Auditions API is active!");
}
