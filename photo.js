const firebaseConfig = {
    apiKey: "AIzaSyCgrA4zq9mCy1vBVN5TSBbkTwKlsDU8_-g",
    authDomain: "image-3a11c.firebaseapp.com",
    databaseURL: "https://image-3a11c-default-rtdb.firebaseio.com",
    projectId: "image-3a11c",
    storageBucket: "image-3a11c.appspot.com",
    messagingSenderId: "731152745724",
    appId: "1:731152745724:web:16c8158bca686ab8a4c379"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the storage service
const storage = firebase.storage();

// Function to handle file upload
function handleFileUpload(file) {
    // Create a storage reference
    const storageRef = storage.ref();

    // Create a reference to the file
    const fileRef = storageRef.child(file.name);

    // Upload the file to Firebase Storage
    fileRef.put(file).then((snapshot) => {
        console.log('File uploaded successfully!');
    }).catch((error) => {
        console.error('Error uploading file:', error);
    });
}

// Example usage
const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    handleFileUpload(file);
});