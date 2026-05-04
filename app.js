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