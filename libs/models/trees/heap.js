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
	this.color="#51DBED";
	this.value=0;
	this.rightChild=undefined;
	this.leftChild=undefined;
	this.parent=undefined;
	this.xPosition=0;
	this.yPosition=0;
}

function Heap(con){
	this.view=new HeapView(this);
	this.context=con;
	this.db=TAFFY();
	this.nodes=[];
	this.sorted=[];
	this.root=undefined;
	this.actStateID=0;
}

Heap.prototype.init=function(){
	this.saveInDB();
}

Heap.prototype.copy=function(toCopy){
	var newHeap=new Heap();
	var nodes=[];
	
	for(var i=0;i<this.nodes.length;i++){
		var newNode=new Node();
		
		newNode.value=this.nodes[i].value;
		newNode.color=this.nodes[i].color;
		
		nodes.push(newNode);
		
		if(i==0)
			newHeap.root=newNode;
		else{
			var actIndex=nodes.length-1;
			var parIndex=Math.floor((actIndex-1)/2);
			
			nodes[actIndex].parent=nodes[parIndex];
			
			//if index of last node is uneven, its a left child. else right
			if((nodes.length-1)%2==1){
				nodes[parIndex].leftChild=nodes[actIndex];
			}
			else{
				nodes[parIndex].rightChild=nodes[actIndex];
			}
		}
			
	}
	newHeap.nodes=nodes;
	
	for(var i=0;i<this.sorted.length;i++)
		newHeap.sorted.push(this.sorted[i]);
	
	return newHeap;
}

Heap.prototype.replaceThis=function(toCopy){
	var nodes=[];
	this.root=undefined;
	this.sorted=[];
	
	for(var i=0;i<toCopy.nodes.length;i++){
		var newNode=new Node();
		
		newNode.value=toCopy.nodes[i].value;
		newNode.color=toCopy.nodes[i].color;
		
		nodes.push(newNode);
		
		if(i==0)
			this.root=newNode;
		else{
			var actIndex=nodes.length-1;
			var parIndex=Math.floor((actIndex-1)/2);
			
			nodes[actIndex].parent=nodes[parIndex];
			
			//if index of last node is uneven, its a left child. else right
			if((nodes.length-1)%2==1){
				nodes[parIndex].leftChild=nodes[actIndex];
			}
			else{
				nodes[parIndex].rightChild=nodes[actIndex];
			}
		}
			
	}
	
	this.nodes=nodes;
	
	for(var i=0;i<toCopy.sorted.length;i++)
		this.sorted.push(toCopy.sorted[i]);

}

Heap.prototype.prev=function(con){
	if(this.actStateID>1){
		var tmp_db=this.db;
		var prev_id=this.actStateID-1;
		this.actStateID=prev_id;
		var rs=tmp_db({id:prev_id}).select("state");
		//make actual node to THIS:
      	this.replaceThis(rs[0]);
      	this.draw(con);
	}
}

Heap.prototype.next=function(con){
	if(this.actStateID<this.db().count()){
		var tmp_db=this.db;
		var next_id=this.actStateID+1;
		this.actStateID=next_id;
		var rs=tmp_db({id:next_id}).select("state");
		//make actual node to THIS:
      	this.replaceThis(rs[0]);
      	this.draw(con);
	}
}

Heap.prototype.firstState=function(con){
	var tmp_db=this.db;
	this.actStateID=1;
	var rs=tmp_db({id:1}).select("state");
	//make actual node to THIS:
     this.replaceThis(rs[0]);
     this.draw(con);
}

Heap.prototype.lastState=function(con){
	var tmp_db=this.db;
	var last_id=tmp_db().count();
	this.actStateID=last_id;
	var rs=tmp_db({id:last_id}).select("state");
	//make actual node to THIS:
     this.replaceThis(rs[0]);
     this.draw(con);
}

