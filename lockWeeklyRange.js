function getProtectedRanges(year, sheetID) {
  const ss = SpreadsheetApp.openById(sheetID);
  const sheet = ss.getSheetByName(year + '_Picks');
  var protections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  let protectedRangeNames = [];

  for (var i = 0; i < protections.length; i++) {
    let protection = protections[i];
    protectedRangeNames.push(protection.getRangeName());
  }
  return protectedRangeNames;
}

function lockWeeklyRange() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetID = 'sheetID';

  const mapConfig = readConfig();
  const mapMembers = readMembersObjects();
  const year = mapConfig.get("year");
  const week = mapConfig.get("week");

  mapMembers.forEach((value, key, map) => {
    const memberName = key;
    const memberInfo = value;
    const rangeName = 'Week_' + week;
    let ssMember;

    // Skip member if no sheet for picks
    try {
      ssMember = SpreadsheetApp.openById(memberInfo.sheetID);
    } catch (error) {
      Logger.log("No sheet exists for: " + memberName);
      return;
    }

    const protectedRanges = getProtectedRanges(year, memberInfo.sheetID);

    // Skip protecting the range again in member sheet if already protected
    if (protectedRanges.includes(rangeName)) {
      return;
    }

    ssMember = SpreadsheetApp.openById(memberInfo.sheetID);

    range = ssMember.getRangeByName(rangeName);
    var protection = range.protect().setDescription(rangeName + ' picks locked!');
    protection.setRangeName(rangeName);

    // Ensure the current user is an editor before removing others. Otherwise, if the user's edit
    // permission comes from a group, the script throws an exception upon removing the group.
    var me = Session.getEffectiveUser();
    protection.addEditor(me);
    protection.removeEditors(protection.getEditors());
    if (protection.canDomainEdit()) {
      protection.setDomainEdit(false);
    }
  });
}