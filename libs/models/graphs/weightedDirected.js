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

function WeightedDirectedGraph(_matrix,startNode,con){
	this.view=new WeightedDirectedGraphView(this);
	
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
					if(graph.edges[j].u==cNode && graph.edges[j].v==newNode){
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
	
	
	addConnected(this,startNode);
	
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
	
	this.draw(con);
	
	this.db=TAFFY();
	this.actStateID=0;
}

WeightedDirectedGraph.prototype.dijkstra=function(cont){
	var delay=2000;
	
	if(this.Q==undefined || this.Q.length==0){
		this.uSet=true;
		delay=0;
		this.i=0;
		for(var i=0;i<this.edges.length;i++)
			this.edges[i].color="black";
		
		for(var i=1;i<this.nodes.length;i++){
			this.nodes[i].color="lime";
		}
		
		this.dist=new Array(this.costMatrix.length);
		this.prev=new Array(this.costMatrix.length);
		this.S=[];
		
		var source=this.nodes[0];
		this.S.push(source);
		this.dist[source.index]=0;
		this.prev[source.index]=undefined;
		
		this.draw(cont);
		this.Q=[];
		
		for(var i=0;i<this.nodes.length;i++){
			var v=this.nodes[i];
			if(v!=source){
				this.dist[v.index]=Number.MAX_VALUE;
				this.prev[v.index]=undefined;
			}
			
			this.Q.push(v);
		}
	}
	
	this.draw(cont);
	
	if(this.uSet)delay=0;
	
	function step(graph){
		setTimeout(function(){
			var u=graph.Q[0];
			graph.uSet=true;
			var index=0;
			
			for(var i=0;i<graph.Q.length;i++){
				if(graph.dist[graph.Q[i].index]<graph.dist[u.index]){
					u=graph.Q[i];index=i;
				}
			}
			
			//because of return while pausing
			if($.inArray(u,graph.S)<0)
				graph.S.push(u);
			
			u.color="#00FFFF";
			graph.draw(cont);

			
			//i<u.connectedTo.length
			function processU(){
				setTimeout(function(){

					var v=u.connectedTo[graph.i];
					var alt=graph.dist[u.index]+graph.costMatrix[u.index][v.index];
					
					if(alt<graph.dist[v.index]){
						graph.dist[v.index]=alt;
						
						var oldU=graph.prev[v.index];
						
						graph.prev[v.index]=u;
						
						//prev for v is u
						
						for(var j=0;j<graph.edges.length;j++){
							if(graph.edges[j].u==u && graph.edges[j].v==v){
								graph.edges[j].color="lime";break;
							}
						}
						for(var j=0;j<graph.edges.length;j++){
							if(graph.edges[j].u==oldU && graph.edges[j].v==v){
								graph.edges[j].color="#6699FF";break;
							}
						}

					}
					else{
						
						for(var j=0;j<graph.edges.length;j++){
							if(graph.edges[j].u==u && graph.edges[j].v==v){
								graph.edges[j].color="#6699FF";eIndex=j;_in=true;break;
							}
						}
					}
					
					graph.draw(cont);
			
					
					graph.i++;
				
					if(graph.i<u.connectedTo.length){
						processU(graph);
						return;
					}
					else{
						graph.i=0;
						graph.Q.splice(index,1);
						graph.uSet=false;
						delay=2000;
						graph.delay=2000;
						if(graph.Q.length>0){
							step(graph);
							return;
						}
					}
				},2000)
			}
			
			if(graph.i<u.connectedTo.length){
				processU(graph);
				return;
			}
			else{
				graph.Q.splice(index,1);
				graph.uSet=false;
				delay=2000;
				graph.delay=2000;
				if(graph.Q.length>0){
					step(graph);
					return;
				}
			}
			
		},delay)
	}

	if(graph.Q.length>0)
		step(this);
	
}

WeightedDirectedGraph.prototype.draw=function(cont){
	this.view.draw(cont);
}