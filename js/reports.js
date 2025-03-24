// Reports handling
document.addEventListener('DOMContentLoaded', function() {
    // Handle report form submission
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportSubmit);
    }

    // Handle media upload
    const mediaInput = document.getElementById('media');
    const mediaPreview = document.getElementById('mediaPreview');
    if (mediaInput && mediaPreview) {
        mediaInput.addEventListener('change', function(e) {
            mediaPreview.innerHTML = '';
            Array.from(e.target.files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'w-full h-32 object-cover rounded-lg';
                        mediaPreview.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    // Handle filters in history page
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const dateFilter = document.getElementById('dateFilter');
    const applyFiltersBtn = document.querySelector('button[type="button"]');

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            filterReports();
        });
    }
});

async function handleReportSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const reportData = {
        incidentType: formData.get('incidentType'),
        description: formData.get('description'),
        dateTime: formData.get('dateTime'),
        location: formData.get('location'),
        latitude: document.getElementById('latitude').value,
        longitude: document.getElementById('longitude').value,
        involvedPeople: formData.get('involvedPeople'),
        media: await handleMediaUpload(formData.getAll('media'))
    };

    try {
        // Save report data to localStorage
        localStorage.setItem('lastReport', JSON.stringify(reportData));

        // Redirect to success page
        window.location.href = 'report-success.html';
    } catch (error) {
        console.error('Error submitting report:', error);
        showNotification('Error submitting report. Please try again.', 'error');
    }
}

async function handleMediaUpload(files) {
    const mediaUrls = [];
    
    for (const file of files) {
        if (file.size > 0) {
            try {
                // In a real application, you would upload the file to a server
                // For now, we'll create a local URL
                const mediaUrl = URL.createObjectURL(file);
                mediaUrls.push({
                    url: mediaUrl,
                    type: file.type,
                    name: file.name
                });
            } catch (error) {
                console.error('Error handling media file:', error);
            }
        }
    }

    return mediaUrls;
}

function generateReportId() {
    return 'REP-' + Date.now().toString().slice(-6);
}

function saveReport(reportData) {
    // Get existing reports
    let reports = JSON.parse(localStorage.getItem('reports') || '[]');
    
    // Add new report
    reports.push(reportData);
    
    // Save back to localStorage
    localStorage.setItem('reports', JSON.stringify(reports));
}

function filterReports() {
    const status = document.getElementById('statusFilter').value;
    const type = document.getElementById('typeFilter').value;
    const date = document.getElementById('dateFilter').value;

    // Get all reports
    let reports = JSON.parse(localStorage.getItem('reports') || '[]');

    // Apply filters
    let filteredReports = reports.filter(report => {
        const matchesStatus = !status || report.status === status;
        const matchesType = !type || report.type === type;
        const matchesDate = !date || report.dateTime.startsWith(date);
        return matchesStatus && matchesType && matchesDate;
    });

    // Update the UI with filtered reports
    updateReportsList(filteredReports);
}

function updateReportsList(reports) {
    const reportsContainer = document.querySelector('.space-y-4');
    if (!reportsContainer) return;

    reportsContainer.innerHTML = reports.map(report => `
        <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-lg font-medium text-gray-900">${report.type}</h3>
                    <p class="text-sm text-gray-500">Report ID: ${report.id}</p>
                </div>
                <span class="px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(report.status)}">
                    ${report.status}
                </span>
            </div>
            <div class="mt-4">
                <p class="text-gray-600">Reported on ${formatDate(report.dateTime)}</p>
                <p class="text-gray-600 mt-2">Location: ${report.location}</p>
                <p class="text-gray-600 mt-2">Description: ${report.description}</p>
            </div>
            <div class="mt-4 flex items-center space-x-4">
                <button class="text-blue-600 hover:text-blue-800" onclick="viewReport('${report.id}')">
                    <i class="fas fa-eye mr-1"></i> View Details
                </button>
                <button class="text-blue-600 hover:text-blue-800" onclick="downloadReport('${report.id}')">
                    <i class="fas fa-download mr-1"></i> Download Report
                </button>
                <button class="text-blue-600 hover:text-blue-800" onclick="addComment('${report.id}')">
                    <i class="fas fa-comment mr-1"></i> Add Comment
                </button>
            </div>
        </div>
    `).join('');
}

function getStatusColor(status) {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'in-progress':
            return 'bg-blue-100 text-blue-800';
        case 'resolved':
            return 'bg-green-100 text-green-800';
        case 'closed':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
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

// Report actions
function viewReport(reportId) {
    // Implement view report functionality
    console.log('Viewing report:', reportId);
}

function downloadReport(reportId) {
    // Implement download report functionality
    console.log('Downloading report:', reportId);
}

function addComment(reportId) {
    // Implement add comment functionality
    console.log('Adding comment to report:', reportId);
} 