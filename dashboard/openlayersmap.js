var columnsNumber = 6;
var rowsNumber = 3

function SquareSelection(coordinates){
  
  var lowerX, lowerY, higherX, higherY, xDimension, yDimension;

  var proccessCoordinates = function(item, index){
    if(Array.isArray(item) && index < 4){
      if(!lowerX || item[0] < lowerX){
        lowerX = item[0];
      }
      if(!lowerY || item[1] < lowerY){
        lowerY = item[1];
      }
      if(!higherX || item[0] > higherX){
        higherX = item[0];
      }
      if(!higherY || item[1] > higherY){
        higherY = item[1];
      }
    }else{
      switch(index){
         case 0:
           lowerX = item;
           break;
         case 1:
           lowerY = item;
           break; 
         case 2:
           higherX = item;
           break;
         case 3:
           higherY = item;
           break;
         default:
           break;
      }
    }
  
  }

  coordinates.forEach(proccessCoordinates);

  xDimension = (higherX - lowerX);
  yDimension = (higherY - lowerY);

  function itIntersects(squareSelection){
    //Test for each point
    if(isPointInside(squareSelection.getUpperLeftPoint()[0], squareSelection.getUpperLeftPoint()[1])){
      return true;
    }
    if(isPointInside(squareSelection.getUpperRightPoint()[0], squareSelection.getUpperRightPoint()[1])){
      return true;
    }
    if(isPointInside(squareSelection.getBottomLeftPoint()[0], squareSelection.getBottomLeftPoint()[1])){
      return true;
    }
    if(isPointInside(squareSelection.getBottomRightPoint()[0], squareSelection.getBottomLeftPoint()[1])){
      return true;
    }
    //Test if superior line pass through
    if(squareSelection.getLowerX() < lowerX &&
        squareSelection.getHigherX() > higherX && 
        squareSelection.getHigherY() >= lowerY &&
        squareSelection.getHigherY() <= higherY){
      return true;
    }
    //Test if inferior line pass through
    if(squareSelection.getLowerX() < lowerX &&
        squareSelection.getHigherX() > higherX && 
        squareSelection.getLowerY() >= lowerY &&
        squareSelection.getLowerY() <= higherY){
      return true;
    }
    //Test if left line pass through
    if(squareSelection.getLowerY() < lowerY &&
        squareSelection.getHigherY() > higherY && 
        squareSelection.getHigherX() >= lowerX &&
        squareSelection.getHigherX() <= higherX){
      return true;
    }
    //Test if right line pass through
    if(squareSelection.getLowerY() < lowerY &&
        squareSelection.getHigherY() > higherY && 
        squareSelection.getLowerX() >= lowerX &&
        squareSelection.getLowerX() <= higherX){
      return true;
    }
  }

  function isPointInside(x,y){
    if(x >= lowerX &&
       x <= higherX &&
       y >= lowerY &&
       y <= higherY){
      return true;
    }
    return false;
  }

  function itIsInsideOf(squareSelection){
    if(squareSelection.getLowerX() > lowerX ||
       squareSelection.getHigherY() < higherY ||
       squareSelection.getLowerY() > higherY ||
       squareSelection.getHigherX() < higherX ){
      return false;
    }
    
    return true;
  }

  var publicApi = {
     getCoordinates: function(){return [[lowerX,higherY],[lowerX,lowerY],[higherX,lowerY],[higherX,higherY]];},
     getExtensions: function(){return [lowerX, lowerY, higherX, higherY]},
     getLowerX: function(){return lowerX},
     getLowerY: function(){return lowerY},
     getHigherX: function(){return higherX},
     getHigherY: function(){return higherY},
     getXDimension: function(){return xDimension},
     getYDimension: function(){return yDimension},
     getUpperLeftPoint: function(){return [lowerX,higherY]},
     getUpperRightPoint: function(){return [higherX,higherY]},
     getBottomLeftPoint: function(){return [lowerX,lowerY]},
     getBottomRightPoint: function(){return [higherX,lowerY]},
     intersects: itIntersects,
     isInsideOf: itIsInsideOf,
  };

  return publicApi;
}

