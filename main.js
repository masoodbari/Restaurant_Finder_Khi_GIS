var map = L.map('map', {
    center: [24.85218, 67.01578],
    zoom: 250,
    zoomControl: false
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?',
    {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Data And Data Gis'
    }).addTo(map);


function populaterestaurant() {
    const ul = document.querySelector('.list');
    restaurantList.forEach((restaurant) => {
        const li = document.createElement('li');
        const div = document.createElement('div');
        const a = document.createElement('a');
        const p = document.createElement('p');
        a.addEventListener('click', () => {
            flyToStore(restaurant);
        });
        div.classList.add('restaurant-item');
        a.innerText = restaurant.properties.name;
        a.href = '#';
        p.innerText = restaurant.properties.address;

        div.appendChild(a);
        div.appendChild(p);
        li.appendChild(div);
        ul.appendChild(li);
    });
}

populaterestaurant();

function flyToStore(restaurant) {
    const lat = restaurant.geometry.coordinates[1];
    const lng = restaurant.geometry.coordinates[0];
    map.flyTo([lat, lng], 14, {
        duration: 3
    });
    setTimeout(() => {
        L.popup({ closeButton: false, offset: L.point(0, -8) })
            .setLatLng([lat, lng])
            .setContent(makePopupContent(restaurant))
            .openOn(map);
    }, 3000);
}
function makePopupContent(restaurant) {
    return `
      <div>
          <h4>${restaurant.properties.name}</h4>
          <p>${restaurant.properties.address}</p>
          <div class="phone-number">
              <a href="tel:${restaurant.properties.phone}">${restaurant.properties.phone}</a>
          </div>
      </div>
      `;
}


function bindrestaurantPopup(feature, layer) {
    layer.bindPopup(makePopupContent(feature), { closeButton: false, offset: L.point(0, -8) });
}

var myIcon = L.icon({
    iconUrl: 'resources/images/restaurant.png',
    iconSize: [50, 50]
});

const restaurantLayer = L.geoJSON(restaurantList, {
    onEachFeature: bindrestaurantPopup,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: myIcon });
    }
});
restaurantLayer.addTo(map);
