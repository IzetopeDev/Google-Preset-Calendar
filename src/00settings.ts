// env variables (supposed to be taken from user's excel settings file)
enum possibleFixes {
    createFolder = "createFolder",
    createFile = "createFile",
}

function insertSpreadsheetTemplate(spreadsheetID: string) {
    console.info("insertSpreadsheetTemplate() called");
    console.log(`spreadsheetID :>> ${spreadsheetID}`);

    const spreadsheet = {
        obj: SpreadsheetApp.openById(spreadsheetID),
        id: spreadsheetID,
    };
}

class userSettings {
    userDriveID: string | null;
    enableVerbose: boolean;

    constructor() {
        this.userDriveID = null;
        
        let userSettingsCheck = this.hasUserSettings();
        if (userSettingsCheck.outcome) {
            this.userDriveID = userSettingsCheck.id;
        } else {
            this.createUserSettings(userSettingsCheck.fix);
        }

        this.enableVerbose = true;
        
    }


    /**
     * Checks whether the user has existing settings in their Google Drive.
     * @returns {object} An object containing:
     * - `outcome`: A boolean indicating if the settings exist.
     * - `fix`: A suggested fix action from `possibleFixes` enum if settings are not found, or `null` if settings exist.
     * - `id`: The ID of the settings file if it exists, otherwise `null`.
     */
    hasUserSettings(): {outcome: boolean, fix: possibleFixes | null, id: string | null} {
        console.info("hasUserSettings() called");

        const folders = DriveApp.getFoldersByName("google-preset-calendar-script");

        
        if (this.enableVerbose) {console.log("checking if 'google-preset-calendar-script' exists...");}
        const folderExists = folders.hasNext();
        if (!folderExists) {
            if (this.enableVerbose) {console.log("folder does not exist");}
            return {outcome: false, fix: possibleFixes.createFolder, id: null};
        }
        if (this.enableVerbose) {console.log("folder exists");}


        if (this.enableVerbose) {console.log("checking if 'Google_Preset_Calendar_Settings' exists...");}
        const settingsFiles = folders.next().getFilesByName("Google_Preset_Calendar_Settings");
        const settingsFileExists = settingsFiles.hasNext();
        if (!settingsFileExists) {
            if (this.enableVerbose) {console.log("settings file does not exist");}
            return {outcome: false, fix: possibleFixes.createFile, id: null};
        }
        const settingsFileID = settingsFiles.next().getId();
        if (this.enableVerbose) {console.log(`settings file exists, id: ${settingsFileID}`);}

        return {outcome: true, fix: null, id: settingsFileID};

    }

    createUserSettings(suggestedSolution: possibleFixes | null): void  {
        console.info("createUserSettings() called");
        if (this.enableVerbose) {console.log(`suggestedSolution :>> ${suggestedSolution}`);}

        switch (suggestedSolution) {
            case possibleFixes.createFolder:
                if (this.enableVerbose) {console.log("creating folder...");}
                DriveApp.createFolder("google-preset-calendar-script");
                this.createUserSettings(possibleFixes.createFile);
                break;
            
            case possibleFixes.createFile:
                if (this.enableVerbose) {console.log("creating spreadsheet...");}
                const spreadsheet = SpreadsheetApp.create("Google_Preset_Calendar_Settings");
                const spreadsheetID = DriveApp.getFileById(spreadsheet.getId());
                if (this.enableVerbose) {console.log(`spreadsheetID :>> ${spreadsheetID}, moving file to folder...`);}

                DriveApp.getFoldersByName("google-preset-calendar-script").next().addFile(spreadsheetID);
                DriveApp.getRootFolder().removeFile(spreadsheetID);
                break;

            case null:

                break;
            default:

                break;
        }
    }
}

