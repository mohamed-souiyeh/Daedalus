export function torad(degrees) {
    return (degrees * Math.PI) / 180;
}
export function todeg(radians) {
    return (radians * 180) / Math.PI;
}
export function determineFrameRate() {
    let start = 0;
    let fps = 0;
    let itirations = 0;
    let draw = (timestamp) => {
        if (!start)
            start = timestamp;
        console.log("itirations = >", itirations);
        console.log("we are in the animation frame");
        console.log(timestamp);
        // console.log("this is 1000 / 60 = >", 1000 / 60);
        // console.log("this is 1000 / 16.666 = >", 1000 / 16.666);
        console.log("timestamp - start = >", timestamp - start);
        if (itirations == 1) {
            fps = Math.round(1000 / (timestamp - start));
            if (fps > 60 && fps < 70) {
                fps = 60;
            }
            console.log("fps = >", fps);
            return;
        }
        itirations++;
        requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
    return fps;
}
