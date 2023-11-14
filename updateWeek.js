function updateWeek() {
  var week = fetchWeek();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var range = ss.getRangeByName("configKeyValue");
  var mapConfig = readConfig();
  var numMembers;
  var output;

  mapConfig.set("week", week);

  var sheetMembers = ss.getSheetByName("MEMBERS");
  numMembers = sheetMembers.getMaxRows() - 1;
  mapConfig.set("numMembers", numMembers.toString());

  var output = Array.from(mapConfig.entries());
  range.setValues(output);
}
