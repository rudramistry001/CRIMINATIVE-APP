// Handle success screen functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get report data from localStorage
    const reportData = JSON.parse(localStorage.getItem('lastReport'));
    
    if (!reportData) {
        // Redirect to home if no report data
        window.location.href = 'index.html';
        return;
    }

    // Update report details
    document.getElementById('reportId').textContent = generateReportId();
    document.getElementById('incidentType').textContent = reportData.incidentType;
    document.getElementById('dateTime').textContent = formatDateTime(reportData.dateTime);
    document.getElementById('location').textContent = reportData.location;

    // Initialize map with report location
    initMapWithReport(reportData);

    // Find nearest police station
    findNearestPoliceStation(reportData.latitude, reportData.longitude);
});

function generateReportId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `RPT-${timestamp}-${random}`;
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString();
}

function initMapWithReport(reportData) {
    // Initialize map centered on report location
    const map = L.map('map').setView([reportData.latitude, reportData.longitude], 15);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add marker for report location
    const reportMarker = L.marker([reportData.latitude, reportData.longitude], {
        icon: L.divIcon({
            className: 'custom-div-icon',
            html: '<div class="marker-pin bg-red-500"></div>',
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        })
    }).addTo(map);

    // Add popup to marker
    reportMarker.bindPopup(`
        <div class="text-center">
            <h4 class="font-semibold">Report Location</h4>
            <p class="text-sm">${reportData.location}</p>
        </div>
    `);

    // Initialize get location button
    const getLocationBtn = document.getElementById('getLocation');
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const newPos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        map.setView([newPos.lat, newPos.lng], 15);
                        reportMarker.setLatLng([newPos.lat, newPos.lng]);
                    },
                    (error) => {
                        showNotification('Error getting location: ' + error.message, 'error');
                    }
                );
            }
        });
    }
}

async function findNearestPoliceStation(lat, lng) {
    try {
        // Using OpenStreetMap's Overpass API to find police stations
        const query = `
            [out:json][timeout:25];
            (
              node["amenity"="police"](around:5000,${lat},${lng});
              way["amenity"="police"](around:5000,${lat},${lng});
              relation["amenity"="police"](around:5000,${lat},${lng});
            );
            out body;
            >;
            out skel qt;
        `;

        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query
        });

        const data = await response.json();
        
        if (data.elements && data.elements.length > 0) {
            // Find the nearest police station
            const nearest = data.elements.reduce((nearest, current) => {
                const currentDist = calculateDistance(lat, lng, current.lat, current.lon);
                const nearestDist = calculateDistance(lat, lng, nearest.lat, nearest.lon);
                return currentDist < nearestDist ? current : nearest;
            });

            // Update UI with nearest police station
            const policeName = nearest.tags.name || 'Police Station';
            document.getElementById('nearestPolice').textContent = policeName;
            
            // Add police station marker to map
            const policeMarker = L.marker([nearest.lat, nearest.lon], {
                icon: L.divIcon({
                    className: 'custom-div-icon',
                    html: '<div class="marker-pin bg-blue-500"></div>',
                    iconSize: [30, 42],
                    iconAnchor: [15, 42]
                })
            }).addTo(map);

            policeMarker.bindPopup(`
                <div class="text-center">
                    <h4 class="font-semibold">${policeName}</h4>
                    <p class="text-sm">Nearest Police Station</p>
                </div>
            `);

            // Update police contact link
            const policeContact = document.getElementById('policeContact');
            if (nearest.tags.phone) {
                policeContact.href = `tel:${nearest.tags.phone}`;
            }
        } else {
            document.getElementById('nearestPolice').textContent = 'No police stations found nearby';
        }
    } catch (error) {
        console.error('Error finding police stations:', error);
        document.getElementById('nearestPolice').textContent = 'Error finding police stations';
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(value) {
    return value * Math.PI / 180;
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