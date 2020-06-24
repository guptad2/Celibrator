const Shotstack = require('shotstack-sdk');

const defaultClient = Shotstack.ApiClient.instance;
const DeveloperKey = defaultClient.authentications['DeveloperKey'];
const api = new Shotstack.EndpointsApi();

let apiUrl = 'https://api.shotstack.io/stage';

function createVideo(videoListStr, person_name) {
    if (!process.env.SHOTSTACK_KEY) {
        console.log('API Key is required. Set using: export SHOTSTACK_KEY=your_key_here');
        process.exit(1);
    }

    if (process.env.SHOTSTACK_HOST) {
        apiUrl = process.env.SHOTSTACK_HOST;
    }

    defaultClient.basePath = apiUrl;
    DeveloperKey.apiKey = process.env.SHOTSTACK_KEY;

    const images = [
        'https://scontent-sea1-1.xx.fbcdn.net/v/t1.15752-9/104873552_271882597248362_4768499443144815849_n.png?_nc_cat=110&_nc_sid=b96e70&_nc_ohc=54n21QKbr9wAX--xts4&_nc_ht=scontent-sea1-1.xx&oh=d610ab7badcb96ec527b56d43b851e25&oe=5F187B89',
    ];

    let videos = videoListStr.split(",");

    let clips = [];
    let start = 0;
    let length = 5;
    let vidLength = 15;

    let soundtrack = new Shotstack.Soundtrack;
    soundtrack
        .setSrc('https://cdn.fbsbx.com/v/t59.3654-21/104839158_600533427233245_7426388954113560426_n.mp3/FbHack_audio.mp3?_nc_cat=103&_nc_sid=7272a8&_nc_ohc=ItTkd6zfDDsAX-e6JVN&_nc_ht=cdn.fbsbx.com&oh=b0d2cc8353cdcb31e9ad3c1ae15c95b0&oe=5EF49CD6')
        .setEffect('fadeInFadeOut')
        .setVolume(0.1);

    images.forEach((image) => {
        let imageAsset = new Shotstack.ImageAsset;
        imageAsset
            .setSrc(image);

        let clip = new Shotstack.Clip;
        clip
            .setAsset(imageAsset)
            .setStart(start)
            .setLength(length)
            .setEffect('zoomIn');

        start = start + length;
        clips.push(clip);
    });

    videos.forEach((vid) => {
        let videoAsset = new Shotstack.VideoAsset;
        videoAsset
            .setSrc(vid)
            .setVolume(1);

        let transition = new Shotstack.Transition;
        transition
            .setIn("fade")
            .setOut("fade");

        let clip = new Shotstack.Clip;
        clip
            .setAsset(videoAsset)
            .setStart(start)
            .setLength(vidLength)
            .setTransition(transition);

        start = start + clip.getLength();
        clips.push(clip);
    });

    let track = new Shotstack.Track;
    track
        .setClips(clips);

    let timeline = new Shotstack.Timeline;
    timeline
        .setBackground('#000000')
        .setSoundtrack(soundtrack)
        .setTracks([track]);

    let output = new Shotstack.Output;
    output
        .setFormat('mp4')
        .setResolution('sd');

    let edit = new Shotstack.Edit;
    edit
        .setTimeline(timeline)
        .setOutput(output);

    api.postRender(edit).then((data) => {
        let message = data.response.message;
        let id = data.response.id
        
        console.log(message + '\n');
        console.log('>> Now check the progress of your render by running:');
        console.log('>> node examples/status.js ' + id);

    }, (error) => {
        console.error('Request failed: ', error);
        process.exit(1);
    });
}