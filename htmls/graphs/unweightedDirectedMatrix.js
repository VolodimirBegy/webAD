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

function UnweightedDirectedMatrix(_number){
	//number=of nodes
	this.number=_number;
	this.matrix=new Array(_number);
	
	this.miniMatrix;
	this.minNum;
	
	for(var i=0;i<_number;i++){
		this.matrix[i]=new Array(_number);
	}
	this.scale=1;
}

UnweightedDirectedMatrix.prototype.extendBy=function(amount,gm){
	var oldM=gm.slice();
	var oldN=gm.length
	this.matrix=[];
	
	this.number=oldN+amount;
	
	for(var i=0;i<this.number;i++){
		this.matrix.push(new Array(this.number));
	}
	
	for(var i=0;i<oldN;i++){
		for(var j=0;j<oldN;j++){
			if(oldM[i][j]==1){
				this.matrix[i][j]=1;
			}
		}
	}
}

UnweightedDirectedMatrix.prototype.initStage=function(cont,contMin){
	this.stage = new Kinetic.Stage({
  		container: cont,
		width: 0,
		height: 0
	}); 
	
	this.stageMin = new Kinetic.Stage({
  		container: contMin,
		width: 150,
		height: 150
	}); 
}

UnweightedDirectedMatrix.prototype.drawMin=function(){
	this.stageMin.removeChildren();
  	var layer = new Kinetic.Layer();
  	
	var rects=new Array(this.minNum);
	for(var i=0;i<this.minNum;i++){
		rects[i]=new Array(this.minNum);
	}

  	for(var i=0;i<this.minNum;i++){
  		
  		var lineV = new Kinetic.Line({
			points: [5+150/this.minNum*i,0,5+150/this.minNum*i,150],
			stroke: 'black',
			strokeWidth: 2*this.scale,
		});
  		
  		var lineH = new Kinetic.Line({
			points: [0,5+150/this.minNum*i,150,5+150/this.minNum*i],
			stroke: 'black',
			strokeWidth: 2*this.scale,
		});
  		

  		for(var j=0;j<this.minNum;j++){
  			var strokeCol="black";
  			var fill="white";
  			if(j==i)fill="red";
  			else if(this.miniMatrix[j][i]==1){
  				fill="lime";
  			}
  			var rect = new Kinetic.Rect({
  				x: 5+150/this.minNum*i,
  				y: 5+150/this.minNum*j,
  				width: 150/this.minNum,
  				height: 150/this.minNum,
  				fill: fill,
  				stroke: strokeCol,
  				strokeWidth: 2*this.scale
  			});
  			
  			rect.ij=""+(i)+":"+(j);
  			var um=this;
  			
  			rects[i][j]=rect;
  			layer.add(rect);
  		}
  		
  		
	  	layer.add(lineH);
		layer.add(lineV);
  	}

	this.stageMin.add(layer);	  
}

UnweightedDirectedMatrix.prototype.zoomIn=function(){
	if(this.scale<1.5)this.scale=this.scale+0.1;
	this.draw();
}

UnweightedDirectedMatrix.prototype.zoomOut=function(){
	if(this.scale>0.5)this.scale=this.scale-0.1;
	this.draw();
}

