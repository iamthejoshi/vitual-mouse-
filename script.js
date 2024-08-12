const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load Handpose Model
async function loadHandposeModel() {
    const model = await handpose.load();
    return model;
}

// Set up webcam feed
async function setupWebcam() {
    return new Promise((resolve, reject) => {
        const navigatorAny = navigator;
        navigator.getUserMedia = navigator.getUserMedia ||
            navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
            navigatorAny.msGetUserMedia;
        
        if (navigator.getUserMedia) {
            navigator.getUserMedia(
                { video: true },
                stream => {
                    video.srcObject = stream;
                    video.addEventListener('loadeddata', () => resolve(), false);
                },
                error => reject()
            );
        } else {
            reject();
        }
    });
}

async function main() {
    await setupWebcam();
    const model = await loadHandposeModel();

    video.width = video.videoWidth;
    video.height = video.videoHeight;

    async function detect() {
        const predictions = await model.estimateHands(video);

        if (predictions.length > 0) {
            const landmarks = predictions[0].landmarks;
            const indexFinger = landmarks[8]; // Index finger tip

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw a circle where the index finger tip is
            ctx.beginPath();
            ctx.arc(indexFinger[0], indexFinger[1], 10, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();

            // Move the cursor
            moveCursor(indexFinger[0], indexFinger[1]);
        }

        requestAnimationFrame(detect);
    }

    detect();
}

function moveCursor(x, y) {
    const cursor = document.createElement('div');
    cursor.style.position = 'absolute';
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursor.style.borderRadius = '50%';
    cursor.style.backgroundColor = 'blue';
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
    cursor.style.pointerEvents = 'none';
    document.body.appendChild(cursor);

    setTimeout(() => {
        cursor.remove();
    }, 50);
}

main();
