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

function UnweightedUndirectedGraphView(_model){
	this.model=_model;
	this.scale=1;
}

UnweightedUndirectedGraphView.prototype.initStage=function(cont){
	this.stage = new Kinetic.Stage({
  		container: cont,
  		draggable: true,
		width: 0,
		height: 0
	}); 
}

UnweightedUndirectedGraphView.prototype.zoomIn=function(){
  if(this.scale<2.5)this.scale=this.scale+0.1;
  this.draw();
}

UnweightedUndirectedGraphView.prototype.zoomOut=function(){
  if(this.scale>0.5)this.scale=this.scale-0.1;
  this.draw();
}

UnweightedUndirectedGraphView.prototype.draw=function(){
	
	var _radius=25*this.scale;
	
	var layer = new Kinetic.Layer();
	var lines=[];
	var circles=[];
	var vals=[];

	var H=undefined;
	var W=undefined;
	var drawn=[];
	
	if(this.model.stack!=undefined){
		var visited="";
		
		for(var i=0;i<this.model.visited.length;i++){
			visited+=this.model.visited[i].index;
			if(i<this.model.visited.length-1)
				visited+=", ";
		}
		
		var stack = new Kinetic.Text({
			x: 10,
			y: 0,
			text: 'Stack:',
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black'
		});
		
		var visited = new Kinetic.Text({
			x: stack.getX()+stack.getWidth()+5*this.scale,
			y: 0,
			text: visited,
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black'
		});
		
		layer.add(stack);
		layer.add(visited);
		var scRadius=15*this.scale;
		W=visited.getX()+visited.getWidth()+15*this.scale;
		for(var i=this.model.stack.length-1;i>-1;i--){
			
			var sc = new Kinetic.Circle({
				x: stack.getX()+stack.getWidth()/2,
				y: (stack.getY()+stack.getFontSize()*2)+35*this.scale*i,
				radius:scRadius,
				fill: 'red'
			});
			
			var sct = new Kinetic.Text({
				x: sc.getX()-scRadius,
				y: sc.getY()-scRadius/4,
				text: this.model.stack[this.model.stack.length-1-i].index,
				fontSize: 15*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
				width:scRadius*2,
				align:'center'
			});
			
			layer.add(sc);
			layer.add(sct);
			lastY=sc.getY();
		}
		
		var sl1 = new Kinetic.Line({
			points: [stack.getX()+stack.getWidth()/2-scRadius-5*this.scale,stack.getY()+stack.getFontSize()+10*this.scale,stack.getX()+stack.getWidth()/2-scRadius-5*this.scale,(stack.getY()+stack.getFontSize()*2)+(35*this.scale*this.model.stack.length-1)-15*this.scale],
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		var sl2 = new Kinetic.Line({
			points: [stack.getX()+stack.getWidth()/2+scRadius+5*this.scale,stack.getY()+stack.getFontSize()+10*this.scale,stack.getX()+stack.getWidth()/2+scRadius+5*this.scale,(stack.getY()+stack.getFontSize()*2)+(35*this.scale*this.model.stack.length-1)-15*this.scale],
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		var sl3 = new Kinetic.Line({
			points:[stack.getX()+stack.getWidth()/2-scRadius-5*this.scale,(stack.getY()+stack.getFontSize()*2)+(35*this.scale*this.model.stack.length-1)-15*this.scale,stack.getX()+stack.getWidth()/2+scRadius+5*this.scale,(stack.getY()+stack.getFontSize()*2)+(35*this.scale*this.model.stack.length-1)-15*this.scale],
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		H=(stack.getY()+stack.getFontSize()*2)+(35*this.scale*this.model.stack.length-1)-15*this.scale+15*this.scale;
		
		layer.add(sl1);
		layer.add(sl2);
		layer.add(sl3);
	}
	
	else if(this.model.queue!=undefined){
		var visited="";
		
		for(var i=0;i<this.model.visited.length;i++){
			visited+=this.model.visited[i].index;
			if(i<this.model.visited.length-1)
				visited+=", ";
		}
		
		var queue = new Kinetic.Text({
			x: 10,
			y: 0,
			text: 'Queue:',
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black'
		});
		
		var visited = new Kinetic.Text({
			x: queue.getX()+queue.getWidth()+5*this.scale,
			y: 0,
			text: visited,
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black'
		});
		
		layer.add(queue);
		layer.add(visited);
		var scRadius=15*this.scale;
		W=visited.getX()+visited.getWidth()+15*this.scale;
		for(var i=this.model.queue.length-1;i>-1;i--){
			
			var sc = new Kinetic.Circle({
				x: queue.getX()+queue.getWidth()/2,
				y: (queue.getY()+queue.getFontSize()*2)+35*this.scale*i,
				radius:scRadius,
				fill: 'red'
			});
			
			var sct = new Kinetic.Text({
				x: sc.getX()-scRadius,
				y: sc.getY()-scRadius/4,
				text: this.model.queue[this.model.queue.length-1-i].index,
				fontSize: 15*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
				width:scRadius*2,
				align:'center'
			});
			
			layer.add(sc);
			layer.add(sct);
			lastY=sc.getY();
		}
		
		var sl1 = new Kinetic.Line({
			points: [queue.getX()+queue.getWidth()/2-scRadius-5*this.scale,queue.getY()+queue.getFontSize()+10*this.scale,queue.getX()+queue.getWidth()/2-scRadius-5*this.scale,(queue.getY()+queue.getFontSize()*2)+(35*this.scale*this.model.queue.length-1)-15*this.scale],
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		var sl2 = new Kinetic.Line({
			points: [queue.getX()+queue.getWidth()/2+scRadius+5*this.scale,queue.getY()+queue.getFontSize()+10*this.scale,queue.getX()+queue.getWidth()/2+scRadius+5*this.scale,(queue.getY()+queue.getFontSize()*2)+(35*this.scale*this.model.queue.length-1)-15*this.scale],
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		var sl3 = new Kinetic.Line({
			points:[queue.getX()+queue.getWidth()/2-scRadius-5*this.scale,(queue.getY()+queue.getFontSize()*2)+(35*this.scale*this.model.queue.length-1)-15*this.scale,queue.getX()+queue.getWidth()/2+scRadius+5*this.scale,(queue.getY()+queue.getFontSize()*2)+(35*this.scale*this.model.queue.length-1)-15*this.scale],
			stroke: 'black',
			strokeWidth: 2*this.scale
		});
		
		H=(queue.getY()+queue.getFontSize()*2)+(35*this.scale*this.model.queue.length-1)-15*this.scale+15*this.scale;
		
		layer.add(sl1);
		layer.add(sl2);
		layer.add(sl3);
	}
	
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
				
				v.model.nodes[v.model.matrixLink[parseInt(this.getText())]].xPosition=parseInt(this.circle.getX());
				v.model.nodes[v.model.matrixLink[parseInt(this.getText())]].yPosition=parseInt(this.circle.getY());

		    });
			
			valFrom.on('mouseover', function() {
				this.circle.setFill("orange");
				var ai=parseInt(this.getText());
				v.model.nodes[v.model.matrixLink[ai]].color="orange";
				layer.draw();
		    });
			
			valFrom.on('mouseout', function() {
				var ai=parseInt(this.getText());
				this.circle.setFill(v.model.nodes[v.model.matrixLink[ai]].oColor);
				v.model.nodes[v.model.matrixLink[ai]].color=v.model.nodes[v.model.matrixLink[ai]].oColor;
				layer.draw();
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
					
					v.model.nodes[v.model.matrixLink[parseInt(this.getText())]].xPosition=parseInt(this.circle.getX());
					v.model.nodes[v.model.matrixLink[parseInt(this.getText())]].yPosition=parseInt(this.circle.getY());
			    });
				
				valTo.on('mouseover', function() {
					this.circle.setFill("orange");
					var ai=parseInt(this.getText());
					v.model.nodes[v.model.matrixLink[ai]].color="orange";
					layer.draw();
			    });
				
				valTo.on('mouseout', function() {
					var ai=parseInt(this.getText());
					this.circle.setFill(v.model.nodes[v.model.matrixLink[ai]].oColor);
					v.model.nodes[v.model.matrixLink[ai]].color=v.model.nodes[v.model.matrixLink[ai]].oColor;
					layer.draw();
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
			
			v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].xPosition=parseInt(this.getX());
			v.model.nodes[v.model.matrixLink[parseInt(this.val.getText())]].yPosition=parseInt(this.getY());
			
			this.val.setX(parseInt(this.getX())-_radius);
			this.val.setY(this.getY()-_radius/4);
	    });
		
		var v=this;
		
		on.on('mouseover', function() {
			this.setFill("orange");
			var ai=parseInt(this.val.getText());
			v.model.nodes[v.model.matrixLink[ai]].color="orange";
			layer.draw();
	    });
		
		on.on('mouseout', function() {
			var ai=parseInt(this.val.getText());
			this.setFill(v.model.nodes[v.model.matrixLink[ai]].oColor);
			v.model.nodes[v.model.matrixLink[ai]].color=v.model.nodes[v.model.matrixLink[ai]].oColor;
			layer.draw();			
	    });
	
	}
	
	for(var i=0;i<lines.length;i++)
		layer.add(lines[i]);
	
	for(var i=0;i<circles.length;i++){
		layer.add(circles[i]);
		layer.add(vals[i]);
	}
	
	var w=(25+75*this.model.gridSize)*this.scale;
	var h=(25+75*this.model.gridSize)*this.scale;
	
	if(w<1000)w=1000;
	if(h<500)h=500
	
	if(H>h)h=H;
	if(W>w)w=W;
	
	this.stage.setHeight(h);
	this.stage.setWidth(w);
	this.stage.removeChildren();
	this.stage.add(layer);
						  
}