Heap.prototype.add=function(c1) {
    //code snippet for disabling while actState!=last
	//var count=this.db().count();

	//if(count==this.actStateID){
		
	var val=parseInt(prompt("Add:\n(Values > 999 are ignored)"));
	if(isNaN(val)||val>999)return;
	
	this.working=true;
	
	var node=new Node();
	node.value=val;
	
	this.nodes.push(node);
	if(this.nodes.length==1){
		this.root=this.nodes[0];
		this.draw(c1);
		this.working=false;
		this.saveInDB();
		return;
	}
	else{
		var actIndex=this.nodes.length-1;
		var parIndex=Math.floor((actIndex-1)/2);
		
		this.nodes[actIndex].parent=this.nodes[parIndex];
		
		//if index of last node is uneven, its a left child. else right
		if((this.nodes.length-1)%2==1){
			this.nodes[parIndex].leftChild=this.nodes[actIndex];
		}
		else{
			this.nodes[parIndex].rightChild=this.nodes[actIndex];
		}
		
		this.draw(c1);
		
		//check if swap is needed
		
		//#44FF00 green
		//#FF00E1 red
		//#51DBED default
		var finished=false;
		
		function swapping(heap){
			setTimeout(function (){
				
				if(heap.nodes[actIndex].value<heap.nodes[parIndex].value){
					//window.alert("in1");
					heap.nodes[actIndex].color="#FF00E1";
					heap.nodes[parIndex].color="#FF00E1";
					heap.draw(c1);
					
					var temp=heap.nodes[actIndex].value;
					heap.nodes[actIndex].value=heap.nodes[parIndex].value;
					heap.nodes[parIndex].value=temp;
					
					function delayedDrawing1(heap){
						
						setTimeout(function (){
							
							heap.nodes[actIndex].color="#51DBED";
							heap.nodes[parIndex].color="#51DBED";
							heap.draw(c1);
							
							actIndex=parIndex;
							parIndex=Math.floor((actIndex-1)/2);
							
							if(parIndex<0){
								heap.working=false;
								heap.saveInDB();
								return;
							}
							
							swapping(heap);
						},1000)
					}
					
					delayedDrawing1(heap);
					
				}
				else{
					//window.alert("in2");
					heap.nodes[actIndex].color="#44FF00";
					heap.nodes[parIndex].color="#44FF00";
					heap.draw(c1);
					
					function delayedDrawing(heap){
						setTimeout(function (){
							heap.nodes[actIndex].color="#51DBED";
							heap.nodes[parIndex].color="#51DBED";
							heap.draw(c1);
							heap.working=false;
							heap.saveInDB();
							return;
						},1000)
					}
					
					delayedDrawing(heap);

				}

			},1000)
		}
		
		swapping(this);
	}
}

Heap.prototype.addFixed=function(val) {

	var node=new Node();
	node.value=val;
	
	this.nodes.push(node);
	if(this.nodes.length==1){
		this.root=this.nodes[0];
		return;
	}
	else{
		var actIndex=this.nodes.length-1;
		var parIndex=Math.floor((actIndex-1)/2);
		
		this.nodes[actIndex].parent=this.nodes[parIndex];
		
		//if index of last node is uneven, its a left child. else right
		if((this.nodes.length-1)%2==1){
			this.nodes[parIndex].leftChild=this.nodes[actIndex];
		}
		else{
			this.nodes[parIndex].rightChild=this.nodes[actIndex];
		}
		
		//check if swap is needed
		var finished=false;
		
		function swapping(heap){
				if(heap.nodes[actIndex].value<heap.nodes[parIndex].value){	
					var temp=heap.nodes[actIndex].value;
					heap.nodes[actIndex].value=heap.nodes[parIndex].value;
					heap.nodes[parIndex].value=temp;
					actIndex=parIndex;
					parIndex=Math.floor((actIndex-1)/2);
					if(parIndex<0){
						return;
					}
					swapping(heap);					
				}
				else{
					return;
				}
		}
		
		swapping(this);
	}
}

