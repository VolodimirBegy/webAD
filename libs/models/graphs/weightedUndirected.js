/*
 Software License Agreement (BSD License)
 http://wwwlab.cs.univie.ac.at/~a1100570/webAD/
 Copyright (c), Volodimir Begy
 All rights reserved.


 Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following condition is met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND RIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

function Node(){
	this.index=undefined;
	this.color="lime";
	this.oColor="lime";
	this.connectedTo=[];
	this.connectedWeights=[];
}

function Edge(u,v,w){
	this.u=u;
	this.v=v;
	this.weight=w;
	this.color="black";
	this.index=undefined;
}

function WeightedUndirectedGraph(){
	this.view=new UndirectedGraphView(this);
	this.db=[];
	this.actStateID=-1;
}

WeightedUndirectedGraph.prototype.fill=function(_matrix){	
	this.nodes=[];
	this.edges=[];
	this.costMatrix=_matrix;
	this.matrixLink=new Array(_matrix.length);
	
	function addConnected(graph,index){
		var cNode=undefined;
		
		if(graph.nodes[graph.matrixLink[index]]==undefined){
			cNode=new Node();
			cNode.index=index;
			
			graph.nodes.push(cNode);
			graph.matrixLink[cNode.index]=graph.nodes.length-1;
		}
		else{
			cNode=graph.nodes[graph.matrixLink[index]];
		}
		
		for(var i=0;i<_matrix.length;i++){
			if(_matrix[index][i]!=undefined){
				var newNode=undefined;
				
				if(graph.nodes[graph.matrixLink[i]]==undefined){
					newNode=new Node();
					newNode.index=i;
					
					graph.nodes.push(newNode);
					graph.matrixLink[newNode.index]=graph.nodes.length-1;
				}
				else{
					newNode=graph.nodes[graph.matrixLink[i]];
				}
				
				var alreadyConnected=false;
				for(var j=0;j<cNode.connectedTo.length;j++){
					if(cNode.connectedTo[j]==newNode){
						alreadyConnected=true;break;
					}
				}
				
				if(index==graph.nodes[0].index){cNode.color="#00FFFF";cNode.oColor="#00FFFF";}
			
				//ignore duplicates
				var eExists=false;
				for(var j=0;j<graph.edges.length;j++){
					if((graph.edges[j].u==cNode && graph.edges[j].v==newNode) ||
							(graph.edges[j].v==cNode && graph.edges[j].u==newNode)){
						eExists=true;break
					}
				}
				if(!eExists){
					graph.edges.push(new Edge(cNode,newNode,_matrix[index][i]));
					graph.edges[graph.edges.length-1].index=graph.edges.length-1;
				}
				
				if(!alreadyConnected){
					cNode.connectedTo.push(newNode);
					cNode.connectedWeights.push(_matrix[index][i]);
					addConnected(graph,cNode.connectedTo[cNode.connectedTo.length-1].index);
				}
				
			}
		}
	}
	
	addConnected(this,0);
	
	this.gridSize=Math.ceil(Math.sqrt(this.nodes.length));
	var index=0;
	for(var i=0;i<this.gridSize;i++){
		for(var j=0;j<this.gridSize;j++){
			if(this.nodes[index]!=undefined){
				this.nodes[index].xPosition=100+150*j;
				this.nodes[index].yPosition=50+150*i;
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
}

WeightedUndirectedGraph.prototype.init=function(c1){
	this.view.initStage(c1);
	this.A=undefined;
	this.p=undefined;
	this.i=undefined;
	this.draw();
	this.saveInDB();
}

function compare(a,b) {
	  if (a.weight < b.weight)
	     return -1;
	  if (a.weight > b.weight)
		  return 1;
	  return 0;
}

WeightedUndirectedGraph.prototype.copy=function(){
	var newG = new WeightedUndirectedGraph();
	newG.fill(this.costMatrix);
	for(var i=0;i<this.nodes.length;i++){
		newG.nodes[i].index=this.nodes[i].index;
		newG.nodes[i].color=this.nodes[i].color;
		newG.nodes[i].oColor=this.nodes[i].oColor;
		newG.nodes[i].xPosition=this.nodes[i].xPosition;
		newG.nodes[i].yPosition=this.nodes[i].yPosition;
	}
	
	newG.i=this.i;
	
	for(var i=0;i<this.edges.length;i++){
		for(var j=0;j<newG.edges.length;j++){
			if(this.edges[i].index==newG.edges[j].index){
				newG.edges[j].color=this.edges[i].color;
				break;
			}
		}
	}
	
	if(this.A!=undefined){
		newG.A=[];
		newG.edges.sort(compare);
		for(var i=0;i<this.A.length;i++){
			for(var j=0;j<newG.edges.length;j++){
				if(this.A[i].index==newG.edges[j].index){
					newG.A.push(newG.edges[j]);break;
				}
			}
		}
	}
	else
		newG.A=undefined;
	if(this.p!=undefined){
		newG.p=new Array(this.p.length);
		for(var i=0;i<this.p.length;i++){
			if(this.p[i]!=undefined){
				newG.p[i]=newG.nodes[newG.matrixLink[this.p[i].index]];
			}
		}
	}
	else
		newG.p=undefined;
	return newG;
}

WeightedUndirectedGraph.prototype.replaceThis=function(og){
	var newG = new WeightedUndirectedGraph();
	newG.fill(og.costMatrix);

	this.startNode=newG.startNode;
	this.costMatrix=newG.costMatrix;
	this.nodes=newG.nodes;
	this.edges=newG.edges;
	this.matrixLink=newG.matrixLink;
	for(var i=0;i<og.nodes.length;i++){
		this.nodes[i].index=og.nodes[i].index;
		this.nodes[i].color=og.nodes[i].color;
		this.nodes[i].oColor=og.nodes[i].oColor;
		this.nodes[i].xPosition=og.nodes[i].xPosition;
		this.nodes[i].yPosition=og.nodes[i].yPosition;
	}

	this.i=og.i;
	
	for(var i=0;i<og.edges.length;i++){
		for(var j=0;j<this.edges.length;j++){
			if(og.edges[i].index==this.edges[j].index){
				this.edges[j].color=og.edges[i].color;
				break;
			}
		}
	}
	
	if(og.A!=undefined){
		this.A=[];
		this.edges.sort(compare);
		for(var i=0;i<og.A.length;i++){
			for(var j=0;j<this.edges.length;j++){
				if(og.A[i].index==this.edges[j].index){
					this.A.push(this.edges[j]);break;
				}
			}
		}
	}
	else
		this.A=undefined;
	if(og.p!=undefined){
		this.p=new Array(og.p.length);
		for(var i=0;i<og.p.length;i++){
			if(og.p[i]!=undefined){
				this.p[i]=this.nodes[this.matrixLink[og.p[i].index]];
			}
		}
	}
	else
		this.p=undefined;
}


WeightedUndirectedGraph.prototype.prev=function(){
	if(this.actStateID>0){
		var prev_id=this.actStateID-1;
		this.actStateID=prev_id;
		var rs=this.db[prev_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

WeightedUndirectedGraph.prototype.next=function(){
	if(this.actStateID<this.db.length-1){
		var next_id=this.actStateID+1;
		this.actStateID=next_id;
		var rs=this.db[next_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

WeightedUndirectedGraph.prototype.firstState=function(){
	this.actStateID=0;
	var rs=this.db[0];
	//make actual node to THIS:
    this.replaceThis(rs);
    this.draw();
}

WeightedUndirectedGraph.prototype.lastState=function(){
	var last_id=this.db.length-1;
	this.actStateID=last_id;
	var rs=this.db[last_id];
	//make actual node to THIS:
     this.replaceThis(rs);
     this.draw();
}

WeightedUndirectedGraph.prototype.saveInDB=function(){
	var count=this.db.length-1;
 	if(count!=this.actStateID){
       	for(var i=this.actStateID+1;i<=count;++i){
           	this.db.splice(this.db.length-1,1);
       	}
 	}

	var nextID=this.db.length;
	var new_state = this.copy(this);
	
	var last_state=this.db[this.db.length-1];
	var same=true;
	
	if(last_state==undefined || new_state.nodes.length!=last_state.nodes.length ||
			new_state.edges.length!=last_state.edges.length){
		same=false;
	}
	else{
		for(var i=0;i<new_state.nodes.length;i++){
			if(new_state.nodes[i].color!=last_state.nodes[i].color ||
					new_state.nodes[i].index!=last_state.nodes[i].index||
					new_state.nodes[i].oColor!=last_state.nodes[i].oColor||
					new_state.nodes[i].connectedTo.length!=last_state.nodes[i].connectedTo.length){
				same=false;break;
			}
		}
		for(var i=0;i<new_state.edges.length;i++){
			if(new_state.edges[i].weight!=last_state.edges[i].weight||
					new_state.edges[i].u.index!=last_state.edges[i].u.index||
					new_state.edges[i].v.index!=last_state.edges[i].v.index||
					new_state.edges[i].color!=last_state.edges[i].color){
				same=false;
			}
		}
	}
	
	if(!same){
		this.db.push(new_state);
		this.actStateID=nextID;
	}
}

WeightedUndirectedGraph.prototype.kruskal=function(){
	if(this.nodes.length==1)
		return;
	var delay=0;
	if(this.A==undefined ||(this.i==this.edges.length)){
		
		if(this.i==this.edges.length){
			 delay=1000;
		
			for(var k=0;k<graph.edges.length;k++)
				graph.edges[k].color="black";
		}
		
		if(this.A==undefined){
			this.edges.sort(compare);
		}
		
		this.A=[];
	
		this.p=new Array(this.nodes.length);
		
		//make set fuer alle knoten
		for(var i=0;i<this.nodes.length;i++){
			makeSet(this.nodes[i],this);
		}

		this.i=0;
	}
	
	function step(graph){
		setTimeout(function(){
			if(findSet(graph.edges[graph.i].u,graph)!= findSet(graph.edges[graph.i].v,graph)){
				graph.A.push(graph.edges[graph.i]);
				graph.edges[graph.i].color="lime";
			}
			else{
				graph.edges[graph.i].color="#6699FF";
			}
			union(graph.edges[graph.i].u,graph.edges[graph.i].v,graph);
			
			graph.i++;
			graph.saveInDB();
			graph.draw();
			
			if(graph.i<graph.edges.length)
				step(graph);			
		},2000)
	}
	
	function startKruskal(graph){
		setTimeout(function(){
			step(graph);
		},delay)
	}
	
	startKruskal(this);
	
	function makeSet(x,graph){
		graph.p[x.index]=x;
	}
	
	function findSet(x,graph){
		if(x!=graph.p[x.index]) return findSet(graph.p[x.index],graph);
		return graph.p[x.index];
	}
	
	function link(x,y,graph){
		graph.p[y.index]=x;
	}
	
	function union(x,y,graph){
		link(findSet(x,graph),findSet(y,graph),graph);
	}
}

WeightedUndirectedGraph.prototype.draw=function(){
	this.view.draw();
}