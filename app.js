Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNjcyOWM1MC0xNzYzLTRlMjUtYWQ4Mi1kYTlmZDY5NzA1ZTIiLCJpZCI6Mzk4NTkxLCJzdWIiOiJGUk9BQzQ4NiIsImlzcyI6Imh0dHBzOi8vaW9uLmNlc2l1bS5jb20iLCJhdWQiOiJHRUVfQXNzaWdubWVudCIsImlhdCI6MTc3Nzg2ODAwNX0.nrfQzguROLXdmPqdXgf71vSltxSpHamRvyIiis2-u1s';

const viewer = new Cesium.Viewer('cesiumContainer', {
  terrain: Cesium.Terrain.fromWorldTerrain()
});

viewer.scene.globe.depthTestAgainstTerrain = false;

var waypointEntities = [];

(async () => {
  const tileset = await Cesium.createGooglePhotorealistic3DTileset();
  viewer.scene.primitives.add(tileset);
})();

function getStyle(name) {
  if (name.includes('Car park')) {
    return { colour: Cesium.Color.GRAY, css: 'gray', label: 'Car park', category: 'Car park' };
  }
  if (name.includes('Toilet')) {
    return { colour: Cesium.Color.BLUE, css: 'blue', label: 'Toilet', category: 'Toilet' };
  }
  if (name.includes('Picnic')) {
    return { colour: Cesium.Color.GREEN, css: 'green', label: 'Picnic table', category: 'Picnic table' };
  }
  if (name.includes('Bridge')) {
    return { colour: Cesium.Color.ORANGE, css: 'orange', label: 'Bridge', category: 'Bridge' };
  }
  if (name.includes('Cafe')) {
    return { colour: Cesium.Color.BROWN, css: 'brown', label: 'Cafe', category: 'Cafe' };
  }
  if (name.includes('Information')) {
    return { colour: Cesium.Color.CYAN, css: 'cyan', label: 'Information', category: 'Information' };
  }
  if (name.includes('Station')) {
    return { colour: Cesium.Color.PURPLE, css: 'purple', label: 'Old station', category: 'Old station' };
  }
  if (name.includes('Playground')) {
    return { colour: Cesium.Color.LIME, css: 'lime', label: 'Playground', category: 'Playground' };
  }
  if (name.includes('Tunnel')) {
    return { colour: Cesium.Color.RED, css: 'red', label: 'Tunnel', category: 'Tunnel' };
  }
  if (name.includes('Water')) {
    return { colour: Cesium.Color.DEEPSKYBLUE, css: 'deepskyblue', label: 'Water', category: 'Water' };
  }

  return { colour: Cesium.Color.YELLOW, css: 'yellow', label: 'Other', category: 'Other' };
}

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

