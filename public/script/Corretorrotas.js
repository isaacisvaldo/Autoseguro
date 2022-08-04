


      
if('geolocation' in navigator){

  var u = document.getElementById('lat');
  var u= u.value.trim(); 
  var v = document.getElementById('lng');
  var v= v.value.trim(); 

  function success(position){
  // console.log(position)
  
        const cntr_loc = L.latLng([position.coords.latitude, position.coords.longitude]);
  const orig_loc = L.latLng([position.coords.latitude, position.coords.longitude]);
  const dest_loc = L.latLng(`${u}`, `${v}`);
  
  //var clatlng = { lat: 13.85, lng: 100.45 };
  var zoom = 15;
  
  var map = L.map("map", {
    preferCanvas: false
  }).setView(cntr_loc, zoom);
  
  //This map tiles is simple and no hassles.
  L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; OpenStreetMap contributors"
  }).addTo(map);
  
  const checkmk = `<svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"><path stroke="black" stroke-width="1.5%" opacity="0.8" fill="brown" d="M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"></path></svg>`;
  
  function checkmk_mk(color) {
    // assume checkmk has `brown` only 1 place
    return checkmk.replace(/brown/g, color);
  }
  
  const svgpin_Url = encodeURI("data:image/svg+xml;utf-8," + checkmk_mk("red"));
  const svgpin_Url2 = encodeURI(
    "data:image/svg+xml;utf-8," + checkmk_mk("green")
  );
  const svgpin_Url3 = encodeURI(
    "data:image/svg+xml;utf-8," + checkmk_mk("black")
  );
  
  /*
  const svgpin_Icon = L.icon({
    iconUrl: "data:image/svg+xml;utf-8,%3Csvg%20width=%2224%22%20height=%2224%22%20viewBox=%220%200%2024%2024%22%20version=%221.1%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath%20stroke=%22black%22%20stroke-width=%221.5%25%22%20opacity=%220.8%22%20fill=%22red%22%20d=%22M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M12,1L3,5V11C3,16.55%206.84,21.74%2012,23C17.16,21.74%2021,16.55%2021,11V5L12,1Z%22%3E%3C/path%3E%3C/svg%3E",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -22]
  });
  
    //multipurpose mkr0
    marker0 = L.marker([13.8, 100.5], {
      icon: svgpin_Icon,
      riseOnHover: true,
      opacity: 1.0,
      draggable: true
    })
      .addTo(map)
      .bindPopup("<b>" + "Origin" + "</b>")
      .openPopup();
  
    //multipurpose mkr0
    marker1 = L.marker([13.85, 100.55], {
      icon: svgpin_Icon2,
      riseOnHover: true,
      opacity: 1.0,
      draggable: true
    })
      .addTo(map)
      .bindPopup("<b>" + "Destination" + "</b>")
      .openPopup();
  */
  
  const svgpin_Icon = L.icon({
    iconUrl: svgpin_Url,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -22]
  });
  const svgpin_Icon2 = L.icon({
    iconUrl: svgpin_Url2,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -22]
  });
  const svgpin_Icon3 = L.icon({
    iconUrl: svgpin_Url3,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -22]
  });
  
  
  /* Start routing control  */
  function begin_routing() {
    L.Routing.control({
      waypoints: [
        orig_loc,
        dest_loc
        //L.latLng(14.1688, 100.2918),
        //L.latLng(13.7042, 100.6032)
      ],
      routeWhileDragging: true,
      routeDragInterval: 500,
      collapsible: true, // hide/show panel routing
      reverseWaypoints: false,
      showAlternatives: false,
      createMarker: function(i, wp, nWps) {
        switch (i) {
          case 0:
            return L.marker(wp.latLng, {
              icon: svgpin_Icon,
              draggable: true
            }).bindPopup("<b>" + "Origin" + "</b>");
          case nWps - 1:
            return L.marker(wp.latLng, {
              icon: svgpin_Icon2,
              draggable: true
            }).bindPopup("<b>" + "Destination" + "</b>");
          default:
            return L.marker(wp.latLng, {
              icon: svgpin_Icon3,
              draggable: true
            }).bindPopup("<b>" + "Waypoint" + "</b>");
        }
      }
    }).addTo(map);
  }
  
  begin_routing();
  
  /* end-of-script */
  }
  
  
  
  const watcher = navigator.geolocation.watchPosition(success, function(error){
      console.log(error)
  }, { enableHighAccuracy: true, maximumAge: 30000, timeout: 30000});
  // navigator.geolocation.clearWatch(watcher)
  
  
  }else{
  alert('Ops, não foi possível pegar localização')
  }