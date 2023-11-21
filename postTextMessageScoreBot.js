function postTextMessageScoreBot(textMessage) {
    // Post a text-based message to the GroupMe chat
  
    try {
      var scriptProperties = PropertiesService.getScriptProperties()
      var botId = scriptProperties.getProperty('botId');
    } catch (err) {
      Logger.log(`Failed getting property "botId": ${err.message}`);
    }
  
    // var textMessage = "Testing google apps script w/ properties to post a message!";
  
    // TO-DO: Add something similar for top 3 scores
    // let array = ["Item 1", "Item 2", "Item 3"]
    // let joinedArray = array.join("\n")
  
    var url = "https://api.groupme.com/v3/bots/post";
    var headers = {
      "method": "post",
      "payload":'{"bot_id":"' + botId + '",\
      "text":"' + textMessage +  '"}'
    };
  
    var response = UrlFetchApp.fetch(url, headers);
    var responseCode = response.getResponseCode();
  
    if (responseCode !== 202) {
      throw new Error('GroupMe message not sent successfully!, HTTP error code: ' + responseCode.toString());
    }
  
    // Logger.log(typeof(text));
    // Logger.log(text);
}