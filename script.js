//設定地圖中心座標和縮放比例
var map = L.map("map", {
  center: [22.7317117, 120.28759],
  zoom: 15
});

var lc = L.control
  .locate({
    keepCurrentZoomLevel: "true",
    strings: {
      title: "顯示您目前的位置",
      popup: "您目前的位置",
      outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
    }
  })
  .addTo(map);
lc.start();

//載入 OpenStreetMap 地圖資訊
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var xhr = new XMLHttpRequest();
xhr.open(
  "get",
  "https://raw.githubusercontent.com/SharkLayi61/vaccineMap/main/%E7%96%AB%E8%8B%97%E6%96%BD%E6%89%93%E7%AB%99.json"
);
xhr.send();
xhr.onload = function () {
  var data = JSON.parse(xhr.responseText);

  for (var i = 0; i < data.length; i++) {
    //將藥局標記不同顏色的圖標
    var imageIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

    var markers = new L.MarkerClusterGroup({
      iconCreateFunction: function (cluster) {
        var list = cluster.getAllChildMarkers();
        var level = 0;

        for (var i = 0; i < list.length; i++) {
          if (
            level < 3 &&
            list[i].options.icon.options.iconUrl === image3Icon.options.iconUrl
          )
            level = 3;
          else if (
            level < 2 &&
            list[i].options.icon.options.iconUrl === image2Icon.options.iconUrl
          )
            level = 2;
          else if (
            level < 1 &&
            list[i].options.icon.options.iconUrl === image1Icon.options.iconUrl
          )
            level = 1;
        }
        return L.divIcon({
          html: "<div><span>" + cluster.getChildCount() + "</span></div>",
          className: "icon-cluster " + imageClass[level],
          iconSize: [50, 50]
        });
      },
      removeOutsideVisibleBounds: true,
      animate: true
    }).addTo(map);
    //設定藥局經緯度和 Popup 內容
    var val = data[i].院所名稱;
    var mark = L.marker(
      [data[i].緯度, data[i].經度],
      { icon: imageIcon }
    ).bindPopup(
      '<p class="popup-name">' +
        data[i].院所名稱 +
        "<p/>" +
        '<p class="popup-phone">[電話] ' +
        data[i].電話 +
        "<p/>" +
      '<p class="popup-address">[地址] ' +
        data[i].地址 +
        "<p/>" +
      '<p class="popup-phone">[疫苗種類名稱] ' +
        data[i].疫苗種類名稱 +
        "<p/>" +
        '<a href="https://www.google.com.tw/maps/search/' +
        val +
        '">打開Google地圖</a>'
    );

    //將圖標加入圖層
    markers.addLayer(mark);
  }
  map.addLayer(markers);
};
