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
					this.circle.lines[k].setPoints([this.circle.getX(),this.circle.getY(),this.circle.connectedTo[k].getX(),this.circle.connectedTo[k].getY()]);
				}
				
				for(var k=0;k<this.circle.weights.length;k++){
					this.circle.weights[k].setX((this.circle.getX()+this.circle.connectedTo[k].getX())/2+(this.circle.getX()+this.circle.connectedTo[k].getX())/3);
					this.circle.weights[k].setY((this.circle.getY()+this.circle.connectedTo[k].getY())/2+(this.circle.getY()+this.circle.connectedTo[k].getY())/3);
				}
				
				v.model.nodes[v.model.matrixLink[parseInt(this.circle.val.getText())]].xPosition=parseInt(this.circle.getX());
				v.model.nodes[v.model.matrixLink[parseInt(this.circle.val.getText())]].yPosition=parseInt(this.circle.getY());
				var _index=v.model.nodes[v.model.matrixLink[parseInt(this.circle.val.getText())]].index;

				
				for(var k=0;k<v.model.nodes.length;k++){
					for(var p=0;p<v.model.nodes[k].connectedTo.length;p++){
						if(v.model.nodes[k].connectedTo[p].index==_index){
							v.model.nodes[k].connectedTo[p].xPosition=this.circle.getX();
							v.model.nodes[k].connectedTo[p].yPosition=this.circle.getY();
						}
					}
				}
				
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
					this.circle.lines[k].setPoints([this.circle.getX(),this.circle.getY(),this.circle.connectedTo[k].getX(),this.circle.connectedTo[k].getY()]);
				}
				
				for(var k=0;k<this.circle.weights.length;k++){
					this.circle.weights[k].setX((this.circle.getX()+this.circle.connectedTo[k].getX())/2+(this.circle.getX()+this.circle.connectedTo[k].getX())/3);
					this.circle.weights[k].setY((this.circle.getY()+this.circle.connectedTo[k].getY())/2+(this.circle.getY()+this.circle.connectedTo[k].getY())/3);
				}
				
				v.model.nodes[v.model.matrixLink[parseInt(this.circle.val.getText())]].xPosition=parseInt(this.circle.getX());
				v.model.nodes[v.model.matrixLink[parseInt(this.circle.val.getText())]].yPosition=parseInt(this.circle.getY());
				var _index=v.model.nodes[v.model.matrixLink[parseInt(this.circle.val.getText())]].index;

				
				for(var k=0;k<v.model.nodes.length;k++){
					for(var p=0;p<v.model.nodes[k].connectedTo.length;p++){
						if(v.model.nodes[k].connectedTo[p].index==_index){
							v.model.nodes[k].connectedTo[p].xPosition=this.circle.getX();
							v.model.nodes[k].connectedTo[p].yPosition=this.circle.getY();
						}
					}
				}
				
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
		
		var headlen = 40;   // how long you want the head of the arrow to be, you could calculate this as a fraction of the distance between the points as well.
	    var angle = Math.atan2(yTo-yFrom,xTo-xFrom);

	    var line = new Kinetic.Line({
	        points: [xFrom, yFrom, xTo, yTo, xTo-headlen*Math.cos(angle-Math.PI/6),yTo-headlen*Math.sin(angle-Math.PI/6),xTo, yTo, xTo-headlen*Math.cos(angle+Math.PI/6),yTo-headlen*Math.sin(angle+Math.PI/6)],
	        stroke: 'black',
			strokeWidth: 2*this.scale
	    });

		
		line.on=on;
		line.tn=tn;
		
		lines.push(line);
		
		var weight = new Kinetic.Text({
			x: (xFrom+xTo)/2+(xFrom+xTo)/3,
			y: (yFrom+yTo)/2+(yFrom+yTo)/3,
			text: this.model.edges[i].weight,
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'FF6600'//,
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
				if(this.lines[k].on==this){
					 xFrom=this.getX();
					 yFrom=this.getY();
					 xTo=this.lines[k].tn.getX()-_radius;
					 yTo=this.lines[k].tn.getY()-_radius;
					 var headlen = 40;   // how long you want the head of the arrow to be, you could calculate this as a fraction of the distance between the points as well.
					 var angle = Math.atan2(yTo-yFrom,xTo-xFrom);	
					 this.lines[k].setPoints([xFrom, yFrom, xTo, yTo, xTo-headlen*Math.cos(angle-Math.PI/6),yTo-headlen*Math.sin(angle-Math.PI/6),xTo, yTo, xTo-headlen*Math.cos(angle+Math.PI/6),yTo-headlen*Math.sin(angle+Math.PI/6)]);
				}
				else if(this.lines[k].tn==this){
					//window.alert("in2");
					 xTo=this.getX()-_radius
					 yTo=this.getY()-_radius;
					 xFrom=this.lines[k].on.getX();
					 yFrom=this.lines[k].on.getY();
					 var headlen = 40;   // how long you want the head of the arrow to be, you could calculate this as a fraction of the distance between the points as well.
					 var angle = Math.atan2(yTo-yFrom,xTo-xFrom);	
					 this.lines[k].setPoints([xFrom, yFrom, xTo, yTo, xTo-headlen*Math.cos(angle-Math.PI/6),yTo-headlen*Math.sin(angle-Math.PI/6),xTo, yTo, xTo-headlen*Math.cos(angle+Math.PI/6),yTo-headlen*Math.sin(angle+Math.PI/6)]);
				}
				
			}
			
			for(var k=0;k<this.weights.length;k++){
				this.weights[k].setX((this.getX()+this.connectedTo[k].getX())/2+(this.getX()+this.connectedTo[k].getX())/3);
				this.weights[k].setY((this.getY()+this.connectedTo[k].getY())/2+(this.getY()+this.connectedTo[k].getY())/3);
			}
			
			v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].xPosition=parseInt(this.getX());
			v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].yPosition=parseInt(this.getY());
			var _index=v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].index;

			
			for(var k=0;k<v.model.nodes.length;k++){
				for(var p=0;p<v.model.nodes[k].connectedTo.length;p++){
					if(v.model.nodes[k].connectedTo[p].index==_index){
						v.model.nodes[k].connectedTo[p].xPosition=this.getX();
						v.model.nodes[k].connectedTo[p].yPosition=this.getY();
					}
				}
			}
			
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
				if(this.lines[k].on==this){
					 xFrom=this.getX()
					 yFrom=this.getY();
					 xTo=this.lines[k].tn.getX();
					 yTo=this.lines[k].tn.getY();
					 var headlen = 40;   // how long you want the head of the arrow to be, you could calculate this as a fraction of the distance between the points as well.
					 var angle = Math.atan2(yTo-yFrom,xTo-xFrom);	
					 this.lines[k].setPoints([xFrom, yFrom, xTo, yTo, xTo-headlen*Math.cos(angle-Math.PI/6),yTo-headlen*Math.sin(angle-Math.PI/6),xTo, yTo, xTo-headlen*Math.cos(angle+Math.PI/6),yTo-headlen*Math.sin(angle+Math.PI/6)]);
				}
				else if(this.lines[k].tn==this){
					//window.alert("in2");
					 xTo=this.getX()
					 yTo=this.getY();
					 xFrom=this.lines[k].on.getX();
					 yFrom=this.lines[k].on.getY();
					 var headlen = 40;   // how long you want the head of the arrow to be, you could calculate this as a fraction of the distance between the points as well.
					 var angle = Math.atan2(yTo-yFrom,xTo-xFrom);	
					 this.lines[k].setPoints([xFrom, yFrom, xTo, yTo, xTo-headlen*Math.cos(angle-Math.PI/6),yTo-headlen*Math.sin(angle-Math.PI/6),xTo, yTo, xTo-headlen*Math.cos(angle+Math.PI/6),yTo-headlen*Math.sin(angle+Math.PI/6)]);
				}
				
			}
			
			for(var k=0;k<this.weights.length;k++){
				this.weights[k].setX((this.getX()+this.connectedTo[k].getX())/2+(this.getX()+this.connectedTo[k].getX())/3);
				this.weights[k].setY((this.getY()+this.connectedTo[k].getY())/2+(this.getY()+this.connectedTo[k].getY())/3);
			}
			
			v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].xPosition=parseInt(this.getX());
			v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].yPosition=parseInt(this.getY());
			var _index=v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].index;

			
			for(var k=0;k<v.model.nodes.length;k++){
				for(var p=0;p<v.model.nodes[k].connectedTo.length;p++){
					if(v.model.nodes[k].connectedTo[p].index==_index){
						v.model.nodes[k].connectedTo[p].xPosition=this.getX();
						v.model.nodes[k].connectedTo[p].yPosition=this.getY();
					}
				}
			}
			
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