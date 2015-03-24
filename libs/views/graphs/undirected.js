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

function UndirectedGraphView(_model){
	this.model=_model;
	this.scale=1;
}

UndirectedGraphView.prototype.zoomIn=function(cont){
  if(this.scale<2.5)this.scale=this.scale+0.1;
  this.draw(cont);
}

UndirectedGraphView.prototype.zoomOut=function(cont){
  if(this.scale>0.5)this.scale=this.scale-0.1;
  this.draw(cont);
}

UndirectedGraphView.prototype.draw=function(cont){
	
	var w=(25+75*this.model.gridSize)*this.scale;
	var h=(25+75*this.model.gridSize)*this.scale;
	var _radius=25*this.scale;
	if(w<1000)w=1000;
	if(h<500)h=500
  	var stage = new Kinetic.Stage({
  		container: cont,
		width: w,
		height: h,
		draggable:true
	}); 

	var group = new Kinetic.Group();
	
	var layer = new Kinetic.Layer();
	var lines=[];
	var circles=[];
	var vals=[];

	var drawn=[];
	
	for(var i=0;i<this.model.nodes.length;i++){
		

		var on=undefined;
		
		var exists=false;
		for(var k=0;k<drawn.length;k++){
			if(drawn[k]==this.model.nodes[i].index){
				exists=true;break;
			}
		}
		
		if(!exists){
		
			var circleFrom = new Kinetic.Circle({
				x: this.model.nodes[i].xPosition,
				y: this.model.nodes[i].yPosition,
				radius:_radius,
				fill: this.model.nodes[i].color,
				stroke: 'black',
				draggable:true,
				strokeWidth: 2*this.scale
			});
			
			var valFrom = new Kinetic.Text({
				x: circleFrom.getX()-_radius,
				y: circleFrom.getY()-_radius/4,
				text: this.model.nodes[i].index,
				fontSize: 15*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
				width:_radius*2,
				draggable:true,
				align:'center'
			});
			
			circleFrom.val=valFrom;
			valFrom.circle=circleFrom;
			
			var v=this;
			
			valFrom.on('dragmove', function() {
				for(var k=0;k<this.circle.lines.length;k++){
					this.circle.lines[k].setPoints([parseInt(this.getX())+parseInt(this.getWidth())/2,parseInt(this.getY())+parseInt(this.getFontSize())/2,parseInt(this.circle.connectedTo[k].getX()),parseInt(this.circle.connectedTo[k].getY())]);
				}
				
				for(var k=0;k<this.circle.connectedTo.length;k++){
					for(var p=0;p<this.circle.connectedTo[k].lines.length;p++){
						if(this.circle.connectedTo[k].lines[p].tn==this.circle)
							this.circle.connectedTo[k].lines[p].setPoints([parseInt(this.getX())+parseInt(this.getWidth())/2,parseInt(this.getY())+parseInt(this.getFontSize())/2,parseInt(this.circle.connectedTo[k].getX()),parseInt(this.circle.connectedTo[k].getY())]);
					}
				}
				this.circle.setX(parseInt(this.getX())+_radius);
				this.circle.setY(parseInt(this.getY())+_radius/4);
				
				var _index=undefined;
				
				for(var k=0;k<v.model.nodes.length;k++){
					
					if(""+v.model.nodes[k].index==this.getText()){
						v.model.nodes[k].xPosition=parseInt(this.circle.getX());
						v.model.nodes[k].yPosition=parseInt(this.circle.getY());
						_index=v.model.nodes[k].index;
						break;
					}
				}
				
				for(var k=0;k<v.model.nodes.length;k++){
					for(var p=0;p<v.model.nodes[k].connectedTo.length;p++){
						if(v.model.nodes[k].connectedTo[p].index==_index){
							v.model.nodes[k].connectedTo[p].xPosition=parseInt(this.circle.getX());
							v.model.nodes[k].connectedTo[p].yPosition=parseInt(this.circle.getY());
						}
					}
				}
		    });
			
			valFrom.on('mouseover', function() {
				if(parseInt(this.getText())!=v.model.startNode){
					this.circle.setFill("orange");
					
					var ai=parseInt(this.getText());
					var _i=undefined;
					for(var k=0;k<v.model.nodes.length;k++){
						if(v.model.nodes[k].index==ai){
							_i=k;break;
						}
					}
					v.model.nodes[_i].color="orange";
					layer.draw();
				}
		    });
			
			valFrom.on('mouseout', function() {
				if(parseInt(this.getText())!=v.model.startNode){
					this.circle.setFill("lime");
					
					var ai=parseInt(this.getText());
					var _i=undefined;
					for(var k=0;k<v.model.nodes.length;k++){
						if(v.model.nodes[k].index==ai){
							_i=k;break;
						}
					}
					v.model.nodes[_i].color="lime";
					layer.draw();
				}
		    });
			
			circles.push(circleFrom);
			vals.push(valFrom);
			
			drawn.push(this.model.nodes[i].index);
			on=circleFrom;
		}
		else{
			for(var k=0;k<circles.length;k++){
				if(circles[k].val.getText()==""+this.model.nodes[i].index){
					on=circles[k];break;
				}
			}
		}
		
		var onLines=[];
		var onTo=[];
		//window.alert(on.val.getText());
		for(var j=0;j<this.model.nodes[i].connectedTo.length;j++){
			
			var tn=undefined;
			
			exists=false;
			for(var k=0;k<drawn.length;k++){
				if(drawn[k]==this.model.nodes[i].connectedTo[j].index){
					exists=true;break;
				}
			}
			
			if(!exists){
				
				var circleTo = new Kinetic.Circle({
					x: this.model.nodes[i].connectedTo[j].xPosition,
					y: this.model.nodes[i].connectedTo[j].yPosition,
					radius:_radius,
					fill: this.model.nodes[i].connectedTo[j].color,
					stroke: 'black',
					draggable:true,
					strokeWidth: 2*this.scale
				});

				var valTo = new Kinetic.Text({
					x: circleTo.getX()-_radius,
					y: circleTo.getY()-_radius/4,
					text: this.model.nodes[i].connectedTo[j].index,
					fontSize: 15*this.scale,
					fontFamily: 'Calibri',
					fill: 'black',
					width:_radius*2,
					draggable:true,
					align:'center'
				});
				
				circleTo.val=valTo;
				valTo.circle=circleTo;
				
				var v=this;
				
				valTo.on('dragmove', function() {
					for(var k=0;k<this.circle.lines.length;k++){
						this.circle.lines[k].setPoints([parseInt(this.getX())+parseInt(this.getWidth())/2,parseInt(this.getY())+parseInt(this.getFontSize())/2,parseInt(this.circle.connectedTo[k].getX()),parseInt(this.circle.connectedTo[k].getY())]);
					}
					
					for(var k=0;k<this.circle.connectedTo.length;k++){
						for(var p=0;p<this.circle.connectedTo[k].lines.length;p++){
							if(this.circle.connectedTo[k].lines[p].tn==this.circle)
								this.circle.connectedTo[k].lines[p].setPoints([parseInt(this.getX())+parseInt(this.getWidth())/2,parseInt(this.getY())+parseInt(this.getFontSize())/2,parseInt(this.circle.connectedTo[k].getX()),parseInt(this.circle.connectedTo[k].getY())]);
						}
					}
					this.circle.setX(parseInt(this.getX())+_radius);
					this.circle.setY(parseInt(this.getY())+_radius/4);
					
					var _index=undefined;
					
					for(var k=0;k<v.model.nodes.length;k++){
						
						if(""+v.model.nodes[k].index==this.getText()){
							v.model.nodes[k].xPosition=parseInt(this.circle.getX());
							v.model.nodes[k].yPosition=parseInt(this.circle.getY());
							_index=v.model.nodes[k].index;
							break;
						}
					}
					
					for(var k=0;k<v.model.nodes.length;k++){
						for(var p=0;p<v.model.nodes[k].connectedTo.length;p++){
							if(v.model.nodes[k].connectedTo[p].index==_index){
								v.model.nodes[k].connectedTo[p].xPosition=parseInt(this.circle.getX());
								v.model.nodes[k].connectedTo[p].yPosition=parseInt(this.circle.getY());
							}
						}
					}
			    });
				
				valTo.on('mouseover', function() {
					if(parseInt(this.getText())!=v.model.startNode){
						this.circle.setFill("orange");
						
						var ai=parseInt(this.getText());
						var _i=undefined;
						for(var k=0;k<v.model.nodes.length;k++){
							if(v.model.nodes[k].index==ai){
								_i=k;break;
							}
						}
						v.model.nodes[_i].color="orange";
						layer.draw();
					}
			    });
				
				valTo.on('mouseout', function() {
					if(parseInt(this.getText())!=v.model.startNode){
						this.circle.setFill("lime");
						
						var ai=parseInt(this.getText());
						var _i=undefined;
						for(var k=0;k<v.model.nodes.length;k++){
							if(v.model.nodes[k].index==ai){
								_i=k;break;
							}
						}
						v.model.nodes[_i].color="lime";
						layer.draw();
					}
			    });
				
				circles.push(circleTo);
				vals.push(valTo);
				
				drawn.push(valTo.getText());
				
				tn=circleTo;
			}
			else{
				for(var k=0;k<circles.length;k++){
					if(circles[k].val.getText()==""+this.model.nodes[i].connectedTo[j].index){
						tn=circles[k];break;
					}
				}
			}
			
			var line = new Kinetic.Line({
				points: [this.model.nodes[i].xPosition,this.model.nodes[i].yPosition,this.model.nodes[i].connectedTo[j].xPosition,this.model.nodes[i].connectedTo[j].yPosition],
				stroke: 'black',
				strokeWidth: 2*this.scale
			});
			
			line.on=on;
			line.tn=tn;
			
			onLines.push(line);
			onTo.push(tn);
			//window.alert(tn.val.getText());
			lines.push(line);
		}
		on.lines=onLines;
		on.connectedTo=onTo;
		
		on.on('dragmove', function() {
			for(var k=0;k<this.lines.length;k++){
				this.lines[k].setPoints([this.getX(),this.getY(),this.connectedTo[k].getX(),this.connectedTo[k].getY()]);
			}
			
			for(var k=0;k<this.connectedTo.length;k++){
				for(var p=0;p<this.connectedTo[k].lines.length;p++){
					if(this.connectedTo[k].lines[p].tn==this)
						this.connectedTo[k].lines[p].setPoints([this.getX(),this.getY(),this.connectedTo[k].getX(),this.connectedTo[k].getY()]);
				}
			}
			
			var _index=undefined;
			
			for(var k=0;k<v.model.nodes.length;k++){
				
				if(""+v.model.nodes[k].index==this.val.getText()){
					v.model.nodes[k].xPosition=this.getX();
					v.model.nodes[k].yPosition=this.getY();
					_index=v.model.nodes[k].index;
					break;
				}
			}
			
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
		
		var v=this;
		
		on.on('mouseover', function() {
			if(parseInt(this.val.getText())!=v.model.startNode){
				this.setFill("orange");
				var ai=parseInt(this.val.getText());
				var _i=undefined;
				for(var k=0;k<v.model.nodes.length;k++){
					if(v.model.nodes[k].index==ai){
						_i=k;break;
					}
				}
				//window.alert(_i);
				v.model.nodes[_i].color="orange";
				layer.draw();
			}
	    });
		
		on.on('mouseout', function() {
			//window.alert("out");
			if(parseInt(this.val.getText())!=v.model.startNode){
				this.setFill("lime");
				var ai=parseInt(this.val.getText());
				var _i=undefined;
				for(var k=0;k<v.model.nodes.length;k++){
					if(v.model.nodes[k].index==ai){
						_i=k;break;
					}
				}
				v.model.nodes[_i].color="lime";
				layer.draw();
			}
	    });
	
	}
	
	for(var i=0;i<lines.length;i++)
		group.add(lines[i]);
	
	for(var i=0;i<circles.length;i++){
		group.add(circles[i]);
		group.add(vals[i]);
	}
	
	layer.add(group);
	
	stage.add(layer);
						  
}