
const map = L.map('mapid').setView([-8.8533562, 13.2140633], 12);

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);
//create icon 
const icon = L.icon({
    iconUrl: "/assets/img/map-marker.jpg",
    iconSize: [58, 68],
    iconAnchor: [29, 68],
    popupAnchor: [170, 20],

})

function addMarker({id, lat, lng, descricao, matricula}) {
   
    //create popup

const popup = L.popup({
    closeButton: false,
    className: 'map-popup',
    minWidth: 240,
    minHeigth: 240
}).setContent(`<div> <br>Mtricula:${matricula}<br> Descricao:${descricao}<br>  <div class = "text-center mt-4"><a target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}"" class="btn btn-round btn-fill btn-info"  data-toggle="tooltip" title="traçar routa para esse destino"><i class="fas fa-play"></i></a><a  onclick="confirmar( ${id})"  title="Deletar Usuário" data-toggle="tooltip" class="btn btn-round  btn-danger  data-toggle="tooltip" title="deletar este ponto"><i class="fas fa-trash"></i>deletar</a> </div> `)

//create and add map


L
.marker([lat, lng], {icon})
.addTo(map)
.bindPopup(popup)

}

const orphanagesSpan = document.querySelectorAll('.pontos span')

orphanagesSpan.forEach( span =>{
    const orphanage ={
        id: span.dataset.id,
        lat:span.dataset.lat,
        lng:span.dataset.lng,
        name:span.dataset.name,
        descricao:span.dataset.descricao,
        matricula:span.dataset.matricula
    }
    addMarker(orphanage)
})
