/*
 Software License Agreement (BSD License)
 http://wwwlab.cs.univie.ac.at/~a1100570/webAD/
 Copyright (c), Volodimir Begy
 All rights reserved.


 Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following condition is met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

function WeightedDirectedGraphView(_model){
	this.model=_model;
	this.scale=1;
}

function intL(number) {
	if(number!=undefined)
		return number.toString().length;
	else return 0;
}

WeightedDirectedGraphView.prototype.zoomIn=function(cont){
  if(this.scale<2.5)this.scale=this.scale+0.1;
  this.draw(cont);
}

WeightedDirectedGraphView.prototype.zoomOut=function(cont){
  if(this.scale>0.5)this.scale=this.scale-0.1;
  this.draw(cont);
}

WeightedDirectedGraphView.prototype.draw=function(cont){
	
	var _radius=25*this.scale;
	
	var layer = new Kinetic.Layer();
	var lines=[];
	var weights=[];
	var circles=[];
	var vals=[];

	var H=undefined;
	var W=undefined;
	var drawn=[];
	
	if(this.model.S!=undefined && this.model.S.length>0){
	
		var outerX=0;
		for(var i=0;i<this.model.nodes.length;i++){
			if(this.model.nodes[i].xPosition>outerX)
				outerX=this.model.nodes[i].xPosition;
		}
		
		outerX+=2*_radius;
		
		
		
		var dist = new Kinetic.Rect({
				x: outerX,
				y: 50*this.scale,
				width: 120*this.scale,
				height: 50*this.scale,
				fill: 'white',
				stroke: 'black',
				strokeWidth: 2*this.scale
		});

		
		
		
		var dt = new Kinetic.Text({
			x: dist.getX()+5*this.scale,
			y: dist.getY()+dist.getHeight()/2,
			text: "Distance",
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
		
		var processed = new Kinetic.Rect({
			x: outerX,
			y: dist.getY()+dist.getHeight(),
			width: 120*this.scale,
			height: 50*this.scale,
			fill: 'white',
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		var pt = new Kinetic.Text({
			x: processed.getX()+5*this.scale,
			y: processed.getY()+processed.getHeight()/2,
			text: "Processed?",
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
		
		var previous = new Kinetic.Rect({
			x: outerX,
			y: processed.getY()+processed.getHeight(),
			width: 120*this.scale,
			height: 50*this.scale,
			fill: 'white',
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		var prt = new Kinetic.Text({
			x: previous.getX()+5*this.scale,
			y: previous.getY()+previous.getHeight()/2,
			text: "Previous",
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
		var lastX=previous.getX()+previous.getWidth();
		
		//nodes list:
		for(var i=0;i<this.model.nodes.length;i++){
			var nodeRect = new Kinetic.Rect({
				x: lastX,
				y: 0,
				width: 50*this.scale,
				height: 50*this.scale,
				fill: 'white',
				stroke: 'black',
				strokeWidth: 2*this.scale
			});
			
			var nodeText = new Kinetic.Text({
				x: nodeRect.getX()+5*this.scale,
				y: nodeRect.getY()+nodeRect.getHeight()/2,
				text: this.model.nodes[i].index,
				fontSize: 25*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
			});
			
			var distanceRect = new Kinetic.Rect({
				x: lastX,
				y: 50*this.scale,
				width: 50*this.scale,
				height: 50*this.scale,
				fill: 'white',
				stroke: 'black',
				strokeWidth: 2*this.scale
			});
			
			var fSize=25*this.scale;
			
			var dTxt=""+this.model.dist[this.model.nodes[i].index];
			if(dTxt==""+Number.MAX_VALUE)
				dTxt="∞";
			else{
				if(intL(this.model.dist[this.model.nodes[i].index])>3){
					var len=intL(this.model.dist[this.model.nodes[i].index]);
					var diff=len-3;
					fSize=(25-(25/4*diff))*this.scale;
				}
			}
	  	  	
			var distanceText = new Kinetic.Text({
				x: distanceRect.getX()+5*this.scale,
				y: distanceRect.getY()+distanceRect.getHeight()/2,
				text: dTxt,
				fontSize: fSize,
				fontFamily: 'Calibri',
				fill: 'black',
			});
			
			var pfill="lime";
			var procText="No";
			for(var j=0;j<this.model.S.length;j++){
				if(this.model.S[j].index==this.model.nodes[i].index){
					pfill="#00FFFF";procText="Yes";break
				}
			}
			
			var processedRect = new Kinetic.Rect({
				x: lastX,
				y: 100*this.scale,
				width: 50*this.scale,
				height: 50*this.scale,
				fill: pfill,
				stroke: 'black',
				strokeWidth: 2*this.scale
			});
			
			var processedText = new Kinetic.Text({
				x: processedRect.getX()+5*this.scale,
				y: processedRect.getY()+processedRect.getHeight()/2,
				text: procText,
				fontSize: 25*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
			});
			
			var prevRect = new Kinetic.Rect({
				x: lastX,
				y: 150*this.scale,
				width: 50*this.scale,
				height: 50*this.scale,
				fill: 'white',
				stroke: 'black',
				strokeWidth: 2*this.scale
			});
			
			var pTxt="-";
			
			if(this.model.prev[this.model.nodes[i].index]!=undefined){
				pTxt=this.model.prev[this.model.nodes[i].index].index;
			}
			
			var prevText = new Kinetic.Text({
				x: prevRect.getX()+5*this.scale,
				y: prevRect.getY()+prevRect.getHeight()/2,
				text: pTxt,
				fontSize: 25*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
			});
			
			lastX=nodeRect.getX()+nodeRect.getWidth();
			layer.add(nodeRect);
			layer.add(nodeText);
			layer.add(distanceRect);
			layer.add(distanceText);
			layer.add(processedRect);
			layer.add(processedText);
			layer.add(prevRect);
			layer.add(prevText);
		}
		
		W=lastX+100*this.scale;
		
		layer.add(dist);
		layer.add(processed);
		layer.add(previous);
		
		layer.add(dt);
		layer.add(pt);
		layer.add(prt);
		
	}
	
	for(var i=0;i<this.model.edges.length;i++){
	
		var exists=false;
		
		var on=undefined;
		var tn=undefined;
		
		for(var j=0;j<drawn.length;j++){
			if(drawn[j]==this.model.edges[i].u){
				exists=true;break;
			}
		}
		
		var xFrom=this.model.edges[i].u.xPosition;
		var yFrom=this.model.edges[i].u.yPosition;
		
		if(!exists){
		
			drawn.push(this.model.edges[i].u);
			
			var circleFrom = new Kinetic.Circle({
				x: xFrom,
				y: yFrom,
				radius:_radius,
				fill: this.model.edges[i].u.color,
				stroke: 'black',
				draggable:true,
				strokeWidth: 2*this.scale
			});
			
			var valFrom = new Kinetic.Text({
				x: circleFrom.getX()-_radius,
				y: circleFrom.getY()-_radius/4,
				text: this.model.edges[i].u.index,
				fontSize: 15*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
				width:_radius*2,
				draggable:true,
				align:'center'
			});
			
			circleFrom.val=valFrom;
			valFrom.circle=circleFrom;
			
			v=this;	
			
			valFrom.on('dragmove', function() {
				for(var k=0;k<this.circle.lines.length;k++){
					//window.alert("in1");
					var xTo=undefined;
					var xFrom=undefined;
					var yTo=undefined;
					var xFrom=undefined;
					var headlen = 15;
					if(this.circle.lines[k].on==this.circle){
						xFrom=parseInt(this.circle.getX());
						yFrom=parseInt(this.circle.getY());
						xTo=parseInt(this.circle.lines[k].tn.getX());
						yTo=parseInt(this.circle.lines[k].tn.getY());
						
					    var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
					}
					else if(this.circle.lines[k].tn==this.circle){
						xTo=parseInt(this.circle.getX());
						yTo=parseInt(this.circle.getY());
						xFrom=parseInt(this.circle.lines[k].on.getX());
						yFrom=parseInt(this.circle.lines[k].on.getY());
						
						var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
					}
					
					var xDiff=xTo-xFrom;
					if(Math.abs(xDiff)>_radius){
					    if(xDiff>0){xDiff=_radius;}
					    else{xDiff=-_radius;}
					 }
					 
					 xTo=xTo-xDiff;
					 if(xDiff>0)
						 this.circle.weights[k].setX(xTo-25);
					 else
						 this.circle.weights[k].setX(xTo+10);
					 
					 var yDiff=yTo-yFrom;
					 if(Math.abs(yDiff)>_radius){
					    if(yDiff>0){yDiff=_radius;}
					    else{yDiff=-_radius;}
					 }
					 
					 yTo=yTo-yDiff;
					 if(yDiff>0)
						 this.circle.weights[k].setY(yTo-30);
					 else
						 this.circle.weights[k].setY(yTo+10);
					 
					 this.circle.lines[k].setPoints([xFrom, yFrom, xTo, yTo, xTo-headlen*Math.cos(angle-Math.PI/6),yTo-headlen*Math.sin(angle-Math.PI/6),xTo, yTo, xTo-headlen*Math.cos(angle+Math.PI/6),yTo-headlen*Math.sin(angle+Math.PI/6)]); 
				}
				
				v.model.nodes[v.model.matrixLink[parseInt(this.getText())]].xPosition=parseInt(this.circle.getX());
				v.model.nodes[v.model.matrixLink[parseInt(this.getText())]].yPosition=parseInt(this.circle.getY());
				
				this.circle.setX(parseInt(this.getX())+_radius);
				this.circle.setY(parseInt(this.getY())+_radius/4);
		    });
			
			circles.push(circleFrom);
			vals.push(valFrom);
			
			on=circleFrom;
		}
		else{
			for(var j=0;j<circles.length;j++){
				if(circles[j].val.getText()==this.model.edges[i].u.index){
					on=circles[j];break;
				}
			}
		}
		
		exists=false;
			
		for(var j=0;j<drawn.length;j++){
			if(drawn[j]==this.model.edges[i].v){
				exists=true;break;
			}
		}
			
		var xTo=this.model.edges[i].v.xPosition;
		var yTo=this.model.edges[i].v.yPosition;
			
		if(!exists){
			
			drawn.push(this.model.edges[i].v);
				
			var circleTo = new Kinetic.Circle({
				x: xTo,
				y: yTo,
				radius:_radius,
				fill: this.model.edges[i].v.color,
				stroke: 'black',
				draggable:true,
				strokeWidth: 2*this.scale
			});
				
			var valTo = new Kinetic.Text({
				x: circleTo.getX()-_radius,
				y: circleTo.getY()-_radius/4,
				text: this.model.edges[i].v.index,
				fontSize: 15*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
				width:_radius*2,
				draggable:true,
				align:'center'
			});	
			
			circleTo.val=valTo;
			valTo.circle=circleTo;
			
			v=this;	
			
			valTo.on('dragmove', function() {
				for(var k=0;k<this.circle.lines.length;k++){
					//window.alert("in1");
					var xTo=undefined;
					var xFrom=undefined;
					var yTo=undefined;
					var xFrom=undefined;
					var headlen = 15;
					if(this.circle.lines[k].on==this.circle){
						xFrom=parseInt(this.circle.getX());
						yFrom=parseInt(this.circle.getY());
						xTo=parseInt(this.circle.lines[k].tn.getX());
						yTo=parseInt(this.circle.lines[k].tn.getY());
						
					    var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
					}
					else if(this.circle.lines[k].tn==this.circle){
						xTo=parseInt(this.circle.getX());
						yTo=parseInt(this.circle.getY());
						xFrom=parseInt(this.circle.lines[k].on.getX());
						yFrom=parseInt(this.circle.lines[k].on.getY());
						
						var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
					}
					
					var xDiff=xTo-xFrom;
					if(Math.abs(xDiff)>_radius){
					    if(xDiff>0){xDiff=_radius;}
					    else{xDiff=-_radius;}
					 }
					 
					 xTo=xTo-xDiff;
					 if(xDiff>0)
						 this.circle.weights[k].setX(xTo-25);
					 else
						 this.circle.weights[k].setX(xTo+10);
					 
					 var yDiff=yTo-yFrom;
					 if(Math.abs(yDiff)>_radius){
					    if(yDiff>0){yDiff=_radius;}
					    else{yDiff=-_radius;}
					 }
					 
					 yTo=yTo-yDiff;
					 if(yDiff>0)
						 this.circle.weights[k].setY(yTo-30);
					 else
						 this.circle.weights[k].setY(yTo+10);
					 this.circle.lines[k].setPoints([xFrom, yFrom, xTo, yTo, xTo-headlen*Math.cos(angle-Math.PI/6),yTo-headlen*Math.sin(angle-Math.PI/6),xTo, yTo, xTo-headlen*Math.cos(angle+Math.PI/6),yTo-headlen*Math.sin(angle+Math.PI/6)]); 
				}
				
				v.model.nodes[v.model.matrixLink[parseInt(this.getText())]].xPosition=parseInt(this.circle.getX());
				v.model.nodes[v.model.matrixLink[parseInt(this.getText())]].yPosition=parseInt(this.circle.getY());

				this.circle.setX(parseInt(this.getX())+_radius);
				this.circle.setY(parseInt(this.getY())+_radius/4);
		    });
			
			circles.push(circleTo);
			vals.push(valTo);
			
			tn=circleTo;
		}
		
		else{
			for(var j=0;j<circles.length;j++){
				if(circles[j].val.getText()==this.model.edges[i].v.index){
					tn=circles[j];break;
				}
			}
		}
		
		var headlen = 15;   // how long you want the head of the arrow to be, you could calculate this as a fraction of the distance between the points as well.
	    var angle = Math.atan2(yTo-yFrom,xTo-xFrom);

	    var xDiff=tn.getX()-xFrom;
	    if(Math.abs(xDiff)>_radius){
	    	if(xDiff>0)xDiff=_radius;
	    	else xDiff=-_radius;
	    }
	    
	    xTo=xTo-xDiff;
	    
	    var yDiff=tn.getY()-yFrom;
	    if(Math.abs(yDiff)>_radius){
	    	if(yDiff>0)yDiff=_radius;
	    	else yDiff=-_radius;
	    }
	    
	    yTo=yTo-yDiff;
	    var col=this.model.edges[i].color;
		var _stroke=0;
		if(col=="#6699FF")
			_stroke=1*this.scale;
		else if(col=="black")
			_stroke=2*this.scale;
		else
			_stroke=5*this.scale;
	    
	    var line = new Kinetic.Line({
	        points: [xFrom, yFrom, xTo, yTo, xTo-headlen*Math.cos(angle-Math.PI/6),yTo-headlen*Math.sin(angle-Math.PI/6),xTo, yTo, xTo-headlen*Math.cos(angle+Math.PI/6),yTo-headlen*Math.sin(angle+Math.PI/6)],
	        stroke: this.model.edges[i].color,
			strokeWidth: _stroke,
			shapeType: "line",
			lineCap: 'round',
			lineJoin: 'round'
	    });

		
		line.on=on;
		line.tn=tn;
		
		lines.push(line);
		
		var wX=undefined
		var wY=undefined;
		
		if(xTo>xFrom)
			var wX=xTo+10;
		else
			var wX=xTo-25;
		
		if(yTo>yFrom)
			var wY=yTo-30;
		else
			var wY=yTo+10;
		
		if(yDiff>0)
			 wY=yTo-30;
		 else
			 wY=yTo+10;
		
		if(xDiff>0)
			 wX=xTo-25;
		 else
			 wX=xTo+10;
  	  	
		var fSize=25*this.scale;
		if(intL(this.model.edges[i].weight)>3){
			var len=intL(this.model.edges[i].weight);
			var diff=len-3;
			fSize=(25-(25/4*diff))*this.scale;
		}
		
		var weight = new Kinetic.Text({
			x: wX,
			y: wY,
			text: this.model.edges[i].weight,
			fontSize: fSize,
			fontFamily: 'Calibri',
			fill: 'orange'//,
			//width:_radius*2,
			//align:'center'
		});
		
		weights.push(weight);
		
		if(on.connectedTo==undefined){
			on.connectedTo=[];
			on.lines=[];
			on.weights=[];
		}
		
		on.connectedTo.push(tn);
		on.lines.push(line);
		on.weights.push(weight);
		
		if(tn.connectedTo==undefined){
			tn.connectedTo=[];
			tn.lines=[];
			tn.weights=[];
			tn.connectedTo.push(on);
			tn.lines.push(line);
			tn.weights.push(weight);
		}
		
		else{
			var alreadyConnected;
			for(var j=0;j<tn.lines;j++){
				if(tn.lines[j].tn==on){
					alreadyConnected=true;
				}
			}
			if(!alreadyConnected){
				tn.connectedTo.push(on);
				tn.lines.push(line);
				tn.weights.push(weight);
			}
		}
		
		v=this;	
		
		on.on('dragmove', function() {
			for(var k=0;k<this.lines.length;k++){
				//window.alert("in1");
				var xTo=undefined;
				var xFrom=undefined;
				var yTo=undefined;
				var xFrom=undefined;
				var headlen = 15;
				if(this.lines[k].on==this){
					xFrom=this.getX();
					yFrom=this.getY();
					xTo=this.lines[k].tn.getX();
					yTo=this.lines[k].tn.getY();
					
				    var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
				}
				else if(this.lines[k].tn==this){
					xTo=this.getX();
					yTo=this.getY();
					xFrom=this.lines[k].on.getX();
					yFrom=this.lines[k].on.getY();
					
					var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
				}
				
				var xDiff=xTo-xFrom;
				if(Math.abs(xDiff)>_radius){
				    if(xDiff>0){xDiff=_radius;}
				    else{xDiff=-_radius;}
				 }
				 
				 xTo=xTo-xDiff;
				 if(xDiff>0)
					 this.weights[k].setX(xTo-25);
				 else
					 this.weights[k].setX(xTo+10);
				 
				 var yDiff=yTo-yFrom;
				 if(Math.abs(yDiff)>_radius){
				    if(yDiff>0){yDiff=_radius;}
				    else{yDiff=-_radius;}
				 }
				 
				 yTo=yTo-yDiff;
				 if(yDiff>0)
					 this.weights[k].setY(yTo-30);
				 else
					 this.weights[k].setY(yTo+10);
				 this.lines[k].setPoints([xFrom, yFrom, xTo, yTo, xTo-headlen*Math.cos(angle-Math.PI/6),yTo-headlen*Math.sin(angle-Math.PI/6),xTo, yTo, xTo-headlen*Math.cos(angle+Math.PI/6),yTo-headlen*Math.sin(angle+Math.PI/6)]); 
			}
			
			v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].xPosition=parseInt(this.getX());
			v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].yPosition=parseInt(this.getY());
			
			this.val.setX(parseInt(this.getX())-_radius);
			this.val.setY(this.getY()-_radius/4);
	    });
		
		tn.on('dragmove', function() {
			for(var k=0;k<this.lines.length;k++){
				//window.alert("in1");
				var xTo=undefined;
				var xFrom=undefined;
				var yTo=undefined;
				var xFrom=undefined;
				var headlen = 15;
				if(this.lines[k].on==this){
					xFrom=this.getX();
					yFrom=this.getY();
					xTo=this.lines[k].tn.getX();
					yTo=this.lines[k].tn.getY();
					
				    var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
				}
				else if(this.lines[k].tn==this){
					xTo=this.getX();
					yTo=this.getY();
					xFrom=this.lines[k].on.getX();
					yFrom=this.lines[k].on.getY();
					
					var angle = Math.atan2(yTo-yFrom,xTo-xFrom);
				}
				
				var xDiff=xTo-xFrom;
				if(Math.abs(xDiff)>_radius){
				    if(xDiff>0){xDiff=_radius;}
				    else{xDiff=-_radius;}
				 }
				 
				 xTo=xTo-xDiff;
				 if(xDiff>0)
					 this.weights[k].setX(xTo-25);
				 else
					 this.weights[k].setX(xTo+10);
				 
				 var yDiff=yTo-yFrom;
				 if(Math.abs(yDiff)>_radius){
				    if(yDiff>0){yDiff=_radius;}
				    else{yDiff=-_radius;}
				 }
				 
				 yTo=yTo-yDiff;
				 if(yDiff>0)
					 this.weights[k].setY(yTo-30);
				 else
					 this.weights[k].setY(yTo+10);
				 this.lines[k].setPoints([xFrom, yFrom, xTo, yTo, xTo-headlen*Math.cos(angle-Math.PI/6),yTo-headlen*Math.sin(angle-Math.PI/6),xTo, yTo, xTo-headlen*Math.cos(angle+Math.PI/6),yTo-headlen*Math.sin(angle+Math.PI/6)]);
			}
			
			v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].xPosition=parseInt(this.getX());
			v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].yPosition=parseInt(this.getY());
			
			this.val.setX(parseInt(this.getX())-_radius);
			this.val.setY(this.getY()-_radius/4);
	    });
	}

	for(var i=0;i<lines.length;i++){
		layer.add(lines[i]);
	}
	
	for(var i=0;i<weights.length;i++){
		layer.add(weights[i]);
	}
	
	for(var i=0;i<circles.length;i++){
		layer.add(circles[i]);
		layer.add(vals[i]);
	}
	
	//layer.add(group);
	var w=(25+75*this.model.gridSize)*this.scale;
	var h=(25+75*this.model.gridSize)*this.scale;
	
	if(w<1000)w=1000;
	if(h<500)h=500
	
	if(H>h)h=H;
	if(W>w)w=W;
  	var stage = new Kinetic.Stage({
  		container: cont,
		width: w,
		height: h,
	}); 
	stage.add(layer);
						  
}