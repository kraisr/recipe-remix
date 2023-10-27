import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const MapComponent = ({ startingPoint }) => {
    const mapRef = useRef(null);
    const directionsServiceRef = useRef(new window.google.maps.DirectionsService());
    const directionsRendererRef = useRef(new window.google.maps.DirectionsRenderer());

    useEffect(() => {
        const mapOptions = {
            zoom: 15,
            // center: { lat: 40.4237, lng: -86.9212 }  // Purdue University's coordinates
            center: startingPoint
        };

        const map = new window.google.maps.Map(mapRef.current, mapOptions);
        window.google.maps.event.trigger(map, 'resize');

        directionsRendererRef.current.setMap(map);

        // Search for grocery stores nearby Purdue University
        const service = new window.google.maps.places.PlacesService(map);
        service.nearbySearch({
            location: { lat: 40.4237, lng: -86.9212 },
            radius: 5000,  // 5 km
            type: ['grocery_or_supermarket']
        }, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {
                    createMarker(results[i], map);
                }
            }
        });

    }, [startingPoint]);

    const createMarker = (place, map) => {
        const marker = new window.google.maps.Marker({
            map,
            position: place.geometry.location
        });

        const startMarker = new window.google.maps.Marker({
            position: startingPoint,
            map,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: '#00FF00',
                fillOpacity: 1,
                strokeWeight: 1,
                scale: 8
            },
            title: 'Starting Point'
        });

        const infowindow = new window.google.maps.InfoWindow();

        window.google.maps.event.addListener(marker, 'click', () => {
            infowindow.setContent(`
                <div>
                    <strong>${place.name}</strong><br>
                    ${place.vicinity}<br>
                    <button 
                      onclick="getDirectionsTo('${place.geometry.location}')" 
                      style="
                         background-color: #e57373;
                         color: white;
                         padding: 6px 12px;
                         border: none;
                         border-radius: 4px;
                         cursor: pointer;
                         outline: none;
                         font-size: 0.875rem;
                         font-weight: 500;
                         mt: 2;
                         text-transform: uppercase;
                         transition: background-color 0.3s;
                      "
                      onmouseover="this.style.backgroundColor='#e53935'"
                      onmouseout="this.style.backgroundColor='#e57373'"
                    >
                      Get Directions
                    </button>
                </div>
            `);
            infowindow.open(map, marker);
        });
    };

    window.getDirectionsTo = (lat, lng) => {
        const destination = new window.google.maps.LatLng(lat, lng);
        const request = {
            // origin: { lat: 40.4237, lng: -86.9212 },  // Starting from Purdue University
            origin: startingPoint,
            destination,  // The chosen store's location
            travelMode: 'DRIVING'
        };

        directionsServiceRef.current.route(request, (result, status) => {
            if (status === 'OK') {
                directionsRendererRef.current.setDirections(result);
            } else {
                alert('Directions request failed due to ' + status);
            }
        });
    };

    return (
        <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
    );
}

MapComponent.propTypes = {
    startingPoint: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
    }).isRequired
};

export default MapComponent;
