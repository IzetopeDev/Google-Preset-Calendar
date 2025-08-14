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
    buttonColor: string | undefined,
    isAllDay: boolean | undefined,
    startTime: number | undefined,
    endTime: number | undefined,
    reminders: ReminderHelper[] | undefined,
    eventColor: string | undefined,
    description: string | undefined,
}

class Preset {
    calendarID: string;
    name: string;
    buttonColor: string | undefined;
    isAllDay: boolean | undefined;
    startTime: number | undefined;
    endTime: number | undefined;
    reminders: ReminderHelper[] | undefined;
    eventColor: string | undefined;
    description: string | undefined;

    constructor(helperObject: PresetHelper);
    constructor(
        calendarID: string,
        name: string,
        buttonColor: string | undefined,
        isAllDay: boolean | undefined,
        startTime: number | undefined,
        endTime: number | undefined,
        reminders: ReminderHelper[] | undefined,
        eventColor: string | undefined,
        description: string | undefined,
    );

    constructor(
        helperOrCalID: PresetHelper | string,
        name?: string,
        buttonColor?: string | undefined,
        isAllDay?: boolean | undefined,
        startTime?: number | undefined,
        endTime?: number | undefined,
        reminders?: ReminderHelper[] | undefined,
        eventColor?: string | undefined,
        description?: string | undefined,
    ) {
        console.info("constructing preset obj");
        if (settings.enableVerbose) {
            console.log('helperOrCalID :>> ', helperOrCalID);
        }

        if (typeof(helperOrCalID) === "string") {
            if (settings.enableVerbose) {
                console.log('name :>> ', name);
                console.log('buttonColor :>> ', buttonColor);
                console.log('isAllDay :>> ', isAllDay);
                console.log('startTime :>> ', startTime);
                console.log('endTime :>> ', endTime);
                console.log('reminders :>> ', reminders);
                console.log('eventColor :>> ', eventColor);
                console.log('description :>> ', description);
            }

            this.calendarID = helperOrCalID
            this.name = name!
            this.buttonColor = buttonColor
            this.isAllDay = isAllDay
            this.startTime = startTime
            this.endTime = endTime
            this.reminders = reminders
            this.eventColor = eventColor
            this.description = description

        } else {
            this.calendarID = helperOrCalID.calendarID
            this.name = helperOrCalID.name
            this.buttonColor = helperOrCalID.buttonColor
            this.isAllDay = helperOrCalID.isAllDay
            this.startTime = helperOrCalID.startTime
            this.endTime = helperOrCalID.endTime
            this.reminders = helperOrCalID.reminders
            this.eventColor = helperOrCalID.eventColor
            this.description = helperOrCalID.description
        }
    }
}