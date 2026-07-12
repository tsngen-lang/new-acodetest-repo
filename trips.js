// ==========================================
// DATA INITIALIZATION
// ==========================================
// Ensure our core data arrays exist in local storage
if (!localStorage.getItem('trips')) {
    localStorage.setItem('trips', JSON.stringify([]));
}
if (!localStorage.getItem('claims')) {
    localStorage.setItem('claims', JSON.stringify([]));
}

// ==========================================
// CORE FUNCTIONS
// ==========================================

// 1. Render the main Log History list
function renderHistory() {
    const container = document.getElementById('historyContainer');
    if (!container) return;
    
    container.innerHTML = ''; // Clear container
    const trips = JSON.parse(localStorage.getItem('trips')) || [];

    if (trips.length === 0) {
        container.innerHTML = '<p class="no-data">No log entries found.</p>';
        return;
    }

    trips.forEach(t => {
        container.innerHTML += `
            <div class="history-item" id="trip-${t.id}">
                <div class="history-details">
                    <span class="trip-date"><strong>${t.date || 'No Date'}</strong></span>
                    <p class="trip-desc">${t.details || 'No Details specified'}</p>
                </div>
                <div class="history-actions">
                    <button class="edit-btn" onclick="editTrip(${t.id})">Edit</button>
                    <button class="claim-btn" onclick="claimTrip(${t.id})">Claim</button>
                </div>
            </div>
        `;
    });
}

// 2. Handle moving a trip entry over to the Claims list
function claimTrip(id) {
    let trips = JSON.parse(localStorage.getItem('trips')) || [];
    let claims = JSON.parse(localStorage.getItem('claims')) || [];

    // Find the item matching the ID
    const tripToClaim = trips.find(t => t.id === id);

    if (tripToClaim) {
        // Prevent adding duplicate IDs into claims array
        if (!claims.some(c => c.id === id)) {
            claims.push(tripToClaim);
            localStorage.setItem('claims', JSON.stringify(claims));
        }

        // Remove it from the main history list
        trips = trips.filter(t => t.id !== id);
        localStorage.setItem('trips', JSON.stringify(trips));

        alert('Success: Entry moved to Claim tab.');
        
        // Automatically refresh both UI screens
        renderHistory();
        renderClaims();
    } else {
        alert('Error: This trip could not be found.');
    }
}

// 3. Render the contents inside the separate Claim Tab
function renderClaims() {
    const claimsContainer = document.getElementById('claimsContainer');
    if (!claimsContainer) return;

    claimsContainer.innerHTML = '';
    const claims = JSON.parse(localStorage.getItem('claims')) || [];

    if (claims.length === 0) {
        claimsContainer.innerHTML = '<p class="no-data">No claimed entries yet.</p>';
        return;
    }

    claims.forEach(c => {
        claimsContainer.innerHTML += `
            <div class="claim-item">
                <div class="claim-details">
                    <span class="claim-date"><strong>${c.date || 'No Date'}</strong></span>
                    <p class="claim-desc">${c.details || 'No Details'}</p>
                </div>
                <span class="status-badge">Pending</span>
            </div>
        `;
    });
}

// 4. Placeholder logic for Edit button to prevent missing function crashes
function editTrip(id) {
    console.log("Editing trip ID:", id);
    // Future edit modal or prompt can be added here
}

// ==========================================
// INITIAL SETUP ON LOADING FILE
// ==========================================
// Automatically trigger renders when the app boots up
document.addEventListener('DOMContentLoaded', () => {
    renderHistory();
    renderClaims();
});
