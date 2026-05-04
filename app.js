// ==============================
// CESIUM TOKEN
// ==============================
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNjcyOWM1MC0xNzYzLTRlMjUtYWQ4Mi1kYTlmZDY5NzA1ZTIiLCJpZCI6Mzk4NTkxLCJzdWIiOiJGUk9BQzQ4NiIsImlzcyI6Imh0dHBzOi8vaW9uLmNlc2l1bS5jb20iLCJhdWQiOiJHRUVfQXNzaWdubWVudCIsImlhdCI6MTc3Nzg2ODAwNX0.nrfQzguROLXdmPqdXgf71vSltxSpHamRvyIiis2-u1s';

// ==============================
// VIEWER
// ==============================
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain()
});

// Keep markers visible above imagery/terrain
viewer.scene.globe.depthTestAgainstTerrain = false;

// ==============================
// GOOGLE PHOTOREALISTIC 3D TILES
// ==============================
(async () => {
  const tileset = await Cesium.createGooglePhotorealistic3DTileset();
  viewer.scene.primitives.add(tileset);
})();

// ==============================
// COLOUR FUNCTION
// ==============================
function getStyle(name) {
  if (name.includes('Car park')) return { colour: Cesium.Color.GRAY, css: 'gray', label: 'Car park' };
  if (name.includes('Toilet')) return { colour: Cesium.Color.BLUE, css: 'blue', label: 'Toilet' };
  if (name.includes('Picnic')) return { colour: Cesium.Color.GREEN, css: 'green', label: 'Picnic table' };
  if (name.includes('Bridge')) return { colour: Cesium.Color.ORANGE, css: 'orange', label: 'Bridge' };
  if (name.includes('Cafe')) return { colour: Cesium.Color.BROWN, css: 'brown', label: 'Cafe' };
  if (name.includes('Information')) return { colour: Cesium.Color.CYAN, css: 'cyan', label: 'Information' };
  if (name.includes('Station')) return { colour: Cesium.Color.PURPLE, css: 'purple', label: 'Old station' };
  if (name.includes('Playground')) return { colour: Cesium.Color.LIME, css: 'lime', label: 'Playground' };
  if (name.includes('Tunnel')) return { colour: Cesium.Color.RED, css: 'red', label: 'Tunnel' };
  if (name.includes('Water')) return { colour: Cesium.Color.DEEPSKYBLUE, css: 'deepskyblue', label: 'Water' };
  return { colour: Cesium.Color.YELLOW, css: 'yellow', label: 'Other' };
}

// Creates a solid square icon
function makeSquareIcon(cssColour) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <rect x="3" y="3" width="22" height="22" 
        fill="${cssColour}" 
        stroke="white" 
        stroke-width="3"/>
    </svg>
  `;
}

// ==============================
// LOAD TRAIL
// ==============================
Cesium.GeoJsonDataSource.load('Lilydale_to_Warburton_Rail_Trail.geojson').then(function(dataSource) {
  viewer.dataSources.add(dataSource);

  dataSource.entities.values.forEach(function(entity) {
    if (entity.polyline) {
      entity.polyline.width = 6;
      entity.polyline.material = Cesium.Color.WHITE;
      entity.polyline.clampToGround = true;
    }
  });

  viewer.zoomTo(dataSource);
});

// ==============================
// LOAD WAYPOINTS
// ==============================
Cesium.GeoJsonDataSource.load('Lilydale_to_Warburton_Rail_Trail_waypoints.geojson').then(function(dataSource) {
  viewer.dataSources.add(dataSource);

  dataSource.entities.values.forEach(function(entity) {
    var name = entity.properties.Name.getValue();
    var style = getStyle(name);

    entity.point = undefined;

    entity.billboard = new Cesium.BillboardGraphics({
      image: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(makeSquareIcon(style.css)),
      width: 28,
      height: 28,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    });

    entity.label = new Cesium.LabelGraphics({
      text: name,
      font: '13px sans-serif',
      pixelOffset: new Cesium.Cartesian2(0, -28),
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      showBackground: true,
      backgroundColor: Cesium.Color.BLACK.withAlpha(0.55),
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    });
  });
});

// ==============================
// LEGEND
// ==============================
var legend = document.createElement('div');
legend.style.position = 'absolute';
legend.style.bottom = '25px';
legend.style.left = '25px';
legend.style.padding = '12px';
legend.style.background = 'rgba(0, 0, 0, 0.75)';
legend.style.color = 'white';
legend.style.fontSize = '13px';
legend.style.borderRadius = '8px';
legend.style.zIndex = '999';

legend.innerHTML = `
<b>Lilydale to Warburton Rail Trail</b><br>
<div style="margin-top:6px;">
<span style="color:gray;">■</span> Car park<br>
<span style="color:blue;">■</span> Toilet<br>
<span style="color:green;">■</span> Picnic table<br>
<span style="color:orange;">■</span> Bridge<br>
<span style="color:brown;">■</span> Cafe<br>
<span style="color:cyan;">■</span> Information<br>
<span style="color:purple;">■</span> Old station<br>
<span style="color:lime;">■</span> Playground<br>
<span style="color:red;">■</span> Tunnel<br>
<span style="color:deepskyblue;">■</span> Water<br>
<span style="color:yellow;">■</span> Other
</div>
`;

document.body.appendChild(legend);
// ==============================
// LIVE WEATHER API BONUS FEATURE
// ==============================

// Create weather information panel
var weatherPanel = document.createElement('div');
weatherPanel.style.position = 'absolute';
weatherPanel.style.top = '80px';
weatherPanel.style.left = '25px';
weatherPanel.style.padding = '12px';
weatherPanel.style.background = 'rgba(0, 0, 0, 0.75)';
weatherPanel.style.color = 'white';
weatherPanel.style.fontSize = '13px';
weatherPanel.style.borderRadius = '8px';
weatherPanel.style.zIndex = '999';
weatherPanel.style.maxWidth = '260px';

weatherPanel.innerHTML = '<b>Live Trail Weather</b><br>Loading weather data...';

document.body.appendChild(weatherPanel);

// Convert weather code to readable description
function getWeatherDescription(code) {
  var descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm'
  };

  return descriptions[code] || 'Weather code: ' + code;
}

// Fetch live weather data for the Lilydale-Warburton trail area
function loadLiveWeather() {
  var latitude = -37.78;
  var longitude = 145.55;

  var weatherUrl =
    'https://api.open-meteo.com/v1/forecast' +
    '?latitude=' + latitude +
    '&longitude=' + longitude +
    '&current_weather=true' +
    '&timezone=Australia%2FSydney';

  fetch(weatherUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var weather = data.current_weather;

      weatherPanel.innerHTML = `
        <b>Live Trail Weather</b><br>
        Location: Lilydale-Warburton Rail Trail<br>
        Temperature: ${weather.temperature} °C<br>
        Wind speed: ${weather.windspeed} km/h<br>
        Wind direction: ${weather.winddirection}°<br>
        Condition: ${getWeatherDescription(weather.weathercode)}<br>
        Updated: ${weather.time}
      `;
    })
    .catch(function(error) {
      weatherPanel.innerHTML = `
        <b>Live Trail Weather</b><br>
        Weather API could not be loaded.
      `;
      console.log('Weather API error:', error);
    });
}

loadLiveWeather();
