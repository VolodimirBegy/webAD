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
}

function WeightedUndirectedGraph(_matrix,c1){
	this.view=new UndirectedGraphView(this);
	
	this.nodes=[];
	this.edges=[];
	
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
				if(!eExists)
					graph.edges.push(new Edge(cNode,newNode,_matrix[index][i]));
				
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
				this.nodes[index].xPosition=100+75*j;
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
	this.view.initStage(c1);
	this.draw();
	
	this.db=TAFFY();
	this.actStateID=0;
}

WeightedUndirectedGraph.prototype.kruskal=function(){
	var delay=0;
	if(this.A==undefined ||(this.i==this.edges.length)){
		
		if(this.i==this.edges.length){
			 delay=1000;
		
			for(var k=0;k<graph.edges.length;k++)
				graph.edges[k].color="black";
		}
		
		if(this.A==undefined){
			//sortiere alle kanten 
			function compare(a,b) {
				  if (a.weight < b.weight)
				     return -1;
				  if (a.weight > b.weight)
					  return 1;
				  return 0;
			}
			
			this.edges.sort(compare);
		}
		
		this.A=[];
	
		this.p=new Array(this.nodes.length);
		
		//make set fuer alle knoten
		for(var i=0;i<this.nodes.length;i++){
			makeSet(this.nodes[i]);
		}
		
		this.i=0;
	}
	
	this.draw();
	
	function step(graph){
		setTimeout(function(){
			if(findSet(graph.edges[graph.i].u)!= findSet(graph.edges[graph.i].v)){
				graph.A.push(graph.edges[graph.i]);
				graph.edges[graph.i].color="lime";
			}
			else{
				graph.edges[graph.i].color="#6699FF";
			}
			union(graph.edges[graph.i].u,graph.edges[graph.i].v);
			
			graph.i++;
			
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
	
	function makeSet(x){
		this.p[x.index]=x;
	}
	
	function findSet(x){
		if(x!=this.p[x.index]) return findSet(this.p[x.index]);
		return this.p[x.index];
	}
	
	function link(x,y){
		this.p[y.index]=x;
	}
	
	function union(x,y){
		link(findSet(x),findSet(y));
	}
}

WeightedUndirectedGraph.prototype.draw=function(){
	this.view.draw();
}