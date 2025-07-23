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
 * Called when the script is opened in a web browser.
 * @returns {GoogleAppsScript.HTML.HtmlOutput} The HTML output of the dashboard page.
 */
function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  console.info('doGet() called');
  return HtmlService.createHtmlOutputFromFile('pages/dashboard.html')
    .setTitle(getTitle(false, pages.dashboard));
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

