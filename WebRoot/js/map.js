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
    var maxScale;
    var currentScale;
    //设置图层的箭头长度特定值
    var specialL=4000;
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
			//添加箭头依赖的属性
			maxScale=map.getMinScale();
//console.log("最大的比例尺为："+maxScale);
	        currentScale = map.getScale();
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
//console.log(polylineLayer.graphics);
    }
    //显示点线and箭头标记
    function showPolylineAndArrow(){
    	clearMap();
    	showP_Start_End();
    	var polyline=new esri.geometry.Polyline(spatialReference);
    	var lineArray=[];
    	for(var i in pointArray){
    		lineArray.push([pointArray[i].split(",")[0],pointArray[i].split(",")[1]]);
    	}
    	polyline.addPath(lineArray);
    	for(var i=0;i<pointArray.length-1;i++){
    		//add line ...
			var x1=pointArray[i].split(",")[0];
			var y1=pointArray[i].split(",")[1];
			var x2=pointArray[i+1].split(",")[0];
			var y2=pointArray[i+1].split(",")[1];
			var pArray=getArrowPoint(x1,y1,x2,y2);
	         console.log("pArray..."+pArray.length);
	         if(pArray.length>1){
	         polyline.addPath([new esri.geometry.Point(x2,y2), new esri.geometry.Point(pArray[0])]);
	         polyline.addPath([new esri.geometry.Point(x2,y2), new esri.geometry.Point(pArray[1])]);
	         }
    	}
    	var symbol=new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
    			new esri.Color([255,0,0]), 2);
    	var graphic=new esri.Graphic(polyline,symbol);
    	polylineLayer.add(graphic);
//console.log(polylineLayer.graphics);
    }
    //清空图层
    function clearMap(){
    	pointLayer.clear();
        polylineLayer.clear();
    }
    //已知p坐标系坐标值，返回对应的o坐标系坐标值
	function getoxy(Xp,Yp,sinA,cosA){
		x=Xp*cosA-Yp*sinA;
		y=Xp*sinA+Yp*cosA;
		return [x,y];
	}
	//获得箭头坐标
	function getArrowPoint(x1,y1,x2,y2){
  		var yy= y2-y1;
		var xx= x2-x1;
		//求两点间距即斜边L
		var L=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
		var sinA=yy/L;
		var cosA=xx/L;
		//点1，p坐标系坐标，用o坐标系坐标表示
		var x1p=x1*cosA+y1*sinA;
		var y1p=-x1*sinA+y1*cosA;
		//点2，p坐标系坐标，用o坐标系坐标表示
		var x2p=x2*cosA+y2*sinA;
		var y2p=-x2*sinA+y2*cosA;
		var pointArray=[];
		//pointArray.push(getoxy(x1p+3*L/4,y1p+L/10,sinA,cosA));
		//pointArray.push(getoxy(x1p+3*L/4,y1p-L/10,sinA,cosA));
		//var spNum=Math.pow(2,levelScale);
		var spNum=maxScale/currentScale;
console.log("缩小倍数"+spNum);
console.log("L为。。。"+L);
console.log("特定数为："+specialL/spNum);
		if(L<(specialL/spNum)){
			pointArray.push(0)
		}else{
			pointArray.push(getoxy(x2p-specialL/spNum,y1p+(specialL/3)/spNum,sinA,cosA));
			pointArray.push(getoxy(x2p-specialL/spNum,y1p-(specialL/3)/spNum,sinA,cosA));
		}
		
		return pointArray
	}