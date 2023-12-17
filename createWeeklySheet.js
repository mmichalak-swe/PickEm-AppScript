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

    const data = ss.getRangeByName('NFL_' + year).getValues(); // Grab again if wasn't populated before
    let maxRows = sheet.getMaxRows();
    let maxCols = sheet.getMaxColumns();
    const numMembers = Number(mapConfig.get('numMembers'));
    const rowCushion = 3;
    const colCushion = 3;
    let rows = numMembers + rowCushion; // top three rows above member rows

    // Remove extra rows
    if (maxRows < rows){
      sheet.insertRows(maxRows,rows - maxRows);
      Logger.log('added ' + (rows - maxRows) + ' rows');
    } else if (maxRows > rows){
      sheet.deleteRows(rows,maxRows - rows);
      Logger.log('deleted ' + (maxRows - rows) + ' rows');
    }
    maxRows = sheet.getMaxRows();

    // Count number of games for the week
    let numWeeklyGames = 0;
    for (let j = 0; j < data.length; j++) {
      if ( data[j][0] == week ) {
        numWeeklyGames++;
      }
    }

    // Insert correct number of cols based on number of games
    sheet.insertColumnsAfter(maxCols, 2*numWeeklyGames);

    // Build member array
    const arrMemberNames1D = Array.from(mapMembers.keys());
    const arrMemberNames2D = arrMemberNames1D.map(function(arr) {
      return [arr];
    });
    // Insert members
    sheet.getRange(rowCushion + 1,1,numMembers,1).setValues(arrMemberNames2D);

    // Format member area
    sheet.getRange(rowCushion + 1,1,numMembers,colCushion).setHorizontalAlignment("center");
    sheet.getRange(rowCushion + 1,1,numMembers,colCushion).setFontWeight("bold");
    sheet.getRange(rowCushion + 1,1,numMembers,colCushion).setBorder(null, null, null, null, true, true, null, null);
  
    // Setting header values
    sheet.setColumnWidth(1,120);
    sheet.getRange(1,1).setValue('WEEK ' + week);
    sheet.getRange(1,1,rowCushion - 1,1).merge();
    sheet.getRange(1,1,rowCushion - 1,1).setBorder(true, true, true, true, null, null, "white", null);
    sheet.getRange(1,1,rowCushion,1).setFontWeight("bold");
    sheet.getRange(1,1,rowCushion,1).setFontSize(18);
    sheet.getRange(1,1,rowCushion,1).setVerticalAlignment("middle");
    sheet.getRange(1,1,rowCushion,1).setHorizontalAlignment("center");

    sheet.getRange(1,2,rowCushion - 1,1).merge();
    sheet.getRange(1,2,rowCushion - 1,1).setBorder(true, true, true, true, null, null, "white", null);
    sheet.getRange(1,2,rowCushion - 1,1).setFontWeight("bold");
    sheet.getRange(1,2,rowCushion - 1,1).setFontSize(10);
    sheet.getRange(1,2,rowCushion - 1,1).setVerticalAlignment("middle");
    sheet.getRange(1,2,rowCushion - 1,1).setHorizontalAlignment("center");
    sheet.getRange(1,2,rowCushion - 1,1).insertCheckboxes();

    sheet.getRange(1,3,rowCushion - 1,1).merge();
    sheet.getRange(1,3,rowCushion - 1,1).setBorder(null, null, true, null, null, null, "white", null);

    sheet.getRange(rowCushion,1,1,1).setValue(['MEMBER']);
    sheet.getRange(rowCushion,1,1,1).setFontSize(10);
    sheet.getRange(rowCushion,1,1,1).setFontWeight("bold");
    sheet.getRange(rowCushion,1,1,1).setHorizontalAlignment("center");
    sheet.getRange(rowCushion,1,1,1).setBorder(null, null, null, true, null, null, "white", null);

    sheet.setColumnWidth(2,90);
    sheet.getRange(rowCushion,2,1,1).setValue(['POINTS']);
    sheet.getRange(rowCushion,2,1,1).setFontWeight("bold");
    sheet.getRange(rowCushion,2,1,1).setHorizontalAlignment("center");
    sheet.getRange(rowCushion,2,1,1).setBorder(null, null, null, true, null, null, "white", null);

    sheet.setColumnWidth(3,90);
    sheet.getRange(rowCushion,3,1,1).setValue(['RECORD']);
    sheet.getRange(rowCushion,3,1,1).setFontWeight("bold");
    sheet.getRange(rowCushion,3,1,1).setHorizontalAlignment("center");

    // Setting headers for the week's matchups with format of 'AWAY' + '@' + 'HOME', then creating a data validation cell below each
    let rule = 0;
    let ptrColumn = colCushion + 1;
    let formatRules = sheet.getConditionalFormatRules();
    for (let j = 0; j < data.length; j++) {
      if ( data[j][0] == week && data[j][13] === true) {
        sheet.getRange(1, ptrColumn).setValue(data[j][6] + '@' + data[j][7]);
        sheet.getRange(1, ptrColumn, 1, 2).mergeAcross();
        sheet.getRange(1, ptrColumn).setHorizontalAlignment("center");

        rule = SpreadsheetApp.newDataValidation().requireValueInList([data[j][6],data[j][7],"TIE"], true).build();
        sheet.getRange(2, ptrColumn).setDataValidation(rule);
        sheet.getRange(2, ptrColumn, 1, 2).mergeAcross();
        sheet.getRange(2, ptrColumn).setHorizontalAlignment("center");
        sheet.setColumnWidth(ptrColumn, 75);
        sheet.setColumnWidth(ptrColumn + 1, 75);

        sheet.getRange(3, ptrColumn, 1, 2).mergeAcross();
        sheet.getRange(3, ptrColumn).setHorizontalAlignment("center");
        sheet.getRange(3, ptrColumn).setFontWeight("bold");
        sheet.getRange(3, ptrColumn).setFormulaR1C1("IF(R[-1]C[0]=\"\", \"NOT FINAL\", IF(R[-1]C[0]=\"TIE\", \"TIE\", IF(R[-1]C[0]=REGEXEXTRACT(R[-2]C[0],\"(.*)@.*\"),\"AWAY\",\"HOME\")))");

        const startRowRange = rowCushion + 1;
        const awayPickRange = sheet.getRange(startRowRange, ptrColumn, maxRows - rowCushion, 1);
        const homePickRange = sheet.getRange(startRowRange, ptrColumn + 1, maxRows - rowCushion, 1);
        let awayFormula = "=$" + columnToLetter(ptrColumn) + "$" + rowCushion.toString() + "=\"AWAY\"";
        formatGameAwayPickColumn = SpreadsheetApp.newConditionalFormatRule()
          .whenFormulaSatisfied(awayFormula)
          // .setBackground("#E1D6B7") // light orange 13
          .setBackground("#b7e1cd") // light green
          .setRanges([awayPickRange])
          .build();
        let homeFormula = "=$" + columnToLetter(ptrColumn) + "$" + rowCushion.toString() + "=\"HOME\"";
        formatGameHomePickColumn = SpreadsheetApp.newConditionalFormatRule()
          .whenFormulaSatisfied(homeFormula)
          // .setBackground("#B7E1FF") // light cornflower blue 3
          .setBackground("#b7e1cd") // light green
          .setRanges([homePickRange])
          .build();
        formatRules.push(formatGameAwayPickColumn);
        formatRules.push(formatGameHomePickColumn);


        sheet.getRange(rowCushion + 1, ptrColumn + 1, maxRows, 1).setBorder(null, null, null, true, null, null, null, null)
        ptrColumn += 2;
      }
    }

    // Trim excess columns
    maxCols = sheet.getMaxColumns();
    sheet.deleteColumns(ptrColumn, maxCols-ptrColumn+1);
    maxCols = sheet.getMaxColumns();

    // Set location for checkbox that triggers member points, weekly W-L record forumlas (R1C1 notation)
    const checkBoxRow = 1;
    const checkBoxCol = 2;
    const checkBoxRangeR1C1 = 'R' + checkBoxRow + 'C' + checkBoxCol;

    // Set location for AWAY/HOME range (R1C1 notation)
    const homeAwayRangeStartR1C1 = 'R' + rowCushion + 'C' + (colCushion + 1);
    const homeAwayRangeEndR1C1 = 'R' + rowCushion + 'C' + maxCols;
    const homeAwayRangeR1C1 = homeAwayRangeStartR1C1 + ":" + homeAwayRangeEndR1C1;

    // Set formulas for member points
    const pointsStartCol = 2;
    const pointsEndColOffset = maxCols - pointsStartCol;
    sheet.getRange(rowCushion + 1,pointsStartCol,numMembers,1).setFormulaR1C1("=sumCorrectPicks(R[0]C[2]:R[0]C[" + pointsEndColOffset + "], \"#b7e1cd\", " + checkBoxRangeR1C1 + ")")

    // Set formulas for weekly W-L record
    const recordStartCol = 3;
    const recordEndColOffset = maxCols - recordStartCol;
    sheet.getRange(rowCushion + 1,recordStartCol,numMembers,1)
    .setFormulaR1C1("=getNumberWeeklyWins(R[0]C[1]:R[0]C[" + recordEndColOffset + "], \"#b7e1cd\", " + checkBoxRangeR1C1 + ") & \"-\" & (ARRAYFORMULA(SUM(COUNTIF(" + homeAwayRangeR1C1 + ",{\"AWAY\",\"HOME\"})))-getNumberWeeklyWins(R[0]C[1]:R[0]C[" + recordEndColOffset + "], \"#b7e1cd\", " + checkBoxRangeR1C1 + "))");

    // Set center alignment for member picks
    sheet.getRange(rowCushion + 1,colCushion + 1,numMembers,maxCols-colCushion).setHorizontalAlignment("center");

    // Set alternating row colors for member picks
    sheet.getRange(rowCushion + 1,1,numMembers,maxCols).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);

    // Conditional formatting rules for NOT FINAL/TIE/AWAY/HOME
    let range = sheet.getRange(3, colCushion+1, 1, maxCols-colCushion);
    formatRuleRedBackground = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("NOT FINAL")
      // .setBackground("#F4C7C3") // light red
      .setBackground("#EA4335") // red
      .setRanges([range])
      .build();
    formatRuleYellowBackground = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("TIE")
      // .setBackground("#FCE8B2") // light yellow
      // .setBackground("#FBBC04") // yellow
      .setBackground("#FF6D01") // orange
      .setRanges([range])
      .build();
    formatRuleGreenBackground = SpreadsheetApp.newConditionalFormatRule()
      .whenTextDoesNotContain("NOT FINAL")
      // .setBackground("#B7E1CD") // light green
      .setBackground("#34A853") // green
      .setRanges([range])
      .build();
    formatRules.push(formatRuleRedBackground);
    formatRules.push(formatRuleYellowBackground);
    formatRules.push(formatRuleGreenBackground);
    sheet.setConditionalFormatRules(formatRules);

    // Format frozen rows, cols
    // Backgrounds and font color for remaining frozen area
    sheet.setFrozenColumns(colCushion);
    sheet.setFrozenRows(3);
    range = sheet.getRange(1,1,2,maxCols);
    range.setBackground('black');
    range.setFontColor('white');
    range = sheet.getRange(3,1,1,colCushion);
    range.setBackground('black');
    range.setFontColor('white');

    // Sorts descending by column B
    // range.sort({column: 2, ascending: false});
}

  function driverCreateWeeklySheet() {
    const mapConfig = readConfig();
    const mapMembers = readMembersObjects();

    const year = mapConfig.get('year');
    const week = mapConfig.get('week');

    createWeeklySheet(year, week, mapConfig, mapMembers)
}