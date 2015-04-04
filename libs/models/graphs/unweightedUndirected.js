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

function UnweightedUndirectedGraph(_matrix,_startNode,c1){
	this.view=new UnweightedUndirectedGraphView(this);
	
	this.nodes=[];
	this.startNode=_startNode;

	this.visited=[];
	
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
			
				if(!alreadyConnected){
					cNode.connectedTo.push(newNode);
					addConnected(graph,cNode.connectedTo[cNode.connectedTo.length-1].index);
				}
				
			}
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
	this.view.initStage(c1);
	this.draw();
	
	this.db=[];
	this.actStateID=-1;
}

UnweightedUndirectedGraph.prototype.dfs=function(){
	//push into stack-> process upper -> push 
	// cause initial has always index 0
	var delay=0;
	if(this.visited.length==this.nodes.length){
		for(var j=0;j<this.nodes.length;j++){
			this.nodes[j].color="lime";
			this.nodes[j].oColor="lime";
		}
		this.nodes[0].color="#00FFFF";this.nodes[0].oColor="#00FFFF";
		this.visited=[];this.draw();delay=1000;
	}
	
	if(this.stack==undefined)
		this.stack=[];
	if(this.stack.length==0)
		this.stack.push(this.nodes[this.matrixLink[this.startNode]]);
	
	function _dfs(graph){
		//make all from stack red
		for(var k=0;k<graph.stack.length;k++){
			graph.stack[k].color="red";
			graph.stack[k].oColor="red";
		}
		
		graph.draw();
		
		function processAct(graph){
			setTimeout(function (){
				var ai=graph.matrixLink[graph.stack[graph.stack.length-1].index];
				graph.stack[graph.stack.length-1].color="grey";
				graph.stack[graph.stack.length-1].oColor="grey";
				
				graph.visited.push(graph.stack[graph.stack.length-1]);
				graph.stack.splice(graph.stack.length-1,1);
				graph.draw();
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
				

			},2000)
		}
		
		processAct(graph);
	}
	
	function startDFS(graph){
		setTimeout(function(){
			_dfs(graph);
		},delay)
	}
	
	startDFS(this);
	
}

UnweightedUndirectedGraph.prototype.bfs=function(){
	//push into stack-> process upper -> push 
	// cause initial has always index 0
	var delay=0;
	if(this.visited.length==this.nodes.length){
		for(var j=0;j<this.nodes.length;j++){
			this.nodes[j].color="lime";
			this.nodes[j].oColor="lime";
		}
		this.nodes[0].color="#00FFFF";this.nodes[0].oColor="#00FFFF";
		this.visited=[];this.draw();delay=1000;
	}
	if(this.queue==undefined)
		this.queue=[];
	if(this.queue.length==0)
		this.queue.push(this.nodes[this.matrixLink[this.startNode]]);
	
	function _bfs(graph){
		//make all from stack red
		for(var k=0;k<graph.queue.length;k++){
			graph.queue[k].color="red";
			graph.queue[k].oColor="red";
		}
		
		graph.draw();
		
		function processAct(graph){
			setTimeout(function (){
				var ai=graph.matrixLink[graph.queue[0].index];
				graph.queue[0].color="grey";
				graph.queue[0].oColor="grey";
				
				graph.visited.push(graph.queue[0]);
				graph.queue.splice(0,1);
				graph.draw();
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
			},2000)
		}
		
		processAct(graph);
	}
	
	function startBFS(graph){
		setTimeout(function(){
			_bfs(graph);
		},delay)
	}
	
	startBFS(this);
}

UnweightedUndirectedGraph.prototype.draw=function(){
	this.view.draw();
}