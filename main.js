window.addEventListener('load', () => {
    const video = document.getElementById('video');
    const cursor = document.getElementById('cursor');

    // Access the webcam
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error('Error accessing webcam: ', err);
        });

    // Initialize tracking.js
    const tracker = new tracking.ObjectTracker('finger');

    // Define the callback for the tracker
    tracker.on('track', event => {
        if (event.data.length > 0) {
            const x = event.data[0].x + event.data[0].width / 2;
            const y = event.data[0].y + event.data[0].height / 2;

            // Move the cursor to the detected finger position
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;

            // Optional: add click event based on finger detection
            // This example does not handle click events, but you can enhance it
        }
    });

    // Start tracking
    tracking.track('#video', tracker);
});