function initiateMap(elementId, callbackFuncForSelection){

  var vectorSource = new ol.source.Vector({
    url: 'https://openlayers.org/en/v3.20.1/examples/data/geojson/countries.geojson',
    format: new ol.format.GeoJSON()
  });

  var osmSource = new ol.source.OSM();

  var mapLayers = [
      new ol.layer.Tile({
        source: osmSource
      }),
      new ol.layer.Vector({
        source: vectorSource
  })];
  var mapView = new ol.View({
      center: [-4180799.456017701,-768009.2602094514],
      zoom: 10,
      maxZoom:10,
      minZoom:10,
      zoomFactor: 2
  })

  var map = new ol.Map({
    layers: mapLayers,
    target: elementId,
    view: mapView,
    interactions: ol.interaction.defaults({
      dragPan: false
    })
  });

  

  var gridArray = [];

  var generateGrid = function(){

      var extent = mapView.calculateExtent(map.getSize());

      var mapSelection = SquareSelection(extent);

      var xFactor = (mapSelection.getXDimension() / columnsNumber);
      var yFactor = (mapSelection.getYDimension() / rowsNumber);

      map.getLayers().forEach(function(layer, i) {
        if (layer instanceof ol.layer.Group) {
          console.log('Removing Group Layer');
          map.removeLayer(layer);
        }
      });

      var actualLX, actualLY, actualHX, actualHY;
      var gridLayers = [];

      for(var latCount = 1; latCount <= rowsNumber; latCount++){
        for(var longCount = 1; longCount <= columnsNumber; longCount++){
            actualLX = mapSelection.getLowerX() + (xFactor*(longCount-1));
            actualHX = mapSelection.getLowerX() + (xFactor*longCount);
            actualLY = mapSelection.getHigherY() - (yFactor*latCount);
            actualHY = mapSelection.getHigherY() - (yFactor*(latCount-1));

            var polygonCoords = [[actualLX,actualHY],[actualLX,actualLY],[actualHX,actualLY],[actualHX,actualHY]];
            var polygonFeature = new ol.Feature(
            new ol.geom.Polygon([polygonCoords]));

            var newLayerVector =  new ol.layer.Vector({
              source: new ol.source.Vector({
                features: [polygonFeature]
              }),
              style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                  width: 2,
                  color: [0, 0, 0, 1]
                }),
                // fill: new ol.style.Fill({
                //   color: [0, 0, 255, 0.6]
                // })
              })
            })
            
            gridLayers.push(newLayerVector);
            var newSquare = SquareSelection(polygonCoords);
            gridArray.push(newSquare)

        }
      }
      var gridGroupLayers = new ol.layer.Group({
            layers: gridLayers
      });

      map.addLayer(gridGroupLayers);
      
  };

  
  //window.onresize = function(){console.log('Mudou')};
  
  //generateGrid(longIncreaseFactor, latIncreaseFactor);
  map.on('moveend', generateGrid);
  

  /// ********* INTERACTIONS **********************

  // a normal select interaction to handle click
  var select = new ol.interaction.Select();
  map.addInteraction(select);

  var selectedFeatures = select.getFeatures();

  // a DragBox interaction used to select features by drawing boxes
  var dragBox = new ol.interaction.DragBox({
    condition: ol.events.condition.platformModifierKeyOnly
  });

  map.addInteraction(dragBox);


  dragBox.on('boxend', function() {
    // features that intersect the box are added to the collection of
    // selected features, and their names are displayed in the "info"
    // div
    var info = [];
    var userSelection = SquareSelection(dragBox.getGeometry().getCoordinates()[0])
    console.log(JSON.stringify(dragBox.getGeometry().getCoordinates()));
    

    var gridSquareSelecteds = 0;
    for(var count=0; count < gridArray.length; count++){
      if(gridArray[count].intersects(userSelection) || 
        gridArray[count].isInsideOf(userSelection)){
        gridSquareSelecteds++;
      }
    }
    selectionInfos = {
      coordinates: userSelection.getCoordinates(),
      quaresSelected: gridSquareSelecteds
    }
    callbackFuncForSelection(selectionInfos);
  });

  // clear selection when drawing a new box and when clicking on the map
  dragBox.on('boxstart', function() {
    selectedFeatures.clear();
    //Do anything else after this?
  });
  map.on('click', function() {
    selectedFeatures.clear();
    //Do anything else after this?
  });
}