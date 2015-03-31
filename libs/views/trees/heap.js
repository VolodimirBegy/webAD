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

function HeapView(_model){
	this.model=_model;
	this.scale=1;
}

HeapView.prototype.initStage=function(cont){
	this.stage = new Kinetic.Stage({
  		container: cont,
  		draggable: true,
		width: 0,
		height: 0
	}); 
}

HeapView.prototype.zoomIn=function(){
  if(this.scale<3)this.scale=this.scale+0.1;
  this.draw();
}

HeapView.prototype.zoomOut=function(){
  if(this.scale>0.5)this.scale=this.scale-0.1;
  this.draw();
}

HeapView.prototype.draw=function(){
	
	var tmpNodes=[];
	if(this.model.root!=undefined)
		tmpNodes.push(this.model.root);
	var level=1;
	var finished=new Boolean();
	finished=false;
	var cacheCircle=[];
	var cacheRect=[];
	var cacheText=[];
	//determine levels
	do{
		finished=true;
		var oldNodes=tmpNodes; tmpNodes=[];
		do{
			if(oldNodes[0]!=undefined){
				tmpNodes.push(oldNodes[0].leftChild);
				tmpNodes.push(oldNodes[0].rightChild);
			}
			oldNodes.shift();
		}while(oldNodes.length!=0);
		
		for(var k=0;k<tmpNodes.length;k++){
			if(tmpNodes[k]!=undefined)
				finished=false;
		}
		level++;
	}while(!finished);
	
	level--;
	
	var _radius=20*this.scale;

	var layer = new Kinetic.Layer();
	
	var al=1;
	tmpNodes=[];
	if(this.model.root!=undefined)
		tmpNodes.push(this.model.root);
	finished=new Boolean();
	finished=false;
	var firstXLastLevel=0;
	//determine x and y, draw
	do{

		for(var i=0;i<tmpNodes.length;i++){
			
			var xPos;
			if(al==1){
				xPos=(_radius*2.5)*(Math.pow(2,(level-1))/2);
				if(xPos<200)xPos=200;
			}
			
			else{
				if(tmpNodes[i]!=undefined){
						var devider=2;
						for(var d=1;d<al;d++){
							devider=devider*2;
						}
						
						var parXpos=tmpNodes[i].parent.xPosition;
						var rootXpos=(_radius*4.5)*(Math.pow(2,(level-1))/2);
						if((i+1)%2==1){
							xPos=parXpos-(rootXpos/devider);
						}
						else{
							xPos=parXpos+(rootXpos/devider);
						}
						
				}
			}
			if(tmpNodes[i]!=undefined){
				if(i==0)firstXLastLevel=xPos;
				
				tmpNodes[i].xPosition=xPos;
				yPos=al*5*_radius;
				tmpNodes[i].yPosition=yPos; 
					
				var circle = new Kinetic.Circle({
					x: tmpNodes[i].xPosition,
					y: tmpNodes[i].yPosition,
					radius:_radius,
					fill: tmpNodes[i].color,
					strokeWidth: 4*this.scale,
					//draggable: true
				});
				
				
				
				var val = new Kinetic.Text({
					x: circle.getX()-40*this.scale,
					y: circle.getY()-7*this.scale,
					text: tmpNodes[i].value,
					fontSize: 15*this.scale,
					fontFamily: 'Calibri',
					fill: 'black',
					width: 80*this.scale,
					align: 'center'
				});
				
				
	
				if(tmpNodes[i]!=undefined && tmpNodes[i].parent!=undefined){
					var lineColor="blue";
					if(i%2==1)
						lineColor="red";
					
					var line = new Kinetic.Line({
						points: [circle.getX(),circle.getY()-_radius,tmpNodes[i].parent.xPosition,tmpNodes[i].parent.yPosition+_radius],
						stroke: lineColor,
						strokeWidth: (0.1*_radius),
						lineJoin: 'round',
					});
				}
			}
			
			layer.add(circle);
			layer.add(val);
			if(tmpNodes[i]!=undefined && tmpNodes[i].parent!=undefined && tmpNodes[i]!=this.model.root)
				layer.add(line);
			
			
		}
		
		finished=true;
		var oldNodes=tmpNodes; tmpNodes=[];
		do{
			if(oldNodes[0]!=undefined){
				tmpNodes.push(oldNodes[0].leftChild);
				tmpNodes.push(oldNodes[0].rightChild);
			}
			oldNodes.shift();
		}while(oldNodes.length!=0);
		
		for(var k=0;k<tmpNodes.length;k++){
			if(tmpNodes[k]!=undefined)
				finished=false;
		}
		al++;
	}while(!finished);
	
	//add array
	var firstSortedX=200;
	var firstSortedIndex=0;
	for(var i=0;i<this.model.nodes.length;i++){
		var rect = new Kinetic.Rect({
			x: firstXLastLevel+(i*42*this.scale),
			y: 20*this.scale,
			width: 40*this.scale,
			height: 40*this.scale,
			stroke: this.model.nodes[i].color,
			fill: 'white',
			strokeWidth: 2*this.scale,
		});
	  
		var text = new Kinetic.Text({
			x: rect.getX()+rect.getWidth()/4,
			y: rect.getY()+rect.getWidth()/4,
			text: this.model.nodes[i].value,
			fontSize: 15*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
		
		var index = new Kinetic.Text({
			x: rect.getX()+rect.getWidth()/4,
			y: rect.getY()-15*this.scale,
			text: i,
			fontSize: 15*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
	
		layer.add(rect);
		layer.add(text);
		layer.add(index);
		
		
		firstSortedX=rect.getX()+rect.getWidth()+2*this.scale;
		firstSortedIndex=i+1;
	}
	
	//addSorted
	for(var i=0;i<this.model.sorted.length;i++){
		var rect = new Kinetic.Rect({
			x: firstSortedX+(i*42*this.scale),
			y: 20*this.scale,
			width: 40*this.scale,
			height: 40*this.scale,
			stroke: 'red',
			fill: 'white',
			strokeWidth: 2*this.scale,
		});
	  
		var text = new Kinetic.Text({
			x: rect.getX()+rect.getWidth()/4,
			y: rect.getY()+rect.getWidth()/4,
			text: this.model.sorted[i],
			fontSize: 15*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
		
		var index = new Kinetic.Text({
			x: rect.getX()+rect.getWidth()/4,
			y: rect.getY()-15*this.scale,
			text: firstSortedIndex,
			fontSize: 15*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
	
		layer.add(rect);
		layer.add(text);
		layer.add(index);
		
		firstSortedIndex++;
	}
	
	var w=firstXLastLevel+(this.model.nodes.length*42*this.scale+this.model.sorted.length*42*this.scale)+250*this.scale;
	var h=500;
	if(level>4)
		h+=(level-4)*7*_radius;
	if(this.scale>1.1)
		h*=this.scale;
	if(w<1000)w=1000;
  	
	this.stage.setWidth(w);
	this.stage.setHeight(h);
	this.stage.removeChildren();
	this.stage.add(layer);	

}