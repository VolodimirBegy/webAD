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

function HashTableView(_model){
	this.scale=1;
	this.model=_model;
}

HashTableView.prototype.initStage=function(cont){
	this.stage = new Kinetic.Stage({
  		container: cont,
  		draggable: true,
		width: 0,
		height: 0
	}); 
}

HashTableView.prototype.zoomIn=function(){
	if(this.scale<3)this.scale=this.scale+0.1;
	this.draw();
}

HashTableView.prototype.zoomOut=function(){
	if(this.scale>0.5)this.scale=this.scale-0.1;
	this.draw();
}

HashTableView.prototype.draw=function(){
	var m=this.model;
	var h=100+m.rows.length*70*this.scale;
  	var maxOverflow=0;
      
  	for(var i=0;i<m.rows.length;i++){
  		counter=0;
  		var actRow=m.rows[i];
  		while(actRow.overflow!=undefined){
  			counter++;
  			actRow=actRow.overflow;
  		}
  		if(counter>maxOverflow)
  			maxOverflow=counter;
	}
    
  	var binIndexLen=0;
  	if(m.manipulatedBin!=undefined)
  		binIndexLen=m.manipulatedBin.length*10*this.scale
	var w=(maxOverflow+1)*m.b*90*this.scale+2*(m.rows[0].index.length*10)*this.scale+binIndexLen+200*this.scale;
      
  	this.stage.setWidth(w);
	this.stage.setHeight(h);
	this.stage.removeChildren();
	
	var layer = new Kinetic.Layer();

	var info = new Kinetic.Text({
		x: m.rows[0].index.length*10*this.scale,
		y: 10,
		text: "d="+m.d+", NextToSplit="+m.nts+", b="+m.b,
		fontSize: 18*this.scale,
		fontFamily: 'Calibri',
		fill: 'black'
	});
	var manipulatedHandled=false;
	for(var i=0;i<m.rows.length;i++){
		var y=(50+i*50*1.03)*this.scale;
		var color="black";
		if(m.manipulatedIndex==m.rows[i].index)
			color="red";
		var text = new Kinetic.Text({
			x: 10*this.scale,
			y: y,
			text: m.rows[i].index,
			fontSize: 18*this.scale,
			fontFamily: 'Calibri',
			fill: color
		});
			  
		var prevBucket=undefined;

		for(var j=0;j<m.b;j++){
			var bucketX=0;
			if(prevBucket==undefined)
				bucketX=m.rows[0].index.length*10*this.scale+12*this.scale;
			else
				bucketX=prevBucket.getX()+prevBucket.getWidth()*1.03;

			var txt;
			var col="black";
			
			if(m.rows[i].values[j]==undefined)
				txt="x";
			else{
				txt=m.rows[i].values[j];
				if(m.rows[i].index==m.manipulatedIndex && m.manipulationInProgress && m.rows[i].values[j]==m.manipulated && !manipulatedHandled){
					col="red";
					manipulatedHandled=true;
				}
			}
			
			var rect = new Kinetic.Rect({
				x: bucketX,
				y: y,
				width: 50*this.scale,
				height: 50*this.scale,
				fill: '#9AFE2E',
				stroke: col,
				strokeWidth: 2*this.scale
			});
				  
	
			var textVal = new Kinetic.Text({
				x: rect.getX(),
				y: rect.getY(),
				text: txt,
				fontSize: 18*this.scale,
				fontFamily: 'Calibri',
				fill: col,
				width: 50*this.scale,
				align: 'center'
			});
			prevBucket=rect;
				  
			if(j==m.b-1){
				var pointer = new Kinetic.Rect({
					x: rect.getX()+rect.getWidth()*1.03,
					y: y,
					width: 10*this.scale,
					height: 50*this.scale,
					fill: '#9AFE2E',
					stroke: 'black',
					strokeWidth: 2*this.scale,
				});
				layer.add(pointer);
				
				if(m.rows[i].overflow==undefined && m.manipulatedIndex==m.rows[i].index){
					//var calcText=m.manipulated+"="+m.manipulatedBin;
					//if(m.manipulatedBin.length>m.rows[i].index>length){
						var calc1 = new Kinetic.Text({
							x: pointer.getX()+pointer.getWidth()*1.3,
							y: y,
							text: m.manipulated+"="+m.manipulatedBin.substring(0,m.manipulatedBin.length-m.rows[i].index.length),
							fontSize: 18*this.scale,
							fontFamily: 'Calibri',
							fill: 'black'
						});
						var calc2 = new Kinetic.Text({
							x: calc1.getX()+calc1.getWidth(),
							y: y,
							text: m.manipulatedBin.substring(m.manipulatedBin.length-m.rows[i].index.length),
							fontSize: 18*this.scale,
							fontFamily: 'Calibri',
							fill: 'red'
						});
						layer.add(calc1);
						layer.add(calc2);
					//}
				}
			}

			layer.add(rect);
			layer.add(textVal);
		}
		layer.add(text);
		//overflows
		var baseRow=m.rows[i];
		var actRow=m.rows[i].overflow;
		var overflowIn=false;
		var lastPointer=undefined;
		while(actRow!=undefined){
			overflowIn=true;
			var first=true;
				  
			for(var j=0;j<m.b;j++){
					  
				var bucketX=0;
				if(first){
					bucketX=prevBucket.getX()+prevBucket.getWidth()+30*this.scale;
						  
					var headlen = 10*this.scale;   
						   
					var toX=bucketX;
					var Y=y+20*this.scale;
					var fromX=prevBucket.getX()+prevBucket.getWidth()+5*this.scale
					var angle = Math.atan2(0,toX-fromX);
						    
					var arrow = new Kinetic.Line({
						points: [fromX, Y, toX, Y, toX-headlen*Math.cos(angle-Math.PI/6),Y-headlen*Math.sin(angle-Math.PI/6),toX, Y, toX-headlen*Math.cos(angle+Math.PI/6),Y-headlen*Math.sin(angle+Math.PI/6)],
						stroke: "black",
						strokeWidth:2*this.scale
					});
					layer.add(arrow);
				}
				else
					bucketX=prevBucket.getX()+prevBucket.getWidth()*1.03;
				
				var overflowBucketTxt="x";
				var col="black";
				if(actRow.values[j]!=undefined){
					overflowBucketTxt=actRow.values[j];
					if(baseRow.index==m.manipulatedIndex && m.manipulationInProgress && actRow.values[j]==m.manipulated && !manipulatedHandled){
						col="red";
						manipulatedHandled=true;
					}
				}
				var overflow = new Kinetic.Rect({
					x: bucketX,
					y: y,
					width: 50*this.scale,
					height: 40*this.scale,
					fill: '#9AFE2E',
					stroke: col,
					strokeWidth: 2*this.scale
				});
					  
				var overflowVal = new Kinetic.Text({
					x: overflow.getX(),
					y: overflow.getY(),
					text: overflowBucketTxt,
					fontSize: 18*this.scale,
					fontFamily: 'Calibri',
					fill: col,
					width: 50*this.scale,
					align: 'center'
				});
					  
				if(j==m.b-1){
					var pointer = new Kinetic.Rect({
						x: overflow.getX()+overflow.getWidth(),
						y: y,
						width: 10*this.scale,
						height: 40*this.scale,
						fill: '#9AFE2E',
						stroke: 'black',
						strokeWidth: 2*this.scale
					});
					lastPointer=pointer;
					layer.add(pointer);
				}
					  
				layer.add(overflow);
				layer.add(overflowVal);
				prevBucket=overflow;
				first=false;
			}

			actRow=actRow.overflow;
		}
		if(overflowIn && m.manipulatedIndex==m.rows[i].index){
			//var calcText=m.manipulated+"="+m.manipulatedBin;
			var calc1 = new Kinetic.Text({
				x: pointer.getX()+pointer.getWidth()*1.3,
				y: y,
				text: m.manipulated+"="+m.manipulatedBin.substring(0,m.manipulatedBin.length-m.rows[i].index.length),
				fontSize: 18*this.scale,
				fontFamily: 'Calibri',
				fill: 'black'
			});
			var calc2 = new Kinetic.Text({
				x: calc1.getX()+calc1.getWidth(),
				y: y,
				text: m.manipulatedBin.substring(m.manipulatedBin.length-m.rows[i].index.length),
				fontSize: 18*this.scale,
				fontFamily: 'Calibri',
				fill: 'red'
			});
			layer.add(calc1);
			layer.add(calc2);
		}
		
		if(i==m.rows.length-1 && m.newBlockVals!=undefined && m.newBlockVals.length>0){
			for(var j=0;j<m.newBlockVals.length;j++){
				var nb1 = new Kinetic.Text({
					x: m.rows[0].index.length*10*this.scale+12*this.scale,
					y: y+(50+20*j)*this.scale,
					text: m.newBlockVals[j]+"="+m.newBlockBins[j].substring(0,m.newBlockBins[j].length-m.rows[i].index.length),
					fontSize: 18*this.scale,
					fontFamily: 'Calibri',
					fill: 'black'
				});
				var nb2 = new Kinetic.Text({
					x: nb1.getX()+nb1.getWidth(),
					y: y+(50+20*j)*this.scale,
					text: m.newBlockBins[j].substring(m.newBlockBins[j].length-m.rows[i].index.length),
					fontSize: 18*this.scale,
					fontFamily: 'Calibri',
					fill: 'red'
				});
				layer.add(nb1);
				layer.add(nb2);
			}
		}
	}
	layer.add(info);
	
	this.stage.add(layer);	
}