// env variables (supposed to be taken from user's excel settings file)
enum possibleFixes {
    createFolder = "createFolder",
    createFile = "createFile",
}

enum driveTypes {
    folder = "folder",
    file = "file",
}

/**
 * Waits for a folder or file to appear in the user's Drive.
 * @param {string} name The name of the folder or file to wait for.
 * @param {string} type The type to wait for, either 'folder' or 'file'.
 * @param {number} interval The interval in milliseconds to check for the existence.
 * @returns {boolean} A boolean indicating if the folder or file was found.
 */
function watchForDriveItem(name: string, type: driveTypes, interval: number = 1000): boolean {
    console.info("watchForDriveItem() called");
    if (settings.enableVerbose) {console.log(`name :>> ${name}, type :>> ${type}, interval :>> ${interval}`);}
    
    let i = 0;
    while (i < 60) {
        let exists;
        switch (type) {
            case 'folder':
                exists = DriveApp.getFoldersByName(name).hasNext();
                break;
            case 'file':
                exists = DriveApp.getFilesByName(name).hasNext();
                break;
            default:
                console.error("Invalid type provided. Only 'folder' or 'file' are allowed.");
                return false;
        }

        if (exists) {
            if (settings.enableVerbose) {console.log(`${type} found!`);}
            return true;
        }

        if (settings.enableVerbose) {console.log(`${type} not found. sleeping for ${interval}ms...`);}
        Utilities.sleep(interval);
        i++;
    }

    return false;
}


class UserSettings {
    fileID: string | undefined;
    virtualSheets: {
        settings: Array<Array<any>> | undefined,
        presets: Array<Array<any>> | undefined
    };
    enableVerbose: boolean;

    constructor() {
        //default settings:
        this.fileID = undefined;
        this.virtualSheets = {
            settings: undefined,
            presets: undefined
        };

        this.enableVerbose = true; // to change to false in production
    }


    /**
     * Checks whether the user has existing settings in their Google Drive.
     * @returns {object} An object containing:
     * - `outcome`: A boolean indicating if the settings exist.
     * - `fix`: A suggested fix action from `possibleFixes` enum if settings are not found, or `null` if settings exist.
     * - `id`: The ID of the settings file if it exists, otherwise `null`.
     */
    hasUserSettings(): {outcome: boolean, fix?: possibleFixes, id?: string} {
        console.info("hasUserSettings() called");

        const folders = DriveApp.getFoldersByName("google-preset-calendar-script");
        
        if (this.enableVerbose) {console.log("checking if 'google-preset-calendar-script' exists...");}
        const folderExists = folders.hasNext();
        if (!folderExists) {
            if (this.enableVerbose) {console.log("folder does not exist");}
            return {outcome: false, fix: possibleFixes.createFolder};
        }
        if (this.enableVerbose) {console.log("folder exists");}


        if (this.enableVerbose) {console.log("checking if 'Google_Preset_Calendar_Settings' exists...");}
        const settingsFiles = folders.next().getFilesByName("Google_Preset_Calendar_Settings");
        const settingsFileExists = settingsFiles.hasNext();
        if (!settingsFileExists) {
            if (this.enableVerbose) {console.log("settings file does not exist");}
            return {outcome: false, fix: possibleFixes.createFile};
        }
        const settingsFileID = settingsFiles.next().getId();
        if (this.enableVerbose) {console.log(`settings file exists, id: ${settingsFileID}`);}

        return {outcome: true, id: settingsFileID};

    }

    createUserSettings(suggestedSolution: possibleFixes | undefined): string | undefined  {
        console.info("createUserSettings() called");
        if (this.enableVerbose) {console.log(`suggestedSolution :>> ${suggestedSolution}`);}

        switch (suggestedSolution) {
            case possibleFixes.createFolder:
                if (this.enableVerbose) {console.log("creating folder...");}
                DriveApp.createFolder("google-preset-calendar-script");
                let isFolderFound: boolean = watchForDriveItem("google-preset-calendar-script", driveTypes.folder);
                if (!isFolderFound) {
                    console.error("folder not found!");
                    break;
                }
                this.createUserSettings(possibleFixes.createFile);
                break;
            
            case possibleFixes.createFile:
                if (this.enableVerbose) {console.log("creating spreadsheet...");}
                const templateSheet = SpreadsheetApp.openById("1MH5zaioBSi9ybuqjZiQ4mfrfbRlAAqufnU4QEMGnlI0")
                const userSheet = templateSheet.copy("Google_Preset_Calendar_Settings");
                let isSheetFound: boolean = watchForDriveItem("Google_Preset_Calendar_Settings", driveTypes.file);
                if (!isSheetFound) {
                    console.error("settings file not found!");
                    return undefined;
                }
                const userSheetID = userSheet.getId();

                if (this.enableVerbose) {console.log(`spreadsheetID :>> ${userSheetID}, moving file to folder...`);}
                const spreadsheetFile = DriveApp.getFileById(userSheetID);
                DriveApp.getFoldersByName("google-preset-calendar-script").next().addFile(spreadsheetFile);
                DriveApp.getRootFolder().removeFile(spreadsheetFile);
                return userSheetID;

            case undefined:
                console.error("param suggestedSolution :>> undefined. No fixes to apply. Was this function illegally called?");
                break;
            default:
                console.error("uncaught instance of param suggestedSolution! Unable to apply fixes for user settings. Was this function illegally called?");
                break;
        }
    }

    getUserSettings(): void {
        console.info("getUserSettings() called");

        const userSettingsCheck = settings.hasUserSettings();
        if (userSettingsCheck.outcome) {
            this.fileID = userSettingsCheck.id;
        } else if (!userSettingsCheck.outcome) {
            settings.createUserSettings(userSettingsCheck.fix);

        }
        
        
        const settingsSheet = SpreadsheetApp.openById(this.fileID!);
        // TODO: try catch settings and presets if they don't exist.

        try {
            let sheetSettings = settingsSheet.getSheetByName("Settings");
            let sheetPresets = settingsSheet.getSheetByName("Presets");
            if (sheetSettings === null || sheetPresets === null) {
                throw new Error(`settings or presets not found in ${this.fileID}`);
            }
        } catch (error) {
            console.error(error);
            return;
        }

        this.virtualSheets.settings = settingsSheet.getSheetByName("Settings")?.getDataRange().getValues()
        this.virtualSheets.presets = settingsSheet.getSheetByName("Presets")?.getDataRange().getValues()
        if (this.enableVerbose) {
            console.log(`this.virtualSheets.settings :>> ${this.virtualSheets.settings}`);
            console.log(`this.virtualSheets.presets :>> ${this.virtualSheets.presets}`);
        };


        for (let i = 0; i < this.virtualSheets.settings![0].length; i++) {
            let settingName = this.virtualSheets.settings![i][0];
            let settingValue = this.virtualSheets.settings![i][1];
            if (this.enableVerbose) {
                console.log('settingName :>> ', settingName);
                console.log('settingValue :>> ', settingValue);
            }

            switch (settingName) {
                case "enableVerbose":
                    this.enableVerbose = settingValue;
                    break;
            }
        }

        if (this.enableVerbose) {
            console.log('settings :>> ', this);
        };
    }
}

