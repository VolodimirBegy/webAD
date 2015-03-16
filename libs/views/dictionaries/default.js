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

HashTableView.prototype.zoomIn=function(cont){
	if(this.scale<3)this.scale=this.scale+0.1;
	this.draw(this.model,cont);
}

HashTableView.prototype.zoomOut=function(cont){
	if(this.scale>0.2)this.scale=this.scale-0.1;
	this.draw(this.model,cont);
}

HashTableView.prototype.draw=function(m,cont){
	
	var layer = new Kinetic.Layer();
		  
	var group = new Kinetic.Group();
		
	var hash = new Kinetic.Text({
		x: 50*this.scale,
		y: 0,
		text: "hash function: k mod "+m.rows.length,
		fontSize: 18*this.scale,
		fontFamily: 'Calibri',
		fill: 'red',
	});

	var calcTxt=m.calc;
	var calcY=0;
	if(m.actCalc!=undefined){
		calcY=(50+m.actCalc*50)*this.scale;
	}
	if(calcTxt==undefined)calcTxt=" ";
	var calc = new Kinetic.Text({
		x: 300*this.scale,
		y: calcY,
		text: calcTxt,
		fontSize: 18*this.scale,
		fontFamily: 'Calibri',
		fill: 'black'
	});

	var fillTxt="Fill Factor: "+Math.floor(m.fillFactor * 100)+"%";
	if(m.fillFactor>0.7){
		fillTxt+=" -> Extend!";
	}
		
	var fillFactor = new Kinetic.Text({
		x: calc.getX(),
		y: 0,
		text: fillTxt,
		fontSize: 18*this.scale,
		fontFamily: 'Calibri',
		fill: 'green'
	});
		
	var toAddTxt="";
	if(m.overflow!=undefined && m.overflow.length>0){
		for(var i=0;i<m.overflow.length;i++){
			toAddTxt+=m.overflow[i]+",";
		}
		toAddTxt=toAddTxt.substring(0,toAddTxt.length-1);
	}
		
	var toAdd = new Kinetic.Text({
		x: hash.getX(),
		y: 15*this.scale+10*this.scale,
		text: toAddTxt,
		fontSize: 18*this.scale,
		fontFamily: 'Calibri',
		fill: 'black',
		textWidth:toAddTxt.length*20*this.scale
	});
	
	for(var i=0;i<m.rows.length;i++){
		var color="#9AFE2E";
		if(m.rows[i].extraCheck==true){
			color="#FF33CC";
		}
		var rect = new Kinetic.Rect({
			x: 50*this.scale,
			y: (50+i*50)*this.scale,
			width: 200*this.scale,
			height: 50*this.scale,
			fill: color,
			stroke: 'black',
			strokeWidth: 4*this.scale,
		});
		  
		var text = new Kinetic.Text({
			x: rect.getX()-25*this.scale,
			y: rect.getY(),
			text: i,
			fontSize: 18*this.scale,
			fontFamily: 'Calibri',
			fill: 'black',
		});
		  
		var txt;
		if(m.rows[i].value==undefined)
			txt="x";
		else
			txt=m.rows[i].value;
		var textVal = new Kinetic.Text({
			x: rect.getX()+10*this.scale,
			y: rect.getY(),
			text: txt,
			fontSize: 18*this.scale,
			fontFamily: 'Calibri',
			fill: m.rows[i].color,
		});
		  
		group.add(rect);
		group.add(text);
		group.add(textVal);
	}
	group.add(hash);
	group.add(calc);
	group.add(fillFactor);
	group.add(toAdd);

	// add the shape to the layer
	layer.add(group);
	
	var h=100*this.scale+m.rows.length*100*this.scale;
	var w=0;
	
	if(calc.getX()+calc.getWidth()>fillFactor.getX()+fillFactor.getWidth() && 
			calc.getX()+calc.getWidth() > toAdd.getX()+toAdd.getWidth())
		w=calc.getX()+calc.getWidth();
	else if(fillFactor.getX()+fillFactor.getWidth() > calc.getX()+calc.getWidth() &&
			fillFactor.getX()+fillFactor.getWidth() > toAdd.getX()+toAdd.getWidth())
		w=fillFactor.getX()+fillFactor.getWidth();
	else
		w=toAdd.getX()+toAdd.getWidth();
	
	var stage = new Kinetic.Stage({
		container: cont,
		width: w,
		height: h
	}); 
	
	stage.add(layer);
}