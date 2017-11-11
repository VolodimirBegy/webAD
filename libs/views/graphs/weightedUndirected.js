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

UndirectedGraphView.prototype.initStage=function(cont){
	this.stage = new Kinetic.Stage({
  		container: cont,
  		draggable: true,
		width: 0,
		height: 0
	}); 
}

UndirectedGraphView.prototype.zoomIn=function(){
  if(this.scale<2.5)this.scale=this.scale+0.1;
  this.draw();
}

UndirectedGraphView.prototype.zoomOut=function(){
  if(this.scale>0.5)this.scale=this.scale-0.1;
  this.draw();
}

UndirectedGraphView.prototype.draw=function(){
	
	var _radius=25*this.scale;
	
	var layer = new Kinetic.Layer();
	var lines=[];
	var weights=[];
	var circles=[];
	var vals=[];

	var H=undefined;
	var W=undefined;
	var drawn=[];
    
    // Addition for prim
    /*
    if(this.model.Q != undefined){
        var outerX = 0;
        var offset = 0;
        
        for (var i = 0; i < this.model.nodes.length; i++) {
            if (this.model.nodes[i].xPosition > outerX) {
                outerX = this.model.nodes[i].xPosition;   
            }
        }

        outerX += 2 * _radius;
        
        for(var i = 0; i < this.model.nodes.length; i++) {
            var color1 = undefined;
            var color2 = undefined;
            
            if(this.model.Q[i].used == true) {
                color1 = "lightgrey";
            } else {
                color1 = "black";
            }
            if(this.model.Q[i].isMinInStep == this.model.i && this.model.i != undefined) {
                color1 = "black";
                color2 = "lime";
            } else {
                color2 = "white";
            }
            
            var col1 = new Kinetic.Rect({
                x: outerX,
                y: 25 + offset,
                width: 50 * this.scale,
                height: 40 * this.scale,
                fill: color2,
                stroke: 'black',
                strokeWidth: 2*this.scale
            });
            var col1text = new Kinetic.Text({
                x: col1.getX() + 5 * this.scale,
                y: col1.getY() + 5 * this.scale,
                text: this.model.Q[i].node.index,
                fontSize: 25 * this.scale,
                fontFamily: 'Calibri',
                fill: color1,
            });
            var col2 = new Kinetic.Rect({
                x: outerX + 50,
                y: 25 + offset,
                width: 100 * this.scale,
                height: 40 * this.scale,
                fill: color2,
                stroke: 'black',
                strokeWidth: 2 * this.scale
            });
            var col2text = new Kinetic.Text({
                x: col2.getX() + 5 * this.scale,
                y: col2.getY() + 5 * this.scale,
                text: this.model.Q[i].cost,
                fontSize: 25 * this.scale,
                fontFamily: 'Calibri',
                fill: color1,
            });
            
            offset += 40;
            layer.add(col1);
            layer.add(col1text);
            layer.add(col2);
            layer.add(col2text);
        }
    }
    */
	
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
					
					this.circle.weights[k].setX(((parseInt(this.getX())+parseInt(this.getWidth())/2)+(parseInt(this.circle.connectedTo[k].getX())))/2);
					this.circle.weights[k].setY(((parseInt(this.getY())+parseInt(this.getFontSize())/2)+(parseInt(this.circle.connectedTo[k].getY())))/2);
				}
				
				for(var k=0;k<this.circle.connectedTo.length;k++){
					for(var p=0;p<this.circle.connectedTo[k].lines.length;p++){
						if(this.circle.connectedTo[k].lines[p].tn==this.circle){
							this.circle.connectedTo[k].lines[p].setPoints([parseInt(this.getX())+parseInt(this.getWidth())/2,parseInt(this.getY())+parseInt(this.getFontSize())/2,parseInt(this.circle.connectedTo[k].getX()),parseInt(this.circle.connectedTo[k].getY())]);
							
							this.circle.connectedTo[k].weights[p].setX(((parseInt(this.getX())+parseInt(this.getWidth())/2)+(parseInt(this.circle.connectedTo[k].getX())))/2);
							this.circle.connectedTo[k].weights[p].setY(((parseInt(this.getY())+parseInt(this.getFontSize())/2)+(parseInt(this.circle.connectedTo[k].getY())))/2);
						}
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
		var onWeights=[];
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
						
						this.circle.weights[k].setX(((parseInt(this.getX())+parseInt(this.getWidth())/2)+(parseInt(this.circle.connectedTo[k].getX())))/2);
						this.circle.weights[k].setY(((parseInt(this.getY())+parseInt(this.getFontSize())/2)+(parseInt(this.circle.connectedTo[k].getY())))/2);
					}
					
					for(var k=0;k<this.circle.connectedTo.length;k++){
						for(var p=0;p<this.circle.connectedTo[k].lines.length;p++){
							if(this.circle.connectedTo[k].lines[p].tn==this.circle){
								this.circle.connectedTo[k].lines[p].setPoints([parseInt(this.getX())+parseInt(this.getWidth())/2,parseInt(this.getY())+parseInt(this.getFontSize())/2,parseInt(this.circle.connectedTo[k].getX()),parseInt(this.circle.connectedTo[k].getY())]);
								
								this.circle.connectedTo[k].weights[p].setX(((parseInt(this.getX())+parseInt(this.getWidth())/2)+(parseInt(this.circle.connectedTo[k].getX())))/2);
								this.circle.connectedTo[k].weights[p].setY(((parseInt(this.getY())+parseInt(this.getFontSize())/2)+(parseInt(this.circle.connectedTo[k].getY())))/2);
							}
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
			
			var col=undefined;
			
			for(var k=0;k<this.model.edges.length;k++){
				if((this.model.edges[k].u.index==this.model.nodes[i].index && this.model.edges[k].v.index==this.model.nodes[i].connectedTo[j].index)||
						(this.model.edges[k].v.index==this.model.nodes[i].index && this.model.edges[k].u.index==this.model.nodes[i].connectedTo[j].index)){
					col=this.model.edges[k].color;break;
				}
			}
			
			var _stroke=0;
			if(col=="#6699FF")
				_stroke=1*this.scale;
			else if(col=="black")
				_stroke=2*this.scale;
			else
				_stroke=5*this.scale;
			
			var line = new Kinetic.Line({
				points: [this.model.nodes[i].xPosition,this.model.nodes[i].yPosition,this.model.nodes[i].connectedTo[j].xPosition,this.model.nodes[i].connectedTo[j].yPosition],
				stroke: col,
				strokeWidth: _stroke*this.scale
			});
			
			var _weight=undefined;
			for(var k=0;k<this.model.edges.length;k++){
				if((this.model.edges[k].u.index==this.model.nodes[i].index && this.model.edges[k].v.index==this.model.nodes[i].connectedTo[j].index)||
						(this.model.edges[k].v.index==this.model.nodes[i].index && this.model.edges[k].u.index==this.model.nodes[i].connectedTo[j].index)){
							_weight=this.model.edges[k].weight;break;
						}
			}
			
			var weight = new Kinetic.Text({
				x: (this.model.nodes[i].xPosition+this.model.nodes[i].connectedTo[j].xPosition)/2,
				y: (this.model.nodes[i].yPosition+this.model.nodes[i].connectedTo[j].yPosition)/2,
				text: _weight,
				fontSize: 25*this.scale,
				fontFamily: 'Calibri',
				fill: 'orange'//,
				//width:_radius*2,
				//align:'center'
			});
			
			line.on=on;
			line.tn=tn;
			
			onLines.push(line);
			onWeights.push(weight);
			onTo.push(tn);
			//window.alert(tn.val.getText());
			lines.push(line);
			weights.push(weight);
		}
		on.lines=onLines;
		on.weights=onWeights;
		on.connectedTo=onTo;
		
		on.on('dragmove', function() {
			for(var k=0;k<this.lines.length;k++){
				this.lines[k].setPoints([this.getX(),this.getY(),this.connectedTo[k].getX(),this.connectedTo[k].getY()]);
			}
			
			for(var k=0;k<this.weights.length;k++){
				this.weights[k].setX((this.getX()+this.connectedTo[k].getX())/2);
				this.weights[k].setY((this.getY()+this.connectedTo[k].getY())/2);
			}
			
			for(var k=0;k<this.connectedTo.length;k++){
				for(var p=0;p<this.connectedTo[k].lines.length;p++){
					if(this.connectedTo[k].lines[p].tn==this){
						this.connectedTo[k].lines[p].setPoints([this.getX(),this.getY(),this.connectedTo[k].getX(),this.connectedTo[k].getY()]);
						this.connectedTo[k].weights[p].setX((this.getX()+this.connectedTo[k].getX())/2);
						this.connectedTo[k].weights[p].setY((this.getY()+this.connectedTo[k].getY())/2);
					}
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
	
	var w=(25+150*this.model.gridSize)*this.scale;
	var h=(25+150*this.model.gridSize)*this.scale;
	
	if(w<1000)w=1000;
	if(h<500)h=500
	
	if(H>h)h=H;
	if(W>w)w=W;
	
	this.stage.setHeight(h);
	this.stage.setWidth(w);
	this.stage.removeChildren();
	this.stage.add(layer);
						  
}