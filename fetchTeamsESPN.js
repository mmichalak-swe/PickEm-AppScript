// ESPN TEAMS - Fetches the ESPN-available API data on NFL teams
function fetchTeamsESPN() {
  var year = fetchYear(); // First array value is year
  var obj = JSON.parse(UrlFetchApp.fetch('http://fantasy.espn.com/apis/v3/games/ffl/seasons/' + year + '?view=proTeamSchedules').getContentText());
  var objTeams = obj['settings']['proTeams'];
  return objTeams;
}