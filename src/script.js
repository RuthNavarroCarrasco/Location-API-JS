// El primer paso es localizar la ubicación actual del usuario y añadir un marcador. 
// Para ello, hacemos uso de la API de geolocalización
const mymap = L.map('sample_map').setView([0, 0], 1);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
}).addTo(mymap);


let actualLocation;
let destination;
let countDest = 0;

// Obtenemos las coordenadas de la ubicación actual del usuario para ubicarnos en el mapa, en caso de error mostramos un alert.
navigator.geolocation.getCurrentPosition((location) => {
  var latlngAct = L.latLng(location.coords.latitude, location.coords.longitude);
  actualLocation = L.marker(latlngAct).addTo(mymap);
  mymap.setView(latlngAct, 15);
  },
  (error) => {
    var errorMessage;
    switch(error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "No se han concedido permisos de ubicación.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "La ubicación no está disponible.";
        break;
      case error.TIMEOUT:
        errorMessage = "Se ha agotado el tiempo para obtener la ubicación.";
        break;
      default:
        errorMessage = "Se ha producido un error al obtener la ubicación.";
    }
    
    window.alert(errorMessage);
  });

  navigator.geolocation.watchPosition((location) => {
    var latlngAct = L.latLng(location.coords.latitude, location.coords.longitude);
    mymap.on('click', function(e) {
      if (countDest < 1) {
        var latlngDest = e.latlng;
        destination = L.marker(latlngDest).addTo(mymap);

        L.polyline([latlngAct, latlngDest], {
          color: 'red'
        }).addTo(mymap);
        
        var distance = mymap.distance(latlngAct, latlngDest);
        if (distance < 500) {
          navigator.vibrate([200, 100, 200, 100, 200]);
        }
      }
      countDest += 1;
    });
    });
