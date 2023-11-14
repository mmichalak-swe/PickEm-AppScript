// CREATE MENU - this is the ideal setup once the sheet has been configured and the data is all imported
function createMenu() {
  var menu = SpreadsheetApp.getUi().createMenu('Pick\'Ems')
  menu.addItem('Update NFL Schedule', 'fetchNFLSchedule')
      // .addItem('Lock Members','createMenuLockedWithTrigger')
      // .addSeparator()
      // .addItem('Update NFL Schedule', 'fetchNFLSchedule')
      .addToUi();

  var ui = SpreadsheetApp.getUi();
    ui.alert('Items added to menu.', SpreadsheetApp.getUi().ButtonSet.OK);

  // deleteTriggers()
  // var id = SpreadsheetApp.getActiveSpreadsheet().getId();
  // ScriptApp.newTrigger('createMenuUnlocked')
  //   .forSpreadsheet(id)
  //   .onOpen()
  //   .create();
}