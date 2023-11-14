function readMembersObjects() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('MEMBERS');
  const memberHeaders = ss.getRangeByName('memberHeaders').getValues().flat();
  const maxRows = sheet.getMaxRows();
  const maxCols = sheet.getMaxColumns();

  let mapMembers = new Map();

  // Populate mapMembers map with member objects
  for (let row = 2; row < maxRows + 1; row++) {
    let member = new Object();
    let memberName = sheet.getRange(row, 1).getValue();

    for (let col = 1; col < maxCols + 1; col++) {
      const key = memberHeaders[col-1];
      const value = sheet.getRange(row, col).getValue();
      member[key] = value;
    }
    mapMembers.set(memberName, member);
  }

  return mapMembers;
}