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

function Timer(callback, delay) {
    this.timerId, this.start, this.remaining = delay;
    this._callback=callback;
    this.pause = function() {
        window.clearTimeout( this.timerId);
        this.remaining -= new Date() - start;
    };

    this.resume = function() {
        start = new Date();
        window.clearTimeout(this.timerId);
        this.timerId = window.setTimeout( this._callback,  this.remaining);
    };

    this.resume();
}

function Heap(){
	this.view=new HeapView(this);
	this.db=[];
	this.nodes=[];
	this.sorted=[];
	this.root=undefined;
	this.actStateID=-1;
}

Heap.prototype.init=function(){
	//this.saveInDB();
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
	if(toCopy.timer!=undefined){
		newHeap.timer=new Timer(toCopy.timer._callback,toCopy.timer.remaining);
		newHeap.timer.pause();
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
	if(toCopy.timer!=undefined){
		this.timer=new Timer(toCopy.timer._callback,toCopy.timer.remaining);
		this.timer.pause();
	}
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

Heap.prototype.prev=function(){
	
	if(this.actStateID>0){
		if(heap.working){
			var rs=this.db[this.actStateID];
			//make actual node to THIS:
	      	this.replaceThis(rs);
	      	this.draw();
		}
		else{
			var prev_id=this.actStateID-1;
			this.actStateID=prev_id;
			var rs=this.db[prev_id];
			//make actual node to THIS:
	      	this.replaceThis(rs);
	      	this.draw();
		}
	}
	else
		this.firstState();
}

Heap.prototype.next=function(){
	if(this.actStateID<this.db.length-1){
		var next_id=this.actStateID+1;
		this.actStateID=next_id;
		var rs=this.db[next_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

Heap.prototype.firstState=function(){
	this.actStateID=0;
	var rs=this.db[0];
	//make actual node to THIS:
    this.replaceThis(rs);
    this.draw();
}

Heap.prototype.lastState=function(){
	var last_id=this.db.length-1;
	this.actStateID=last_id;
	var rs=this.db[last_id];
	//make actual node to THIS:
     this.replaceThis(rs);
     this.draw();
}

Heap.prototype.add=function() {
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
		this.draw();
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
		
		this.draw();
		
		//check if swap is needed
		
		//#44FF00 green
		//#FF00E1 red
		//#51DBED default
		var finished=false;
		
		function swapping(heap){
			heap.timer=new Timer(function() {
				
				if(heap.nodes[actIndex].value<heap.nodes[parIndex].value){
					//window.alert("in1");
					heap.nodes[actIndex].color="#FF00E1";
					heap.nodes[parIndex].color="#FF00E1";
					heap.draw();
					
					var temp=heap.nodes[actIndex].value;
					heap.nodes[actIndex].value=heap.nodes[parIndex].value;
					heap.nodes[parIndex].value=temp;
					
					function delayedDrawing1(heap){
						
						heap.timer=new Timer(function() {
							
							heap.nodes[actIndex].color="#51DBED";
							heap.nodes[parIndex].color="#51DBED";
							heap.draw();
							
							actIndex=parIndex;
							parIndex=Math.floor((actIndex-1)/2);
							
							if(parIndex<0){
								heap.working=false;
								heap.saveInDB();
								return;
							}
							
							swapping(heap);
						},1000);
					}
					
					delayedDrawing1(heap);
					
				}
				else{
					//window.alert("in2");
					heap.nodes[actIndex].color="#44FF00";
					heap.nodes[parIndex].color="#44FF00";
					heap.draw();
					
					function delayedDrawing(heap){
						heap.timer=new Timer(function() {
							heap.nodes[actIndex].color="#51DBED";
							heap.nodes[parIndex].color="#51DBED";
							heap.draw();
							heap.working=false;
							heap.saveInDB();
							return;
						},1000);
					}
					
					delayedDrawing(heap);

				}

			},1000);
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
	var count=this.db.length-1;
 	if(count!=this.actStateID){
       	for(var i=this.actStateID+1;i<=count;++i){
           	this.db.splice(this.db.length-1,1);
       	}
 	}

	var nextID=this.db.length;
	
	var new_state = this.copy(this);
	//ignoring duplicates 
	var last_state = this.db[this.db.length-1];
	
	var same=true;
	if(last_state!=undefined && (new_state.nodes.length!=last_state.nodes.length || 
			new_state.sorted.length!=last_state.sorted.length)) 
		same=false;
	else{
		if(last_state!=undefined)
			for(var i=0;i<new_state.nodes.length;i++){
				if(new_state.nodes[i].color!=last_state.nodes[i].color ||
						new_state.nodes[i].value!=last_state.nodes[i].value){
					same=false;break;
				}
			}
		else
			same=false;
	}
	
	if(!same){
		this.db.push(new_state);
		this.actStateID=nextID;
	}
}


Heap.prototype.removeMinimum=function() { 
	if(this.nodes.length<1){
		window.alert("Heap is empty!");
		return;
	}
	else{
		this.working=true;
		if(this.nodes.length==1){
			this.nodes=[];
			this.root=undefined
			this.draw();
			this.saveInDB();
			this.working=false;
			return;
		}
		else{

			var actIndex=undefined;
			
			this.nodes[0].color="#FF00E1";
			this.nodes[this.nodes.length-1].color="#FF00E1";
			this.draw();
			
			var temp=this.nodes[0].value;
			this.nodes[0].value=heap.nodes[this.nodes.length-1].value;
			this.nodes[this.nodes.length-1].value=temp;
			
			function delayedDrawing1(heap){
				
				heap.timer=new Timer(function() {
					
					heap.nodes[0].color="#51DBED";
					heap.nodes[heap.nodes.length-1].color="#51DBED";
					heap.draw();
					
					delayedDrawing2(heap);
				},1000);
			}
			
			function delayedDrawing2(heap){
				
				heap.timer=new Timer(function() {
					heap.nodes[heap.nodes.length-1].color="red";
					heap.draw();
					
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
				},1000);
			}
			
			function delayedDrawing3(heap){
				
				heap.timer=new Timer(function() {
					heap.draw();
					if(heap.nodes.length==1){
						heap.saveInDB();
						heap.working=false;
						return;
					}
					else{
						actIndex=0;
						sink(heap);
					}
				},1000);
			}
			var minKidIndex=undefined;
			function sink(heap){
				heap.timer=new Timer(function() {
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
						
						heap.draw();
						
						heap.nodes[actIndex].color="#51DBED";
						heap.nodes[minKidIndex].color="#51DBED";
						delayedDrawing4(heap);
					}
					else{
						heap.nodes[actIndex].color="#FF00E1";
						heap.nodes[minKidIndex].color="#FF00E1";
						
						heap.draw();
						
						var temp=heap.nodes[actIndex].value;
						heap.nodes[actIndex].value=heap.nodes[minKidIndex].value;
						heap.nodes[minKidIndex].value=temp;
						delayedDrawing5(heap);
					}

				},1000);
			}
			
			function delayedDrawing4(heap){
				
				heap.timer=new Timer(function() {
					heap.draw();
					
					heap.saveInDB();
					heap.working=false;
					return;
					
				},1000);
			}
			
			function delayedDrawing5(heap){
				
				heap.timer=new Timer(function() {
					heap.nodes[actIndex].color="#51DBED";
					heap.nodes[minKidIndex].color="#51DBED";
					heap.draw();
					
					actIndex=minKidIndex;
					if(heap.nodes[actIndex].leftChild==undefined && heap.nodes[actIndex].rightChild==undefined){
						heap.saveInDB();
						heap.working=false;
						return;
					}
					
					else
						sink(heap);
					
				},1000);
			}

			delayedDrawing1(this);
		}
	}
}

Heap.prototype.sort=function() { 

		this.working=true;
		if(this.nodes.length==1){
			function endSort(heap){
				heap.timer=new Timer(function(){
					heap.sorted.splice(0,0,heap.root.value);
					heap.sorted.join();
	
					heap.nodes=[];
					heap.root=undefined
				
					heap.draw();
					heap.saveInDB();
					heap.working=false;
				},0);
			}
			endSort(this);
			return;
		}
		else{
			var actIndex=undefined;
			
			this.nodes[0].color="#FF00E1";
			this.nodes[this.nodes.length-1].color="#FF00E1";
			this.draw();
			
			var temp=this.nodes[0].value;
			this.nodes[0].value=heap.nodes[this.nodes.length-1].value;
			this.nodes[this.nodes.length-1].value=temp;
			
			function delayedDrawing1(heap){
				
				heap.timer=new Timer(function() {
					
					heap.nodes[0].color="#51DBED";
					heap.nodes[heap.nodes.length-1].color="#51DBED";
					heap.draw();
					
					delayedDrawing2(heap);
				},1000);
			}
			
			function delayedDrawing2(heap){
				heap.timer=new Timer(function() {
					heap.nodes[heap.nodes.length-1].color="red";
					heap.draw();
					
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
				},1000);
			}
			
			function delayedDrawing3(heap){
				
				heap.timer=new Timer(function() {
					heap.draw();
					if(heap.nodes.length==1){
						heap.saveInDB();
						
						function removeNext(heap){
							heap.timer=new Timer(function() {
								heap.sort();
							},1000);
						}
						
						removeNext(heap);
						return;
					}
					else{
						actIndex=0;
						sink(heap);
					}
				},1000);
			}
			var minKidIndex=undefined;
			function sink(heap){
				heap.timer=new Timer(function() {
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
						
						heap.draw();
						
						heap.nodes[actIndex].color="#51DBED";
						heap.nodes[minKidIndex].color="#51DBED";
						delayedDrawing4(heap);
					}
					else{
						heap.nodes[actIndex].color="#FF00E1";
						heap.nodes[minKidIndex].color="#FF00E1";
						
						heap.draw();
						
						var temp=heap.nodes[actIndex].value;
						heap.nodes[actIndex].value=heap.nodes[minKidIndex].value;
						heap.nodes[minKidIndex].value=temp;
						delayedDrawing5(heap);
					}

				},1000);
			}
			
			function delayedDrawing4(heap){
				
				heap.timer=new Timer(function() {
					heap.draw();
					
					heap.saveInDB();
					
					function removeNext(heap){
						heap.timer=new Timer(function() {
							heap.sort();
						},1000);
					}
					
					removeNext(heap);
					
					return;
					
				},1000);
			}
			
			function delayedDrawing5(heap){
				
				heap.timer=new Timer(function() {
					heap.nodes[actIndex].color="#51DBED";
					heap.nodes[minKidIndex].color="#51DBED";
					heap.draw();
					
					actIndex=minKidIndex;
					if(heap.nodes[actIndex].leftChild==undefined && heap.nodes[actIndex].rightChild==undefined){
						heap.saveInDB();
						
						function removeNext(heap){
							heap.timer=new Timer(function() {
								heap.sort();
							},1000);
						}
						
						removeNext(heap);
						
						return;
					}
					
					else
						sink(heap);
					
				},1000);
			}

			delayedDrawing1(this);
		}
}

Heap.prototype.buildMaxHeap=function(){
	if(this.nodes.length==1){
		function endBMH(heap){
			heap.timer=new Timer(function(){
				heap.saveInDB();
				window.alert("Max Heap built. Starting to sort...");
				heap.sort();
			},1000);
		}
		endBMH(this);
		
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
		heap.timer=new Timer(function() {
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
				
				heap.draw();
				
				heap.nodes[actIndex].color="#51DBED";
				heap.nodes[maxKidIndex].color="#51DBED";
				
				function delayedDrawing(heap){
					heap.timer=new Timer(function() {
						heap.draw();
						if(lastHeapified==0){
							heap.saveInDB();
					
							function pSort(heap){
								heap.timer=new Timer(function() {
									window.alert("Max Heap built. Starting to sort...");
									heap.sort();
								},1000);
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
					},1000);
				}
				
				delayedDrawing(heap);
			}
			else{
				heap.nodes[actIndex].color="#FF00E1";
				heap.nodes[maxKidIndex].color="#FF00E1";
				
				heap.draw();
				
				var temp=heap.nodes[actIndex].value;
				heap.nodes[actIndex].value=heap.nodes[maxKidIndex].value;
				heap.nodes[maxKidIndex].value=temp;
				
				function endSink(heap){
					
					heap.timer=new Timer(function() {
						heap.nodes[actIndex].color="#51DBED";
						heap.nodes[maxKidIndex].color="#51DBED";
						heap.draw();
						
						actIndex=maxKidIndex;
						if(heap.nodes[actIndex].leftChild==undefined && heap.nodes[actIndex].rightChild==undefined){
							if(lastHeapified==0){
								heap.saveInDB();
								
								function pSort(heap){
									heap.timer=new Timer(function() {
										window.alert("Max Heap built. Starting to sort...");
										heap.sort();
									},1000);
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
						
					},1000);
				}
				
				endSink(heap);
			}

		},1000);
	}
	sink(this);
}

Heap.prototype.random=function(){
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
		this.draw();
	//}
}

Heap.prototype.randomHeapsort=function(){
	this.working=true;
	this.root=undefined;
	this.nodes=[];
	this.sorted=[];
	var number=Math.floor(Math.random() * (20 - 1 + 1)) + 1;
	
	for(var i=0;i<number;i++){
		this.addFixedNotHeapified(parseInt(Math.random()*1000,10));
	}
		
	//this.saveInDB();
	this.draw();
	
	this.timer = new Timer(function() {
		window.alert("Starting to build max heap...");
		heap.buildMaxHeap();
	}, 1000);

	return;
}

Heap.prototype.getElementsByPrompt=function(){
	this.working=true;
	
	var valuesInString=prompt("Please enter the elements (separated by space):\nValues > 999 are ignored");

	var tempValsStr = valuesInString.split(" "); 
	var _in=false;
	for(var i=0;i<tempValsStr.length;i++){
		if(!isNaN(parseInt(tempValsStr[i])) && parseInt(tempValsStr[i])<1000){
			_in=true;
		}
	}
	
	if(_in){
		this.nodes=[];
		this.root=undefined;
		this.sorted=[];
		var tempElements=[];
		
		for(var i=0;i<tempValsStr.length;i++){
			if(!isNaN(parseInt(tempValsStr[i])) && parseInt(tempValsStr[i])<1000){
				this.addFixedNotHeapified(parseInt(tempValsStr[i]));
			}
		}
		
		this.draw();
		
		this.timer = new Timer(function() {
			window.alert("Starting to build max heap...");
			heap.buildMaxHeap();
		}, 1000);
		return true;
	}
	else{
		this.working=false;
		return false;
	}
	
}

Heap.prototype.draw=function(){
	this.view.draw();
}