// init globals
const settings = new UserSettings();
        

// testing area
function test(): void {     
    settings.getUserSettings();
}

/*
* Helper functions
*/

/**
 * Includes a file in the current page.
 * @param {string} file The name of the file to include.
 * @returns {string} The content of the included file.
 */
function include(filename:string): string {
    console.info('include() called');
    if (settings.enableVerbose) {console.log('filename :>> ', filename);}

    return HtmlService
    .createTemplateFromFile(filename)
    .evaluate()
    .getContent();
}


// button click handlers go here as well



/*
* core caller functions
* DO NOT REMOVE
*/



/**
 * Called when the script is opened in a web browser.
 * @param {GoogleAppsScript.Events.DoGet} e The event object.
 * @returns {GoogleAppsScript.HTML.HtmlOutput} The HTML output of the dashboard page.
 */
function doGet(e:GoogleAppsScript.Events.DoGet): GoogleAppsScript.HTML.HtmlOutput {
    console.info('doGet() called');
    if (settings.enableVerbose) {
        console.log('e :>> ', e);
        console.log('Session :>> ', Session);
        console.log('Session.getActiveUser() :>> ', Session.getActiveUser().toString());
        console.log('Session.getEffectiveUser() :>> ', Session.getEffectiveUser().toString());
        console.log('Session.getActiveUserLocale() :>> ', Session.getActiveUserLocale().toString());
    }
    
    return HtmlService
        .createTemplateFromFile("00site/index.html")
        .evaluate();
}


function doPost(e:GoogleAppsScript.Events.DoPost) {
    console.info('doPost() called');
    console.log('e :>> ', e);
    return ContentService.createTextOutput('Received POST');
}

