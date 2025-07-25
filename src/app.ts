enum pages {
  calendarInput = "calendar-input",
  dashboard = "dashboard",
  webAppInit = "initialise-local-webapp"
}



/**
 * returns the title for the given page from the specified page enum. 
 * @param {boolean} enableVerbose - Whether or not to enable verbose logging.
 * @param {pages} page - the page to call (as defined by enums)
 * @returns {string} The title for the given page.
 */
function getTitle(enableVerbose: boolean, page: pages): string {
  console.info('getTitle() called');
  if (enableVerbose) {console.log('page :>> ', page);}

  let title: string = 
    page.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (enableVerbose) {console.log('title :>> ', title);}

  return title;
}



/**
 * Calls the specified page.
 * @param {boolean} enableVerbose - Whether or not to enable verbose logging.
 * @param {pages} page - the page to call (as defined by enums)
 * @returns {GoogleAppsScript.HTML.HtmlOutput} The HTML output of the page.
 */
function callPage(enableVerbose: boolean, page: pages): GoogleAppsScript.HTML.HtmlOutput {
  console.info('callPage() called');
  if (enableVerbose) {console.log('page :>> ', page);}
  
  return HtmlService.createHtmlOutputFromFile(`pages/${page}.html`)
    .setTitle(getTitle(false, page));
}

function onLoad(): void {
  // Runs when the script site is opened.
}

function include(file: string): string {
  return HtmlService.createHtmlOutputFromFile(file).getContent();
}

/*
// chatgpt added code:

// in a script tag
function googleLogin() {
    // Call Apps Script login function or redirect
}

function openPresetEditor() {
    document.getElementById('preset-editor-overlay').style.display = 'block';
}

function closePresetEditor() {
    document.getElementById('preset-editor-overlay').style.display = 'none';
}
*/





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