Heap.prototype.addFixedNotHeapified=function(val) {
	var node=new Node();
	node.value=val;
	
	this.nodes.push(node);
	if(this.nodes.length==1){
		this.root=this.nodes[0];
		return;
	}
	else{
		var actIndex=this.nodes.length-1;
		var parIndex=Math.floor((actIndex-1)/2);
		
		this.nodes[actIndex].parent=this.nodes[parIndex];
		
		//if index of last node is uneven, its a left child. else right
		if((this.nodes.length-1)%2==1){
			this.nodes[parIndex].leftChild=this.nodes[actIndex];
		}
		else{
			this.nodes[parIndex].rightChild=this.nodes[actIndex];
		}
	}
}


Heap.prototype.saveInDB=function(){
	var count=this.db().count();
 	if(count!=this.actStateID){
       	for(var i=this.actStateID+1;i<=count;++i){
           	this.db({id:i}).remove();
       	}
 	}
 	
	var tmp_db=this.db;

	var count=tmp_db().count();
	var nextID=count+1;
	
	var new_state = this.copy(this);
	tmp_db.insert({id: nextID,state:new_state});
	
	this.db=tmp_db;
	this.actStateID=nextID;
}


Heap.prototype.removeMinimum=function(c1) { 
	if(this.nodes.length<1){
		window.alert("Heap is empty!");
		return;
	}
	else{
		this.working=true;
		if(this.nodes.length==1){
			this.nodes=[];
			this.root=undefined
			this.draw(c1);
			this.saveInDB();
			this.working=false;
			return;
		}
		else{

			var actIndex=undefined;
			
			this.nodes[0].color="#FF00E1";
			this.nodes[this.nodes.length-1].color="#FF00E1";
			this.draw(c1);
			
			var temp=this.nodes[0].value;
			this.nodes[0].value=heap.nodes[this.nodes.length-1].value;
			this.nodes[this.nodes.length-1].value=temp;
			
			function delayedDrawing1(heap){
				
				setTimeout(function (){
					
					heap.nodes[0].color="#51DBED";
					heap.nodes[heap.nodes.length-1].color="#51DBED";
					heap.draw(c1);
					
					delayedDrawing2(heap);
				},1000)
			}
			
			function delayedDrawing2(heap){
				
				setTimeout(function (){
					heap.nodes[heap.nodes.length-1].color="red";
					heap.draw(c1);
					
					heap.nodes[heap.nodes.length-1].parent=undefined;
					var actIndex=heap.nodes.length-1;
					var parIndex=Math.floor((actIndex-1)/2);
					
					heap.nodes[actIndex].parent=undefined;
					
					//if index of last node is uneven, its a left child. else right
					if((heap.nodes.length-1)%2==1){
						heap.nodes[parIndex].leftChild=undefined;
					}
					else{
						heap.nodes[parIndex].rightChild=undefined;
					}
					heap.nodes.splice(heap.nodes.length-1,1);
					
					delayedDrawing3(heap);
				},1000)
			}
			
			function delayedDrawing3(heap){
				
				setTimeout(function (){
					heap.draw(c1);
					if(heap.nodes.length==1){
						heap.saveInDB();
						heap.working=false;
						return;
					}
					else{
						actIndex=0;
						sink(heap);
					}
				},1000)
			}
			var minKidIndex=undefined;
			function sink(heap){
				setTimeout(function(){
					//#44FF00 green
					//#FF00E1 red
					//#51DBED default
					
					//get actNode + child with smaller value
					if((heap.nodes[2*actIndex+2]==undefined)||(heap.nodes[2*actIndex+2]!=undefined && heap.nodes[2*actIndex+1].value<=heap.nodes[2*actIndex+2].value)){
						minKidIndex=2*actIndex+1;
					}
					else if(heap.nodes[2*actIndex+2]!=undefined && heap.nodes[2*actIndex+1].value>heap.nodes[2*actIndex+2].value){
						minKidIndex=2*actIndex+2;
					}
					
					if(heap.nodes[actIndex].value<=heap.nodes[minKidIndex].value){
						heap.nodes[actIndex].color="#44FF00";
						heap.nodes[minKidIndex].color="#44FF00";
						
						heap.draw(c1);
						
						heap.nodes[actIndex].color="#51DBED";
						heap.nodes[minKidIndex].color="#51DBED";
						delayedDrawing4(heap);
					}
					else{
						heap.nodes[actIndex].color="#FF00E1";
						heap.nodes[minKidIndex].color="#FF00E1";
						
						heap.draw(c1);
						
						var temp=heap.nodes[actIndex].value;
						heap.nodes[actIndex].value=heap.nodes[minKidIndex].value;
						heap.nodes[minKidIndex].value=temp;
						delayedDrawing5(heap);
					}

				},1000)
			}
			
			function delayedDrawing4(heap){
				
				setTimeout(function (){
					heap.draw(c1);
					
					heap.saveInDB();
					heap.working=false;
					return;
					
				},1000)
			}
			
			function delayedDrawing5(heap){
				
				setTimeout(function (){
					heap.nodes[actIndex].color="#51DBED";
					heap.nodes[minKidIndex].color="#51DBED";
					heap.draw(c1);
					
					actIndex=minKidIndex;
					if(heap.nodes[actIndex].leftChild==undefined && heap.nodes[actIndex].rightChild==undefined){
						heap.saveInDB();
						heap.working=false;
						return;
					}
					
					else
						sink(heap);
					
				},1000)
			}

			delayedDrawing1(this);
		}
	}
}

