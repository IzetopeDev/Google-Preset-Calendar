// env variables (supposed to be taken from user's excel settings file)
enum possibleFixes {
    createFolder = "createFolder",
    createFile = "createFile",
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


    hasUserSettings(): {outcome: boolean, fix: possibleFixes | null, id: string | null} {
        const folders = DriveApp.getFoldersByName("google-preset-calendar-script");
        
        const folderExists = folders.hasNext();
        if (!folderExists) {
            return {outcome: false, fix: possibleFixes.createFolder, id: null};
        }

        const settingsFiles = folders.next().getFilesByName("Google_Preset_Calendar_Settings");
        const settingsFileExists = settingsFiles.hasNext();
        if (!settingsFileExists) {
            return {outcome: false, fix: possibleFixes.createFile, id: null};
        }
        const settingsFileID = settingsFiles.next().getId();
        return {outcome: true, fix: null, id: settingsFileID};

    }

    createUserSettings(suggestedSolution: possibleFixes | null): void  {
        switch (suggestedSolution) {
            case possibleFixes.createFolder:
                DriveApp.createFolder("google-preset-calendar-script");
                break;
            
            case possibleFixes.createFile:
                const spreadsheet = SpreadsheetApp.create("Google_Preset_Calendar_Settings");
                const spreadsheetID = DriveApp.getFileById(spreadsheet.getId());
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
const enableVerbose = true; 
const calendars: [string] = [""];
