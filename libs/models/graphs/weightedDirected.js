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

function WeightedDirectedGraph(){
	this.view=new WeightedDirectedGraphView(this);
	this.db=[];
	this.actStateID=-1;
}

WeightedDirectedGraph.prototype.fill=function(_matrix,startNode){
	this.startNode=startNode;
	
	this.nodes=[];
	this.edges=[];

	//matrix deep copy
	this.costMatrix=[];

	for(var i=0;i<_matrix.length;i++){
		this.costMatrix.push(new Array(_matrix.length));
	}
	
	for(var i=0;i<_matrix.length;i++){
		for(var j=0;j<_matrix.length;j++){
			if(_matrix[i][j]!=undefined){
				this.costMatrix[i][j]=_matrix[i][j];
			}
		}
	}
	//matrix deep copy
	
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
}

WeightedDirectedGraph.prototype.init=function(c1){
	this.view.initStage(c1);
	this.Q=undefined; this.uSet=undefined; 
	this.i=undefined; this.dist=undefined; 
	this.prev=undefined; this.S=undefined;

	// floydwarshall
	this.j = undefined;
	this.k = undefined;
	this.speed = 5;
	this.paused = false;
	this.finished = false;

	this.draw();
	this.saveInDB();
}


WeightedDirectedGraph.prototype.copy=function(){
	var newG = new WeightedDirectedGraph();
	newG.fill(this.costMatrix,this.startNode);
	
	for(var i=0;i<this.nodes.length;i++){
		newG.nodes[i].index=this.nodes[i].index;
		newG.nodes[i].color=this.nodes[i].color;
		newG.nodes[i].oColor=this.nodes[i].oColor;
		newG.nodes[i].xPosition=this.nodes[i].xPosition;
		newG.nodes[i].yPosition=this.nodes[i].yPosition;
	}
	//Q, uSet, i, dist, prev, S
	newG.i=this.i;
	newG.uSet=this.uSet;

	// floydwarshall
	newG.j = this.j;
	newG.k = this.k;
	newG.speed = this.speed;
	newG.paused = true;
	newG.finished = this.newG;
	
	if(this.Q!=undefined){
		newG.Q=new Array(this.Q.length);
		for(var i=0;i<this.Q.length;i++){
			if(this.Q[i]!=undefined){
				newG.Q[i]=newG.nodes[newG.matrixLink[this.Q[i].index]];
			}
			else
				newG.Q[i]=undefined;
		}
	}
	else
		newG.Q=undefined;
	
	if(this.S!=undefined){
		newG.S=new Array(this.S.length);
		for(var i=0;i<this.S.length;i++){
			if(this.S[i]!=undefined){
				newG.S[i]=newG.nodes[newG.matrixLink[this.S[i].index]];
			}
			else
				newG.S[i]=undefined;
		}
	}
	else
		newG.S=undefined;
	
	if(this.dist!=undefined){
		newG.dist=new Array(this.dist.length);
		for(var i=0;i<this.dist.length;i++){
			newG.dist[i]=this.dist[i];
		}
	}
	else
		newG.dist=undefined;
	
	if(this.prev!=undefined){
		newG.prev=new Array(this.prev.length);
		for(var i=0;i<this.prev.length;i++){
			if(this.prev[i]!=undefined)
				newG.prev[i]=newG.nodes[newG.matrixLink[this.prev[i].index]];
			else
				newG.prev[i]=undefined;
		}
	}
	else
		newG.prev=undefined;
	
	for(var i=0;i<this.edges.length;i++){
		for(var j=0;j<newG.edges.length;j++){
			if(this.edges[i].index==newG.edges[j].index){
				
				newG.edges[j].color=this.edges[i].color;
				break;
			}
		}
	}
	

	return newG;
}

