const map = L.map('mapid').setView([-8.8533562, 13.2140633], 13);

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);
//create icon 
const icon = L.icon({
    iconUrl: "/images/map-marker.jpg",
    iconSize: [58, 68],
    iconAnchor: [29, 68],
   

})
let marker;

//Create and add map


map.locate({enableHighAccuracy: true});
map.on('locationfound',(event ) => {
    const lat = event.latlng.lat;
    const lng = event.latlng.lng;
 
    document.querySelector('[name=lat]').value= lat;
    document.querySelector('[name=lng]').value= lng;
    //Remover icon
    marker && map.removeLayer(marker)
    //add icon
    marker = L.marker([lat, lng], {icon})
    .addTo(map)
    .bindPopup('Minha posição')
 });
