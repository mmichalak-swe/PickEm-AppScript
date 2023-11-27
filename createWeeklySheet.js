function createWeeklySheet(year, week, mapConfig, mapMembers) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet;
    let sheetName;
  
    if (Number(week) < 10) {
      sheetName = "Week" + '_0' + week;
    } else {
      sheetName = "Week" + '_' + week;
    }
    
    const sheetExists = ss.getSheetByName(sheetName);
  
    if (sheetExists) {
      throw new Error("Sheet " + sheetName + " already exists!");
    } else {
      ss.insertSheet(sheetName,ss.getNumSheets()+1);
      sheet = ss.getSheetByName(sheetName);
    }
  
    // let data = ss.getRangeByName('NFL_' + year).getValues(); //Grab again if wasn't populated before
  
    let numMembers = Number(mapConfig.get('numMembers'));
    Logger.log(numMembers + " " + typeof(numMembers));
    let rows = numMembers + 3; // top two rows above member rows, one below
    Logger.log(rows + " " + typeof(rows));
    let columns;
  
    // range.mergeAcross();
    // color columns of points green if correct?
    // SUMIF cells have a certain formatting
  
}
  
  function driver() {
    const mapConfig = readConfig();
    const mapMembers = readMembersObjects();
  
    const year = mapConfig.get('year');
    const week = mapConfig.get('week');
  
    createWeeklySheet(year, week, mapConfig, mapMembers)
}