WeightedDirectedGraph.prototype.replaceThis=function(og){
	var newG = new WeightedDirectedGraph();
	newG.fill(og.costMatrix,og.startNode);

	this.startNode=newG.startNode;
	this.costMatrix=newG.costMatrix;
	
	this.nodes=newG.nodes;
	this.edges=newG.edges;
	
	this.matrixLink=newG.matrixLink;
	
	for(var i=0;i<og.nodes.length;i++){
		if(this.nodes[i]!=undefined){
			this.nodes[i].index=og.nodes[i].index;
			this.nodes[i].color=og.nodes[i].color;
			this.nodes[i].oColor=og.nodes[i].oColor;
			this.nodes[i].xPosition=og.nodes[i].xPosition;
			this.nodes[i].yPosition=og.nodes[i].yPosition;
		}
	}

	this.i=og.i;
	this.uSet=og.uSet;

	// floydwarshall
	this.j = og.j;
	this.k = og.k;
	this.speed = og.speed;
	this.paused = og;
	this.finished = og.newG;
	
	if(og.Q!=undefined){
		this.Q=new Array(og.Q.length);
		for(var i=0;i<og.Q.length;i++){
			if(og.Q[i]!=undefined){
				this.Q[i]=this.nodes[this.matrixLink[og.Q[i].index]];
			}
			else
				this.Q[i]=undefined;
		}
	}
	else
		this.Q=undefined;
	
	if(og.S!=undefined){
		this.S=new Array(og.S.length);
		for(var i=0;i<og.S.length;i++){
			if(og.S[i]!=undefined){
				this.S[i]=this.nodes[this.matrixLink[og.S[i].index]];
			}
			else
				this.S[i]=undefined;
		}
	}
	else
		this.S=undefined;
	
	if(og.dist!=undefined){
		this.dist=new Array(og.dist.length);
		for(var i=0;i<og.dist.length;i++){
			this.dist[i]=og.dist[i];
		}
	}
	else
		this.dist=undefined;
	
	if(og.prev!=undefined){
		this.prev=new Array(og.prev.length);
		for(var i=0;i<og.prev.length;i++){
			if(og.prev[i]!=undefined)
				this.prev[i]=this.nodes[this.matrixLink[og.prev[i].index]];
			else
				this.prev[i]=undefined;
		}
	}
	else
		this.prev=undefined;

	for(var i=0;i<og.edges.length;i++){
		for(var j=0;j<this.edges.length;j++){
			if(og.edges[i].index==this.edges[j].index){
				this.edges[j].color=og.edges[i].color;
				break;
			}
		}
	}
}


