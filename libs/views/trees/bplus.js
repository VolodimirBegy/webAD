
function BPlusTreeView(mod, cont, contSec){
	this.scale=1;
	this.model=mod;
	this.elementDisplay = contSec;

	this.stage = new Kinetic.Stage({
  		container: cont,
  		draggable: true,
		width: 0,
		height: 0
	}); 
}


BPlusTreeView.prototype.zoomIn=function(){
	if(this.scale<3)this.scale=this.scale+0.1;
	if(!this.model.runningOp) this.draw();
}

BPlusTreeView.prototype.zoomOut=function(){
  	if(this.scale>0.5)this.scale=this.scale-0.1;
	if(!this.model.runningOp) this.draw();
}

BPlusTreeView.prototype.draw=function(actNode, actualValue, operation, contSec){
	
	var pointerSpace =10*this.scale;
	var cellWidth= 50*this.scale;
	var nodeWidth=2*this.model.order*cellWidth + pointerSpace; // Knotenbreite
	var nodeHeight = 20*this.scale; // Knotenhoehe
	var vertDist=this.model.vdist*this.scale; // vertikaler Abstand zwischen den Ebenen	
	var horDist = this.model.hdist*this.scale; // horizontaler Abstand zwischen den Knoten
	var startPosX = 40*this.scale; //140
	var startPosY = 140*this.scale;
	var layer = new Kinetic.Layer();
	var clr = "black";
	var moveSpeed=this.model.speed;
	var actVal=parseInt(actualValue);
	var op=parseInt(operation); // 1 = add, 2 = delete, 3 = search, 4=double value
	
	var tmpNodes=[];
	var helpNode=undefined;
	var i=0, j=0;

	
	if(this.model.root!=undefined) tmpNodes.push(this.model.root); // Wurzel hinzufuegen
	while(tmpNodes[i]!=undefined){ // uebrige Knoten hinzu
		helpNode=tmpNodes[i];
		for(j=0; j<helpNode.pointers.length; j++){ 	
			if(helpNode.pointers[j]!=undefined) tmpNodes.push(helpNode.pointers[j]);
		}		
		i++;
	}

	var level=0, oldLevel=0, childCount=0, s=0, a, b, c;
	var middleChild=undefined, middleChildLeft=undefined, middleChildRight=undefined;

	for(i=0; i<tmpNodes.length; i++){

		level=0;
		helpNode=tmpNodes[i]; // Ebene feststellen
		while(helpNode.parent!=undefined){
			helpNode=helpNode.parent;
			level++;
		}
		if(level>oldLevel) s=0;
		tmpNodes[i].xPosition= startPosX + (nodeWidth + horDist)*s;
		tmpNodes[i].yPosition=startPosY + (vertDist+nodeHeight)*level;
		s++;
		oldLevel=level;
	}

	for(i=tmpNodes.length-1; i>=0; i--){

		childCount=tmpNodes[i].pointers.length;
		if(childCount>0){

			if(childCount%2!=0){ 
				middleChild=tmpNodes[i].pointers[(childCount-1)/2]; // mittleres Kind ermitteln
				tmpNodes[i].xPosition=middleChild.xPosition;
			}else{
				middleChildLeft=tmpNodes[i].pointers[childCount/2-1]; // mittleres Kind ermitteln
				middleChildRight=tmpNodes[i].pointers[childCount/2];
				a=middleChildLeft.xPosition + nodeWidth;
				b=middleChildRight.xPosition;
				c=(b-a)*0.5;
				tmpNodes[i].xPosition= a + c - nodeWidth * 0.5;
			}
		}
	}

	for(var i=0; i<tmpNodes.length; i++){ // alle Knoten durchgehen
		if(tmpNodes[i]!=undefined){

			var nodeBox = new Kinetic.Rect({ // das Rechteck fuer den ganzen Knoten
				x: tmpNodes[i].xPosition,
				y: tmpNodes[i].yPosition,
				width: nodeWidth, // Breite des Knotens
			     height: nodeHeight,
				fill: this.model.color,
				stroke: 'black',
				strokeWidth: 2*this.scale,
				
			});
			layer.add(nodeBox);
		
			for(var j=0; j<this.model.order*2; j++){ // jetzt die Zellen des Blattes
					
				var cell = new Kinetic.Rect({ // Hier werden die Zellen hinzugefuegt
					x: tmpNodes[i].xPosition + cellWidth*j + pointerSpace, // Punkte, wo die Zellen beginnen
					y: tmpNodes[i].yPosition,
					width: cellWidth - pointerSpace, // breite der zellen
				     height: nodeHeight,
					fill: this.model.color,
					stroke: 'black',
					strokeWidth: 2*this.scale, // liniendicke
				});
				layer.add(cell);

				if(tmpNodes[i].keys[j]!=undefined){

					clr = "black";
					if(tmpNodes[i].keys[j]==actVal && actNode == undefined){ 
						if(op==1) clr="green"; // neu hinzugefuegter Wert ist gruen
						else if(op==3) clr="green";
						else if(op==4) clr="red";
					}
				
					var val = new Kinetic.Text({
						x: cell.getX()+3*this.scale,
						y: cell.getY()+3*this.scale,
						text: tmpNodes[i].keys[j],
						fontSize: 15*this.scale,
						fontFamily: 'Calibri',
						fill: clr,
						width: cellWidth,
					});
					layer.add(val);
				}	
			} 

			if(tmpNodes[i]!=undefined && tmpNodes[i].parent!=undefined){ // jetzt die Pfeile
		
				var parX=tmpNodes[i].parent.xPosition; // x-Wert des Elternknotens
				var j;
				for(j=0; j<tmpNodes[i].parent.pointers.length; j++){
					if(tmpNodes[i].parent.pointers[j]==tmpNodes[i]) break; // ermitteln, welche Nummer der Zeiger vom Elternknoten hat
				}
				parX = parX + cellWidth*j + 5; // jetzt steht der Startpunkt fest	
				var line = new Kinetic.Line({
					points: [tmpNodes[i].xPosition + cellWidth*this.model.order + 5, tmpNodes[i].yPosition, parX, tmpNodes[i].parent.yPosition + nodeHeight],
					stroke: 'black',
					strokeWidth: 2*this.scale,
					lineJoin: 'round',
				});
				layer.add(line);
			}
		}
	}

	var boxHeight=(this.model.history.length * 20 + 5)*this.scale; // Die Box mit dem Protokoll hinzufuegen
	var distBottom=100*this.scale;
/*
	var protocolBox = new Kinetic.Rect({ 
			x: 20*this.scale,
			y: 20*this.scale,
			width: 90*this.scale, 
		     height: boxHeight,
			stroke: 'black',
			strokeWidth: 2*this.scale,
	});
	layer.add(protocolBox);


	var val;
	var hist, histOp, histVal, elCount;
	clr="black";

	for(i=0; i<this.model.history.length; i++){ // Die Zeilen der Protokoll-Box. Hier wird auf die Geschichte zugegriffen

		hist=this.model.history[i];
		histOp=hist.charAt(0);
		histVal=hist.substr(2);

		if(histOp=='r') clr = "red";
		else if(histOp=='a') clr = "green";

		val = new Kinetic.Text({
			x: 25*this.scale,
			y: 25*this.scale + i * 20*this.scale,
			text: i+1 + ". " + histVal,
			fontSize: 15*this.scale,
			fontFamily: 'Calibri',
			fill: clr,
			width: 90*this.scale,
		});
		layer.add(val);
	}*/
			
	var height=startPosY + (vertDist+2*nodeHeight)*(level+1);
	//if(height<(boxHeight+distBottom)) height=boxHeight+distBottom;
	this.stage.setWidth(startPosX + horDist + s*(nodeWidth+horDist) + 200 * this.scale); // Breite und Hoehe der Flaeche festlegen
	this.stage.setHeight(height);
	this.stage.removeChildren();
	this.stage.add(layer);	

	var hist, histOp, histVal, elCount, clr="black", protValues="";

	for(i=0; i<this.model.history.length; i++){

		hist=this.model.history[i];
		histVal=hist.substr(2);
		histOp=hist.charAt(0);
		if(histOp=='r') clr = "red";
		else if(histOp=='a') clr = "green";
		elCount = i+1;
		protValues = protValues + "<div style='color:" + clr + "'>" +  elCount + ". " + histVal +"</div>";

	}

	this.elementDisplay.innerHTML=protValues;

	if(actNode!=undefined){ // wandernder Kreis bei erster Zeichnung

		clr="black";
		if(op==1) clr="#66ff33"; // hinzufuegen
		else if(op==2) clr="#ff6666"; // loeschen
		else if(op==3) clr="#00ccff"; // suchen

		var nValxPos=-15;
		if(actVal<10) nValxPos=-5;
		else if(actVal<100) nValxPos=-10;
		
		var circle = new Kinetic.Circle({
			radius: 20*this.scale,
			stroke: 'black',
			strokeWidth: 2*this.scale,
			fill: clr,
		});

		var nVal = new Kinetic.Text({
			x: nValxPos*this.scale,
			y: -5*this.scale,
			text: actVal,
			fontSize: 15*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});

		var ball = new Kinetic.Group({
			x: tmpNodes[0].xPosition + nodeWidth/2,
			y: tmpNodes[0].yPosition - nodeHeight,	
			draggable: true
		});
		
		ball.add(circle);
		ball.add(nVal);
		layer.add(ball);

		var visitedNodes=[];
		var tweens=[];
		
		for(i=tmpNodes.length-1; i>=0; i--){

			helpNode=tmpNodes[i];
			if(helpNode==actNode){ 
				visitedNodes.push(helpNode);
				while(helpNode.parent!=undefined && helpNode.parent!=this.model.root){
					visitedNodes.unshift(helpNode.parent);
					helpNode=helpNode.parent;
				}
				finished=true;
				break;
			}
		}
		i=0;	
		function moveCircle(){
			var tween = new Kinetic.Tween({
				node: ball,
				x: visitedNodes[i].xPosition + nodeWidth/2,
				y: visitedNodes[i].yPosition - nodeHeight,
				duration: moveSpeed,
				onFinish: function(){
					i++;
					if(visitedNodes[i]!=undefined){
						setTimeout(function(){ 
							moveCircle();
						}, 1000);
					}
				}
			});
			tween.play();
		}
		if(tmpNodes.length>1) moveCircle();
	}
}

