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
 
function TrieView(_model){
	this.model=_model;
	this.scale=1;
}

TrieView.prototype.initStage=function(cont){
	this.stage = new Kinetic.Stage({
  		container: cont,
  		draggable: true,
		width: 0,
		height: 0
	}); 
}

TrieView.prototype.zoomIn=function(){
  if(this.scale<2.5)this.scale=this.scale+0.1;
  	this.draw();
}

TrieView.prototype.zoomOut=function(){
  if(this.scale>0.5)this.scale=this.scale-0.1;
  	this.draw();
}

TrieView.prototype.draw=function(){
	//this.model.setColor();

	// fill tmpNodes, calculate maxlevel and nodes per level (npl)
	var tmpNodes=[];
	var maxlevel = 0;
	var npl = [];

	var level = 0;
	var ends = 0;
	function recursiveTraversalLevel(actNode, level){
		
		tmpNodes.push(actNode);
		if(npl[level]===undefined)
			npl[level]=1;
		else 
			npl[level]++;
		level++;
		
		if(actNode.value==="$" || actNode.children===undefined){
			if(level>maxlevel)
				maxlevel = level;
			ends++;
			return;
		}
		
		var actChildren = actNode.children;
		for(var j=0;j<actChildren.length;j++){
			
			recursiveTraversalLevel(actNode.children[j], level);
		}
	}
	if(this.model.root!=undefined)
		recursiveTraversalLevel(this.model.root, level);
	
	// calculate width
	var maxNpl = 0;
	for(var i=0;i<npl.length;i++){
		
		if(npl[i]>maxNpl)
			maxNpl = npl[i];
	}
	
	
	// define vals for drawing
	var _radius = 20*this.scale;
	var w = (_radius*3 + _radius*4*ends ) *this.scale;
	var h=500;
	if(maxlevel>7)
		h=300+(maxlevel-4)*3*_radius;
	if(this.scale>1.1)
		h*=this.scale;
	if(w<1000)w=1000;
	
	this.stage.setHeight(h);
	this.stage.setWidth(w);
	this.stage.removeChildren();

	var layer = new Kinetic.Layer();
	
	// calculate x and y position of every node
	
	function recursiveTraversalPosition(actNode, childShift){
		
		if(actNode.value==="0"){
			actNode.xPosition = _radius*3;
			actNode.yPosition = _radius*3;
		}
		else{
			actNode.xPosition = actNode.parent.xPosition;
			actNode.yPosition = actNode.parent.yPosition + _radius*3;
		}
		
		actNode.xPosition = actNode.xPosition + childShift;
		
		var shift = 0;
		var children = actNode.children;
		if(children===undefined)
			return 0;
		for(var i=0;i<children.length;i++){
			
			if(i>0){
				shift += _radius*2;
			}
			shift += recursiveTraversalPosition(children[i], shift*2);
			
		}
		actNode.xPosition += shift;
		
		return shift;
	}

	if(this.model.root!=undefined)
		recursiveTraversalPosition(this.model.root, 0);
	
	
	// draw nodes from tmpNodes
	for(var i=0;i<tmpNodes.length;i++){
			
		// draw (if node exists)
		if(tmpNodes[i]!=undefined){
			
			// make start node a different color
			if(tmpNodes[i].value==="0" && tmpNodes[i].color!=tree.color3)
				tmpNodes[i].color = tree.color1;
			
			// make end nodes a different color
			else if(tmpNodes[i].value==="$" && tmpNodes[i].color!=tree.color3)
				tmpNodes[i].color = tree.color1;
			
			else if(tmpNodes[i].color!=tree.color3)
				tmpNodes[i].color = tree.color2;
			
			// draw node
			var circle = new Kinetic.Circle({
				x: tmpNodes[i].xPosition,
				y: tmpNodes[i].yPosition,
				radius:_radius,
				fill: tmpNodes[i].color,
				strokeWidth: 4*this.scale,
				//draggable: true
			});
			layer.add(circle);
				
			// draw value on node (if not root)
			if(tmpNodes[i].value!="0"){
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
				layer.add(val);
			}
				
			// draw line (if node not root)
			if(tmpNodes[i]!=undefined && tmpNodes[i].parent!=undefined){
				var line = new Kinetic.Line({
					points: [circle.getX(),circle.getY()-_radius,tmpNodes[i].parent.xPosition,tmpNodes[i].parent.yPosition+_radius],
					stroke: "blue",
					strokeWidth: (0.1*_radius),
					lineJoin: 'round',
				});
				layer.add(line);
			}
		}
	}
	
	this.stage.add(layer);
}