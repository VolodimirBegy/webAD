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
	this.w=w;
}

function UnweightedUndirectedGraph(_matrix,_startNode,con){
	this.view=new UndirectedGraphView(this);
	
	this.nodes=[];
	this.startNode=_startNode;

	this.visited=[];
	
	this.matrixLink=new Array(_matrix.length);
	
	function addConnected(graph,index){
		var cNode=new Node();
		cNode.index=index;
		for(var i=0;i<_matrix.length;i++){
			if(_matrix[index][i]!=undefined){
				var newNode=new Node();
				newNode.index=i;
				cNode.connectedTo.push(newNode);
				if(index==_startNode){cNode.color="#00FFFF";cNode.oColor="#00FFFF";}
			}
		}
		
		graph.nodes.push(cNode);
		
		graph.matrixLink[cNode.index]=graph.nodes.length-1;
		
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
	
	this.draw(con);
	
	this.db=TAFFY();
	this.actStateID=0;
}

function WeightedUndirectedGraph(_matrix,con){
	this.view=new UndirectedGraphView(this);
	
	this.nodes=[];
	this.edges=[];
	
	this.matrixLink=new Array(_matrix.length);
	
	function addConnected(graph,index){
		var cNode=new Node();
		cNode.index=index;
		for(var i=0;i<_matrix.length;i++){
			if(_matrix[index][i]!=undefined){
				var newNode=new Node();
				newNode.index=i;
				cNode.connectedTo.push(newNode);
				cNode.connectedWeights.push(_matrix[index][i]);
				
				//ignore duplicates?
				graph.edges.push(new Edge(cNode,newNode,_matrix[index][i]));
			}
		}
		
		graph.nodes.push(cNode);
		
		graph.matrixLink[cNode.index]=graph.nodes.length-1;
		
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
	
	this.draw(con);
	
	this.db=TAFFY();
	this.actStateID=0;
}

UnweightedUndirectedGraph.prototype.dfs=function(cont){
	//push into stack-> process upper -> push 
	// cause initial has always index 0
	if(this.stack==undefined)
		this.stack=[];
	if(this.stack.length==0)
		this.stack.push(this.nodes[this.matrixLink[this.startNode]]);
	
	function _dfs(graph){
		//make all from stack red
		for(var k=0;k<graph.stack.length;k++){
			graph.stack[k].color="red";
			graph.stack[k].oColor="red";
			var ai=graph.matrixLink[graph.stack[k].index];
			graph.nodes[ai].color="red";
			graph.nodes[ai].oColor="red";
			for(var p=0;p<graph.nodes.length;p++){
				for(var z=0;z<graph.nodes[p].connectedTo.length;z++){
					if(graph.nodes[p].connectedTo[z].index==graph.stack[k].index){
						graph.nodes[p].connectedTo[z].color="red";
						graph.nodes[p].connectedTo[z].oColor="red";
					}
				}
			}
		}
		
		graph.draw(cont);
		
		function processAct(graph){
			setTimeout(function (){
				var ai=graph.matrixLink[graph.stack[graph.stack.length-1].index];
				graph.stack[graph.stack.length-1].color="lime";
				graph.stack[graph.stack.length-1].oColor="lime";
				graph.nodes[ai].color="lime";
				graph.nodes[ai].oColor="lime";
				for(var p=0;p<graph.nodes.length;p++){
					for(var z=0;z<graph.nodes[p].connectedTo.length;z++){
						if(graph.nodes[p].connectedTo[z].index==graph.nodes[ai].index){
							graph.nodes[p].connectedTo[z].color="lime";
							graph.nodes[p].connectedTo[z].oColor="lime";
						}
					}
				}
				
				graph.visited.push(graph.stack[graph.stack.length-1]);
				graph.stack.splice(graph.stack.length-1,1);
				graph.draw(cont);
				//process connected
				for(i=0;i<graph.nodes[ai].connectedTo.length;i++){
					var exists=false;
					
					for(var j=0;j<graph.visited.length;j++){
						if(graph.visited[j].index==graph.nodes[ai].connectedTo[i].index)
							exists=true;
					}
					
					for(var j=0;j<graph.stack.length;j++){
						if(graph.stack[j].index==graph.nodes[ai].connectedTo[i].index)
							exists=true;
					}
					
					if(!exists)
						graph.stack.push(graph.nodes[ai].connectedTo[i]);
				}
				
				if(graph.stack.length>0)
					_dfs(graph);
				else{
					graph.nodes[0].color="#00FFFF";graph.nodes[0].oColor="#00FFFF";
					graph.draw(cont);graph.visited=[];return;
				}

			},2000)
		}
		
		processAct(graph);
	}
	
	_dfs(this);
	
}

UnweightedUndirectedGraph.prototype.bfs=function(cont){
	//push into stack-> process upper -> push 
	// cause initial has always index 0
	if(this.queue==undefined)
		this.queue=[];
	if(this.queue.length==0)
		this.queue.push(this.nodes[this.matrixLink[this.startNode]]);
	
	function _bfs(graph){
		//make all from stack red
		for(var k=0;k<graph.queue.length;k++){
			graph.queue[k].color="red";
			graph.queue[k].oColor="red";
			var ai=graph.matrixLink[graph.queue[k].index];
			graph.nodes[ai].color="red";
			graph.nodes[ai].oColor="red";
			for(var p=0;p<graph.nodes.length;p++){
				for(var z=0;z<graph.nodes[p].connectedTo.length;z++){
					if(graph.nodes[p].connectedTo[z].index==graph.queue[k].index){
						graph.nodes[p].connectedTo[z].color="red";
						graph.nodes[p].connectedTo[z].oColor="red";
					}
				}
			}
		}
		
		graph.draw(cont);
		
		function processAct(graph){
			setTimeout(function (){
				var ai=graph.matrixLink[graph.queue[0].index];
				graph.queue[0].color="lime";
				graph.queue[0].oColor="lime";
				graph.nodes[ai].color="lime";
				graph.nodes[ai].oColor="lime";
				for(var p=0;p<graph.nodes.length;p++){
					for(var z=0;z<graph.nodes[p].connectedTo.length;z++){
						if(graph.nodes[p].connectedTo[z].index==graph.nodes[ai].index){
							graph.nodes[p].connectedTo[z].color="lime";
							graph.nodes[p].connectedTo[z].oColor="lime";
						}
					}
				}
				
				graph.visited.push(graph.queue[0]);
				graph.queue.splice(0,1);
				graph.draw(cont);
				//process connected
				for(i=0;i<graph.nodes[ai].connectedTo.length;i++){
					var exists=false;
					
					for(var j=0;j<graph.visited.length;j++){
						if(graph.visited[j].index==graph.nodes[ai].connectedTo[i].index)
							exists=true;
					}
					
					for(var j=0;j<graph.queue.length;j++){
						if(graph.queue[j].index==graph.nodes[ai].connectedTo[i].index)
							exists=true;
					}
					
					if(!exists)
						graph.queue.push(graph.nodes[ai].connectedTo[i]);
				}
				
				if(graph.queue.length>0)
					_bfs(graph);
				else{
					graph.nodes[0].color="#00FFFF";graph.nodes[0].oColor="#00FFFF";
					graph.draw(cont);graph.visited=[];return;
				}

			},2000)
		}
		
		processAct(graph);
	}
	
	_bfs(this);
	
}

UnweightedUndirectedGraph.prototype.draw=function(cont){
	this.view.draw(cont);
}