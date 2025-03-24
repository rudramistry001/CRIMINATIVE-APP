// Map handling with Leaflet.js
let map;
let marker;
let watchId;
let isTracking = false;

function initMap() {
    // Initialize the map
    map = L.map('map').setView([0, 0], 15);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add click handler to map
    map.on('click', function(e) {
        updateMarker(e.latlng);
    });

    // Initialize get location button
    const getLocationBtn = document.getElementById('getLocation');
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', toggleLocationTracking);
    }

    // Set initial date and time to current
    const dateTimeInput = document.getElementById('dateTime');
    if (dateTimeInput) {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        dateTimeInput.value = now.toISOString().slice(0, 16);
    }
}

function toggleLocationTracking() {
    if (!isTracking) {
        startLocationTracking();
    } else {
        stopLocationTracking();
    }
}

function startLocationTracking() {
    if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by your browser', 'error');
        return;
    }

    const getLocationBtn = document.getElementById('getLocation');
    if (getLocationBtn) {
        getLocationBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Tracking';
        getLocationBtn.classList.add('text-red-600');
    }

    // Start watching position
    watchId = navigator.geolocation.watchPosition(
        (position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            updateMarker(pos);
        },
        (error) => {
            console.error('Error getting location:', error);
            showNotification('Error getting location: ' + error.message, 'error');
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );

    isTracking = true;
}

function stopLocationTracking() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }

    const getLocationBtn = document.getElementById('getLocation');
    if (getLocationBtn) {
        getLocationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Get My Location';
        getLocationBtn.classList.remove('text-red-600');
    }

    isTracking = false;
}

function updateMarker(latLng) {
    // Remove existing marker
    if (marker) {
        map.removeLayer(marker);
    }

    // Add new marker
    marker = L.marker(latLng, {
        draggable: true
    }).addTo(map);

    // Update coordinates and address
    updateLocationInfo(latLng);

    // Handle marker drag
    marker.on('dragend', function(e) {
        updateLocationInfo(e.target.getLatLng());
    });
}

function updateLocationInfo(latLng) {
    // Update coordinate inputs
    document.getElementById('latitude').value = latLng.lat.toFixed(6);
    document.getElementById('longitude').value = latLng.lng.toFixed(6);

    // Get address using reverse geocoding
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latLng.lat}&lon=${latLng.lng}`)
        .then(response => response.json())
        .then(data => {
            if (data.display_name) {
                document.getElementById('location').value = data.display_name;
            }
        })
        .catch(error => {
            console.error('Error getting address:', error);
            document.getElementById('location').value = `${latLng.lat}, ${latLng.lng}`;
        });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white z-50`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize map when the page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('map')) {
        initMap();
    }
}); 