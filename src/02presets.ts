enum TimeMultiplier {
    DAILY = 1,
    WEEKLY = 7,
    MONTHLY = 30,
    YEARLY = 365,
}

enum ReminderMethods {
    MOBILE_NOTIF,
    AS_EMAIL,
}

interface ReminderHelper {
    value: number | undefined,
    timeMultiplier: TimeMultiplier | undefined,
    triggerTime: number | undefined,
    notificationType: ReminderMethods | undefined,
}

interface PresetHelper {
    calendarID: string,
    name: string,
    buttonColor?: string,
    isAllDay?: boolean,
    startTime?: number,
    endTime?: number,
    reminders?: ReminderHelper[],
    eventColor?: string,
    description?: string,
}

class Preset {
    calendarID: string;
    name: string;
    buttonColor: string;
    isAllDay: boolean;
    startTime: number;
    endTime: number;
    reminders: ReminderHelper[];
    eventColor: string;
    description: string;

    /**
     * Constructs a Preset object from a passed PresetHelper object.
     * If any of the properties are missing from the PresetHelper object, they are set to default values.
     * @param {PresetHelper} presetHelper - The object which contains the properties to be set on the Preset object.
     */
    constructor(presetHelper: PresetHelper) {
        console.info("constructing preset obj");
        
        const defaultHelper =  {
            calendarID: '', // should make this default calendar -- also not sure how to get the user to input this. 
            name: '',
            buttonColor: getRandomColor(),
            isAllDay: true,
            startTime: 0,
            endTime: 0,
            reminders: [], // should make this default reminder 30min before.
            eventColor: '',
            description: '',
        } 

        const initialisedHelper = {...defaultHelper, ...presetHelper};

        if (settings.enableVerbose) {
            console.log(presetHelper);
            console.log(initialisedHelper);
        }

        this.calendarID = initialisedHelper.calendarID
        this.name = initialisedHelper.name
        this.buttonColor = initialisedHelper.buttonColor
        this.isAllDay = initialisedHelper.isAllDay
        this.startTime = initialisedHelper.startTime
        this.endTime = initialisedHelper.endTime
        this.reminders = initialisedHelper.reminders
        this.eventColor = initialisedHelper.eventColor
        this.description = initialisedHelper.description        
    }
}

class PresetManager {
    presets: Preset[];
    constructor() {
        this.presets = [];
    }

    /**
     * Initialises the PresetManager's preset list from settings.virtualSheets.presets.
     * Also generates the HTML for the preset buttons in the dashboard and stores them in the global existingButtons array.
     * @returns The HTML string of the preset buttons.
     */
    initPresets() {
        console.info("initPresets() called");
        
        if (settings.enableVerbose) {console.log('settings.virtualSheets.presets :>> ', settings.virtualSheets.presets);}
        for (let i = 1; i < settings.virtualSheets.presets![0].length; i++) {
            this.presets.push( 
                new Preset({
                    calendarID: settings.virtualSheets.presets![0][i],
                    name: settings.virtualSheets.presets![1][i],
                }
            ));
        }
        if (settings.enableVerbose) {console.log('PresetManager.presets :>> ', this.presets);}

        let htmlParts: string[] = [];
        this.presets.forEach((preset) => {
            existingButtons.push(preset);
            htmlParts.push(
                HtmlService
                    .createHtmlOutput()
                    .setContent(
                        `<button onclick="google.script.run.callPreset('${preset.calendarID}')" class="primary" style="background-color:${getRandomColor()}">${preset.name}</button>`
                    )
                    .getContent()
            );
        });

        const output = htmlParts.join('');

        if (settings.enableVerbose) {
            console.log('output :>> ', output);
            console.log('existingButtons :>> ', existingButtons);
        }

        return output;

    }

    addPreset(preset: Preset) {

    }
    
    getPreset() {

    }
        
}