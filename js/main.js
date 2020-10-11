function Camera(){
    console.log("実行されてるよ");
    let video = document.getElementById("videoInput"); // video is the id of video tag
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function(err) {
            console.log("An error occurred! " + err);
        });
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let hsv_video = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let dst_img = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);
    

    const FPS = 30;
    function processVideo() {
        try {
            let begin = Date.now();
            // start processing.
            cap.read(src);
            cv.cvtColor(src, hsv_video, cv.COLOR_RGB2HSV);
            //cv.imshow('canvasOutput', hsv_video);
            const hsvVector = new cv.MatVector();
            cv.split(hsv_video, hsvVector);

            let hue = hsvVector.get(0);
            let sat = hsvVector.get(1);
            let val = hsvVector.get(2);

            let yellow = 0;
            let green = 0;

            for(let y = 0; y < hsv_video.rows; y++) {
                for (let x = 0; x < hsv_video.cols; x++) {
                    if((hue.data[600*y+x]<35 && hue.data[600*y+x]>20)&& sat.data[600*y+x]>127){
                        yellow++;
                    }
                }
            }
            
            if(yellow>500){
                force = true;
            }else{
                force = false;
            }

            let delay = 1000/FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
        } catch (err) {
            console.log(err);
        }
    };
    setTimeout(processVideo, 0);
}

function onOpenCvReady(){
    console.log("opencv is ready");
    Camera();
}