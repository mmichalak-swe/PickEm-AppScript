function postTextMessageScoreBot(textMessage) {
    // Post a text-based message to the GroupMe chat
  
    try {
      var scriptProperties = PropertiesService.getScriptProperties()
      var botId = scriptProperties.getProperty('botIdTest');
    } catch (err) {
      Logger.log(`Failed getting property "botId": ${err.message}`);
    }
  
    const updateHeader = "The top 3 scores entering the 8pm game:\\n";
    let updateData = [updateHeader, "Jim: 95", "Bret Smith: 94", "Mitchell: 92", "\\nCongrats on Bret to going 12-1 so far this week!"];
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