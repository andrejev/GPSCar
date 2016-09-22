(function () {

  $('button').prop('disabled', true);
  var xhttp = {},
    GPSAufRaedern = {},
    map = {}, //complex object of type OpenLayers.Map
    markerLayer = {},
    carMarker = {},
    goalMarker = {},
    clickMarker = {},
    lat = 49.4,
    lon = 8.67,
    zoom = 17;

  if (window.XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  function sensorStatusToColor(obstacle) {
    if (obstacle < 0)
      return "gray";
    if (obstacle < 30)
      return "red";
    if (obstacle < 50)
      return "orange";
    else
      return "green";
  }

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var json = JSON.parse(xhttp.responseText);

      for (var propName in json) {
        if (json.hasOwnProperty(propName)) {
          if (propName == "GPS") {
            document.getElementById('GPS').innerHTML =
              "<h1>GPS-Daten</h1>"
              + "Latitude: " + json["GPS"]["latitude"] + "<br>"
              + "Longitude: " + json["GPS"]["longitude"] + "<br>"
              + "Altitude: " + json["GPS"]["altitude"] + "<br>"
              + "Track: " + json["GPS"]["track"] + "<br>"
              + "Satellites: " + json["GPS"]["satellites"] + "<br>"
              + "Fix_time: " + json["GPS"]["fix_time"] + "<br>";

            lat = json["GPS"]["latitude"];
            lon = json["GPS"]["longitude"];

            if (map) {
              var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
              // map.setCenter(lonLat, zoom);

              carMarker.lonlat = lonLat;
              markerLayer.removeMarker(carMarker);
              markerLayer.addMarker(carMarker);
              markerLayer.redraw();
            }
          } // DIRECTION, STEER_POSITION, VELOCITY
          else if (propName == "Status") {
            document.getElementById('Status').innerHTML =
              "<h1>Status</h1>"
              + "Direction: " + json["Status"]["direction"] + "<br>"
              + "Steer_position: " + json["Status"]["steer_position"] + "<br>";

          }
          else if (propName == "Destination") {
            // nothing to do here yet. maybe double check the received destination
          }
          else if (propName == "Sensors") {


            var s1 = json["Sensors"]["s1"];
            var s2 = json["Sensors"]["s2"];
            var s3 = json["Sensors"]["s3"];
            var s1_doc = document.getElementById("s1");
            s1_doc.style.backgroundColor = sensorStatusToColor(s1);
            if (s1 >= 0)
                s1_doc.innerHTML = s1.toString().substr(0, 5);
            var s2_doc = document.getElementById("s2");
            s2_doc.style.backgroundColor = sensorStatusToColor(s2);
            if (s2 >= 0)
                s2_doc.innerHTML = s2.toString().substr(0, 5);
            var s3_doc = document.getElementById("s3");
            s3_doc.style.backgroundColor = sensorStatusToColor(s3);
            if (s3 >= 0)
                s3_doc.innerHTML = s3.toString().substr(0, 5);
          }
        }
      }
    }
  };

  GPSAufRaedern.updateStatus = function () {
    xhttp.open("POST", "Status", false);
    xhttp.send();
    setTimeout(GPSAufRaedern.updateStatus, 2000);
  };

  GPSAufRaedern.updateGPS = function () {
    xhttp.open("POST", "GPS", false);
    xhttp.send();
    setTimeout(GPSAufRaedern.updateGPS, 1000);
  };

  GPSAufRaedern.updateSensors = function () {
    xhttp.open("POST", "Sensors", false);
    xhttp.send();
    setTimeout(GPSAufRaedern.updateSensors, 1000);
  };

  GPSAufRaedern.toggleCar = function () {
    xhttp.open("POST", "ToggleCar", false);
    xhttp.send();
  };

  GPSAufRaedern.setDestination = function () {
    var dLonLat = finishMarker.lonlat;

    dLonLat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));

    xhttp.open("POST", "SetDestination?lon=" + dLonLat.lon + "&lat=" + dLonLat.lat, false);
    xhttp.send();
    dLonLat.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
  };

  GPSAufRaedern.setSensorMode= function (el) {
    xhttp.open("POST", "SetSensorMode?mode=" + $(el).find("option:selected").val() , false);
    xhttp.send();
  };

  GPSAufRaedern.updateGPS();
  GPSAufRaedern.updateStatus();
  GPSAufRaedern.updateSensors();


  GPSAufRaedern.init = function () {

    map = new OpenLayers.Map("map", {
      controls: [
        new OpenLayers.Control.Navigation()
      ],
      maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
      maxResolution: 156543.0339,
      numZoomLevels: 19,
      units: 'm',
      projection: new OpenLayers.Projection("EPSG:900913"),
      displayProjection: new OpenLayers.Projection("EPSG:4326")
    });

    layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
    layerMapnik.setOpacity(0.4);
    map.addLayer(layerMapnik);

    var newLayer = new OpenLayers.Layer.OSM("Local Tiles", "tiles/${z}/${x}/${y}.png", {
      numZoomLevels: 19,
      alpha: true,
      isBaseLayer: false
    });

    map.addLayer(newLayer);
    markerLayer = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markerLayer);

    var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
    var cm_size = new OpenLayers.Size(20, 10);
    var cm_offset = new OpenLayers.Pixel(-(cm_size.w / 2), -cm_size.h);
    var cm_icon = new OpenLayers.Icon('vendor/img/race-car.png', cm_size, cm_offset);
    carMarker = new OpenLayers.Marker(lonLat, cm_icon);

    var f_size = new OpenLayers.Size(20, 20);
    var f_offset = new OpenLayers.Pixel(-(f_size.w / 2), -f_size.h);
    var f_icon = new OpenLayers.Icon('vendor/img/finish.png', f_size, f_offset);
    finishMarker = new OpenLayers.Marker(lonLat, f_icon);

    var c_size = new OpenLayers.Size(15, 20);
    var c_offset = new OpenLayers.Pixel(-(f_size.w / 2), -c_size.h);
    var c_icon = new OpenLayers.Icon('vendor/img/clickMarker.png', c_size, c_offset);
    clickMarker = new OpenLayers.Marker(lonLat, c_icon);

    markerLayer.addMarker(carMarker);
    markerLayer.addMarker(finishMarker);
    // markerLayer.addMarker(clickMarker);

    map.setCenter(lonLat, zoom);

    map.events.register("click", map, function (e) {
      var lonlat = map.getLonLatFromViewPortPx(e.xy);

      lonlat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));

      document.getElementById("markerLon").innerHTML = "Lon: " + lonlat.lon;
      document.getElementById("markerLat").innerHTML = "Lat: " + lonlat.lat;

      lonlat.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));

      $('button').prop('disabled', false);
      clickMarker.lonlat = lonlat;
      markerLayer.removeMarker(clickMarker);
      markerLayer.addMarker(clickMarker);
      markerLayer.redraw();
    });
  };

  window.GPSAufRaedern = GPSAufRaedern;

  $("button").click(function () { // set click marker to destination
    finishMarker.lonlat = clickMarker.lonlat;
    markerLayer.removeMarker(clickMarker);
    markerLayer.removeMarker(finishMarker);
    markerLayer.addMarker(finishMarker);
    markerLayer.redraw();
    GPSAufRaedern.setDestination();
  });

})();
