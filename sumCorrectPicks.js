function sumCorrectPicks(countRange, colorRef, refresh) {
    let ss = SpreadsheetApp.getActiveRange();
    let sheet = SpreadsheetApp.getActiveSheet();
    let activeformula = ss.getFormula();
    let countRangeAddressIntermediate = activeformula.match(/\((.*)\,/).pop().trim();
    let countRangeAddress = countRangeAddressIntermediate.split(',')[0];
    let backGrounds = sheet.getRange(countRangeAddress).getBackgrounds();
    let sumValues = sheet.getRange(countRangeAddress).getValues();
    let sum = 0;
    for (let i = 0; i < backGrounds.length; i++)
        for (let k = 0; k < backGrounds[i].length; k++)
            if (backGrounds[i][k] == colorRef)
                if ((typeof sumValues[i][k]) == 'number')
                    sum = sum + (sumValues[i][k]);
    return sum;
};