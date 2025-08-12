function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getPresets(): Array<any> {
    // I should be throwing errors. so that stops if no presets or skips it?
    if (settings.virtualSheets.presets == undefined) {
        console.error("No presets found");
        return [];
    }
    
    if (settings.virtualSheets.presets.length == 0) {
        console.error("No presets found");
        return [];
    }

    return settings.virtualSheets.presets!;
}

function initPresets(): string {
    console.info("initPresets() called");
    let presets: Array<{
        calendarID: string,
        name: string,
    }> = [];
    
    if (settings.enableVerbose) {console.log('settings.virtualSheets.presets :>> ', settings.virtualSheets.presets);}
    for (let i = 0; i < settings.virtualSheets.presets![0].length; i++) {
        presets.push({
            calendarID: settings.virtualSheets.presets![0][i],
            name: settings.virtualSheets.presets![1][i],
        });
    }
    presets.shift();
    if (settings.enableVerbose) {console.log('presets :>> ', presets);}

    let htmlParts: string[] = [];
    presets.forEach((preset) => {
        existingButtons.push(preset);
        htmlParts.push(
            HtmlService
                .createHtmlOutput()
                .setContent(
                    `<button onclick="google.script.run.presetCaller('${preset.calendarID}')" class="primary" style="background-color:${getRandomColor()}">${preset.name}</button>`
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