Heap.prototype.sort=function(c1) { 

		this.working=true;
		if(this.nodes.length==1){
			this.sorted.splice(0,0,this.root.value);
			this.sorted.join();

			this.nodes=[];
			this.root=undefined
			
			this.draw(c1);
			this.saveInDB();
			this.working=false;
			return;
		}
		else{
			var actIndex=undefined;
			
			this.nodes[0].color="#FF00E1";
			this.nodes[this.nodes.length-1].color="#FF00E1";
			this.draw(c1);
			
			var temp=this.nodes[0].value;
			this.nodes[0].value=heap.nodes[this.nodes.length-1].value;
			this.nodes[this.nodes.length-1].value=temp;
			
			function delayedDrawing1(heap){
				
				setTimeout(function (){
					
					heap.nodes[0].color="#51DBED";
					heap.nodes[heap.nodes.length-1].color="#51DBED";
					heap.draw(c1);
					
					delayedDrawing2(heap);
				},1000)
			}
			
			function delayedDrawing2(heap){
				
				setTimeout(function (){
					heap.nodes[heap.nodes.length-1].color="red";
					heap.draw(c1);
					
					heap.nodes[heap.nodes.length-1].parent=undefined;
					var actIndex=heap.nodes.length-1;
					var parIndex=Math.floor((actIndex-1)/2);
					
					heap.nodes[actIndex].parent=undefined;
					
					//if index of last node is uneven, its a left child. else right
					if((heap.nodes.length-1)%2==1){
						heap.nodes[parIndex].leftChild=undefined;
					}
					else{
						heap.nodes[parIndex].rightChild=undefined;
					}

					heap.sorted.splice(0,0,heap.nodes[heap.nodes.length-1].value);
					heap.sorted.join();
					
					heap.nodes.splice(heap.nodes.length-1,1);
					
					delayedDrawing3(heap);
				},1000)
			}
			
			function delayedDrawing3(heap){
				
				setTimeout(function (){
					heap.draw(c1);
					if(heap.nodes.length==1){
						heap.saveInDB();
						
						function removeNext(heap){
							setTimeout(function(){
								heap.sort(c1);
							},1000)
						}
						
						removeNext(heap);
						return;
					}
					else{
						actIndex=0;
						sink(heap);
					}
				},1000)
			}
			var minKidIndex=undefined;
			function sink(heap){
				setTimeout(function(){
					//#44FF00 green
					//#FF00E1 red
					//#51DBED default
					
					//get actNode + child with smaller value
					if((heap.nodes[2*actIndex+2]==undefined)||(heap.nodes[2*actIndex+2]!=undefined && heap.nodes[2*actIndex+1].value>=heap.nodes[2*actIndex+2].value)){
						minKidIndex=2*actIndex+1;
					}
					else if(heap.nodes[2*actIndex+2]!=undefined && heap.nodes[2*actIndex+1].value<heap.nodes[2*actIndex+2].value){
						minKidIndex=2*actIndex+2;
					}
					
					if(heap.nodes[actIndex].value>=heap.nodes[minKidIndex].value){
						heap.nodes[actIndex].color="#44FF00";
						heap.nodes[minKidIndex].color="#44FF00";
						
						heap.draw(c1);
						
						heap.nodes[actIndex].color="#51DBED";
						heap.nodes[minKidIndex].color="#51DBED";
						delayedDrawing4(heap);
					}
					else{
						heap.nodes[actIndex].color="#FF00E1";
						heap.nodes[minKidIndex].color="#FF00E1";
						
						heap.draw(c1);
						
						var temp=heap.nodes[actIndex].value;
						heap.nodes[actIndex].value=heap.nodes[minKidIndex].value;
						heap.nodes[minKidIndex].value=temp;
						delayedDrawing5(heap);
					}

				},1000)
			}
			
			function delayedDrawing4(heap){
				
				setTimeout(function (){
					heap.draw(c1);
					
					heap.saveInDB();
					heap.working=false;
					
					function removeNext(heap){
						setTimeout(function(){
							heap.sort(c1);
						},1000)
					}
					
					removeNext(heap);
					
					return;
					
				},1000)
			}
			
			function delayedDrawing5(heap){
				
				setTimeout(function (){
					heap.nodes[actIndex].color="#51DBED";
					heap.nodes[minKidIndex].color="#51DBED";
					heap.draw(c1);
					
					actIndex=minKidIndex;
					if(heap.nodes[actIndex].leftChild==undefined && heap.nodes[actIndex].rightChild==undefined){
						heap.saveInDB();
						
						function removeNext(heap){
							setTimeout(function(){
								heap.sort(c1);
							},1000)
						}
						
						removeNext(heap);
						
						return;
					}
					
					else
						sink(heap);
					
				},1000)
			}

			delayedDrawing1(this);
		}
}

