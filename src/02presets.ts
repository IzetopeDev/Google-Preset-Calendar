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
    buttonColor?: string;
    isAllDay?: boolean;
    startTime?: number;
    endTime?: number;
    reminders?: ReminderHelper[];
    eventColor?: string;
    description?: string;

    constructor(
        helperObject: PresetHelper 
        = {
            calendarID: '',
            name: '',
            buttonColor: getRandomColor(),
            isAllDay: true,
            startTime: undefined,
            endTime: undefined,
            reminders: [],
            eventColor: getRandomColor(),
            description: '',
        }
    ) {
        console.info("constructing preset obj");
        if (settings.enableVerbose) {
            console.log('helperObject :>> ', helperObject);
        }

        this.calendarID = helperObject.calendarID
        this.name = helperObject.name
        this.buttonColor = helperObject.buttonColor
        this.isAllDay = helperObject.isAllDay
        this.startTime = helperObject.startTime
        this.endTime = helperObject.endTime
        this.reminders = helperObject.reminders
        this.eventColor = helperObject.eventColor
        this.description = helperObject.description
        
    }
}

class PresetManager {
    presets: Preset[];
    constructor() {
        this.presets = [];
    }

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