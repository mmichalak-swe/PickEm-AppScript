// NFL TEAM INFO - script to fetch all NFL data for teams
function fetchNFLSchedule() {
  // Calls the linked spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
    
  // Declaration of script variables
  var maxRows;
  var maxCols;
  var year = fetchYear();
  var arr = [];
  var nfl = [];
  var abbr;
  var name;
  var location;
  var objTeams = fetchTeamsESPN();
  var teamsLen;
  var espnId = [];
  var espnAbbr = [];
  var espnName = [];
  var espnLocation = [];
  var teamsLen = objTeams.length;
  
  for (var i = 0 ; i < teamsLen ; i++ ) {
    arr = [];
    if(objTeams[i]['id'] != 0 ) {
      abbr = objTeams[i]['abbrev'].toUpperCase();
      name = objTeams[i]['name'];
      location = objTeams[i]['location'];
      espnId.push(objTeams[i]['id']);
      espnAbbr.push(abbr);
      espnName.push(name);
      espnLocation.push(location);
      arr = [objTeams[i]['id'],abbr,location,name,objTeams[i]['byeWeek']];
      nfl.push(arr);
    }
  }

  var sheet;
  var range;
  var ids = [];
  var abbrs = [];
  for ( var i = 0 ; i < espnId.length ; i++ ) {
    ids.push(espnId[i].toFixed(0));
    abbrs.push(espnAbbr[i]);
  }
  // Declaration of variables
  var arr = [];
  var schedule = [];
  var home = [];
  var dates = [];
  var allDates = [];
  var hours = [];
  var allHours = [];
  var minutes = [];
  var allMinutes = [];
  var location = [];
  var byeIndex;
  var id;
  var data;
  var j;
  var k;
  var date;
  var hour;
  var minute;
  var weeks = 1; 
  var gameIds = [];
  for(var key in objTeams[0]['proGamesByScoringPeriod']){
    weeks++;
  }
  
  for ( i = 0 ; i < teamsLen ; i++ ) {
    
    arr = [];
    arrIds = [];
    home = [];
    dates = [];
    hours = [];
    minutes = [];
    byeIndex = objTeams[i]['byeWeek'].toFixed(0);
    if ( byeIndex != 0 ) {
      id = objTeams[i]['id'].toFixed(0);
      arr.push(abbrs[ids.indexOf(id)]);
      arrIds.push(abbrs[ids.indexOf(id)])
      home.push(abbrs[ids.indexOf(id)]);
      dates.push(abbrs[ids.indexOf(id)]);
      hours.push(abbrs[ids.indexOf(id)]);
      minutes.push(abbrs[ids.indexOf(id)]);
      for (var j = 1 ; j <= weeks ; j++ ) {
        if ( j == byeIndex ) {
          arr.push('BYE');
          arrIds.push('BYE');
          home.push('BYE');
          dates.push('BYE');
          hours.push('BYE');
          minutes.push('BYE');
        } else {
          if ( objTeams[i]['proGamesByScoringPeriod'][j][0]['homeProTeamId'].toFixed(0) === id ) {
            arr.push(abbrs[ids.indexOf(objTeams[i]['proGamesByScoringPeriod'][j][0]['awayProTeamId'].toFixed(0))]);
            home.push(1);
            date = new Date(objTeams[i]['proGamesByScoringPeriod'][j][0]['date'])
            dates.push(date);
            hour = date.getHours()
            hours.push(hour);
            minute = date.getMinutes();
            minutes.push(minute);
          } else {
            arr.push(abbrs[ids.indexOf(objTeams[i]['proGamesByScoringPeriod'][j][0]['homeProTeamId'].toFixed(0))]);
            home.push(0);
            date = new Date(objTeams[i]['proGamesByScoringPeriod'][j][0]['date'])
            dates.push(date);
            hour = date.getHours()
            hours.push(hour);
            minute = date.getMinutes();
            minutes.push(minute);
          }
          arrIds.push(objTeams[i]['proGamesByScoringPeriod'][j][0]['id']);
        }
      }
      schedule.push(arr);
      gameIds.push(arrIds);
      location.push(home);
      allDates.push(dates);
      allHours.push(hours);
      allMinutes.push(minutes);
    }
  }
  
  // This section creates a nice table to be used for lookups and queries about NFL season
  var week;
  var awayTeam;
  var awayTeamName;
  var awayTeamLocation;
  var homeTeam;
  var homeTeamName;
  var homeTeamLocation;
  var formData = [];
  var mnf;
  var day;
  var dayName;
  var gameId;
  arr = [];
  
  for ( j = 0; j < (teamsLen - 1); j++ ) {
    for ( k = 1; k <= 18; k++ ) {
      if (location[j][k] == 1) {
        week = k;
        awayTeam = schedule[j][k];
        awayTeamName = espnName[espnAbbr.indexOf(awayTeam)];
        awayTeamLocation = espnLocation[espnAbbr.indexOf(awayTeam)];
        homeTeam = schedule[j][0];
        homeTeamName = espnName[espnAbbr.indexOf(homeTeam)];
        homeTeamLocation = espnLocation[espnAbbr.indexOf(homeTeam)];
        date = allDates[j][k];
        hour = allHours[j][k];
        minute = allMinutes[j][k];
        day = date.getDay();
        mnf = 0;
        if ( day == 1 ) {
          mnf = 1;
          dayName = 'Monday';
        } else if ( day == 0 ) {
          dayName = 'Sunday';
        } else if ( day == 4 ) {
          day = -3;
          dayName = 'Thursday';
        } else if ( day == 5 ) {
          day = -2;
          dayName = 'Friday';
        } else if ( day == 6 ) {
          day = -1;
          dayName = 'Saturday';
        }
        gameId = gameIds[j][k];
        arr = [week, date, day, hour, minute, dayName, awayTeam, homeTeam, awayTeamLocation, awayTeamName, homeTeamLocation, homeTeamName, gameId];
        formData.push(arr);
      }
    }
  }
  var headers = ['week','date','day','hour','minute','dayName','awayTeam','homeTeam','awayTeamLocation','awayTeamName','homeTeamLocation','homeTeamName', 'gameId'];
  var sheetName = 'NFL_' + year;
  var rows = formData.length + 1;
  var columns = formData[0].length;
  
  sheet = ss.getActiveSheet();
  if ( sheet.getSheetName() == 'Sheet1' && ss.getSheetByName(sheetName) == null) {
    sheet.setName(sheetName);
  }
  sheet = ss.getSheetByName(sheetName);  
  if (sheet == null) {
    ss.insertSheet(sheetName,0);
    sheet = ss.getSheetByName(sheetName);
  }
  
  maxRows = sheet.getMaxRows();
  if (maxRows < rows){
    sheet.insertRows(maxRows,rows - maxRows - 1);
  } else if (maxRows > rows){
    sheet.deleteRows(rows,maxRows - rows);
  }
  maxCols = sheet.getMaxColumns();
  for ( j = maxCols; j < columns; j++){
    sheet.insertColumnAfter(j);
  } 
  if (maxCols > columns){
    sheet.deleteColumns(columns,maxCols - columns);
  }
  sheet.setColumnWidths(1,columns,30);
  sheet.setColumnWidth(1, 34);
  sheet.setColumnWidth(2,60);
  sheet.setColumnWidth(6,60);
  sheet.setColumnWidths(9,4,80);
  sheet.setColumnWidth(13, 64);
  sheet.clear();
  range = sheet.getRange(1,1,1,columns)
  range.setValues([headers]);
  ss.setNamedRange(sheetName+'_HEADERS',range);
  range = sheet.getRange(1,1,rows,columns)
  range.setFontSize(8);
  range.setVerticalAlignment('middle');  
  range = sheet.getRange(2,1,formData.length,columns)
  range.setValues(formData);
  ss.setNamedRange(sheetName,range);
  range.setHorizontalAlignment('left');  
  range.sort([{column: 1, ascending: true},{column: 2, ascending: true},{column: 4, ascending: true},
              {column:  5, ascending: true},{column: 6, ascending: true},{column: 8, ascending: true}]); 
  sheet.getRange(1,3).setNote('-3: Thursday, -2: Friday, -1: Saturday, 0: Sunday, 1: Monday, 2: Tuesday');
  sheet.protect().setDescription(sheetName);
  sheet.setFrozenRows(1);
  try {
    sheet.hideSheet();
  }
  catch (err){
  }
  ss.toast('Imported all NFL schedule data');
}