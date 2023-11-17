function triggerWeeklyFunctions() {
  // Trigger every Sunday near, but after 13:00.
  ScriptApp.newTrigger('lockWeeklyRange')
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.SUNDAY)
      .atHour(13)
      .nearMinute(0)
      .create();
  ScriptApp.newTrigger('updateWeek')
      .timeBased()
      .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
      .atHour(5)
      .create();
}