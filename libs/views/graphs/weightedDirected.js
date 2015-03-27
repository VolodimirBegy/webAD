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
			
			circles.push(circleFrom);
			vals.push(valFrom);
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
			
			circles.push(circleTo);
			vals.push(valTo);
		}
		
		var line = new Kinetic.Line({
			points: [xFrom,yFrom,xTo,yTo],
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		lines.push(line);
		
		var weight = new Kinetic.Text({
			x: (xFrom+xTo)/2,
			y: (yFrom+yTo)/2,
			text: this.model.edges[i].weight,
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'FF6600'//,
			//width:_radius*2,
			//align:'center'
		});
		
		weights.push(weight);
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