UnweightedDirectedMatrix.prototype.draw=function(){
	//var rects=;
	var dim=(75+this.number*50)*this.scale;
	
	this.stage.setHeight(dim);
	this.stage.setWidth(dim);
	this.stage.removeChildren();
  	var layer = new Kinetic.Layer();
  	
	var rects=new Array(this.number);
	for(var i=0;i<this.number;i++){
		rects[i]=new Array(this.number);
	}
	var numH=undefined, numV=undefined;
  	for(var i=0;i<this.number;i++){
  		
  		numH = new Kinetic.Text({
			x: (50+50*i)*this.scale,
			y: 0,
			text: i,
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
  		
  		numV = new Kinetic.Text({
			x: 0,
			y: (50+50*i)*this.scale,
			text: i,
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
  		
  		numHparallel = new Kinetic.Text({
  			x: (50+50*i)*this.scale,
			y: 25*this.scale+50*this.number*this.scale,
			text: i,
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
  		
  		numVparallel = new Kinetic.Text({
			x: 40*this.scale+50*this.number*this.scale,
			y: (50+50*i)*this.scale,
			text: i,
			fontSize: 25*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
  		
  		var lineV = new Kinetic.Line({
			points: [numH.getX()-25*this.scale+10*this.scale,0,numH.getX()-25*this.scale+10*this.scale,dim],
			stroke: 'black',
			strokeWidth: 2*this.scale,
		});
  		
  		var lineH = new Kinetic.Line({
			points: [0,numV.getY()-25*this.scale,dim,numV.getY()-25*this.scale],
			stroke: 'black',
			strokeWidth: 2*this.scale,
		});
  		
  		//vertical
  		for(var j=0;j<this.number;j++){
  			var strokeCol="black";
  			var fill="white";
  			if(j==i)fill="red";
  			var rect = new Kinetic.Rect({
  				x: (35+50*j)*this.scale,
  				y: numV.getY()-25*this.scale,
  				width: 50*this.scale,
  				height: 50*this.scale,
  				fill: fill,
  				stroke: strokeCol,
  				strokeWidth: 2*this.scale
  			});
  			
  			rect.ij=""+(i)+":"+(j);
  			var um=this;
  			rect.on('click', function() {		  				
  		        var indexes=this.ij.split(":");
  		        if(um.matrix[indexes[0]][indexes[1]]==undefined && indexes[0]!=indexes[1]){
  		        	um.matrix[indexes[0]][indexes[1]]=1;
  		        }

  		        um.draw();
  		        return;
  		    });
  			
  			rect.on('touchend', function() {
  				var indexes=this.ij.split(":");
  		        if(um.matrix[indexes[0]][indexes[1]]==undefined && indexes[0]!=indexes[1]){
  		        	um.matrix[indexes[0]][indexes[1]]=1;
  		        }

  		        um.draw();
  		        return;
  		    });
  			
  			rects[i][j]=rect;
  			layer.add(rect);
  		}
  		
  		layer.add(numH);
	  	layer.add(numV);
	  	layer.add(numHparallel);
	  	layer.add(numVparallel);
	  	layer.add(lineH);
		layer.add(lineV);
  	}

  	
  	for(var i=0;i<this.number;i++){
  		for(var j=0;j<this.number;j++){
  			if(this.matrix[i][j]!=undefined){
  	  			var set = new Kinetic.Rect({
  	  				x: rects[i][j].getX(),
  	  				y: rects[i][j].getY(),
  	  				width: 50*this.scale,
  	  				height: 50*this.scale,
  	  				fill: 'lime',
  	  				stroke: 'black',
  	  				strokeWidth: 2*this.scale
  	  			});
  	  			
		  	  	function intL(number) {
		  	  	    return number.toString().length;
		  	  	}
		  	  	
  	  			var fSize=25*this.scale;
  	  			
  	  			if(intL(this.matrix[i][j])>3){
  	  				var len=intL(this.matrix[i][j]);
  	  				var diff=len-3;
  	  				fSize=(25-(25/4*diff))*this.scale;
  	  			}
  	  				
  	  			set.ij=""+i+":"+j;
  	  			
  	  			var um=this;
	  	  		set.on('click', function() {
	  	  			var indexes=this.ij.split(":");	
	  		        um.matrix[indexes[0]][indexes[1]]=undefined;
	  		        //window.alert(um.matrix[indexes[0]][indexes[1]]);
	  		        um.draw();
	  		        return;
	  		    });
	  	  		
		  	  	set.on('touchend', function() {
	  	  			var indexes=this.ij.split(":");	
	  		        um.matrix[indexes[0]][indexes[1]]=undefined;
	  		        //window.alert(um.matrix[indexes[0]][indexes[1]]);
	  		        um.draw();
	  		        return;
	  		    });
  	  			
  				layer.add(set);
  			}
  		}
  	}

  	var lineV = new Kinetic.Line({
		points: [numH.getX()+25*this.scale+10*this.scale,0,numH.getX()+25*this.scale+10*this.scale,dim],
		stroke: 'black',
		strokeWidth: 2*this.scale,
	});
		
		var lineH = new Kinetic.Line({
		points: [0,numV.getY()+25*this.scale,dim,numV.getY()+25*this.scale],
		stroke: 'black',
		strokeWidth: 2*this.scale,
	});
		
	layer.add(lineH);
	layer.add(lineV);
  	
	this.stage.add(layer);	  
}