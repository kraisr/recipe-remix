import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

function MapComponent({ startingPoint, isOpenNow, distance }) {
    const mapRef = useRef(null);
    const directionsServiceRef = useRef(new window.google.maps.DirectionsService());
    const directionsRendererRef = useRef(new window.google.maps.DirectionsRenderer());

    const createMarker = useCallback((place, map) => {
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
                        onclick="window.getDirectionsTo(${place.geometry.location.lat()}, ${place.geometry.location.lng()})"
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
                            text-transform: uppercase;
                            transition: background-color 0.3s;
                        "
                    >
                      Get Directions
                    </button>
                </div>
            `);
            infowindow.open(map, marker);
        });
    }, [startingPoint]);

    useEffect(() => {
        const mapOptions = {
            zoom: 15,
            center: startingPoint
        };

        const map = new window.google.maps.Map(mapRef.current, mapOptions);
        window.google.maps.event.trigger(map, 'resize');

        directionsRendererRef.current.setMap(map);

        const callbackFunction = (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {
                    createMarker(results[i], map);
                }
            } else {
                console.error('Places API call failed with status:', status);
            }
        };

        if (startingPoint) {
            const request = {
                location: new window.google.maps.LatLng(startingPoint.lat, startingPoint.lng),
                radius: distance,
                type: "supermarket",
                keyword: "grocery",
                openNow: isOpenNow
            };

            const service = new window.google.maps.places.PlacesService(map);
            service.nearbySearch(request, callbackFunction);
        }
    }, [startingPoint, isOpenNow, distance, createMarker]);

    window.getDirectionsTo = (lat, lng) => {
        const destination = new window.google.maps.LatLng(lat, lng);
        const request = {
            origin: startingPoint,
            destination,
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
    }).isRequired,
    isOpenNow: PropTypes.bool,
    distance: PropTypes.number
};

export default MapComponent;
