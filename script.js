const videocode = 'qTEJ2gtWrPk'; 


var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: videocode,
        playerVars: {
            'playsinline': 1,
            'controls': 0
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    document.querySelector('#play-button').addEventListener('click', play);
    document.querySelector('#pause-button').addEventListener('click', pause);
}

function play() {
    player.playVideo();
    document.querySelector('#play-button').style.display = 'none';
    document.querySelector('#pause-button').style.display = 'inline-block';
}
function pause() {
    player.pauseVideo();
    document.querySelector('#play-button').style.display = 'inline-block';
    document.querySelector('#pause-button').style.display = 'none';
}

let cues = [];
loadFile(videocode+'.vtt', (fileContent) => {
    cues = cues = parseVTT(fileContent);
    addSubtitlesToUI(cues);
});

setInterval(()=>{
    const currentTime = player.getCurrentTime()
    const cue = cues.find(cue => {
        return currentTime >= cue.startTime && currentTime < cue.endTime;
    });
    let text = '';
    if(cue) {
        text = cue.text; 
    }
    document.querySelector('#currentSubtitle').textContent = text;
}, 1);

