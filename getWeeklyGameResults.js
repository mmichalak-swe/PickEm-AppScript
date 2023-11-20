function getWeeklyGameResults(year, week) {
    // Return object of gameID:games JSON object, key:value pairs
    // check if games are completed: <value['status']['type']['completed'] == true>
    var obj;
    var mapGames = new Map();
    const ESPN_URL = "http://cdn.espn.com/core/nfl/schedule?xhr=1&year=" + year + "&week=" + week;
    // const ESPN_URL = "http://cdn.espn.com/core/nfl/schedule?xhr=1&year=2023&week=11";
    Logger.log(ESPN_URL);

    obj = JSON.parse(UrlFetchApp.fetch(ESPN_URL).getContentText());

    for (const date in obj['content']['schedule']) {
        const objDate = obj['content']['schedule'][date]['games'];
        for (const gameNum in objDate) {
          const objGame = objDate[gameNum];
          mapGames.set(objGame['id'], objGame);
        }
    }

  return mapGames;
}