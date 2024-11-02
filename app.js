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

    // Load anime list from local storage
    const animeList = JSON.parse(localStorage.getItem('animeList')) || [];
    animeList.forEach(anime => addAnimeCard(anime.name, anime.thumbnail, anime.status)); 

    // Add click event listener to add-anime button
    document.getElementById('add-anime-btn').addEventListener('click', () => {
        const animeName = document.getElementById('anime-name').value;
        const animeThumbnail = 'placeholder-image.png'; // Placeholder image for now
        if (animeName) {
            addAnimeCard(animeName, animeThumbnail, '');
            // Save to local storage
            const animeList = JSON.parse(localStorage.getItem('animeList')) || [];
            animeList.push({ name: animeName, thumbnail: animeThumbnail, status: '' });
            localStorage.setItem('animeList', JSON.stringify(animeList));

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

            // Update local storage
            const animeList = JSON.parse(localStorage.getItem('animeList')) || [];
            const animeIndex = animeList.findIndex(anime => anime.name === name);
            if (animeIndex !== -1) {
                animeList[animeIndex].status = selectedStatus;
                localStorage.setItem('animeList', JSON.stringify(animeList));
            }

            modal.close();
        };
    });

    // Add event listener for removing anime card
    animeCard.querySelector('.remove-btn').addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent triggering the card click event
        animeCard.remove();

        // Update local storage
        const animeList = JSON.parse(localStorage.getItem('animeList')) || [];
        const updatedAnimeList = animeList.filter(anime => anime.name !== name);
        localStorage.setItem('animeList', JSON.stringify(updatedAnimeList));
    });

    animeList.appendChild(animeCard);
}
