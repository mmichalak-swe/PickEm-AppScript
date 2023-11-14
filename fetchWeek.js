function fetchWeek() {
  // FETCH CURRENT WEEK (returns string), writes to CONFIG tab
  var obj;
  obj = JSON.parse(UrlFetchApp.fetch('http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard').getContentText());
  var week = 1;
  if(obj['events'][0]['season']['slug'] != 'preseason'){
    week = obj['week']['number'];
  }
  Logger.log('Current week: ' + week);
  return week.toString();
}