WeightedDirectedGraph.prototype.prevtr=function(){
	if(this.actStateID>0){
		var prev_id=this.actStateID-1;
		this.actStateID=prev_id;
		var rs=this.db[prev_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

WeightedDirectedGraph.prototype.next=function(){
	if(this.actStateID<this.db.length-1){
		var next_id=this.actStateID+1;
		this.actStateID=next_id;
		var rs=this.db[next_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

WeightedDirectedGraph.prototype.firstState=function(){
	this.actStateID=0;
	var rs=this.db[0];
	//make actual node to THIS:
    this.replaceThis(rs);
    this.draw();
}

WeightedDirectedGraph.prototype.lastState=function(){
	var last_id=this.db.length-1;
	this.actStateID=last_id;
	var rs=this.db[last_id];
	//make actual node to THIS:
     this.replaceThis(rs);
     this.draw();
}

WeightedDirectedGraph.prototype.saveInDB=function(){
	
	var count=this.db.length-1;
 	if(count!=this.actStateID){
 		this.db.splice(this.actStateID+1,count-this.actStateID);
 	}

	var nextID=this.db.length;
	var new_state = this.copy();
	
	var last_state=this.db[this.db.length-1];
	var same=true;
	
	if(last_state==undefined || new_state.costMatrix.length!=last_state.costMatrix.length||
			new_state.nodes.length!=last_state.nodes.length ||
			new_state.edges.length!=last_state.edges.length || (last_state.Q==undefined && new_state.Q!=undefined)
			||(last_state.Q!=undefined && new_state.Q.length!=last_state.Q.length)
			||(last_state.S==undefined && new_state.S==undefined)
			||(last_state.S!=undefined && new_state.S.length!=last_state.S.length)){
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
				//window.alert("not same");
			}
		}
	}
	
	if(!same){
		this.db.push(new_state);
		this.actStateID=nextID;
		//window.alert(this.actStateID);
	}
}

WeightedDirectedGraph.prototype.dijkstra=function(){
	//[25]
	var delay=2000;
	//Q, uSet, i, dist, prev, S
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
	
	this.draw();
	this.saveInDB();
	
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
			graph.draw();
			graph.saveInDB();

			
			//i<u.connectedTo.length
			function processU(){
				setTimeout(function(){

					var v=u.connectedTo[graph.i];
					var alt=graph.dist[u.index]+graph.costMatrix[u.index][v.index];
					
					if(alt<graph.dist[v.index]){
						graph.dist[v.index]=alt;
						
						var oldU=graph.prev[v.index];
						
						graph.prev[v.index]=u;
						/*if(oldU!=undefined)
						window.alert(oldU.index);
						else window.alert("undef");*/
						//prev for v is u
						
						for(var j=0;j<graph.edges.length;j++){
							if(graph.edges[j].u==u && graph.edges[j].v==v){
								graph.edges[j].color="lime";break;
								
							}
						}
						if(oldU!=undefined){
							for(var j=0;j<graph.edges.length;j++){
								if(graph.edges[j].u==oldU && graph.edges[j].v==v){
									graph.edges[j].color="#6699FF";break;
								}
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
					
					
					graph.i++;
					graph.draw();
					
				
					if(graph.i<u.connectedTo.length){
						graph.saveInDB();
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
							graph.saveInDB();
							step(graph);
							return;
						}
						else
							graph.saveInDB();
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

WeightedDirectedGraph.prototype.floydwarshall = function() {
    var graph = this;
	var n = this.nodes.length;
    var firstDelay = 0;

    if (n === 1 || graph.finished) {
        graph.finished = true;
        return;
	}

    function step() {
        setTimeout(function() {
            graph.k = graph.k === undefined ? 0 : graph.k;
            graph.i = graph.i === undefined ? 0 : graph.i;
            graph.j = graph.j === undefined ? 0 : graph.j;
            firstDelay = 100 * graph.speed;

            // nur Knoten
            if (graph.k === graph.i && graph.i === graph.j) {
                changeNodeColor();
                graph.draw();
                graph.saveInDB();
                resetGraphColor();
                // Knoten + Weg (zweiter)
            } else if (graph.k === graph.i) {
                changeNodeColor();
                changeEdgeColor(2);
                graph.draw();
                graph.saveInDB();
                resetGraphColor();
                // Knoten + Weg (erster)
            } else if (graph.k === graph.j) {
                changeNodeColor();
                changeEdgeColor(1);
                graph.draw();
                graph.saveInDB();
                resetGraphColor();
                // 2 Wege
            } else {
                changeEdgeColor(1);
                changeEdgeColor(2);
                graph.draw();
                graph.saveInDB();
                var firstLength = graph.costMatrix[graph.i][graph.k];
                var secondLength = graph.costMatrix[graph.k][graph.j];
                var shouldResetGraphColor = true;
                if (firstLength !== undefined && secondLength !== undefined) {
                    var oldPathlength = graph.costMatrix[graph.i][graph.j];
                    var newPathlength = firstLength + secondLength;
                    if (graph.i !== graph.j && (oldPathlength === undefined || newPathlength < oldPathlength)) {
                        var firstIndex = graph.i;
                        var secondIndex = graph.j;
                        var firstNode;
                        var secondNode;
                        var foundEdge = undefined;
                        $.each(graph.nodes, function(
                            index,
                            node
                        ) {
                            if (firstIndex === node.index) {
                                firstNode = node;
                            }
                            if (
                                secondIndex === node.index
                            ) {
                                secondNode = node;
                            }
                        });
                        $.each(graph.edges, function(
                            index,
                            edge
                        ) {
                            if (
                                edge.u === firstNode &&
                                edge.v === secondNode
                            ) {
                                foundEdge = edge;
                                return false;
                            }
						});
						setTimeout(function() {
							if (foundEdge !== undefined) {
								console.log("found Edge");
								foundEdge.weight = newPathlength;
								foundEdge.color = "red";
								graph.costMatrix[graph.i][graph.j] = newPathlength;
							} else {
								console.log("new Edge");
								var newEdge = new Edge(firstNode, secondNode, newPathlength);
								newEdge.color = "red";
								// newEdge.index = graph.edges.length - 1;
								graph.edges.push(newEdge);
								graph.costMatrix[graph.i][graph.j] = newPathlength;
							}
                            graph.draw();
                            graph.saveInDB();
                            resetGraphColor();
                        }, 100 * graph.speed);
                        shouldResetGraphColor = false;
                    }
                }
                if (shouldResetGraphColor) {
                    resetGraphColor();
                }
            }
        }, firstDelay);
    }
    step();
	
	function loop() {
		if (graph.j < n-1) {
			graph.j++;
			step();
		} else if (graph.i < n-1) {
			graph.j = 0;
			graph.i++;
			step();
		} else if (graph.k < n-1) {
			graph.j = 0;
			graph.i = 0;
			graph.k++;
			step();
		} else {
			graph.finished = true;
		}
	}

	function changeNodeColor(){
		$.each(graph.nodes, function(index, node) {
			if (graph.k === node.index) {
				node.color = "#00FFFF";
				return false;
			}
		});
	}

	function changeEdgeColor(number) {
		var firstIndex;
		var secondIndex;
		var firstNode;
		var secondNode;
		if(number === 1){
			firstIndex = graph.i;
			secondIndex = graph.k;
		} else if(number === 2){
			firstIndex = graph.k;
			secondIndex = graph.j;
		}
		$.each(graph.nodes, function(index, node) {
			if (firstIndex === node.index) {
				firstNode = node;
			}
			if (secondIndex === node.index) {
				secondNode = node;
			}
		});
        $.each(graph.edges, function(index, edge) {
			if (edge.u === firstNode && edge.v === secondNode) {
				edge.color = "lime";
			}
		});
	}

	function resetGraphColor(){
		setTimeout(function() {
            $.each(graph.nodes, function(index, node) {
                node.color = "lime";
            });
            $.each(graph.edges, function(index, edge) {
                edge.color = "black";
            });
            graph.draw();
            graph.saveInDB();
            loop();
        }, 100 * graph.speed);
	}

};

	// console.log("hier")
	// 											var newEdge = new Edge(
	// 												node,
	// 												connectedNode,
	// 												newPathlength
	// 											);
	// 											newEdge.color = "red";
	// 											newEdge.index =
	// 												graph.edges.length - 1;
	// 											graph.edges.push(newEdge);
	// 											graph.costMatrix[graph.i][
	// 												graph.j
	// 											] = newPathlength;

	// $.each(graph.nodes, function(index, node) {
	// 	if (graph.i === node.index) {
	// 		$.each(node.connectedTo, function(
	// 			index,
	// 			connectedNode
	// 		) {
	// 			if (graph.j === connectedNode.index) {
	// 				var foundEdge = false;
	// 				$.each(graph.edges, function(index, edge) {
	// 					if (
	// 						edge.u === node &&
	// 						edge.v === connectedNode
	// 					) {
	// 						edge.weight = newPathlength;
	// 						graph.costMatrix[graph.i][
	// 							graph.j
	// 						] = newPathlength;
	// 					}
	// 				});
	// 			}
	// 		});
	// 	}
	// });

// if (
			// 	i !== j &&
			// 	((newPathlength !== undefined &&
			// 		oldPathlength === undefined) ||
			// 		newPathlength < oldPathlength)
			// ) {
			// 	this.costMatrix[i][j] = newPathlength;
			
			// }

// $.each(this.nodes, function(index, node) {
// 	if (graph.i === node.index) {
// 		$.each(node.connectedTo, function(index, connectedNode) {
// 			if (graph.j === connectedNode.index) {
// 				$.each(graph.edges, function(index, edge) {
// 					if (edge.u === node && edge.v === connectedNode) {
// 						edge.weight = newPathlength;
// 					} else {
// 						var newEdge = new Edge(node, connectedNode, newPathlength);
// 						newEdge.color = "red";
// 						newEdge.index = graph.edges.length-1;
// 						graph.edges.push(newEdge);
// 					}
// 				});
// 			}
// 		});
// 	}
// });

// for (; graph.k < n; graph.k++) {
// 	for (; graph.i < n; graph.i++) {
// 		for (; graph.j < n; graph.j++) {

// 		}
// 	}
// }

// function step(graph) {
// 	function start(graph) {
		
// 		setTimeout(function() {}, 100 * graph.speed);
// 	}
// 	start(graph);
// }

// if(k == i == j){
// 	console.log("treffer");
// 	setTimeout(function(){
// 		$.each(graph.nodes, function(index, node){
// 			if(k == node.index){
// 				console.log("erste farbe");
// 				node.color = "#00FFFF";
// 				graph.draw();
// 				graph.saveInDB();
// 				// setTimeout(function(){
// 					console.log("zweite farbe");
// 					node.color = "lime";
// 					graph.draw();
// 					graph.saveInDB();
// 				// }, 100*graph.speed)
// 			}
// 		})
// 	}, 500)
// }

// WeightedDirectedGraph.prototype.floydwarshall = function() {
//     console.log(this.costMatrix);

//     var testMatrix = [];
//     for (var i = 0; i < this.costMatrix.length; i++) {
//         testMatrix.push(new Array(this.costMatrix.length));
//     }

//     for (var i = 0; i < this.costMatrix.length; i++) {
//         for (var j = 0; j < this.costMatrix.length; j++) {
//             if (this.costMatrix[i][j] != undefined) {
//                 testMatrix[i][j] = this.costMatrix[i][j];
//             }
//         }
//     }

//     var n = testMatrix.length;
//     for (var k = 0; k < n; k++) {
//         for (var i = 0; i < n; i++) {
//             for (var j = 0; j < n; j++) {
//                 var firstLength = testMatrix[i][k];
//                 var secondLength = testMatrix[k][j];
//                 var newPathlength = undefined;
//                 if (firstLength !== undefined && secondLength !== undefined) {
//                     newPathlength = firstLength + secondLength;
//                 }
//                 var oldPathlength = testMatrix[i][j];
//                 if (
//                     i !== j &&
//                     ((newPathlength !== undefined &&
//                         oldPathlength === undefined) ||
//                         newPathlength < oldPathlength)
//                 ) {
//                     testMatrix[i][j] = newPathlength;
//                     console.log(i);
//                     console.log(j);
//                     console.log(newPathlength);
//                     console.log(oldPathlength);
//                     console.log(testMatrix[i][j]);
//                     console.log(testMatrix);
//                 }
//             }
//         }
//     }
// };

WeightedDirectedGraph.prototype.draw=function(){
	this.view.draw();
}