Heap.prototype.buildMaxHeap=function(c1){
	if(this.nodes.length==1){
		heap.saveInDB();
		window.alert("Max Heap built. Starting to sort...");
		this.sort(c1);
		return;
	}
		
	//get lastKid:
	var actIndex=this.nodes.length-1;
	var actNode=this.nodes[actIndex];
	//get his parent to be actNode:
	actIndex=Math.floor((actIndex-1)/2);
	actNode=this.nodes[actIndex];
	var lastHeapified=actIndex;
	//lift:
	var maxKidIndex=undefined;
	function sink(heap){
		setTimeout(function(){
			//#44FF00 green
			//#FF00E1 red
			//#51DBED default
			
			//get actNode + child with smaller value
			if((heap.nodes[2*actIndex+2]==undefined)||(heap.nodes[2*actIndex+2]!=undefined && heap.nodes[2*actIndex+1].value>=heap.nodes[2*actIndex+2].value)){
				maxKidIndex=2*actIndex+1;
			}
			else if(heap.nodes[2*actIndex+2]!=undefined && heap.nodes[2*actIndex+1].value<heap.nodes[2*actIndex+2].value){
				maxKidIndex=2*actIndex+2;
			}
			
			if(heap.nodes[actIndex].value>=heap.nodes[maxKidIndex].value){
				heap.nodes[actIndex].color="#44FF00";
				heap.nodes[maxKidIndex].color="#44FF00";
				
				heap.draw(c1);
				
				heap.nodes[actIndex].color="#51DBED";
				heap.nodes[maxKidIndex].color="#51DBED";
				
				function delayedDrawing(heap){
					setTimeout(function (){
						heap.draw(c1);
						if(lastHeapified==0){
							heap.saveInDB();
					
							function pSort(heap){
								setTimeout(function(){
									window.alert("Max Heap built. Starting to sort...");
									heap.sort(c1);
								},1000)
							}
							pSort(heap);
							
							return;
						}
						else{
							actIndex=lastHeapified-1;
							lastHeapified=actIndex;
							sink(heap);
							return;
						}
					},1000)
				}
				
				delayedDrawing(heap);
			}
			else{
				heap.nodes[actIndex].color="#FF00E1";
				heap.nodes[maxKidIndex].color="#FF00E1";
				
				heap.draw(c1);
				
				var temp=heap.nodes[actIndex].value;
				heap.nodes[actIndex].value=heap.nodes[maxKidIndex].value;
				heap.nodes[maxKidIndex].value=temp;
				
				function endSink(heap){
					
					setTimeout(function (){
						heap.nodes[actIndex].color="#51DBED";
						heap.nodes[maxKidIndex].color="#51DBED";
						heap.draw(c1);
						
						actIndex=maxKidIndex;
						if(heap.nodes[actIndex].leftChild==undefined && heap.nodes[actIndex].rightChild==undefined){
							if(lastHeapified==0){
								heap.saveInDB();
								
								function pSort(heap){
									setTimeout(function(){
										window.alert("Max Heap built. Starting to sort...");
										heap.sort(c1);
									},1000)
								}
								pSort(heap);
								
								return;
							}
							else{
								actIndex=lastHeapified-1;
								lastHeapified=actIndex;
								sink(heap);
								return;
							}
						}
						
						else
							sink(heap);
						
					},1000)
				}
				
				endSink(heap);
			}

		},1000)
	}
	sink(this);
}

