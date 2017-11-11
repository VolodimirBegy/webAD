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
	this.calledby=[];
}

function Edge(u,v){
	this.u=u;
	this.v=v;
	this.color="black";
}

function UnweightedDirectedGraph(){
	this.view=new UnweightedDirectedGraphView(this);
	this.db=[];
	this.actStateID=-1;
	this.speed=10;
}

UnweightedDirectedGraph.prototype.fill=function(_matrix,startNode){

	this.startNode=startNode;
	this.nodes=[];
	this.edges=[];
	this.visited=[];
	this.queue=undefined;
	this.stack=undefined;
	//matrix deep copy
	this.costMatrix=[];

	this.topovisited=undefined; //Algorithmus aktiv oder nicht
	this.nodescopy=[]; 			//Knoten, die nocht nicht entfernt wurden
	this.edgecopy=[]; 			//Gelöschte Edges
	this.toponodes=[];			//Gelöschte Knoten

	var topoconnect=undefined;

	for(var i=0;i<_matrix.length;i++){
		this.costMatrix.push(new Array(_matrix.length));
	}

	for(var i=0;i<_matrix.length;i++){
		for(var j=0;j<_matrix.length;j++){
			if(_matrix[i][j]==1){
				this.costMatrix[i][j]=1;
			}
		}
	}

    for (var i =0;i<_matrix.length;i++){
        for (var j =0;j<_matrix.length;j++){
            if (_matrix[i][j]==1){
               // alert("Matrix: ["+i+"]["+j+"]");
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

			var aNode = undefined;
			aNode=new Node();
			aNode=graph.nodes[graph.matrixLink[index]];
		}
		else{
			cNode=graph.nodes[graph.matrixLink[index]];
		}

		for(var i=0;i<_matrix.length;i++){

			//alert("matrix an der Stelle [" + index +"][" +i+"]");
			if(_matrix[index][i]!=undefined){
				//alert("ist vorhanden");
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

				//falls der index der Startknoten ist, wird dieser blau gefaerbt
				if(index==graph.nodes[0].index){cNode.color="#2E64FE";cNode.oColor="#2E64FE";}

				//ignore duplicates
				var eExists=false;
				for(var j=0;j<graph.edges.length;j++){
					if(graph.edges[j].u==cNode && graph.edges[j].v==newNode){
						eExists=true;break
					}
				}
				if(!eExists)

					graph.edges.push(new Edge(cNode,newNode,_matrix[index][i]));
					for (var o=0;o<graph.edges.length;o++){
					//	alert("edges \n NodeU "+ graph.edges[o].u.index + "\n NodeV "+ graph.edges[o].v.index);
					}

				if(!alreadyConnected){
					cNode.connectedTo.push(newNode);
					addConnected(graph,cNode.connectedTo[cNode.connectedTo.length-1].index);
				}
			}
			else if (_matrix[i][index]!=undefined){
				var help=undefined;

				for (var t=0;t<graph.edges.length;t++){
					if (graph.edges[t].u.index==i && graph.edges[t].v.index==index){
						topoconnect=false;
					}
                    if (t== (graph.edges.length)-1 && topoconnect==false){
                        help=false;
                    }
					if (t== (graph.edges.length)-1){
						topoconnect=undefined;
					}
				}
				if (help==undefined){

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

					 for(var j=0;j<newNode.connectedTo.length;j++){
					 	if(newNode.connectedTo[j]==newNode){
					 		alreadyConnected=true;break;
					 	}
					 }

					 //falls der index der Startknoten ist wird dieser blau gefaerbt
					 if(index==graph.nodes[0].index){cNode.color="#2E64FE";cNode.oColor="#2E64FE";}

					 //ignore duplicates
					 var eExists=false;
					 for(var j=0;j<graph.edges.length;j++){
					 	if(graph.edges[j].u==newNode && graph.edges[j].v==cNode){
					 		eExists=true;break
					 	}
					 }
					if(!eExists) {
						graph.edges.push(new Edge(newNode, cNode, _matrix[i][index]));
					}

					if(!alreadyConnected){
						newNode.connectedTo.push(cNode);
						addConnected(graph,newNode.index);
					}
				}
				help==undefined;
			}
		}
	}

	addConnected(this,startNode);

	var nownode =undefined;
	nownode=new Node();

	for(var i=0;i<this.matrixLink.length;i++) {
		nownode=this.nodes[i]
    }

	if(this.nodes.length==1){
		this.nodes[0].color="#2E64FE";this.nodes[0].oColor="#2E64FE";
	}

	//hier werden die knoten ausgerichtet im grid fenster mit der xposition und yposition
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

	//verknüpfungen werden hergestellt
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

    for (var i = 0; i < this.nodes.length; i++) {
        var newNode = new Node();
        newNode.index = this.nodes[i].index;
        newNode.color = this.nodes[i].color;
        newNode.oColor = this.nodes[i].oColor;
        newNode.xPosition = this.nodes[i].xPosition;
        newNode.yPosition = this.nodes[i].yPosition;
        newNode.connectedTo = this.nodes[i].connectedTo;
        this.nodescopy[i] = newNode;
    }
}

UnweightedDirectedGraph.prototype.init=function(c1){
	this.view.initStage(c1);
	this.draw();
	this.saveInDB();
}

UnweightedDirectedGraph.prototype.copy=function(){
	var newG = new UnweightedDirectedGraph();
	newG.fill(this.costMatrix,this.startNode);
	for(var i=0;i<this.nodes.length;i++){
        var newNode1 = new Node();
        newNode1.index=this.nodes[i].index;
        newNode1.color=this.nodes[i].color;
        newNode1.oColor=this.nodes[i].oColor;
        newNode1.xPosition=this.nodes[i].xPosition;
        newNode1.yPosition=this.nodes[i].yPosition;
        newNode1.connectedTo=this.nodes[i].connectedTo;
        newG.nodes[i]=newNode1;
	}

	newG.topovisited=this.topovisited;

	newG.nodescopy.length=this.nodescopy.length;

    for(var i=0;i<this.nodescopy.length;i++){
        if(this.nodescopy[i]!=undefined){
            var newNode = new Node();
            newNode.index=this.nodescopy[i].index;
            newNode.color=this.nodescopy[i].color;
            newNode.oColor=this.nodescopy[i].oColor;
            newNode.xPosition=this.nodescopy[i].xPosition;
            newNode.yPosition=this.nodescopy[i].yPosition;
            newNode.connectedTo=this.nodescopy[i].connectedTo;
            newG.nodescopy[i]=newNode;
        }
    }

    for(var i=0;i<this.toponodes.length;i++){
        if(this.toponodes[i]!=undefined){
            var newNode2 = new Node();
            newNode2.index=this.toponodes[i].index;
            newNode2.color=this.toponodes[i].color;
            newNode2.oColor=this.toponodes[i].oColor;
            newNode2.xPosition=this.toponodes[i].xPosition;
            newNode2.yPosition=this.toponodes[i].yPosition;
            newNode2.connectedTo=this.toponodes[i].connectedTo;
            newG.toponodes[i]=newNode2;
        }
    }


    for(var i=0;i<this.edgecopy.length;i++){
        if(this.edgecopy[i]!=undefined){
            var new_node1= new Node();
            var new_node2= new Node();
            new_node1.yPosition=this.edgecopy[i].u.yPosition;
            new_node1.xPosition=this.edgecopy[i].u.xPosition;
            new_node2.yPosition=this.edgecopy[i].v.yPosition;
            new_node2.xPosition=this.edgecopy[i].v.xPosition;
            new_node1.index=this.edgecopy[i].u.index;
            new_node2.index=this.edgecopy[i].v.index;
            new_node1.color=this.edgecopy[i].u.color;
            new_node2.color=this.edgecopy[i].v.color;
            new_node1.oColor=this.edgecopy[i].u.oColor;
            new_node2.oColor=this.edgecopy[i].v.oColor;
            new_node1.connectedTo=this.edgecopy[i].u.connectedTo;
            new_node2.connectedTo=this.edgecopy[i].v.connectedTo;

            var new_Edge3 = new Edge(new_node1,new_node2);

            newG.edgecopy[i]=new_Edge3;
        }
    }

    setEdges(newG,this);

    if (newG.edges.length!=0){
        setColorEdges(newG,this);
    }

    function setEdges(newG,this_) {
        var del=undefined;
        for (var i =0;i<newG.edges.length;i++){
            for (var k=0;k<this_.edges.length;k++){
                if (newG.edges[i].u.index==this_.edges[k].u.index && newG.edges[i].v.index==this_.edges[k].v.index){
                    del=false;
                }
                if ( k==(this_.edges.length)-1 && del==undefined){
                    newG.edges.splice(i,1);
                    setEdges(newG,this_)
                    break;
                }
                if (k==(this_.edges.length)-1){
                    del=undefined;
                }
            }
            if (this_.edges.length==0){
                newG.edges.length=0;
            }
        }
    }

    function setColorEdges(newG,this_) {
        for (var i =0;i<newG.edges.length;i++) {
            for (var k = 0; k < this_.edges.length; k++) {
                if (newG.edges[i].u.index==this_.edges[k].u.index && newG.edges[i].v.index==this_.edges[k].v.index){
                    newG.edges[i].u.color=this_.edges[k].u.color;
                    newG.edges[i].u.oColor=this_.edges[k].u.oColor;
                    newG.edges[i].v.color=this_.edges[k].v.color;
                    newG.edges[i].v.oColor=this_.edges[k].v.oColor;
                    /////////
                    newG.edges[i].u.connectedTo=this_.edges[k].u.connectedTo;
                    newG.edges[i].v.connectedTo=this_.edges[k].v.connectedTo;
                    newG.edges[i].u.xPosition=this_.edges[k].u.xPosition;
                    newG.edges[i].v.yPosition=this_.edges[k].v.yPosition;
                }
            }
        }
    }

	if(this.stack!=undefined){
		newG.stack=[];
		for(var i=0;i<this.stack.length;i++){
			newG.stack.push(newG.nodes[newG.matrixLink[this.stack[i].index]]);
		}
	}
	else
		newG.stack=undefined;
	if(this.queue!=undefined){
		newG.queue=[];
		for(var i=0;i<this.queue.length;i++){
			newG.queue.push(newG.nodes[newG.matrixLink[this.queue[i].index]]);
		}
	}
	else
		newG.queue=undefined;
	if(this.visited!=undefined){
		newG.visited=[];
		for(var i=0;i<this.visited.length;i++){
			newG.visited.push(newG.nodes[newG.matrixLink[this.visited[i].index]]);
		}
	}
	return newG;
}

UnweightedDirectedGraph.prototype.replaceThis=function(og){

	this.startNode=og.startNode;
	this.costMatrix=og.costMatrix;
	this.nodes=og.nodes;
    this.matrixLink=og.matrixLink;
	this.topovisited=og.topovisited;

	for(var i=0;i<og.nodes.length;i++){
		if(this.nodes[i]!=undefined){
            var newNode = new Node();
            newNode.index=og.nodes[i].index;
            newNode.color=og.nodes[i].color;
            newNode.oColor=og.nodes[i].oColor;
            newNode.xPosition=og.nodes[i].xPosition;
            newNode.yPosition=og.nodes[i].yPosition;
            newNode.connectedTo=og.nodes[i].connectedTo;
            this.nodes[i]=newNode;
		}
	}
	this.nodescopy.length=og.nodescopy.length;
    for(var i=0;i<og.nodescopy.length;i++){
        if(og.nodescopy[i]!=undefined){
            var newNode = new Node();
            newNode.index=og.nodescopy[i].index;
            newNode.color=og.nodescopy[i].color;
            newNode.oColor=og.nodescopy[i].oColor;
            newNode.xPosition=og.nodescopy[i].xPosition;
            newNode.yPosition=og.nodescopy[i].yPosition;
            newNode.connectedTo=og.nodescopy[i].connectedTo;
            this.nodescopy[i]=newNode;
        }
    }
    this.toponodes.length=og.toponodes.length;
    for(var i=0;i<og.toponodes.length;i++){
        if(og.toponodes[i]!=undefined){
            var newNode = new Node();
            newNode.index=og.toponodes[i].index;
            newNode.color=og.toponodes[i].color;
            newNode.oColor=og.toponodes[i].oColor;
            newNode.xPosition=og.toponodes[i].xPosition;
            newNode.yPosition=og.toponodes[i].yPosition;
            newNode.connectedTo=og.toponodes[i].connectedTo;
            this.toponodes[i]=newNode;
        }
    }


    this.edgecopy.length=og.edgecopy.length;
    for(var i=0;i<og.edgecopy.length;i++){
        if(og.edgecopy[i]!=undefined){
            var new_node1= new Node();
            var new_node2= new Node();
            new_node1.yPosition=og.edgecopy[i].u.yPosition;
            new_node1.xPosition=og.edgecopy[i].u.xPosition;
            new_node2.yPosition=og.edgecopy[i].v.yPosition;
            new_node2.xPosition=og.edgecopy[i].v.xPosition;
            new_node1.index=og.edgecopy[i].u.index;
            new_node2.index=og.edgecopy[i].v.index;
            new_node1.color=og.edgecopy[i].u.color;
            new_node2.color=og.edgecopy[i].v.color;
            new_node1.oColor=og.edgecopy[i].u.oColor;
            new_node2.oColor=og.edgecopy[i].v.oColor;
            new_node1.connectedTo=og.edgecopy[i].u.connectedTo;
            new_node2.connectedTo=og.edgecopy[i].v.connectedTo;

            var new_Edge = new Edge(new_node1,new_node2);

            this.edgecopy[i]=new_Edge;
        }
    }


    var already_in=[]; // bekommt die Knoten aus edges
	//edges muss anders übergeben werden, da sonst Bezug zum vorherigen Graphen besteht
    this.edges.length=og.edges.length;
    for(var i=0;i<og.edges.length;i++){
        if(og.edges[i]!=undefined){
            var skip_u=undefined; // index von U
            var skip_v=undefined; // index von V

            for(var h=0;h<already_in.length;h++){
                if (already_in[h].index==og.edges[i].u.index){
                    skip_u=already_in[h].index;
                }
                if (already_in[h].index==og.edges[i].v.index){
                    skip_v=already_in[h].index;
                }
            }
			// Fall 1, beim ersten Aufruf, die Knoten sind noch nicht enthalten
            if (skip_u==undefined && skip_v==undefined){
                var new_node5= new Node();
                var new_node6= new Node();
                new_node5.yPosition=og.edges[i].u.yPosition;
                new_node5.xPosition=og.edges[i].u.xPosition;
                new_node6.yPosition=og.edges[i].v.yPosition;
                new_node6.xPosition=og.edges[i].v.xPosition;
                new_node5.index=og.edges[i].u.index;
                new_node6.index=og.edges[i].v.index;
                new_node5.color=og.edges[i].u.color;
                new_node6.color=og.edges[i].v.color;
                new_node5.oColor=og.edges[i].u.oColor;
                new_node6.oColor=og.edges[i].v.oColor;
                new_node5.connectedTo=og.edges[i].u.connectedTo;
                new_node6.connectedTo=og.edges[i].v.connectedTo;

                already_in.push(new_node5);
                already_in.push(new_node6);

                var new_Edge = new Edge(new_node5,new_node6);

                this.edges[i]=new_Edge;
            }
            //Fall 2, Es gibt U schon, daher nur Knoten V neu erstellen
            if (skip_u!=undefined && skip_v==undefined){
                var newNode=new Node();
                newNode.yPosition=og.edges[i].v.yPosition;
                newNode.xPosition=og.edges[i].v.xPosition;
                newNode.index=og.edges[i].v.index;
                newNode.color=og.edges[i].v.color;
                newNode.oColor=og.edges[i].v.oColor;
                newNode.connectedTo=og.edges[i].v.connectedTo;

                already_in.push(newNode);

                for (var z=0;z<already_in.length;z++){
                    if(already_in[z].index==og.edges[i].u.index){
                        var newEdge1=new Edge(already_in[z],newNode);
                        this.edges[i]=newEdge1;
                    }
                }
            }
            //Fall 3, Es gibt V schon, daher nur Knoten U neu erstellen
            if (skip_u==undefined && skip_v!=undefined){
                var newNodeU=new Node();
                newNodeU.yPosition=og.edges[i].u.yPosition;
                newNodeU.xPosition=og.edges[i].u.xPosition;
                newNodeU.index=og.edges[i].u.index;
                newNodeU.color=og.edges[i].u.color;
                newNodeU.oColor=og.edges[i].u.oColor;
                newNodeU.connectedTo=og.edges[i].u.connectedTo;

                already_in.push(newNodeU);

                for (var z=0;z<already_in.length;z++){
                    if(already_in[z].index==og.edges[i].v.index){
                        var newEdge1=new Edge(newNodeU,already_in[z]);
                        this.edges[i]=newEdge1;
                    }
                }
            }
            var u_index=undefined; // Stelle von alreadyin von U
            var v_index=undefined; // Stelle von alreadyin von V
			//Fall 4, Es gibt beide Knoten schon, keinen neuen Knoten erstellen
            if (skip_u!=undefined && skip_v!=undefined){
                for (var z=0;z<already_in.length;z++){
                    if(already_in[z].index==skip_u){
                        u_index=z;
                    }
                    if(already_in[z].index==skip_v){
                        v_index=z;
                    }
                }
                var newEdge2=new Edge(already_in[u_index],already_in[v_index]);
                this.edges[i]=newEdge2;
            }
            skip_u=undefined;
            skip_v=undefined;
        }
    }

	if(og.stack!=undefined){
		this.stack=[];
		for(var i=0;i<og.stack.length;i++){
			this.stack.push(this.nodes[this.matrixLink[og.stack[i].index]]);
		}
	}
	else
		this.stack=undefined;
	if(og.queue!=undefined){
		this.queue=[];
		for(var i=0;i<og.queue.length;i++){
			this.queue.push(this.nodes[this.matrixLink[og.queue[i].index]]);
		}
	}
	else
		this.queue=undefined;
	if(og.visited!=undefined){
		this.visited=[];
		for(var i=0;i<og.visited.length;i++){
			this.visited.push(this.nodes[this.matrixLink[og.visited[i].index]]);
		}
	}
}

UnweightedDirectedGraph.prototype.prev=function(){
	if(this.actStateID>0){
		var prev_id=this.actStateID-1;
		this.actStateID=prev_id;
		var rs=this.db[prev_id];
      	this.replaceThis(rs);
      	this.draw();
	}
}

UnweightedDirectedGraph.prototype.next=function(){
	if(this.actStateID<this.db.length-1){
		var next_id=this.actStateID+1;
		this.actStateID=next_id;
		var rs=this.db[next_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

UnweightedDirectedGraph.prototype.firstState=function(){
	this.actStateID=0;
	var rs=this.db[0];
	//make actual node to THIS:
    this.replaceThis(rs);
    this.draw();
}

UnweightedDirectedGraph.prototype.lastState=function(){
	var last_id=this.db.length-1;
	this.actStateID=last_id;
	var rs=this.db[last_id];
	//make actual node to THIS:
     this.replaceThis(rs);
     this.draw();
}

UnweightedDirectedGraph.prototype.saveInDB=function(){
	var count=this.db.length-1;
 	if(count!=this.actStateID){
 		this.db.splice(this.actStateID+1,count-this.actStateID);
 	}


	var nextID=this.db.length;
	var new_state = this.copy();
	
	var last_state=this.db[this.db.length-1];
	var same=true;
	
	if(last_state==undefined || new_state.costMatrix.length!=last_state.costMatrix.length||
			new_state.costMatrix.length!=last_state.costMatrix.length||
			new_state.nodes.length!=last_state.nodes.length ||
			new_state.edges.length!=last_state.edges.length ||
			new_state.visited.length!=last_state.visited.length ||
			new_state.edgecopy.length!=last_state.edgecopy||
			new_state.nodescopy.length!=last_state.nodescopy||
			new_state.toponodes.length!=last_state.toponodes){
		same=false;
	}
	else{
		for(var i=0;i<new_state.nodes.length;i++){
			if(new_state.nodes[i].color!=last_state.nodes[i].color ||
					new_state.nodes[i].index!=last_state.nodes[i].index||
					new_state.nodes[i].oColor!=last_state.nodes[i].oColor||
					new_state.nodes[i].connectedTo.length!=last_state.nodes[i].connectedTo.length)
				same=false;
		}
		for (var i=0;i<new_state.toponodes.length;i++){
			if (new_state.toponodes[i].color!=last_state.toponodes[i].color ||
                new_state.toponodes[i].index!=last_state.toponodes[i].index||
                new_state.toponodes[i].oColor!=last_state.toponodes[i].oColor||
				new_state.toponodes[i].xPosition!=last_state.toponodes[i].xPosition ||
                new_state.toponodes[i].yPosition!=last_state.toponodes[i].yPosition
                ){
                same=false;
			}
		}
        for (var i=0;i<new_state.nodescopy.length;i++){
            if (new_state.nodescopy[i].color!=last_state.nodescopy[i].color ||
                new_state.nodescopy[i].index!=last_state.nodescopy[i].index||
                new_state.nodescopy[i].oColor!=last_state.nodescopy[i].oColor||
                new_state.nodescopy[i].xPosition!=last_state.nodescopy[i].xPosition ||
                new_state.nodescopy[i].yPosition!=last_state.nodescopy[i].yPosition
                ){
                same=false;
            }
        }
	}
	
	if(!same){
		this.db.push(new_state);
		this.actStateID=nextID;
	}
}

UnweightedDirectedGraph.prototype.topo=function () {

    var delay=0;

    if(this.visited.length==this.nodes.length){
       window.alert("The graph is already sorted");
       return;
    }

	this.topovisited=true;

    if(this.stack==undefined)
        this.stack=[];
    if(this.stack.length==0){
    	for (var i=0;i<this.nodes.length;i++){
    		if (this.nodes[i].index==this.startNode){
    			this.stack.push(this.nodes[i]);
			}
		}
	}

    setTimeout(function () {
        graph.saveInDB();
        graph.draw();
    },100*graph.speed)

    function topoSort(graph){

    	graph.topovisited=true;

        //make all from stack red
        for(var k=0;k<graph.stack.length;k++){
            graph.stack[k].color="red";
            graph.stack[k].oColor="red";
        }

        for (var i=0;i<graph.nodescopy.length;i++){
            for(var k=0;k<graph.stack.length;k++){
            	if (graph.nodescopy[i].index==graph.stack[k].index){
            		graph.nodescopy[i].color="red";
            		graph.nodescopy[i].oColor="red";
                    for (var p=0;p<graph.edges.length;p++){
                        if (graph.edges[p].u.index==graph.nodescopy[i].index){
                            graph.edges[p].u.color=graph.nodescopy[i].color;
                            graph.edges[p].u.oColor=graph.nodescopy[i].oColor;
                        }
                        if (graph.edges[p].v.index==graph.nodescopy[i].index){
                            graph.edges[p].v.color=graph.nodescopy[i].color;
                            graph.edges[p].v.oColor=graph.nodescopy[i].oColor;
                        }
                    }
				}
            }
		}

		setTimeout(function () {
            graph.saveInDB();
            graph.draw();
        },100*graph.speed)

        function processAct(graph){
        	graph.topovisited=true;

            setTimeout(function (){

            	var workingnode=undefined;
                var helpconnectedTo=[];
                var onlyOneInNode=undefined;

				for (var i=0;i<graph.nodes.length;i++){
					if (graph.stack[graph.stack.length-1].index==graph.nodes[i].index){
						workingnode=graph.nodes[i];
					}
				}

                for (var i=0; i< graph.nodescopy.length;i++){
                    if (graph.nodescopy[i].index==workingnode.index){
                    	for (var j=0;j<graph.nodescopy[i].connectedTo.length;j++){
                    		helpconnectedTo.push(graph.nodescopy[i].connectedTo[j]);
						}
					}
                }

                // nodescopy wird um den Knoten der gerade bearbeitet wird gekürzt
                for (var i=0; i< graph.nodescopy.length;i++){
                    if (graph.nodescopy[i].index==workingnode.index){
                        graph.nodescopy.splice(i,1);
                    }
                }

				//ich füge den entfernten knoten zu meine hilfsarray toponodes
                for (var i=0; i< graph.nodes.length;i++){
                    if (graph.nodes[i].index==workingnode.index){
                        var newNode = new Node();
                        newNode.index=graph.nodes[i].index;
                        newNode.color=graph.nodes[i].color;
                        newNode.oColor=graph.nodes[i].oColor;
                        newNode.xPosition=graph.nodes[i].xPosition;
                        newNode.yPosition=graph.nodes[i].yPosition;
                        newNode.connectedTo=graph.nodes[i].connectedTo;
                        graph.toponodes.push(newNode);
                    }
                }

				setPositionsToponodes(graph);

                if (graph.edges.length>0) {
                    spliceEdges(graph);
                }
                setPositionsEdgecopy(graph);

                graph.visited.push(graph.stack[graph.stack.length-1]);
                graph.stack.splice(graph.stack.length-1,1);

                //wenn alle knoten erledigt sind
                if(graph.visited.length==graph.nodes.length){
                    setTimeout(function () {
                        graph.saveInDB();
                        graph.draw();
                        clearTimes();
                    },100*graph.speed)
                }

				//Neuer Bearbeitungsknoten wird herausgefunden, der der keine Eingänge hat.
				//Im ersten Block wird bei den Kindern des aktuellen Bearbeitungsknoten gesucht, ob diese keine Eingänge haben...
                var checkstartnode=4;
                var new_workingnode=undefined;

                for(var i=0;i<helpconnectedTo.length;i++){
					checkstartnode=graph.checkcreateinitialnode(graph.nodescopy,helpconnectedTo[i].index);
					if (checkstartnode==undefined){
						new_workingnode=helpconnectedTo[i];
						break;
					}
				}
                //...wenn das erfolglos war, alle durchsuchen
				if (checkstartnode==4 || new_workingnode==undefined){
                    for (var j=0;j<graph.nodescopy.length;j++){
                        checkstartnode=graph.checkcreateinitialnode(graph.nodescopy,graph.nodescopy[j].index);
                        if (checkstartnode==undefined){
                            new_workingnode=graph.nodescopy[j];
                            break;
                        }
                    }
				}

				//falls der neue Knoten schon besucht wurde
				for (var i=0; i<graph.visited.length;i++){
					var exists=false;
					if (graph.visited[i].index==new_workingnode.index){
						exists=true;
						break;
					}
				}
				// falls der Knoten schon am Stack steht
                for (var i=0; i<graph.stack.length;i++){
                    var exists=false;
                    if (graph.stack[i].index==new_workingnode.index){
                        exists=true;
                        break;
                    }
                }
                if(exists==false){
                	graph.stack.push(new_workingnode);
				}

                if(graph.stack.length>0 && graph.speed!=0) {
                    topoSort(graph);
                }else{
                	clearTimes();
				}


            },100*graph.speed)
        }

        processAct(graph);
    }

    function startTopoSort(graph){
        setTimeout(function(){
            topoSort(graph);
        },delay)
    }

    //lösccht den Knoten aus dem Graphen heraus
    function spliceEdges(graph) {

        for(var i=0;i<graph.edges.length;i++){
            if(graph.edges[i].u.index==graph.stack[graph.stack.length-1].index){

                var new_node1= new Node();
                var new_node2= new Node();
                new_node1.yPosition=graph.edges[i].u.yPosition;
                new_node1.xPosition=graph.edges[i].u.xPosition;
                new_node2.yPosition=graph.edges[i].v.yPosition;
                new_node2.xPosition=graph.edges[i].v.xPosition;
                new_node1.index=graph.edges[i].u.index;
                new_node2.index=graph.edges[i].v.index;
                new_node1.color=graph.edges[i].u.color;
                new_node2.color=graph.edges[i].v.color;
                new_node1.oColor=graph.edges[i].u.oColor;
                new_node2.oColor=graph.edges[i].v.oColor;
                new_node1.connectedTo=graph.edges[i].u.connectedTo;
                new_node2.connectedTo=graph.edges[i].v.connectedTo;

                var new_Edge = new Edge(new_node1,new_node2);

                graph.edgecopy.push(new_Edge);
                graph.edges.splice(i,1);
                if(graph.edges.length>0) {
                    spliceEdges(graph);
                }else{
                	return;
				}
            }
        }
    }

	//setzt die Positionen der gelöschten Knoten
    function setPositionsToponodes(graph) {
        for(var i=0;i<graph.toponodes.length;i++){
            if(graph.toponodes[i].yPosition!=500){
                graph.toponodes[i].yPosition=500;
                graph.toponodes[i].xPosition=100+130*i;
                graph.toponodes[i].oColor="red";
                graph.toponodes[i].color="red";
            }
        }
    }

    //setzt die Postionen der gelöschten Edges
    function setPositionsEdgecopy(graph) {
		for (var i=0;i<graph.edgecopy.length;i++){
			for (var j=0;j<graph.toponodes.length;j++){
				if (graph.edgecopy[i].u.index==graph.toponodes[j].index){
                    graph.edgecopy[i].u.xPosition=graph.toponodes[j].xPosition;
                    graph.edgecopy[i].u.yPosition=graph.toponodes[j].yPosition;
                    graph.edgecopy[i].u.color=graph.toponodes[j].color;
                    graph.edgecopy[i].u.oColor=graph.toponodes[j].oColor;
				}
                if (graph.edgecopy[i].v.index==graph.toponodes[j].index){
                    graph.edgecopy[i].v.xPosition=graph.toponodes[j].xPosition;
                    graph.edgecopy[i].v.yPosition=graph.toponodes[j].yPosition;
                    graph.edgecopy[i].v.color=graph.toponodes[j].color;
                    graph.edgecopy[i].v.oColor=graph.toponodes[j].oColor;
                }
			}
		}
    }

    startTopoSort(graph);

    return true;
}


UnweightedDirectedGraph.prototype.dfs=function(graph){
    //push into stack-> process upper -> push
    // cause initial has always index 0

    var delay=0;
    if(this.visited.length==this.nodes.length){
        for(var j=0;j<this.nodes.length;j++){
            this.nodes[j].color="lime";
            this.nodes[j].oColor="lime";
        }
        this.nodes[0].color="#00FFFF";this.nodes[0].oColor="#00FFFF";
        this.visited=[];this.saveInDB();this.draw();delay=1000;
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

        graph.saveInDB();
        graph.draw();

        function processAct(graph){
            setTimeout(function (){
                var ai=graph.matrixLink[graph.stack[graph.stack.length-1].index];


                // ++++++++++++  hier werden die knoten gefärbt, die schon bearbeitet sind  +++++++++++++++++++
                graph.stack[graph.stack.length-1].color="grey";
                graph.stack[graph.stack.length-1].oColor="grey";


                graph.visited.push(graph.stack[graph.stack.length-1]);
                graph.stack.splice(graph.stack.length-1,1);

                if(graph.visited.length==graph.nodes.length){
                    graph.draw();
                    graph.saveInDB();
                }

                for(i=0;i<graph.nodes[ai].connectedTo.length;i++){
                    var exists=false;

                    for(var j=0;j<graph.visited.length;j++){
                        if(graph.visited[j].index==graph.nodes[ai].connectedTo[i].index) {

                            var b=graph.visited[j].index;
                            for(var k=0;k<graph.stack.length;k++){

                            }

                            exists = true;
                            return false;
                        }
                    }

                    for(var j=0;j<graph.stack.length;j++){
                        if(graph.stack[j].index==graph.nodes[ai].connectedTo[i].index) {
                            var a=graph.stack[j].index;
                            for(var k=0;k<graph.stack.length;k++){

                            }
                            exists = true;
                        }
                    }
                    if(!exists) {
                        graph.stack.push(graph.nodes[ai].connectedTo[i]);
                    }
                }
                // alert("Ai ist   " + ai + "\n"+" Visited laenge :  " + graph.visited.length + "\n"+ "stack laenge:   " + graph.stack.length + "\n" + "Graph[ai].length "+ graph.nodes[ai].connectedTo.length)
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

    startDFS(graph);

    return true;

}


UnweightedDirectedGraph.prototype.bfs=function(){
	//push into stack-> process upper -> push 
	// cause initial has always index 0
	var delay=0;
	if(this.visited.length==this.nodes.length){
		for(var j=0;j<this.nodes.length;j++){
			this.nodes[j].color="lime";
			this.nodes[j].oColor="lime";
		}
		this.nodes[0].color="#00FFFF";this.nodes[0].oColor="#00FFFF";
		this.visited=[];this.saveInDB();this.draw();delay=1000;
	}
	if(this.queue==undefined)
		this.queue=[];
	if(this.queue.length==0){
		this.queue.push(this.nodes[this.matrixLink[this.startNode]]);
	}
	
	function _bfs(graph){
		//make all from stack red
		for(var k=0;k<graph.queue.length;k++){
			graph.queue[k].color="red";
			graph.queue[k].oColor="red";
		}
		graph.saveInDB();
		graph.draw();
		
		function processAct(graph){
			setTimeout(function (){
				var ai=graph.matrixLink[graph.queue[0].index];
				graph.queue[0].color="grey";
				graph.queue[0].oColor="grey";
				
				graph.visited.push(graph.queue[0]);
				graph.queue.splice(0,1);
				if(graph.visited.length==graph.nodes.length){
					graph.draw();
					graph.saveInDB();
				}
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

UnweightedDirectedGraph.prototype.draw=function(){
	this.view.draw();
}

//sucht nach Gegenrichtungen
UnweightedDirectedGraph.prototype.checklittleCycle=function(matrix,littlecycle){

    for (var i=0; i<matrix.length;i++){
        for (var j=0;j<matrix.length;j++){
            if (matrix[i][j]!= undefined && matrix[j][i] != undefined){
                littlecycle=1;
            }
        }
    }
    return littlecycle;
}

//sucht nach Cyclen im Graphen
UnweightedDirectedGraph.prototype.checkifcycle=function (nodes,cycleornot) {
	//only the idea is taken from https://www.youtube.com/watch?v=rKQaZuoUR4M

    var whiteset=[]; 	//Knoten die noch nicht besucht wurden
    var greyset=[]; 	//Knoten die gerade besucht werden
    var blackset=[]; 	//Knoten, bei denen alles überprüft wurde, wenn alle Knoten im blackset sind, gibt es keinen cycle

    for (var i=0;i<nodes.length;i++){
        whiteset.push(nodes[i]);
    }

    for(var i=0;i<whiteset.length;i--){
    	if(i==0){
    		whiteset[i].calledby.push(null);
		}
		if(cycleornot==undefined) {
            nowcheckcycle(whiteset[i],cycleornot);
        }if (whiteset.length==0){
    		return cycleornot;
		}
		if (cycleornot!=undefined){
			return cycleornot;
		}
    	i++;
	}

    function nowcheckcycle(setindex,yesorno) {

        for(var j=0;j<greyset.length;j++){
            if(setindex.index==greyset[j].index){
                cycleornot=1;
                yesorno=1;
			}
        }

		if(yesorno==undefined) {
            //vom whiteset rauslöschen
            for (var j = 0; j < whiteset.length; j++) {
                if (setindex.index == whiteset[j].index) {
                    whiteset.splice(j, 1);
                }
            }
            //ins greyset den Knoten, der vom whiteset gelöscht wurde, hinzufügen
            greyset.push(setindex);
            for (var j = 0; j < setindex.connectedTo.length; j++) {
                //wenn der Nachfolger schon im black set ist, wird dies übersprungen
				var alreadyinblack = undefined;
                for (var k = 0; k < blackset.length; k++) {
                    if (setindex.connectedTo[j].index == blackset[k].index) {
                        alreadyinblack = 1;
                    }
                    else{
					}
                }
                if (alreadyinblack == undefined) {
                    //hier wird notiert vom welchen Knoten der nächste aufgerufen wurde
                    setindex.connectedTo[j].calledby.push(setindex);
					for(var u=0;u<nodes.length;u++){
                    	if(setindex.connectedTo[j].index==nodes[u].index){
                            nowcheckcycle(nodes[u],yesorno);
						}
					}
                }
            }

			if (yesorno==undefined) {
				//ist der Knoten schon im greyset?
				var ingreyset = undefined;
				for (var j = 0; j < greyset.length; j++) {
					if (setindex.index == greyset[j].index) {
						ingreyset = 1;
					}
				}
				//wenn der Knoten keine Nachfolgeknoten hat und im greyset ist, blackset dazu, greyset raus
				if (ingreyset != undefined) {
					blackset.push(setindex);
					for (var j = 0; j < greyset.length; j++) {
						if (greyset[j].index == setindex.index) {
							greyset.splice(j, 1);
						}
					}
				}
			}
        }
    }
    return cycleornot;
}

//überprüft den Startknoten im Random
UnweightedDirectedGraph.prototype.checkrandominitnode=function(nodes,startnode){

	var nodeforstart=undefined;
	var end=undefined;

	for(var i=0;i<nodes.length;i++){
		if (startnode!=nodes[i]){
			for (var j=0;j<nodes[i].connectedTo.length;j++){
				if (nodes[i].connectedTo[j].index==startnode && nodeforstart==undefined){
					nodeforstart=1;
					break;
				}
			}
		}
	}
	if (nodeforstart!=undefined){
		for(var i=0;i<nodes.length;i++){
			for (var k=0;k<nodes.length;k++){
				for (var j = 0; j < nodes[k].connectedTo.length; j++) {
					if (nodes[k].connectedTo[j].index==nodes[i].index){
						end=1;
					}
					if (end==undefined && k==(nodes.length-1) && j==(nodes[k].connectedTo.length-1)){
						startnode=i;
					}
					if(k==(nodes.length-1) && j==(nodes[k].connectedTo.length-1)){
						end=undefined;
					}
				}
			}
		}
	}
	return startnode;
}

//überprüft den Startknoten bei Nutzereingabe
UnweightedDirectedGraph.prototype.checkcreateinitialnode=function (nodes,startnode) {


	var nodeforstart=undefined;

	for(var i=0;i<nodes.length;i++){
		if (startnode!=nodes[i] && nodeforstart==undefined){
			for (var j=0;j<nodes[i].connectedTo.length;j++){
				if (nodes[i].connectedTo[j].index==startnode && nodeforstart==undefined){
					nodeforstart=1;
					return nodeforstart;
				}
			}
		}
	}
	return nodeforstart;
}

//überprüft, ob der zu-löschende-Knoten existiert
UnweightedDirectedGraph.prototype.checkifdelnodeexists=function(graph,delnode){
	var help=undefined;
    for (var i=0;i<graph.costMatrix.length;i++){
        for (var j=0;j<graph.costMatrix.length;j++){
            if(graph.costMatrix[i][j]!=undefined){
                if (delnode==i || delnode==j){
                    help=true;
                }
            }
        }
    }
    return help;
}

//überprüft, ob die Löschung Regel 2 erfüllt
UnweightedDirectedGraph.prototype.checkifstandalone=function (graph,delnode) {
	var copycostmatrix=[];
	var copynodes=[];

    for(var i=0;i<graph.costMatrix.length;i++){
        copycostmatrix.push(new Array(graph.costMatrix.length));
    }

    for(var i=0;i<graph.costMatrix.length;i++){
        for(var j=0;j<graph.costMatrix.length;j++){
            if(graph.costMatrix[i][j]==1){
                copycostmatrix[i][j]=1;
            }
        }
    }

    for(var i=0;i<graph.nodes.length;i++){
    	var newNode= new Node();
    	newNode.index=graph.nodes[i].index;
    	newNode.connectedTo=graph.nodes[i].connectedTo;
    	copynodes.push(newNode);
    }

    for(var i=0;i<copynodes.length;i++){
    	if (copynodes[i].index==delnode){
    		copynodes.splice(i,1);
    		break;
		}
    }
    for (var i =0;i<copycostmatrix.length;i++) {
        for (var j = 0; j < copycostmatrix.length; j++) {
			if (copycostmatrix[i][j]!=undefined){
				if (i==delnode || j==delnode){
					copycostmatrix[i][j]=undefined;
				}
			}
        }
    }

    var countmatrix=0;
    for (var i =0;i<copycostmatrix.length;i++){
    	for(var j=0;j<copycostmatrix.length;j++){
    		if (copycostmatrix[i][j]!=undefined){
    			countmatrix++;
    		}
    	}
    }

    var is_standalone=[];
	var helpi=undefined;

    for(var k=0;k<copynodes.length;k++){
        var nowcount=0;
        for (var i =0;i<copycostmatrix.length;i++){
            for(var j=0;j<copycostmatrix.length;j++) {
				if (copycostmatrix[i][j]!=undefined){
					nowcount++;

					if (copynodes[k].index==i || copynodes[k].index==j){
						helpi=true;
					}
					if (nowcount==countmatrix && helpi==undefined){
						var value=copynodes[k].index;
						is_standalone.push(value);
					}
					if (nowcount==countmatrix){
						helpi=undefined;
					}
				}
            }
        }
    }

    return is_standalone;
	
}