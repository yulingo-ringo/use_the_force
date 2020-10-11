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
    let height = video.height;
    console.log(height);
    let width = 520;
    console.log(width);
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let smooth_video = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let hsv_video = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let dst_img = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);
    

    const FPS = 30;
    function processVideo() {
        try {
            let begin = Date.now();
            // start processing.
            cap.read(src);
            //cv.medianBlur(src, smooth_video, 5);
            cv.cvtColor(src, hsv_video, cv.COLOR_RGB2HSV);
            cv.imshow('canvasOutput', hsv_video);
            // schedule the next one.

            const hsvVector = new cv.MatVector();
            cv.split(hsv_video, hsvVector);

            let hue = hsvVector.get(0);
            let sat = hsvVector.get(1);
            let val = hsvVector.get(2);

            let yellow = 0;
            let green = 0;

            for(let y = 0; y < hsv_video.rows; y++) {
                for (let x = 0; x < hsv_video.cols; x++) {
                    if((hue.data[360*y+x]<35 && hue.data[360*y+x]>20)&& sat.data[360*y+x]>127){
                        hue.data[360*y+x]=0;
                        sat.data[360*y+x]=0;
                        val.data[360*y+x]=0;
                        yellow++;

                    }else{
                        hue.data[360*y+x]=0;
                        sat.data[360*y+x]=1000;
                        val.data[360*y+x]=100;
                    }
                    // hue = hsv_video.at(y, x)[0];
                    // sat = hsv_video.at<Vec3b>(y, x)[1];
                    // val = hsv_video.at<Vec3b>(y, x)[2];
                    // // 居留地マップの検出
                    // if ((hue < 35 && hue > 20) && sat > 127) {
                    //     dst_img.at<uchar>(y, x) = 255;
                    // }else {
                    //     dst_img.at<uchar>(y, x) = 0;
                    // }
                }
            }
            console.log("yellow is " + yellow);
            console.log("green is "+ green);
            cv.merge(hsvVector, dst_img)
            cv.imshow('afterHSV', dst_img);

            let forceReady = document.getElementById("forceReady");
            if(yellow>800){
                forceReady.innerHTML = "USING THE FORCE!!!"
            }else{
                forceReady.innerHTML = "You are not using the Force, hold out something yellow over the camera"
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