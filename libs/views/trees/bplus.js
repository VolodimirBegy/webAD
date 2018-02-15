
function BPlusTreeView(cont, prot){
	this.scale=1;	
	this.acVal=undefined;
	this.acOp=undefined;
	this.protDisplay = prot;
	this.stage = new Kinetic.Stage({
  		container: cont,
  		draggable: true,
		width: 0,
		height: 0
	}); 
}


BPlusTreeView.prototype.zoomIn=function(){
	tree.hasArrived=true;
	if(this.scale<3)this.scale=this.scale+0.1;
	tree.draw(undefined, this.acVal, this.acOp);
}

BPlusTreeView.prototype.zoomOut=function(){ 
	tree.hasArrived=true;
  	if(this.scale>0.5)this.scale=this.scale-0.1;
	tree.draw(undefined, this.acVal, this.acOp); //tree kommt nur bis hier vor!
}

BPlusTreeView.prototype.draw=function(actNode, actualValue, operation){
	
	var dOrd=2*tree.order;
	var pointerSpace =10*this.scale;
	var cellWidth= 50*this.scale;
	var nodeWidth=dOrd*cellWidth + pointerSpace; // Knotenbreite
	var ofNodeWidth=dOrd*cellWidth + cellWidth + pointerSpace; // Knotenbreite bei ueberglaufenem Knoten
	var nodeHeight = 20*this.scale; // Knotenhoehe
	var vertDist=tree.vdist*this.scale; // vertikaler Abstand zwischen den Ebenen	
	var horDist = tree.hdist*this.scale; // horizontaler Abstand zwischen den Knoten
	var startPosX = 40*this.scale; 
	var startPosY = 140*this.scale;
	var layer = new Kinetic.Layer();
	var clr = "black";
	var moveSpeed=tree.speed;
	var pauseTime=1000;
	var actVal=parseInt(actualValue);
	var op=parseInt(operation); // 1 = add, 2 = delete, 3 = search, 4=double value
	var savedOpCount=tree.opCount;
	
	var tmpNodes=[];
	var helpNode=undefined;
	var i=0, j=0;

	this.acVal=actVal;
	this.acOp=op;
	
	if(tree.root!=undefined) tmpNodes.push(tree.root); // Wurzel hinzufuegen
	if(tree.root.rightPointer!=undefined) tmpNodes.push(tree.root.rightPointer);
	while(tmpNodes[i]!=undefined){ // uebrige Knoten hinzu
		helpNode=tmpNodes[i];
		for(j=0; j<helpNode.pointers.length; j++){ 	
			if(helpNode.pointers[j]!=undefined) tmpNodes.push(helpNode.pointers[j]);
			if(helpNode.pointers[j].rightPointer!=undefined) tmpNodes.push(helpNode.pointers[j].rightPointer);	
		}	
		i++;
	}

	var level=0, oldLevel=0, childCount=0, s=0, a, b, c;
	var middleChild=undefined, middleChildLeft=undefined, middleChildRight=undefined;
	var levelHasOf=false;
	var keyCount;

	for(i=0; i<tmpNodes.length; i++){

		level=0;
		helpNode=tmpNodes[i]; // Ebene feststellen
		keyCount=tmpNodes[i].keys.length;
		while(helpNode.parent!=undefined){
			helpNode=helpNode.parent;
			level++;
		}
		if(level>oldLevel){ 
			s=0;
			levelHasOf=false;
		}
		if(keyCount>dOrd){ levelHasOf=true;}
		if(levelHasOf&&keyCount<=dOrd) tmpNodes[i].xPosition= startPosX + (nodeWidth + horDist)*s + cellWidth;
		else tmpNodes[i].xPosition= startPosX + (nodeWidth + horDist)*s;
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

			keyCount=tmpNodes[i].keys.length;
			var cellCount=dOrd;
			var helpWidth=nodeWidth;

			if(keyCount>dOrd){ 
				helpWidth=ofNodeWidth;
				cellCount++;
			}

			var nodeBox = new Kinetic.Rect({ // das Rechteck fuer den ganzen Knoten
				x: tmpNodes[i].xPosition,
				y: tmpNodes[i].yPosition,
				width: helpWidth, // Breite des Knotens
			     height: nodeHeight,
				fill: tree.color,
				stroke: 'black',
				strokeWidth: 2*this.scale,
				
			});
			layer.add(nodeBox);
		
			for(j=0; j<cellCount; j++){ // jetzt die Zellen des Blattes
					
				var cell = new Kinetic.Rect({ // Hier werden die Zellen hinzugefuegt
					x: tmpNodes[i].xPosition + cellWidth*j + pointerSpace, // Punkte, wo die Zellen beginnen
					y: tmpNodes[i].yPosition,
					width: cellWidth - pointerSpace, // breite der zellen
				     height: nodeHeight,
					fill: tree.color,
					stroke: 'black',
					strokeWidth: 2*this.scale, // liniendicke
				});
				layer.add(cell);

				if(tmpNodes[i].keys[j]!=undefined){

					clr = "black";
					if(tmpNodes[i].keys[j]==actVal && actNode == undefined){ 
						if(op==1||op==3||op==11) clr="green";
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

			if(tmpNodes[i]!=undefined && tmpNodes[i].parent!=undefined && !tmpNodes[i].isOrphan){ // jetzt die Pfeile
		
				var parX=tmpNodes[i].parent.xPosition; // x-Wert des Elternknotens
				for(j=0; j<tmpNodes[i].parent.pointers.length; j++){
					if(tmpNodes[i].parent.pointers[j]==tmpNodes[i]) break; // ermitteln, welche Nummer der Zeiger vom Elternknoten hat
				}
				parX = parX + cellWidth*j + 5; // jetzt steht der Startpunkt fest	
				var line = new Kinetic.Line({
					points: [tmpNodes[i].xPosition+cellWidth*tree.order+5, tmpNodes[i].yPosition, parX, tmpNodes[i].parent.yPosition + nodeHeight],
					stroke: 'black',
					strokeWidth: 2*this.scale,
					lineJoin: 'round',
				});
				layer.add(line);
			}
		}
	}

	// Ruhender Kreis

	if(moveSpeed==0&&actNode!=undefined){
		tree.hasArrived=true;

		clr="black";
		if(op==1||op==11) clr="#66ff33"; // hinzufuegen
		else if(op==2) clr="#ff6666"; // loeschen
		else if(op==3) clr="#00ccff"; // suchen
		var nValxPos=-15;
		if(actVal<10) nValxPos=-5;
		else if(actVal<100) nValxPos=-10;

		var cXpos=tmpNodes[0].xPosition + nodeWidth/2;
		var cYpos=tmpNodes[0].yPosition - nodeHeight;

		if(op==11){
			cXpos=actNode.xPosition + nodeWidth/2;
			cYpos=actNode.yPosition - nodeHeight;

		}	

		var circle = new Kinetic.Circle({ // Kreis
			radius: 20*this.scale,
			stroke: 'black',
			strokeWidth: 2*this.scale,
			fill: clr,
			opacity: 0.5,
		});
		var nVal = new Kinetic.Text({ // Wert im Kreis
			x: nValxPos*this.scale,
			y: -5*this.scale,
			text: actVal,
			fontSize: 15*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
		var ball = new Kinetic.Group({ // Kreis + Wert
			x: cXpos,
			y: cYpos,
			draggable: true
		});
		
		ball.add(circle);
		ball.add(nVal);
		layer.add(ball);
	}
	
	var height=startPosY + (vertDist+2*nodeHeight)*(level+1);
	this.stage.setWidth(startPosX + horDist + s*(nodeWidth+horDist) + 200 * this.scale); // Breite und Hoehe der Flaeche festlegen
	this.stage.setHeight(height);
	this.stage.removeChildren();
	this.stage.add(layer);	

	//Protokoll

	var hist, histOp, histVal, elCount, clr="black", protValues=""; 
	for(i=0; i<tree.history.length; i++){
		hist=tree.history[i];
		histVal=hist.substr(2);
		histOp=hist.charAt(0);
		if(histOp=='r') clr = "red";
		else if(histOp=='a') clr = "green";
		elCount = i+1;
		protValues = protValues + "<div style='color:" + clr + "'>" +  elCount + ". " + histVal +"</div>";
	}
	this.protDisplay.innerHTML=protValues;

	// Wandernder Kreis

	if(actNode!=undefined&&moveSpeed!=0){ 

		clr="black";
		if(op==1) clr="#66ff33"; // hinzufuegen
		else if(op==2) clr="#ff6666"; // loeschen
		else if(op==3) clr="#00ccff"; // suchen
		var nValxPos=-15;
		if(actVal<10) nValxPos=-5;
		else if(actVal<100) nValxPos=-10;
		
		var circle = new Kinetic.Circle({ // Kreis
			radius: 20*this.scale,
			stroke: 'black',
			strokeWidth: 2*this.scale,
			fill: clr,
			opacity: 0.5,
		});
		var nVal = new Kinetic.Text({ // Wert im Kreis
			x: nValxPos*this.scale,
			y: -5*this.scale,
			text: actVal,
			fontSize: 15*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
		var ball = new Kinetic.Group({ // Kreis + Wert
			x: tmpNodes[0].xPosition + nodeWidth/2,
			y: tmpNodes[0].yPosition - nodeHeight,	
			draggable: true
		});
		
		ball.add(circle);
		ball.add(nVal);
		layer.add(ball);


		if(moveSpeed!=0){

			var visitedNodes=[];
			var xValues=[];
			var yValues=[];
			var dists=[];
			var horWay=0;
			var v=0, distHelp=0, distHelpX=0, distHelpY=0, helpX=0, helpY=0;
		
			for(i=tmpNodes.length-1; i>=0; i--){

				helpNode=tmpNodes[i];
				if(helpNode==actNode){ 
					visitedNodes.push(helpNode); 
					while(helpNode.parent!=undefined && helpNode.parent!=tree.root){
						visitedNodes.unshift(helpNode.parent);// Alle Knoten auf dem Pfad speichern
						helpNode=helpNode.parent;
					}
					finished=true;
					break;
				}
			}

			visitedNodes.unshift(tree.root);

			for(i=0; i<visitedNodes.length; i++){

				helpNode=visitedNodes[i];
				xValues.push(helpNode.xPosition + nodeWidth/2);
				yValues.push(helpNode.yPosition - nodeHeight);

				horWay=0;
				for(v=0; v<helpNode.keys.length; v++) if(actVal<helpNode.keys[v]) break;
				horWay=cellWidth*v+pointerSpace/2;
	
				if(v!=tree.order){
					xValues.push(helpNode.xPosition+horWay); // Punkt an der oberen Kante
					yValues.push(helpNode.yPosition-nodeHeight); 
				}
				if(helpNode!=actNode){
					xValues.push(helpNode.xPosition+horWay); // Punkt an der unteren Kante 
					yValues.push(helpNode.yPosition);
				}
			}

			for(i=1; i<xValues.length; i++){
				distHelpX=xValues[i]-xValues[i-1];
				distHelpY=yValues[i]-yValues[i-1];
				distHelp=Math.sqrt(distHelpX*distHelpX+distHelpY*distHelpY);
				dists.push(distHelp);
			}

			i=1;
			function moveCircle(){
				var tween = new Kinetic.Tween({
					node: ball,
					x: xValues[i],
					y: yValues[i],
					duration: dists[i-1]/moveSpeed,
					onFinish: function(){
						i++;

						setTimeout(function(){
							var inval1=setInterval(function(){

								if(savedOpCount!=tree.opCount) clearInterval(inval1);

 								if(!tree.paused){

									if(savedOpCount==tree.opCount){
										if(xValues[i]!=undefined)  moveCircle();	
										else tree.hasArrived=true; 
									}
									clearInterval(inval1);

								}
							}, 100);
						}, pauseTime);
						
					}
				});
				tween.play();	

			}
			if(tmpNodes.length>1) moveCircle();
		}
	}
}

