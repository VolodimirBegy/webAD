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

function VectorView(_model){
	this.model=_model;
	this.scale=1;
}

VectorView.prototype.initStage=function(cont){
	this.stage = new Kinetic.Stage({
  		container: cont,
  		draggable: true,
		width: 0,
		height: 0
	}); 
}

VectorView.prototype.zoomIn=function(){
	if(this.scale<3)this.scale=this.scale+0.1;
	this.draw();
}

VectorView.prototype.zoomOut=function(){
	if(this.scale>0.2)this.scale=this.scale-0.1;
	this.draw();
}

VectorView.prototype.draw=function(){

	var w=this.model.size()*30*this.scale + 20 + 75*this.scale;
	var biggestNum=0;
	for(var i=0;i<this.model.size();i++){
		if(this.model.elements[i].value>biggestNum)
			biggestNum=this.model.elements[i].value;
	}
	if(typeof this.model.newVector != 'undefined'){
		for(var i = 0; i < this.model.newVector.length; i++){
			if(this.model.newVector[i].value > biggestNum){
				biggestNum = this.model.newVector[i].value;
			}
		}
	}
	var h=(45+biggestNum*3)*this.scale;
	
	this.stage.setHeight(h * 2 + 20 * this.scale);
	this.stage.setWidth(w * 2) + 75*this.scale;
	this.stage.removeChildren();

	var layer = new Kinetic.Layer();
	
	if(typeof this.model.seperatedElements != 'undefined' && this.model.seperatedElements.length > 0){
		var counter = 0;
		for(var a = 0; a < this.model.seperatedElements.length; a++){
			for(var i=0;i<this.model.seperatedElements[a];i++){
				var rect = new Kinetic.Rect({
					x: 10+(counter*25*this.scale) + a * 10,
					y: 20*this.scale,
					width: 15*this.scale,
					height: (5+this.model.elements[counter].value*3)*this.scale,
					stroke: this.model.elements[counter].color,
					fill: this.model.elements[counter].color,
					strokeWidth: 2*this.scale,
				});
			  
				var text = new Kinetic.Text({
					x: rect.getX()-8*this.scale,
					y: rect.getY()-15*this.scale,
					text: this.model.elements[counter].value,
					fontSize: 15*this.scale,
					fontFamily: 'Calibri',
					fill: 'black',
					width: 30*this.scale,
					align: 'center'
				});
			
				layer.add(rect);
				layer.add(text);
				counter ++;
			}
		}
	}
	  
	 else{
		for(var i=this.model.size()-1;i>-1;i--){
			var rect = new Kinetic.Rect({
				x: 10+(i*25*this.scale),
				y: 20*this.scale,
				width: 15*this.scale,
				height: (5+this.model.elements[i].value*3)*this.scale,
				stroke: this.model.elements[i].color,
				fill: this.model.elements[i].color,
				strokeWidth: 2*this.scale,
			});
		  
			var text = new Kinetic.Text({
				x: rect.getX()-8*this.scale,
				y: rect.getY()-15*this.scale,
				text: this.model.elements[i].value,
				fontSize: 15*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
				width: 30*this.scale,
				align: 'center'
			});
		
			layer.add(rect);
			layer.add(text);	
		}
	}
	
	var textIntro = new Kinetic.Text({
		x: 10,
		y: h + 10*this.scale,
		text: 'Helparray',
		fontSize: 15*this.scale,
		fontFamily: 'Calibri',
		fill: 'black',
		width: 75*this.scale,
		align: 'center'
		});
	layer.add(textIntro);
	
	if(this.model.newVector.length > 0)
	{

		for(var i=0;i<this.model.newVector.length;i++){	
			var rect = new Kinetic.Rect({
				x: 10+(i*25*this.scale),
				y: 20*this.scale + h + 20 * this.scale,
				width: 15*this.scale,
				height: (5+this.model.newVector[i].value*3)*this.scale,
				stroke: this.model.newVector[i].color,
				fill: this.model.newVector[i].color,
				strokeWidth: 2*this.scale,
			});
		  
			var text = new Kinetic.Text({
				x: rect.getX()-8*this.scale,
				y: rect.getY()-15*this.scale,
				text: this.model.newVector[i].value,
				fontSize: 15*this.scale,
				fontFamily: 'Calibri',
				fill: 'black',
				width: 30*this.scale,
				align: 'center'
			});
			layer.add(rect);
			layer.add(text);	
		}
	}
	
	
	this.stage.add(layer);
	
}
