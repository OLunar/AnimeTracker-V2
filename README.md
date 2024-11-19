# Anime Watchlist

A Progressive Web App (PWA) to track your favorite anime effortlessly.

## Features

- Add and categorize anime as "Watched," "In Progress," "Dropped," or "Plan to Watch"
- Offline support with service worker and IndexedDB
- Responsive design with MaterializeCSS
- Online syncrhonization with FirebAse Firestore

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Olunar/AnimeWatchlist-V2.git
    cd AnimeWatchlist-V2
    ```

2. Install dependencies: 
    '''bash
    npm install
    '''

3. Confiure Firebase
    - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/). 
    - Add a web app to your Firebase project and get the Firebase configuration. 
    - Copy your Firebase configuration and paste it into the `firebaseConfig` object in `src/firebase/firebase.js`.

4. Open the 'index.htm' file in your browser to start the app. 

## Usage 
- Use the input field to add new anime to your list. 
- Click on an anime card to update its status. 
- Use the tabs to filter anime by category.

## Technologies Used

- HTML
- CSS
- JavaScript 
- MaterializeCSS
- SErvice Worker 
- Firebase
- IndexedDB

## FireBase Integration 

This project uses firebase Firestor for online data storage. When the app is online, all CRUD operations (Create, Read, Update, Delete) are performed using Firebase. 

### Firebase Setup 

1. **Create a Firebase project** in the [Firebase Console](https://console.firebase.google.com/). 
2. **Add a web app** to your project to get your Firebase configuration. 
3. **Update `firebaseConfig`** in `src/firebase/firebase.js` with your Firebase configuration.

### Firebase Configureation Example 

```javascript const firebaseConfig = { 
    apiKey: "YOUR_API_KEY", 
    authDomain: "YOUR_AUTH_DOMAIN", 
    projectId: "YOUR_PROJECT_ID", 
    storageBucket: "YOUR_STORAGE_BUCKET", 
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID", 
    appId: "YOUR_APP_ID" 
    };# AnimeWatchlist-V2.1
# AnimeWatchlist-V2.1.1
