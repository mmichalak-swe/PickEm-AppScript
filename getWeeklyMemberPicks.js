function getWeeklyMemberPicks() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssMember;
  var isValidSheet = true;

  const mapConfig = readConfig();
  const mapMembers = readMembersObjects();
  var week = mapConfig.get("week");

  mapMembers.forEach((value, key, map) => {
    const memberName = key;
    const memberInfo = value;
    const sheetID = 'sheetID';
    const ssMember = SpreadsheetApp.openById(memberInfo.sheetID);

    // Logger.log(ssMember.getName());

    dataImport = ssMember.getRangeByName('Week_' + week).getValues();
    // Logger.log(dataImport);

    dataImport.forEach((game) => {
      Logger.log(game);
      // Logger.log(game.length);
      // Logger.log(typeof(game[0]));

      // Check vote for away team
      if (game[0] != "") {
        Logger.log('vote for away');

      // Check vote for home team  
      } else if (game[4] != "") {
        Logger.log('vote for home');
      } else if (game[0] === "" &&  game[4] === "") {
        Logger.log("Pick was left blank");
      } else {
        isValidSheet = false;
        Logger.log('error');
      }
    });
  });
}