async function loadFile(filePath, callback) {
    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for file: ${filePath}`);
        }

        const fileContent = await response.text();
        
        if(callback) callback(fileContent);

    } catch (error) {
        console.error("Could not load file:", error);
    }
}

function timeToSeconds(timeString) {
    const [hms, mmm] = timeString.split('.');
    const [hours, minutes, seconds] = hms.split(':').map(Number);

    const totalMs = (
        (hours * 3600) +
        (minutes * 60) +
        (seconds) +
        (Number(mmm)/1000 || 0)
    );
    
    return totalMs;
}

function parseVTT(vttContent) {
    const lines = vttContent.trim().split('\n');
    const cues = [];
    let currentCue = {};
    let isHeader = true;

    for (let line of lines) {
        line = line.replace('\r', '');
        if (isHeader && line.toUpperCase().indexOf('WEBVTT') === 0) {
            isHeader = false;
            continue;
        }

        if (line.includes('-->')) {
            if (currentCue.startTime && currentCue.endTime && currentCue.text) {
                cues.push(currentCue);
            }
            currentCue = {};

            const [startTime, endTime] = line.split(' --> ').map(t => t.trim());

            currentCue.startTime = timeToSeconds(startTime);
            currentCue.endTime = timeToSeconds(endTime);
            currentCue.text = '';

        } else if (line.trim() !== '') {
            if (currentCue.startTime) {
                currentCue.text += (currentCue.text.length > 0 ? ' ' : '') + line.trim();
            }
        }
    }

    if (currentCue.startTime && currentCue.endTime && currentCue.text) {
        cues.push(currentCue);
    }
    
    console.log("Parsed Cues:", cues);
    return cues;
}