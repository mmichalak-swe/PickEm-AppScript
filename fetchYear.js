function fetchYear() {
  // FETCH CURRENT YEAR (returns string)
  var obj;
  obj = JSON.parse(UrlFetchApp.fetch('http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard').getContentText());
  var year = obj['season']['year'];
  return year.toString();
}