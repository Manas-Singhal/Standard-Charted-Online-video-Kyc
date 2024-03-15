// JavaScript (recordVideo.js)
let videoStream; // To keep track of the stream for stopping it later

const videoElement = document.getElementById('video');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const downloadButton = document.getElementById('downloadButton');
const checkButton = document.getElementById('checkButton');
const deleteButton = document.getElementById('deleteButton');
const videoCheckedCheckbox = document.getElementById('videoChecked');

let mediaRecorder;
let chunks = [];

startButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            videoStream = stream; // Store the stream for later use
            videoElement.srcObject = stream;
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = event => {
                chunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                downloadButton.href = URL.createObjectURL(blob);
                downloadButton.style.display = 'inline';
                checkButton.style.display = 'inline';
            };

            mediaRecorder.start();
            startButton.disabled = true;
            stopButton.disabled = false;
        })
        .catch(err => {
            console.error('Error accessing the camera: ', err);
        });
});

stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    videoStream.getTracks().forEach(track => track.stop()); // Stop all tracks in the stream
    startButton.disabled = false;
    stopButton.disabled = true;
});

checkButton.addEventListener('click', () => {
    const videoChecked = videoCheckedCheckbox.checked;
    if (videoChecked) {
        // Save the video to Firebase Storage and get its URL
        const storageRef = firebase.storage().ref();
        const videoRef = storageRef.child('recorded_videos/' + Date.now() + '.webm');
        const blob = new Blob(chunks, { type: 'video/webm' });
        videoRef.put(blob).then(snapshot => {
            console.log('Uploaded a blob:', snapshot);
            return snapshot.ref.getDownloadURL();
        }).then(downloadURL => {
            console.log('File available at', downloadURL);
            saveVideoURL(downloadURL);
        }).catch(error => {
            console.error('Error uploading video:', error);
        });
    } else {
        console.log('Video not checked.');
    }
});

deleteButton.addEventListener('click', () => {
    URL.revokeObjectURL(downloadButton.href);
    downloadButton.style.display = 'none';
    deleteButton.style.display = 'none';
    videoElement.srcObject = videoStream;
    startButton.disabled = false;
});

function saveVideoURL(videoURL) {
    // Save the video URL to Firebase Realtime Database
    var newContactForm = contactFormDB.push();
    newContactForm.set({
        videoURL: videoURL
    });
}