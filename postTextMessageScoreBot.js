function postTextMessageScoreBot(textMessage) {
    // Post a text-based message to the GroupMe chat
  
    try {
      var scriptProperties = PropertiesService.getScriptProperties()
      var botId = scriptProperties.getProperty('botIdTest');
    } catch (err) {
      Logger.log(`Failed getting property "botId": ${err.message}`);
    }
  
    const updateHeader = "The top 3 scores for Week 15:\\n";
    let updateData = [updateHeader, "Bret Smith: 103", "Phil Jones: 101", "Jim: 99", "\\nCongrats Bret on the week 15 win!"];
    let joinedUpdateData = updateData.join('\\n');
  
    var url = "https://api.groupme.com/v3/bots/post";
    var headers = {
      "method": "post",
      "payload":'{"bot_id":"' + botId + '",\
      "text":"' + joinedUpdateData +  '"}'
    };
  
    var response = UrlFetchApp.fetch(url, headers);
    var responseCode = response.getResponseCode();
  
    if (responseCode !== 202) {
      throw new Error('GroupMe message not sent successfully!, HTTP error code: ' + responseCode.toString());
    }
  
    // Logger.log(typeof(text));
    // Logger.log(text);
}