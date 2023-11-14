function readConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  dataImport = ss.getRangeByName('configKeyValue').getValues();

  const mapConfig = new Map();

  // Populate mapConfig
  dataImport.forEach((obj) => {
    mapConfig.set(obj[0], obj[1]);
  });

  return mapConfig;
}