Heap.prototype.random=function(con){
	//var count=this.db().count();

	//if(count==this.actStateID){
		this.sorted=[];
		this.root=undefined;
		this.nodes=[];
		var number=Math.floor(Math.random() * (20 - 1 + 1)) + 1;
	
		for(var i=0;i<number;i++){
			this.addFixed(parseInt(Math.random()*1000,10));
		}
		
		this.saveInDB();
		this.draw(con);
	//}
}

Heap.prototype.randomHeapsort=function(con){
	this.working=true;
	this.root=undefined;
	this.nodes=[];
	this.sorted=[];
	var number=Math.floor(Math.random() * (20 - 1 + 1)) + 1;
	
	for(var i=0;i<number;i++){
		this.addFixedNotHeapified(parseInt(Math.random()*1000,10));
	}
		
	//this.saveInDB();
	this.draw(con);
	
	function bmh(heap){
		setTimeout(function (){
			window.alert("Starting to build max heap...");
			heap.buildMaxHeap(con);
		},1000)
	}
	bmh(this);
	return;
}

Heap.prototype.getElementsByPrompt=function(con){
	this.working=true;
	this.nodes=[];
	this.root=undefined;
	this.sorted=[];
	var tempElements=[];

	var valuesInString=prompt("Please enter the elements (separated by space):\nValues > 999 are ignored");

	var tempValsStr = valuesInString.split(" "); 
	var _in=false;
	for(var i=0;i<tempValsStr.length;i++){
		if(!isNaN(parseInt(tempValsStr[i])) && parseInt(tempValsStr[i])<1000){
			this.addFixedNotHeapified(parseInt(tempValsStr[i]));
			_in=true;
		}
	}
	
	if(_in){
		this.draw(con); 
		function bmh(heap){
			setTimeout(function (){
				window.alert("Starting to build max heap...");
				heap.buildMaxHeap(con);
			},1000)
		}
		bmh(this);
	}
	else{
		this.working=false;
		this.randomHeapsort(con);
	}
	return;
}

Heap.prototype.draw=function(c1){
	this.view.draw(c1);
}