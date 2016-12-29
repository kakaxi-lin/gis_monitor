    dojo.require("esri.config");
	dojo.require("esri.map");
	esriConfig.defaults.io.corsDetection=false;
    var map;
    var spatialReference;
    var pointLayer=null;
    var polylineLayer=null;
    var pointArray=[];
    pointArray.push("12971560.146692835,4841705.405986843");
    pointArray.push("12972480.898534339,4841975.2815265935");
    pointArray.push("12973281.000134543,4841597.455770941");
    pointArray.push("12972626.94882644,4841178.35493274");
    pointArray.push("12971760.172092887,4841292.655161341");
    pointArray.push("12971472.569434348,4841721.545602454");
    var zoom;
    var pointGraphic;
    //����ͼƬ�Ĵ�С 30x40
    var imgSizeX;
    var imgSizeY;
    function init(){
    	map = new esri.Map("map", {logo: false});
    	spatialReference=new esri.SpatialReference({wkid:102113});
    	//����ӵ�ͼ����������
        var baseMap = new esri.layers.ArcGISTiledMapServiceLayer("http://130.10.7.207:8399/rest/services/chaoyang_SDE_1211/MapServer");
        map.addLayer(baseMap);
        //�����ͼ��
        polylineLayer=new esri.layers.GraphicsLayer({id:"polylineLayer"});
    	map.addLayer(polylineLayer);
    	//��ӵ�ͼ��
        pointLayer=new esri.layers.GraphicsLayer({id:"pointLayer"});
        map.addLayer(pointLayer);
        map.setLevel(4);
        dojo.connect(map, "onLoad",function(){
			zoom=map.getZoom();
			imgSizeX=10+5*zoom;
			imgSizeY=20+5*zoom;
        });
        dojo.connect(map, "onClick",function(e){
			console.log(e.mapPoint.x+","+e.mapPoint.y);
        });
        dojo.connect(map,"onZoomEnd",function(e){
            //console.log(map.getZoom());
            //console.log(map.getLevel());
        	var points=pointLayer.graphics;
        	if(points.length==0){
              return;
            }
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
    //��ʾ����
    function showPoint(){
    	clearMap();
        if(pointArray.length==0){
          alert("û�е���!");
          return;
        }
        for(var i in pointArray){
        	var point = new esri.geometry.Point(pointArray[i].split(",")[0],pointArray[i].split(",")[1],spatialReference)
            var symbol = new esri.symbol.PictureMarkerSymbol("img/1.png",imgSizeX,imgSizeY);
            symbol.setOffset(0, imgSizeY/2);
            var graphic = new esri.Graphic(point,symbol);
            pointLayer.add(graphic);
        }
		console.log(pointLayer.graphics);
    }
    //��ʾ��ʼ��������
    function showP_Start_End(){
        if(pointArray.length==0){
          alert("û�е���!");
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
		console.log(pointLayer.graphics);
    }
    //��ʾ���߱��
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
		console.log(polylineLayer.graphics);
    }
    function clearMap(){
    	pointLayer.clear();
        polylineLayer.clear();
    }