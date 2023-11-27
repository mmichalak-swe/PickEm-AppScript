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
  
    const data = ss.getRangeByName('NFL_' + year).getValues(); //Grab again if wasn't populated before
    let maxRows = sheet.getMaxRows();
    let maxCols = sheet.getMaxColumns();
    const numMembers = Number(mapConfig.get('numMembers'));
    const colCushion = 4;
    let rows = numMembers + colCushion; // top three rows above member rows, one below
    let columns;
  
    // Removing extra rows, reducing to only member count and the additional 2
    if (maxRows < rows){
      sheet.insertRows(maxRows,rows - maxRows);
      Logger.log('added ' + (rows - maxRows) + ' rows');
    } else if (maxRows > rows){
      sheet.deleteRows(rows,maxRows - rows);
      Logger.log('deleted ' + (maxRows - rows) + ' rows');
    }
  
    sheet.insertColumnsAfter(maxCols, 20);
  
    // Insert Members
    const arrMemberNames1D = Array.from(mapMembers.keys());
    const arrMemberNames2D = arrMemberNames1D.map(function(arr) {
      return [arr];
    });
  
    sheet.getRange(4,1,numMembers,1).setValues(arrMemberNames2D);
    let bottomHeaders = ['PREFERRED','AWAY','HOME'];
    sheet.getRange(rows,1,1,3).setValues([bottomHeaders]);
    
    // Setting header values
    sheet.getRange(1,1).setValue('WEEK ' + week);
    sheet.setColumnWidth(1,120);
    
    sheet.getRange(1,2,2,1).setValues([['TOTAL'],['CORRECT']]);
    sheet.setColumnWidth(2,90);
    
    sheet.getRange(1,3,2,1).setValues([['WEEKLY'],['RANK']]);
    sheet.setColumnWidth(3,90);
    
    sheet.getRange(1,4,2,1).setValues([['PERCENT'],['CORRECT']]);
    sheet.setColumnWidth(4,90);
  
    // Setting headers for the week's matchups with format of 'AWAY' + '@' + 'HOME', then creating a data validation cell below each
    let rule,matches = 0;
    let column = 5;
    for (let j = 0; j < data.length; j++) {
      if ( data[j][0] == week ) {
        matches++;
        // if ( data[j][2] == 1 ) {
        //   mnf = true;
        // }
        sheet.getRange(1, column).setValue(data[j][6] + '@' + data[j][7]);
        sheet.getRange(1, column, 1, 2).mergeAcross();
        sheet.getRange(1, column).setHorizontalAlignment("center");
        // if ( data[j][2] == 1 ) {
        //   if ( mnfStart == undefined ) {
        //     mnfStart = column;
        //   }
        //   mnfEnd = column;
        // }
        rule = SpreadsheetApp.newDataValidation().requireValueInList([data[j][6],data[j][7],"TIE"], true).build();
        sheet.getRange(2, column).setDataValidation(rule);
        sheet.getRange(2, column, 1, 2).mergeAcross();
        sheet.getRange(2, column).setHorizontalAlignment("center");
        sheet.setColumnWidth(column, 75);
        sheet.setColumnWidth(column + 1, 75);
  
        sheet.getRange(3, column, 1, 2).mergeAcross();
        sheet.getRange(3, column).setHorizontalAlignment("center");
        sheet.getRange(3, column).setFormulaR1C1("IF(R[-1]C[0]=\"\", \"NOT FINAL\", IF(R[-1]C[0]=\"TIE\", \"TIE\", IF(R[-1]C[0]=REGEXEXTRACT(R[-2]C[0],\"(.*)@.*\"),\"AWAY\",\"HOME\")))");
  
        column += 2;
      }
    }
  
    maxCols = sheet.getMaxColumns();
    sheet.deleteColumns(column, maxCols-column+1);
  
    // (DONE) merge cells below team dropdown, set formula ="IF(R[0]C[-1]=REGEXEXTRACT(R[0]C[-2],"(.*)@.*"),"AWAY","HOME")"
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