Cesium.GeoJsonDataSource.load('Lilydale_to_Warburton_Rail_Trail_waypoints.geojson').then(function(dataSource) {
  viewer.dataSources.add(dataSource);

  dataSource.entities.values.forEach(function(entity) {
    var name = entity.properties.Name.getValue();
    var style = getStyle(name);

    // Store category for filtering
    entity.category = style.category;
    waypointEntities.push(entity);

    // Remove default point styling
    entity.point = undefined;

    // Square waypoint icon
    entity.billboard = new Cesium.BillboardGraphics({
      image: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(makeSquareIcon(style.css)),
      width: 28,
      height: 28,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    });

    // Label
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

var geePanel = document.createElement('div');
geePanel.style.position = 'absolute';
geePanel.style.top = '20px';
geePanel.style.left = '25px';
geePanel.style.right = 'auto';
geePanel.style.padding = '12px';
geePanel.style.background = 'rgba(0, 0, 0, 0.75)';
geePanel.style.color = 'white';
geePanel.style.fontSize = '13px';
geePanel.style.borderRadius = '8px';
geePanel.style.zIndex = '999';
geePanel.style.maxWidth = '280px';

geePanel.innerHTML = `
  <b>Linked Cloud GIS App</b><br>
  Companion Google Earth Engine app showing Melbourne Land Surface Temperature analysis:<br><br>
  <a href="https://s3946905.projects.earthengine.app/view/gee-lst-melbourne" target="_blank" 
     style="color:#7FDBFF; font-weight:bold;">
     Open Melbourne LST GEE App
  </a>
`;

document.body.appendChild(geePanel);

var weatherPanel = document.createElement('div');
weatherPanel.style.position = 'absolute';
weatherPanel.style.top = '125px';
weatherPanel.style.left = '25px';
weatherPanel.style.padding = '12px';
weatherPanel.style.background = 'rgba(0, 0, 0, 0.75)';
weatherPanel.style.color = 'white';
weatherPanel.style.fontSize = '13px';
weatherPanel.style.borderRadius = '8px';
weatherPanel.style.zIndex = '999';
weatherPanel.style.maxWidth = '280px';

weatherPanel.innerHTML = '<b>Live Trail Weather</b><br>Loading weather data...';

document.body.appendChild(weatherPanel);

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

var filterPanel = document.createElement('div');
filterPanel.style.position = 'absolute';
filterPanel.style.top = '270px';
filterPanel.style.left = '25px';
filterPanel.style.right = 'auto';
filterPanel.style.padding = '12px';
filterPanel.style.background = 'rgba(0, 0, 0, 0.75)';
filterPanel.style.color = 'white';
filterPanel.style.fontSize = '13px';
filterPanel.style.borderRadius = '8px';
filterPanel.style.zIndex = '999';
filterPanel.style.maxWidth = '280px';

filterPanel.innerHTML = `
  <b>Filter Waypoints</b><br>
  <label><input type="checkbox" class="waypoint-filter" value="Car park" checked> Car park</label><br>
  <label><input type="checkbox" class="waypoint-filter" value="Toilet" checked> Toilet</label><br>
  <label><input type="checkbox" class="waypoint-filter" value="Picnic table" checked> Picnic table</label><br>
  <label><input type="checkbox" class="waypoint-filter" value="Bridge" checked> Bridge</label><br>
  <label><input type="checkbox" class="waypoint-filter" value="Cafe" checked> Cafe</label><br>
  <label><input type="checkbox" class="waypoint-filter" value="Information" checked> Information</label><br>
  <label><input type="checkbox" class="waypoint-filter" value="Old station" checked> Old station</label><br>
  <label><input type="checkbox" class="waypoint-filter" value="Playground" checked> Playground</label><br>
  <label><input type="checkbox" class="waypoint-filter" value="Tunnel" checked> Tunnel</label><br>
  <label><input type="checkbox" class="waypoint-filter" value="Water" checked> Water</label><br>
  <label><input type="checkbox" class="waypoint-filter" value="Other" checked> Other</label><br>
  <br>
  <button id="showAllBtn">Show all</button>
  <button id="hideAllBtn">Hide all</button>
`;

document.body.appendChild(filterPanel);

function updateWaypointVisibility() {
  var checkedCategories = [];

  document.querySelectorAll('.waypoint-filter').forEach(function(checkbox) {
    if (checkbox.checked) {
      checkedCategories.push(checkbox.value);
    }
  });

  waypointEntities.forEach(function(entity) {
    entity.show = checkedCategories.includes(entity.category);
  });
}

document.querySelectorAll('.waypoint-filter').forEach(function(checkbox) {
  checkbox.addEventListener('change', updateWaypointVisibility);
});

document.getElementById('showAllBtn').addEventListener('click', function() {
  document.querySelectorAll('.waypoint-filter').forEach(function(checkbox) {
    checkbox.checked = true;
  });
  updateWaypointVisibility();
});

document.getElementById('hideAllBtn').addEventListener('click', function() {
  document.querySelectorAll('.waypoint-filter').forEach(function(checkbox) {
    checkbox.checked = false;
  });
  updateWaypointVisibility();
});

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
legend.style.maxWidth = '280px';

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
var elevationPanel = document.createElement('div');
elevationPanel.style.position = 'absolute';
elevationPanel.style.top = '25px';
elevationPanel.style.right = '25px';
elevationPanel.style.bottom = 'auto';
elevationPanel.style.padding = '12px';
elevationPanel.style.background = 'rgba(0, 0, 0, 0.78)';
elevationPanel.style.color = 'white';
elevationPanel.style.fontSize = '13px';
elevationPanel.style.borderRadius = '8px';
elevationPanel.style.zIndex = '999';
elevationPanel.style.width = '380px';

elevationPanel.innerHTML = `
  <b>Interactive Elevation Profile</b><br><br>

  <label>Start from:</label><br>
  <select id="trailStartSelect" style="width:100%; margin-top:4px;">
    <option value="lilydale">Lilydale</option>
    <option value="warburton">Warburton</option>
  </select>

  <br><br>

  <label>Distance along trail: <span id="distanceValue">0.0 km</span></label><br>
  <input id="trailDistanceSlider" type="range" min="0" max="40" step="0.1" value="0" style="width:100%;">

  <canvas id="elevationCanvas" width="355" height="155" style="margin-top:10px; background:white; border-radius:4px;"></canvas>

  <div id="elevationSummary" style="margin-top:8px;">
    Loading elevation profile...
  </div>
`;

document.body.appendChild(elevationPanel);

var elevationProfileData = null;
var trailCoordsForProfile = [];
var trailDistancesForProfile = [];
var trailTotalDistanceForProfile = 0;

var profileTrailMarker = viewer.entities.add({
  name: 'Selected elevation profile point',
  position: Cesium.Cartesian3.fromDegrees(145.3498, -37.7539, 120),
  point: {
    pixelSize: 14,
    color: Cesium.Color.YELLOW,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 2,
    disableDepthTestDistance: Number.POSITIVE_INFINITY
  },
  label: {
    text: '0.0 km',
    font: '13px sans-serif',
    pixelOffset: new Cesium.Cartesian2(0, -22),
    fillColor: Cesium.Color.WHITE,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 2,
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    showBackground: true,
    backgroundColor: Cesium.Color.BLACK.withAlpha(0.6),
    disableDepthTestDistance: Number.POSITIVE_INFINITY
  }
});

var profileTravelledTrail = viewer.entities.add({
  name: 'Selected travelled section',
  polyline: {
    positions: [],
    width: 5,
    material: Cesium.Color.YELLOW,
    clampToGround: true
  }
});

function calculateDistanceKm(lon1, lat1, lon2, lat2) {
  var R = 6371;
  var dLat = Cesium.Math.toRadians(lat2 - lat1);
  var dLon = Cesium.Math.toRadians(lon2 - lon1);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(Cesium.Math.toRadians(lat1)) *
    Math.cos(Cesium.Math.toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function getTrailPointAtDistance(distanceKmValue) {
  if (distanceKmValue <= 0) {
    return {
      lon: trailCoordsForProfile[0][0],
      lat: trailCoordsForProfile[0][1],
      elev: trailCoordsForProfile[0][2],
      index: 0
    };
  }

  if (distanceKmValue >= trailTotalDistanceForProfile) {
    var last = trailCoordsForProfile.length - 1;
    return {
      lon: trailCoordsForProfile[last][0],
      lat: trailCoordsForProfile[last][1],
      elev: trailCoordsForProfile[last][2],
      index: last
    };
  }

  for (var i = 1; i < trailDistancesForProfile.length; i++) {
    if (trailDistancesForProfile[i] >= distanceKmValue) {
      var beforeDistance = trailDistancesForProfile[i - 1];
      var afterDistance = trailDistancesForProfile[i];
      var ratio = (distanceKmValue - beforeDistance) / (afterDistance - beforeDistance);

      return {
        lon: trailCoordsForProfile[i - 1][0] + ratio * (trailCoordsForProfile[i][0] - trailCoordsForProfile[i - 1][0]),
        lat: trailCoordsForProfile[i - 1][1] + ratio * (trailCoordsForProfile[i][1] - trailCoordsForProfile[i - 1][1]),
        elev: trailCoordsForProfile[i - 1][2] + ratio * (trailCoordsForProfile[i][2] - trailCoordsForProfile[i - 1][2]),
        index: i
      };
    }
  }
}

function drawElevationProfile(markerDistanceFromLilydale) {
  if (!elevationProfileData) {
    return;
  }

  var distances = elevationProfileData.distances;
  var elevations = elevationProfileData.elevations;
  var minElev = elevationProfileData.minElev;
  var maxElev = elevationProfileData.maxElev;
  var totalDistance = elevationProfileData.totalDistance;

  var canvas = document.getElementById('elevationCanvas');
  var ctx = canvas.getContext('2d');

  var width = canvas.width;
  var height = canvas.height;
  var paddingLeft = 40;
  var paddingRight = 15;
  var paddingTop = 15;
  var paddingBottom = 30;

  ctx.clearRect(0, 0, width, height);

  // Background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  // Faded grid lines
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.lineWidth = 1;

  for (var g = 0; g <= 4; g++) {
    var yGrid = paddingTop + g * (height - paddingTop - paddingBottom) / 4;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, yGrid);
    ctx.lineTo(width - paddingRight, yGrid);
    ctx.stroke();
  }

  for (var h = 0; h <= 4; h++) {
    var xGrid = paddingLeft + h * (width - paddingLeft - paddingRight) / 4;
    ctx.beginPath();
    ctx.moveTo(xGrid, paddingTop);
    ctx.lineTo(xGrid, height - paddingBottom);
    ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(paddingLeft, paddingTop);
  ctx.lineTo(paddingLeft, height - paddingBottom);
  ctx.lineTo(width - paddingRight, height - paddingBottom);
  ctx.stroke();

  // Elevation line
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 1.4;
  ctx.beginPath();

  for (var j = 0; j < elevations.length; j++) {
    var x =
      paddingLeft +
      (distances[j] / totalDistance) *
      (width - paddingLeft - paddingRight);

    var y =
      height -
      paddingBottom -
      ((elevations[j] - minElev) / (maxElev - minElev)) *
      (height - paddingTop - paddingBottom);

    if (j === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();

  if (markerDistanceFromLilydale !== null && markerDistanceFromLilydale !== undefined) {
    var point = getTrailPointAtDistance(markerDistanceFromLilydale);

    var markerX =
      paddingLeft +
      (markerDistanceFromLilydale / totalDistance) *
      (width - paddingLeft - paddingRight);

    var markerY =
      height -
      paddingBottom -
      ((point.elev - minElev) / (maxElev - minElev)) *
      (height - paddingTop - paddingBottom);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(markerX, paddingTop);
    ctx.lineTo(markerX, height - paddingBottom);
    ctx.stroke();

    // Blue dot
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(markerX, markerY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Distance label
    ctx.fillStyle = 'black';
    ctx.font = '10px Arial';
    ctx.fillText(markerDistanceFromLilydale.toFixed(1) + ' km', markerX - 18, paddingTop + 10);
  }

  // Axis labels
  ctx.fillStyle = 'black';
  ctx.font = '11px Arial';

  ctx.fillText(Math.round(maxElev) + ' m', 5, paddingTop + 5);
  ctx.fillText(Math.round(minElev) + ' m', 5, height - paddingBottom);
  ctx.fillText('0 km', paddingLeft, height - 8);

  var midDistance = totalDistance / 2;
  var midX = paddingLeft + 0.5 * (width - paddingLeft - paddingRight);
  ctx.fillText(midDistance.toFixed(1) + ' km', midX - 18, height - 8);

  ctx.fillText(totalDistance.toFixed(1) + ' km', width - 70, height - 8);
}

function updateElevationSlider() {
  if (!elevationProfileData) {
    return;
  }

  var startDirection = document.getElementById('trailStartSelect').value;
  var selectedDistance = parseFloat(document.getElementById('trailDistanceSlider').value);

  var distanceFromLilydale =
    startDirection === 'lilydale'
      ? selectedDistance
      : trailTotalDistanceForProfile - selectedDistance;

  var point = getTrailPointAtDistance(distanceFromLilydale);

  document.getElementById('distanceValue').innerHTML = selectedDistance.toFixed(1) + ' km';

  // Move Cesium marker
  profileTrailMarker.position = Cesium.Cartesian3.fromDegrees(
    point.lon,
    point.lat,
    point.elev + 15
  );

  profileTrailMarker.label.text = selectedDistance.toFixed(1) + ' km';

  // Highlight travelled trail section
  var travelledCoords = [];

  if (startDirection === 'lilydale') {
    for (var i = 0; i < trailCoordsForProfile.length; i++) {
      if (trailDistancesForProfile[i] <= distanceFromLilydale) {
        travelledCoords.push(trailCoordsForProfile[i]);
      }
    }
  } else {
    for (var j = trailCoordsForProfile.length - 1; j >= 0; j--) {
      if (trailDistancesForProfile[j] >= distanceFromLilydale) {
        travelledCoords.push(trailCoordsForProfile[j]);
      }
    }
  }

  travelledCoords.push([point.lon, point.lat, point.elev]);

  profileTravelledTrail.polyline.positions = travelledCoords.map(function(coord) {
    return Cesium.Cartesian3.fromDegrees(coord[0], coord[1], coord[2] + 5);
  });

  drawElevationProfile(distanceFromLilydale);

  document.getElementById('elevationSummary').innerHTML =
    'Selected distance: ' + selectedDistance.toFixed(1) + ' km<br>' +
    'Elevation at point: ' + Math.round(point.elev) + ' m<br>' +
    'Approx. total trail: ' + trailTotalDistanceForProfile.toFixed(1) + ' km';
}

function initialiseElevationSliderProfile() {
  fetch('Lilydale_to_Warburton_Rail_Trail.geojson')
    .then(function(response) {
      return response.json();
    })
    .then(function(geojson) {
      trailCoordsForProfile = geojson.features[0].geometry.coordinates[0];

      trailDistancesForProfile = [0];
      var elevations = [];

      for (var i = 0; i < trailCoordsForProfile.length; i++) {
        elevations.push(trailCoordsForProfile[i][2]);

        if (i > 0) {
          var segmentDistance = calculateDistanceKm(
            trailCoordsForProfile[i - 1][0],
            trailCoordsForProfile[i - 1][1],
            trailCoordsForProfile[i][0],
            trailCoordsForProfile[i][1]
          );

          trailDistancesForProfile.push(trailDistancesForProfile[i - 1] + segmentDistance);
        }
      }

      trailTotalDistanceForProfile = trailDistancesForProfile[trailDistancesForProfile.length - 1];

      elevationProfileData = {
        distances: trailDistancesForProfile,
        elevations: elevations,
        minElev: Math.min.apply(null, elevations),
        maxElev: Math.max.apply(null, elevations),
        totalDistance: trailTotalDistanceForProfile
      };

      document.getElementById('trailDistanceSlider').max =
        trailTotalDistanceForProfile.toFixed(1);

      drawElevationProfile(0);
      updateElevationSlider();
    })
    .catch(function(error) {
      document.getElementById('elevationSummary').innerHTML =
        'Elevation slider/profile could not be loaded.';
      console.log('Elevation slider/profile error:', error);
    });
}

document.getElementById('trailDistanceSlider').addEventListener('input', updateElevationSlider);
document.getElementById('trailStartSelect').addEventListener('change', updateElevationSlider);

initialiseElevationSliderProfile();
