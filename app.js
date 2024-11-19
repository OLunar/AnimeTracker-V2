import { addDoc, collection, getDocs, updateDoc, deleteDoc, doc, db } from './firebase/firebase.js';
import { addIndexedDB, getIndexedDBRecords, updateIndexedDBRecord, deleteIndexedDBRecord } from './indexeddb/indexeddb.js';

// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    M.updateTextFields();
    M.Modal.init(document.querySelectorAll('.modal'));
    M.FormSelect.init(document.querySelectorAll('select'));

    // Initialize tabs
    M.Tabs.init(document.querySelectorAll('.tabs'));

    // Load anime list from local storage or Firebase
    if (navigator.onLine) {
        getDocs(collection(db, 'yourCollection')).then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const data = doc.data();
                addAnimeCard(data.name, data.thumbnail, data.status);
            });
        });
    } else {
        const animeList = JSON.parse(localStorage.getItem('animeList')) || [];
        animeList.forEach(anime => addAnimeCard(anime.name, anime.thumbnail, anime.status));
    }
    // Add click event listener to add-anime button
    document.getElementById('add-anime-btn').addEventListener('click', () => {
        const animeName = document.getElementById('anime-name').value;
        const animeThumbnail = 'placeholder-image.png'; // Placeholder image for now
        if (animeName) {
            addAnimeCard(animeName, animeThumbnail, '');
            const newAnime = { name: animeName, thumbnail: animeThumbnail, status: '' };
            addRecord(newAnime); // Add record to Firebase or IndexedDB

            document.getElementById('anime-name').value = ''; // Clear the input field
        }
    });
});

// Filter by category
document.querySelectorAll('.tabs a').forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.getAttribute('href').substring(1);
        document.querySelectorAll('.card').forEach(card => {
            if (category === 'all' || card.classList.contains(category)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Function to add an anime card
function addAnimeCard(name, thumbnail, status) {
    const animeList = document.getElementById('anime-list');
    const animeCard = document.createElement('div');
    animeCard.className = 'col s12 m6';
    animeCard.innerHTML = `
        <div class="card">
            <div class="card-image">
                <img src="${thumbnail}">
            </div>
            <div class="card-content">
                <span class="card-title">${name}</span>
                <p>Status: <span class="anime-status">${status}</span></p>
                <a class="btn-floating halfway-fab waves-effect waves-light red remove-btn"><i class="material-icons">remove</i></a>
            </div>
        </div>
    `;
    
    // Add event listener for status update
    animeCard.querySelector('.card').addEventListener('click', () => {
        const modal = M.Modal.getInstance(document.getElementById('status-modal'));
        modal.open();
        document.getElementById('save-status-btn').onclick = () => {
            const selectedStatus = document.getElementById('anime-status').value;
            animeCard.querySelector('.anime-status').innerText = selectedStatus;

            // Update Firebase or IndexedDB 
            const newAnime = { name, thumbnail, status: selectedStatus };
            if (navigator.onLine) {
                // Update Firebase
                getDocs(collection(db, 'yourCollection')).then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        if (doc.data().name === name) {
                            updateDoc(doc.ref, newAnime);
                        }
                    });
                });
            } else{
                // Update IndexedDB
                getIndexedDBRecords().then(records => {
                    const record = records.find(record => record.name === name);
                    if (record) {
                        updateIndexedDBRecord(record.id, newAnime);
                    }
                });
            }

            modal.close();
        };
    });

    // Add event listener for removing anime card 
    animeCard.querySelector('.remove-btn').addEventListener('click', (event) => {
        event.stopPropagation(); //Prevent triggering the card click event
        animeCard.remove();

        // Remove from Firebase or IndexedDB
        if (navigator.onLine) {
            getDocs(collection(db, 'yourCollection')).then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    if (doc.data().name === name) {
                        deleteDoc(doc.ref);
                    }
                });
            });
        } else {
            getIndexedDBRecords().then(records => {
                const record = records.find(record => record.name === name);
                if (record) {
                    deleteIndexedDBRecord(record.id);
                }
            });
        }
    });

    animeList.appendChild(animeCard);
}

// Functions for adding and syncing records
async function addRecord(data) {
    if (navigator.onLine) {
        await addDoc(collection(db, 'yourCollection'), data);
    } else {
        await addIndexedDB(data);
    }
}

async function syncOfflineData() {
    if (navigator.onLine) {
        const records = await getIndexedDBRecords();
        for (const record of records) {
            await addDoc(collection(db, 'yourCollection'), record);
            await deleteIndexedDBRecord(record.id);
        }
        console.log('Offline data synced with Firebase.');
    }
}

// Event listeners for syncing data
window.addEventListener('online', syncOfflineData);
window.addEventListener('offline', () => console.log('App is offline.'));