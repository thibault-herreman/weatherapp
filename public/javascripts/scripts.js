var mymap = L.map('worldmap',
  {
    center: [48.866667, 2.333333],
    zoom: 4
  }
);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '(c) <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);

var customIcon = L.icon({
    iconUrl: '../images/leaf-green.png',
    shadowUrl: '../images/leaf-shadow.png',
   
    iconSize:   [38, 95],
    shadowSize:  [50, 64],
   
    iconAnchor:  [22, 94],
    shadowAnchor: [4, 62],  
   
    popupAnchor: [-3, -76]
});
   

const dataCities = document.getElementsByClassName('jsUseMap');

for (let i=0; i<dataCities.length; i++) {
    //console.log(dataCities[i].dataset.lat, dataCities[i].dataset.long);
    L.marker([dataCities[i].dataset.lat, dataCities[i].dataset.long], {icon: customIcon}).addTo(mymap).bindPopup(dataCities[i].dataset.city);
}