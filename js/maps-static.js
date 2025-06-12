// Static version - using direct Google Maps API
let map;
let marker;
let searchBox;

// Replace with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBUAALV-_QY-CAJHYJw51VuWrGCE8QcL90';

// Load Google Maps API
function loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Initialize map (same as your existing function)
function initMap() {
    // Your existing initMap code here
    const defaultLocation = { lat: 40.7128, lng: -74.0060 };
    
    map = new google.maps.Map(document.getElementById("map"), {
        center: defaultLocation,
        zoom: 13,
        mapTypeControl: false,
    });
    
    // Add your existing map functionality
}

// Load maps when page loads
document.addEventListener('DOMContentLoaded', loadGoogleMaps);