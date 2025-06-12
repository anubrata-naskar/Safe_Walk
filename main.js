let map;
let marker;
let searchBox;

// Initialize the map
function initMap() {
  // Default location (center of map)
  const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // New York

  // Create map
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 13,
    mapTypeControl: false,
  });

  // Create search box
  const input = document.getElementById("search-location");
  searchBox = new google.maps.places.SearchBox(input);
  
  // Bias the SearchBox results towards current map's viewport
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  // Listen for the event when a user selects a prediction
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    // For each place, get the location
    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      // Update the marker position
      if (marker) {
        marker.setMap(null);
      }
      
      marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
        draggable: true,
      });

      // Add dragend listener to the marker
      marker.addListener("dragend", () => {
        updateSelectedLocation(marker.getPosition());
      });

      // Update form values
      updateSelectedLocation(place.geometry.location);

      // Pan to the selected location
      map.panTo(place.geometry.location);
      map.setZoom(15);
    });
  });

  // Add click listener to the map
  map.addListener("click", (event) => {
    // Update the marker position
    if (marker) {
      marker.setMap(null);
    }
    
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map,
      draggable: true,
    });

    // Add dragend listener to the marker
    marker.addListener("dragend", () => {
      updateSelectedLocation(marker.getPosition());
    });

    // Update form values
    updateSelectedLocation(event.latLng);
  });

  // Use current location button
  document.getElementById("use-current-location").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Update the marker position
          if (marker) {
            marker.setMap(null);
          }
          
          marker = new google.maps.Marker({
            position: currentLocation,
            map: map,
            draggable: true,
          });

          // Add dragend listener to the marker
          marker.addListener("dragend", () => {
            updateSelectedLocation(marker.getPosition());
          });

          // Update form values
          updateSelectedLocation(currentLocation);

          // Pan to the current location
          map.panTo(currentLocation);
          map.setZoom(15);
        },
        (error) => {
          alert("Error getting your location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });
}

// Update the form with selected location details
function updateSelectedLocation(location) {
  const lat = typeof location.lat === 'function' ? location.lat() : location.lat;
  const lng = typeof location.lng === 'function' ? location.lng() : location.lng;
  
  document.getElementById("lat").value = lat;
  document.getElementById("lng").value = lng;
  
  // Use proxy for reverse geocoding
  fetch('/api/geocode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      location: { lat, lng }
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "OK" && data.results[0]) {
      document.getElementById("selected-location").value = data.results[0].formatted_address;
    } else {
      document.getElementById("selected-location").value = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    }
  })
  .catch(error => {
    console.error('Geocoding error:', error);
    document.getElementById("selected-location").value = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
  });
}

// Clear location
function clearLocation() {
  document.getElementById("selected-location").value = "";
  document.getElementById("lat").value = "";
  document.getElementById("lng").value = "";
  document.getElementById("search-location").value = "";
  
  if (marker) {
    marker.setMap(null);
    marker = null;
  }
}

// Form submission
document.getElementById("location-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const lat = document.getElementById("lat").value;
  const lng = document.getElementById("lng").value;
  const address = document.getElementById("selected-location").value;
  
  if (!lat || !lng) {
    alert("Please select a location on the map first.");
    return;
  }
  
  try {
    const response = await fetch('/location/saveLocation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        address: address
      }),
    });

    if (response.ok) {
      const result = await response.json();
      alert('Location saved successfully!');
      console.log('Location saved:', result);
    } else {
      throw new Error('Failed to save location');
    }
  } catch (error) {
    console.error('Error saving location:', error);
    alert('Error saving location. Please try again.');
  }
});