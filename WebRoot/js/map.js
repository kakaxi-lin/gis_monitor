    dojo.require("esri.config");
	dojo.require("esri.map");
	esriConfig.defaults.io.corsDetection=false;
    var map;
    var spatialReference;
    var pointLayer=null;
    var polylineLayer=null;
    //点标记集合
    var pointArray=[];
    pointArray.push("12957094.32702747,4903416.118362501");
    pointArray.push("12964370.383246249,4905797.373125011");
    pointArray.push("12969873.727586271,4902992.784182499");
    pointArray.push("12965799.136103755,4901193.613917492");
    pointArray.push("12962121.42041499,4901590.489711244");
    pointArray.push("12957729.328297472,4903230.9096587505");
    //线标记集合
    var lineArray=[];
    lineArray.push("12958840.580519976,4903469.035135001");
    lineArray.push("12962994.547161244,4905347.580558759");
    lineArray.push("12969265.184702517,4901590.489711244");
    lineArray.push("12966883.92994001,4899764.861059986");
    lineArray.push("12962068.50364249,4899288.610107484");
    lineArray.push("12969582.68533752,4908125.71111502");
    var zoom;
    var pointGraphic;
    //定义图片的大小 30x40
    var imgSizeX;
    var imgSizeY;
    function init(){
    	map = new esri.Map("map", {logo: false});
    	spatialReference=new esri.SpatialReference({wkid:102113});
    	//先添加的图层在最下面
//        var baseMap = new esri.layers.ArcGISTiledMapServiceLayer("http://130.10.7.207:8399/rest/services/chaoyang_SDE_1211/MapServer");
        var baseMap = new esri.layers.ArcGISTiledMapServiceLayer("http://130.10.7.207:8399/rest/services/lgycsh_anno_20170105/MapServer");
        map.addLayer(baseMap);
        //添加线图层
        polylineLayer=new esri.layers.GraphicsLayer({id:"polylineLayer"});
    	map.addLayer(polylineLayer);
    	//添加点图层
        pointLayer=new esri.layers.GraphicsLayer({id:"pointLayer"});
        map.addLayer(pointLayer);
        map.setLevel(4);
        dojo.connect(map, "onLoad",function(){
			zoom=map.getZoom();
console.log(zoom);
			imgSizeX=10+5*zoom;
			imgSizeY=20+5*zoom;
        });
        dojo.connect(map, "onClick",function(e){
console.log(e.mapPoint.x+","+e.mapPoint.y);
        });
        dojo.connect(map,"onZoomEnd",function(e){
console.log(map.getZoom());
console.log(map.getLevel());
        	zoom=map.getZoom();
        	imgSizeX=10+5*zoom;
			imgSizeY=20+5*zoom;
        	var points=pointLayer.graphics;
        	if(points.length==0){
              return;
            }
        	for ( var i = 0; i < points.length; i++) {
        		points[i].symbol.setWidth(imgSizeX).setHeight(imgSizeY).setOffset(0,imgSizeY/2)
			}
        })
    }
    dojo.addOnLoad(init);
    //显示点标记
    function showPoint(){
    	clearMap();
        if(lineArray.length==0){
          alert("没有点标记!");
          return;
        }
        for(var i in lineArray){
        	var point = new esri.geometry.Point(lineArray[i].split(",")[0],lineArray[i].split(",")[1],spatialReference)
            var symbol = new esri.symbol.PictureMarkerSymbol("img/1.png",imgSizeX,imgSizeY);
            symbol.setOffset(0, imgSizeY/2);
            var graphic = new esri.Graphic(point,symbol);
            pointLayer.add(graphic);
        }
//		console.log(pointLayer.graphics);
    }
    //显示开始结束点标记
    function showP_Start_End(){
        if(pointArray.length==0){
          alert("没有点标记!");
          return;
        }
        for(var i in pointArray){
        	var point = new esri.geometry.Point(pointArray[i].split(",")[0],pointArray[i].split(",")[1],spatialReference)
        	var imgSrc;
        	if(i==0){
        		imgSrc="img/begin.png";
            }else if(i==1){
            	imgSrc="img/1.png";
            }else if(i==pointArray.length-1){
            	imgSrc="img/end.png";
            }else{
            	imgSrc="img/2.png";
            }
            var symbol= new esri.symbol.PictureMarkerSymbol(imgSrc,imgSizeX,imgSizeY);
            symbol.setOffset(0, imgSizeY/2);
            var graphic = new esri.Graphic(point,symbol);
            pointLayer.add(graphic);
        }
//		console.log(pointLayer.graphics);
    }
    //显示点线标记
    function showPolyline(){
    	clearMap();
    	showP_Start_End();
		var polyline=new esri.geometry.Polyline(spatialReference);
		var lineArray=[];
		for(var i in pointArray){
			lineArray.push([pointArray[i].split(",")[0],pointArray[i].split(",")[1]]);
	    }
		polyline.addPath(lineArray);
		var symbol=new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
				   new esri.Color([255,0,0]), 3);
	    var graphic=new esri.Graphic(polyline,symbol);
		polylineLayer.add(graphic);
//		console.log(polylineLayer.graphics);
    }
    function clearMap(){
    	pointLayer.clear();
        polylineLayer.clear();
    }