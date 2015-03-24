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

function Node(){
	this.index=undefined;
	this.color="lime";
	this.connectedTo=[];
}

function UndirectedGraph(_matrix,_startNode,con){
	this.view=new UndirectedGraphView(this);
	
	this.nodes=[];
	this.startNode=_startNode;
		
	function addConnected(graph,index){
		var cNode=new Node();
		cNode.index=index;
		for(var i=0;i<_matrix.length;i++){
			if(_matrix[index][i]!=undefined){
				var newNode=new Node();
				newNode.index=i;
				cNode.connectedTo.push(newNode);
				if(index==_startNode)cNode.color="#00FFFF";
			}
		}
		
		graph.nodes.push(cNode);
		
		for(i=0;i<cNode.connectedTo.length;i++){
			var exists=false;
			for(var j=0;j<graph.nodes.length;j++){
				if(graph.nodes[j].index==cNode.connectedTo[i].index)
					exists=true;
			}
			if(!exists)
				addConnected(graph,cNode.connectedTo[i].index);
		}
	}
	
	addConnected(this,_startNode);
	
	this.gridSize=Math.ceil(Math.sqrt(this.nodes.length));
	var index=0;
	for(var i=0;i<this.gridSize;i++){
		for(var j=0;j<this.gridSize;j++){
			if(this.nodes[index]!=undefined){
				this.nodes[index].xPosition=50+75*j;
				this.nodes[index].yPosition=50+75*i;
				index++;
			}
			else break;
		}
	}
	
	for(var i=0;i<this.nodes.length;i++){
		
		for(var j=0;j<this.nodes[i].connectedTo.length;j++){
			
			var ai=this.nodes[i].connectedTo[j].index;
			var tmpN=undefined;
			for(var k=0;k<this.nodes.length;k++){
				if(this.nodes[k].index==ai)
					tmpN=this.nodes[k];
			}
			this.nodes[i].connectedTo[j].xPosition=tmpN.xPosition;
			this.nodes[i].connectedTo[j].yPosition=tmpN.yPosition;
		}
	}
	
	this.draw(con);
	
	this.db=TAFFY();
	this.actStateID=0;
}

UndirectedGraph.prototype.draw=function(cont){
	this.view.draw(cont);
}