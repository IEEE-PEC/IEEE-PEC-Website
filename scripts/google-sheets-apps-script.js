/**
 * Google Apps Script Web App for IEEE PEC Student Branch Auditions
 * 
 * Target Google Sheet: https://docs.google.com/spreadsheets/d/1p7AQ_zqR63bCzTO_eD9ehsxBuzAHCeXlg_BHwUqkmdM/edit
 */

function doPost(e) {
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // Auto-create header row on first run
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
        "Motivation"
      ]);
      sheet.getRange(1, 1, 1, 12).setFontWeight("bold").setBackground("#00629B").setFontColor("#FFFFFF");
    }

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    sheet.appendRow([
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
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("IEEE PEC Student Branch Auditions API is active!");
}
