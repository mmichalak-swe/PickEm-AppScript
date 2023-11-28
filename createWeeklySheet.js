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

    // Insert arbitrary number of cols, fix later?
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
    let ptrColumn = 5;
    for (let j = 0; j < data.length; j++) {
      if ( data[j][0] == week ) {
        matches++;
        // if ( data[j][2] == 1 ) {
        //   mnf = true;
        // }
        sheet.getRange(1, ptrColumn).setValue(data[j][6] + '@' + data[j][7]);
        sheet.getRange(1, ptrColumn, 1, 2).mergeAcross();
        sheet.getRange(1, ptrColumn).setHorizontalAlignment("center");
        // if ( data[j][2] == 1 ) {
        //   if ( mnfStart == undefined ) {
        //     mnfStart = ptrColumn;
        //   }
        //   mnfEnd = ptrColumn;
        // }
        rule = SpreadsheetApp.newDataValidation().requireValueInList([data[j][6],data[j][7],"TIE"], true).build();
        sheet.getRange(2, ptrColumn).setDataValidation(rule);
        sheet.getRange(2, ptrColumn, 1, 2).mergeAcross();
        sheet.getRange(2, ptrColumn).setHorizontalAlignment("center");
        sheet.setColumnWidth(ptrColumn, 75);
        sheet.setColumnWidth(ptrColumn + 1, 75);

        sheet.getRange(3, ptrColumn, 1, 2).mergeAcross();
        sheet.getRange(3, ptrColumn).setHorizontalAlignment("center");
        sheet.getRange(3, ptrColumn).setFormulaR1C1("IF(R[-1]C[0]=\"\", \"NOT FINAL\", IF(R[-1]C[0]=\"TIE\", \"TIE\", IF(R[-1]C[0]=REGEXEXTRACT(R[-2]C[0],\"(.*)@.*\"),\"AWAY\",\"HOME\")))");

        ptrColumn += 2;
      }
    }

    // Trim excess columns
    maxCols = sheet.getMaxColumns();
    sheet.deleteColumns(ptrColumn, maxCols-ptrColumn+1);
    maxCols = sheet.getMaxColumns();

    let range = sheet.getRange(3, colCushion+1, 1, maxCols-colCushion);
    formatRuleRedBackground = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("NOT FINAL")
      .setBackground("#F4C7C3") // red
      .setRanges([range])
      .build();
    formatRuleYellowBackground = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("TIE")
      .setBackground("#FCE8B2") // yellow
      .setRanges([range])
      .build();
    formatRuleGreenBackground = SpreadsheetApp.newConditionalFormatRule()
      .whenTextDoesNotContain("NOT FINAL")
      .setBackground("#B7E1CD") // green
      .setRanges([range])
      .build();
    let formatRules = sheet.getConditionalFormatRules();
    formatRules.push(formatRuleRedBackground);
    formatRules.push(formatRuleYellowBackground);
    formatRules.push(formatRuleGreenBackground);
    sheet.setConditionalFormatRules(formatRules);

    sheet.setFrozenColumns(colCushion);
    sheet.setFrozenRows(3);
    range = sheet.getRange(1,1,2,maxCols);
    range.setBackground('black');
    range.setFontColor('white');

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