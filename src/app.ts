// env variables (supposed to be taken from user's excel settings file)
const enableVerbose = true; 



/**
 * Includes a file in the current page.
 * @param {string} file The name of the file to include.
 * @returns {string} The content of the included file.
 */
function include(file: string): string {
    console.info('include() called');
    if (enableVerbose) {console.log('file :>> ', file);}

    return HtmlService.createHtmlOutputFromFile(file).getContent();
}



/*
* core caller functions
* DO NOT REMOVE
*/



/**
 * Called when the script is opened in a web browser.
 * @returns {GoogleAppsScript.HTML.HtmlOutput} The HTML output of the dashboard page.
 */
function doGet(e:GoogleAppsScript.Events.DoGet): GoogleAppsScript.HTML.HtmlOutput {
  console.info('doGet() called');
  console.log('e :>> ', e);
  return HtmlService.createHtmlOutputFromFile("00site/index");
}


function doPost(e:GoogleAppsScript.Events.DoPost) {
  console.info('doPost() called');
  console.log('e :>> ', e);
  return ContentService.createTextOutput('Received POST');
}
