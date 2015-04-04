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
	this.color="#ADFF2F";
	this.keys=[];
	this.pointers=[];
	this.is_leaf=true; 
	this.next=null; //for the linked list of leaves
	this.parent=undefined; //parent pointer 
}

function BPlusTree(){
	this.view=new BPlusTreeView(this);
	
	this.root=undefined;
	this.order=0;
	
	this.db=[];
	this.actStateID=-1;
	this.history="";
}

BPlusTree.prototype.init=function(){
	var o=parseInt(prompt("Order k:"));
	if(isNaN(o)||o<1)return;
	this.root=undefined;
	this.history="";
	this.order=o;
	this.draw();
	
	this.saveInDB();
}

BPlusTree.prototype.saveInDB=function(){
	var count=this.db.length-1;
 	if(count!=this.actStateID){
       	for(var i=this.actStateID+1;i<=count;++i){
           	this.db.splice(this.db.length-1,1);
       	}
 	}

	var nextID=this.db.length;
	
	var new_state = this.copy(this);
	this.db.push(new_state);
	
	this.actStateID=nextID;
}

BPlusTree.prototype.copy=function(toCopy){
	var history=toCopy.history;
	var tree=new BPlusTree();
	tree.order=toCopy.order;
	
	while(history.length>0){
		var index=0;
		var last=false;
		if(history.substring(0,1)=="a"){
			for(var i=1;i<history.length;i++){
				if(i==history.length-1){
					last=true;
				}
				if(i==history.length-1 || history.substring(i,i+1)=="a"||history.substring(i,i+1)=="r"){
					index=i;break;
				}
			}
			if(!last)
				tree.addFixed(parseInt(history.substring(1,index)));
			else
				tree.addFixed(parseInt(history.substring(1)));
		}
		else{
			for(var i=1;i<history.length;i++){
				if(i==history.length-1){
					last=true;
				}
				if(i==history.length-1 || history.substring(i,i+1)=="a"||history.substring(i,i+1)=="r"){
					index=i;break;
				}
			}
			if(!last)
				tree.removeFixed(parseInt(history.substring(1,index)));
			else
				tree.removeFixed(parseInt(history.substring(1)));
		}
		if(index==history.length-1)
			history="";
		else
			history=history.substring(index);
	}
	
	if(tree.root!=undefined && tree.root.keys.length==0)
		tree.root=undefined;
	return tree;
}

BPlusTree.prototype.replaceThis=function(toCopy){
	this.root=undefined;
	this.order=toCopy.order;
	this.history="";
	var history=toCopy.history;

	while(history.length>0){
		var index=0;
		var last=false;
		if(history.substring(0,1)=="a"){
			for(var i=1;i<history.length;i++){
				if(i==history.length-1){
					last=true;
				}
				if(i==history.length-1 || history.substring(i,i+1)=="a"||history.substring(i,i+1)=="r"){
					index=i;break;
				}
			}
			if(!last)
				this.addFixed(parseInt(history.substring(1,index)));
			else
				this.addFixed(parseInt(history.substring(1)));
		}
		else{
			for(var i=1;i<history.length;i++){
				if(i==history.length-1){
					last=true;
				}
				if(i==history.length-1 || history.substring(i,i+1)=="a"||history.substring(i,i+1)=="r"){
					index=i;break;
				}
			}
			if(!last)
				this.removeFixed(parseInt(history.substring(1,index)));
			else
				this.removeFixed(parseInt(history.substring(1)));
		}
		if(index==history.length-1)
			history="";
		else
			history=history.substring(index);
	}
	if(this.root!=undefined && this.root.keys.length==0)
		this.root=undefined;
}

BPlusTree.prototype.prev=function(){
	if(this.actStateID>0){
		var prev_id=this.actStateID-1;
		this.actStateID=prev_id;
		var rs=this.db[prev_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

BPlusTree.prototype.next=function(){
	if(this.actStateID<this.db.length-1){
		var next_id=this.actStateID+1;
		this.actStateID=next_id;
		var rs=this.db[next_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

BPlusTree.prototype.firstState=function(){
	this.actStateID=0;
	var rs=this.db[0];
	//make actual node to THIS:
    this.replaceThis(rs);
    this.draw();
}

BPlusTree.prototype.lastState=function(){
	var last_id=this.db.length-1;
	this.actStateID=last_id;
	var rs=this.db[last_id];
	//make actual node to THIS:
     this.replaceThis(rs);
     this.draw();
}


BPlusTree.prototype.add=function() {
	var val=parseInt(prompt("Add:\n(Values <-99 and >999 are ignored"));
	var origVal=val;
	if(isNaN(val)||val<-99||val>999)return;
	var steps=0;
	if(this.order<1){
		window.alert("Create the tree first!");return;
	}
	
	//empty tree:
	if(this.root==undefined){
		var root=new Node();
		root.keys[0]=val;
		this.root=root;
		this.draw();

     	this.history+="a"+val;
     	this.saveInDB();
		
		//save, draw
		//this.draw();
		//return;
	}
	//if root exists
	else{
		//find target leaf node first:
		var actNode=this.root;
		actNode.color="#FF8000";
		this.draw();

			function whileLoop(tree,actNode){
				setTimeout(function (){
					//find index of pointer leading to target:
					//assume its on first place
					var index=0;
					//if not, iterate
					if(val>=actNode.keys[0]){
						for(var i=0;i<actNode.keys.length;i++){
							if(val>=actNode.keys[i] && (actNode.keys[i+1]==undefined || val<actNode.keys[i+1])){
								index=i+1; // because pointer.length+1 == keys.length 
								break;
							}
						}
					}
					actNode.neededKid=index;
					actNode=actNode.pointers[index];
					actNode.color="#FF8000";
					
					actNode.parent.color="#ADFF2F";
					tree.draw();
					actNode.parent.neededKid=undefined;
					if(!actNode.is_leaf)whileLoop(tree,actNode);
					
				},1000)
			}
			if(!actNode.is_leaf)whileLoop(tree,actNode);
			//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		
		actNode=this.root;
		while(!actNode.is_leaf){
			var index=0;
			//if not, iterate
			if(val>=actNode.keys[0]){
				for(var i=0;i<actNode.keys.length;i++){
					if(val>=actNode.keys[i] && (actNode.keys[i+1]==undefined || val<actNode.keys[i+1])){
						index=i+1; // because pointer.length+1 == keys.length 
						break;
					}
				}
			}
			actNode=actNode.pointers[index];
			steps++;
		}
		//actNode.color="#ADFF2F";//for root
		
		function forLoop(tree,actNode){
			setTimeout(function(){
				
				for(var i=0;i<actNode.keys.length;i++){if(actNode.keys[i]==val){actNode.color="#ADFF2F";tree.draw();return;}}
				actNode.color="#ADFF2F";
				//the target node has available space for one more key.
				if(actNode.keys.length<tree.order*2){
					//window.alert("in1");
					actNode.keys.push(val);
					actNode.keys.sort(function(a, b){return a-b});
					
	             	tree.history+="a"+origVal;
	            	tree.saveInDB();
				}
				//the target node is full and its root
				else if(actNode.keys.length==tree.order*2 && actNode==tree.root){
					//sibling leaf
					//window.alert("in2");
					var rightSibling=new Node();
					
					//get all values to sort and split siblings
					var values=actNode.keys;
					values.push(val);
					values.sort(function(a, b){return a-b});
					
					var valuesLeftSibling=[];
					for(var i=0;i<tree.order;i++){
						valuesLeftSibling.push(values[i]);
					}
					actNode.keys=valuesLeftSibling;
					
					var valuesRightSibling=[];
					for(var i=tree.order;i<=tree.order*2;i++){
						valuesRightSibling.push(values[i]);
					}
					rightSibling.keys=valuesRightSibling;
					
					var newRoot=new Node();
					newRoot.is_leaf=false;
					newRoot.keys.push(values[tree.order]);
					newRoot.pointers[0]=actNode;
					actNode.parent=newRoot;
					newRoot.pointers[1]=rightSibling;
					rightSibling.parent=newRoot;
					
					tree.root=newRoot;
					
	             	tree.history+="a"+origVal;
	            	tree.saveInDB();
				}
				//the target node is full, but its parent has space for one more key.
				else if(actNode.keys.length==tree.order*2 && actNode.parent!=undefined && actNode.parent.keys.length<tree.order*2){
					//window.alert("in3");
					//sibling leaf
					var rightSibling=new Node();
					
					//get all values to sort and split siblings
					var values=actNode.keys;
					values.push(val);
					values.sort(function(a, b){return a-b});
					
					var valuesLeftSibling=[];
					for(var i=0;i<tree.order;i++){
						valuesLeftSibling.push(values[i]);
					}
					actNode.keys=valuesLeftSibling;
					
					var valuesRightSibling=[];
					for(var i=tree.order;i<=tree.order*2;i++){
						valuesRightSibling.push(values[i]);
					}
					rightSibling.keys=valuesRightSibling;
					
					//add middle key to parent: find index, then splice
					var index=0;
					for(var i=0;i<actNode.parent.keys.length;i++){
						if(values[tree.order]<actNode.parent.keys[i]){
							index=i;
							break;
						}
						else if(i+1==actNode.parent.keys.length){
							index=i+1;
						}
					}
					
					actNode.parent.keys.push(values[tree.order]);
					actNode.parent.keys.sort(function(a, b){return a-b});
					
					//update the right
					actNode.parent.pointers.splice([index+1],0,rightSibling);
					
					//set parent for new sibling
					rightSibling.parent=actNode.parent;

	             	tree.history+="a"+origVal;
	            	tree.saveInDB();
				}
				//the target node and its parent are both full
				else if(actNode.keys.length==tree.order*2 && actNode.parent!=undefined && actNode.parent.keys.length==tree.order*2){
					var finished=false
					
					var oldLeft=undefined;
					var oldRight=undefined;
					var left=false
					
					while(!finished){
						//sibling leaf
						var rightSibling=new Node();
						//window.alert(actNode.keys);
						//get all values to sort and split siblings
						var values=actNode.keys;
						values.push(val);
						values.sort(function(a, b){return a-b});
						
						var valuesLeftSibling=[];
						for(var i=0;i<tree.order;i++){
							valuesLeftSibling.push(values[i]);
						}
						actNode.keys=valuesLeftSibling;
						
						var valuesRightSibling=[];
						for(var i=tree.order;i<=tree.order*2;i++){
							//for internal split do not use the middle value for right sibling
							if(oldLeft!=undefined){
								if(i>tree.order)
									valuesRightSibling.push(values[i]);
							}
							else
								valuesRightSibling.push(values[i]);
						}
						
						rightSibling.keys=valuesRightSibling;
		
						
						//adapt pointers
						if(oldLeft!=undefined){
							rightSibling.is_leaf=false;
							//update pointers to old & old 
							//split pointers in half and add pointer to new sibling to the needed side 
							var pointers=actNode.pointers;
							var pointersLeftParent=[];
							var pointersRightParent=[];
							
							//if middle leaf is split
							if(pointers[tree.order]==oldLeft){
								for(var i=0;i<=tree.order;i++){
									pointersLeftParent.push(pointers[i]);
								}
								pointersRightParent.push(oldRight);
								oldRight.parent=rightSibling;
								for(var i=tree.order+1;i<pointers.length;i++){
									pointersRightParent.push(pointers[i]);
									pointers[i].parent=rightSibling;
								}
							}
		
							else{
								var left=false;
								
								for(var i=0; i<tree.order;i++){
									if(pointers[i]==oldLeft)left=true;
								}
								
								if(left){
									for(var i=0;i<tree.order;i++){
										pointersLeftParent.push(pointers[i]);
									}
									var index=0;
									for(var i=0;i<pointersLeftParent.length;i++){
										if(pointersLeftParent[i]==oldLeft){index=i;break;}
									}
									pointersLeftParent.splice(index+1,0,oldRight);
									pointersLeftParent.join();
									oldRight.parent=actNode;
									
									for(var i=tree.order;i<pointers.length;i++){
										pointersRightParent.push(pointers[i]);
										pointers[i].parent=rightSibling;
									}
								}
								else{
									for(var i=0;i<=tree.order;i++){
										pointersLeftParent.push(pointers[i]);
									}
									for(var i=tree.order+1;i<pointers.length;i++){
										pointersRightParent.push(pointers[i]);
										pointers[i].parent=rightSibling;
									}
									
									var index=0;
									for(var i=0;i<pointersRightParent.length;i++){
										if(pointersRightParent[i]==oldLeft){
											index=i;break;
										}
									}
									pointersRightParent.splice(index+1,0,oldRight);
									pointersRightParent.join();
									oldRight.parent=rightSibling;
								}
							}
							
							actNode.pointers=pointersLeftParent;
							rightSibling.pointers=pointersRightParent;
		
						}
						
						//if parent=root. cant enter here in 1st iteration!
						if(actNode==tree.root){
							actNode.pointers=pointersLeftParent;
							rightSibling.pointers=pointersRightParent;
								
							//make new root
							var newRoot=new Node();		
							newRoot.is_leaf=false;
								
							//set pointers from new root to act and its sibling
							newRoot.keys.push(values[tree.order]);
							newRoot.pointers.push(actNode);
							newRoot.pointers.push(rightSibling);
								
							actNode.parent=newRoot;
							rightSibling.parent=newRoot;
								
							tree.root=newRoot;
							tree.draw();

					     	tree.history+="a"+origVal;
							tree.saveInDB();
							finished=true;
						}
						//or if parent has free space for new index. cant enter here in 1st interation!
						else if(actNode.parent!=undefined && actNode.parent.keys.length<tree.order*2){
						//insert into parent the middle + pointer
							actNode.parent.keys.push(values[tree.order]);
							actNode.parent.keys.sort(function(a, b){return a-b});
								
							var index=0;
							for(var i=0;i<actNode.parent.pointers.length;i++){
								if(actNode.parent.pointers[i]==actNode){
									index=i+1;break;
								}
								else if(i==actNode.parent.pointers.length-1){
									index=i+1;break;
								}
							}
							actNode.parent.pointers.splice(index,0,rightSibling);
							rightSibling.parent=actNode.parent;
							tree.draw();

					     	tree.history+="a"+origVal;
							tree.saveInDB();
							finished=true;
						}
						
						else{				
							//if parent!=root and has no free space
							oldLeft=actNode;
							oldRight=rightSibling;
		
							val=values[tree.order];
							actNode=actNode.parent;
						}
					}
				}
				tree.draw();

			},steps*1000+1000)
		}
		
		forLoop(this,actNode);
		
	}

}

BPlusTree.prototype.removeFixed=function(val){

	//empty tree:
	if(this.root==undefined){
		return
	}
	//if root exists
	else{
		this.history+="r"+val;
		//find target leaf node first:
		var actNode=this.root;
		while(!actNode.is_leaf){
			//!!!!!!!!!!!PUT A TIMEOUT HERE FOR DRAWING!!!!!!!!!!!!
			//find index of pointer leading to target:
			//assume its on first place
			var index=0;
			//if not, iterate
			if(val>=actNode.keys[0]){
				for(var i=0;i<actNode.keys.length;i++){
					if(val>=actNode.keys[i] && (actNode.keys[i+1]==undefined || val<actNode.keys[i+1])){
						index=i+1; // because pointer.length+1 == keys.length 
						break;
					}
				}
			}
			actNode=actNode.pointers[index];
			//draw, end timeout
			//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		}
		
		//if element not there
		var found=false;
		for(var i=0;i<actNode.keys.length;i++){if(actNode.keys[i]==val)found=true;}
		if(!found)return;
		
		//if no underflow will occur
		if(actNode==this.root){
			for(var i=0;i<actNode.keys.length;i++){
				if(actNode.keys[i]==val){
					actNode.keys.splice(i,1);break;
				}
			}
		}

		else if(actNode.keys.length>this.order){
			var indexVal=0;
			for(var i=0;i<actNode.keys.length;i++){
				if(actNode.keys[i]==val){
					indexVal=i;break;
				}
			}
			
			//if the same key is referenced by parent(=its first in the node) replace by next in the parent
			if(actNode.keys[0]==val && actNode!=actNode.parent.pointers[0]){
				var index=1;
				for(var i=1;i<actNode.parent.pointers.length;i++){
					if(actNode.parent.pointers[i]==actNode){
						index=i;break;
					}
				}
				actNode.parent.keys[index-1]=actNode.keys[1];
			}
			
			var index=0;
			for(var i=0;i<actNode.keys.length;i++){
				if(actNode.keys[i]==val){
					index=i;break;
				}
			}
			actNode.keys.splice(index,1);
			
			//if its most left value: replace till root
			if(actNode==actNode.parent.pointers[0] && indexVal==0){

				var gp=actNode.parent;
				while(gp!=undefined){

					for(var i=0;i<gp.keys.length;i++){
						if(gp.keys[i]==val){
							gp.keys[i]=actNode.keys[0];
						}
					}
					gp=gp.parent;
				}
			}
		}
		
		//underflow
		else{
			//borrowing
			var index=0;
			for(var i=0;i<actNode.parent.pointers.length;i++){
				if(actNode.parent.pointers[i]==actNode){
					index=i;break;
				}
			}
			//try borrowing from left:
			if(index!=0 && actNode.parent.pointers[index-1].keys.length>this.order){
				//delete:
				var indexVal=0;
				for(var i=0;i<actNode.keys.length;i++){
					if(actNode.keys[i]==val){
						indexVal=i;break;
					}
				}
				actNode.keys.splice(indexVal,1);
				
				//borrow the rightmost
				actNode.keys.splice(0,0,actNode.parent.pointers[index-1].keys[actNode.parent.pointers[index-1].keys.length-1]);
				actNode.keys.join();
				
				actNode.parent.pointers[index-1].keys.splice(actNode.parent.pointers[index-1].keys.length-1,1);	
				actNode.parent.keys[index-1]=actNode.keys[0];
			}
			//try borrowing from right:
			else if(index!=actNode.parent.pointers.length-1 && actNode.parent.pointers[index+1].keys.length>this.order){
				//delete:
				var indexVal=0;
				for(var i=0;i<actNode.keys.length;i++){
					if(actNode.keys[i]==val){
						indexVal=i;break;
					}
				}
				actNode.keys.splice(indexVal,1);
				
				//borrow the leftmost
				actNode.keys.push(actNode.parent.pointers[index+1].keys[0]);
				actNode.parent.pointers[index+1].keys.splice(0,1);
			
				actNode.parent.keys[index]=actNode.parent.pointers[index+1].keys[0];
				actNode.parent.keys[index-1]=actNode.keys[0];
				
				//if its most left value: replace till root
				if(actNode==actNode.parent.pointers[0] && indexVal==0){

					var gp=actNode.parent;
					while(gp!=undefined){

						for(var i=0;i<gp.keys.length;i++){
							if(gp.keys[i]==val){
								gp.keys[i]=actNode.keys[0];
							}
						}
						gp=gp.parent;
					}
				}
			}
			//merging
			else{
				//delete:
				var indexVal=0;
				for(var i=0;i<actNode.keys.length;i++){
					if(actNode.keys[i]==val){
						indexVal=i;break;
					}
				}
				actNode.keys.splice(indexVal,1);
				
				//if act is most left
				if(actNode==actNode.parent.pointers[0]){
					
					for(var i=0;i<actNode.parent.pointers[1].keys.length;i++){
						actNode.keys.push(actNode.parent.pointers[1].keys[i]);
						//no pointers to push into leaf
					}
					actNode.parent.keys.splice(0,1);
					actNode.parent.pointers.splice(1,1);
					
					//if its most left value: replace till root
					if(indexVal==0){
						var gp=actNode.parent;
						while(gp!=undefined){
							for(var i=0;i<gp.keys.length;i++){
								if(gp.keys[i]==val){
									gp.keys[i]=actNode.keys[0];
								}
							}
							gp=gp.parent;
						}
					}
				}
				else{
					var index=0;
					for(var i=0;i<actNode.parent.pointers.length;i++){
						if(actNode.parent.pointers[i]==actNode){
							index=i;break;
						}
					}
					
					for(var i=0;i<actNode.keys.length;i++){
						actNode.parent.pointers[index-1].keys.push(actNode.keys[i]);
					}
					actNode.parent.keys.splice(index-1,1);
					actNode.parent.pointers.splice(index,1);
					actNode=actNode.parent.pointers[index-1];
				}
				
				if(actNode.parent==this.root && actNode.parent.keys.length==0){
					this.root=actNode;actNode.parent=undefined;return;
				}
				if((actNode.parent!=this.root && actNode.parent.keys.length>=this.order)||actNode.parent==this.root){
					return;
				}
				
				actNode=actNode.parent;
				
				while(actNode.keys.length<this.order && actNode!=this.root){
					//borrowing from left
					var index=0;
					for(var i=0;actNode.parent.pointers.length;i++){
						if(actNode.parent.pointers[i]==actNode){index=i;break;}
					}
					
					if(index!=0 && actNode.parent.pointers[index-1].keys.length>this.order){
						actNode.keys.splice(0,0,actNode.parent.keys[index-1]);
						actNode.pointers.splice(0,0,actNode.parent.pointers[index-1].pointers[actNode.parent.pointers[index-1].pointers.length-1]);
						
						actNode.parent.keys[index-1]=actNode.parent.pointers[index-1].keys[actNode.parent.pointers[index-1].keys.length-1];
						
						actNode.parent.pointers[index-1].keys.splice(actNode.parent.pointers[index-1].keys.length-1,1);
						actNode.parent.pointers[index-1].pointers[actNode.parent.pointers[index-1].pointers.length-1].parent=actNode;
						actNode.parent.pointers[index-1].pointers.splice(actNode.parent.pointers[index-1].pointers.length-1,1);
					}
					//borrowing from right
					else if(index!=actNode.parent.pointers.length-1 && actNode.parent.pointers[index+1].keys.length>this.order){
						
						actNode.keys.push(actNode.parent.keys[index]);
						actNode.pointers.push(actNode.parent.pointers[index+1].pointers[0]);
						actNode.parent.pointers[index+1].pointers[0].parent=actNode;
						
						actNode.parent.keys[index]=actNode.parent.pointers[index+1].keys[0];
						
						actNode.parent.pointers[index+1].keys.splice(0,1);
						actNode.parent.pointers[index+1].pointers.splice(0,1);
					}
					//merge to left
					else{
						if(index==0){
							// First the appropriate key from the parent is moved down to the left node
							actNode.keys.push(actNode.parent.keys[0]);
							actNode.parent.keys.splice(0,1);
							
							//then all keys and pointers are moved from the right node
							for(var i=0;i<actNode.parent.pointers[1].pointers.length;i++){
								actNode.parent.pointers[1].pointers[i].parent=actNode;
							}
							actNode.keys=actNode.keys.concat(actNode.parent.pointers[1].keys);
							actNode.pointers=actNode.pointers.concat(actNode.parent.pointers[1].pointers);
							
							//Finally the pointer to the right node is removed
							actNode.parent.pointers.splice(1,1);
						}
						else{
							// First the appropriate key from the parent is moved down to the left node
							actNode.parent.pointers[index-1].keys.push(actNode.parent.keys[index-1]);
							actNode.parent.keys.splice(index-1,1);
							
							//then all keys and pointers are moved from the right node
							for(var i=0;i<actNode.pointers.length;i++){
								actNode.pointers[i].parent=actNode.parent.pointers[index-1];
							}
							actNode.parent.pointers[index-1].keys=actNode.parent.pointers[index-1].keys.concat(actNode.keys);
							actNode.parent.pointers[index-1].pointers=actNode.parent.pointers[index-1].pointers.concat(actNode.pointers);
							
							//Finally the pointer to the right node is removed
							actNode.parent.pointers.splice(index,1);
						}
					}
					actNode=actNode.parent;
					if(actNode==this.root&&actNode.keys.length==0){
						this.root=actNode.pointers[0];actNode=this.root;actNode.parent=undefined;
					}
				}
			}
		}
	}
	
}


BPlusTree.prototype.addFixed=function(val) {
	//empty tree:
	this.history+="a"+val;
	if(this.root==undefined){
		var root=new Node();
		root.keys[0]=val;
		this.root=root;
	}
	//if root exists
	else{
		//find target leaf node first:
		var actNode=this.root;
		while(!actNode.is_leaf){
			//find index of pointer leading to target:
			//assume its on first place
			var index=0;
			//if not, iterate
			if(val>=actNode.keys[0]){
				for(var i=0;i<actNode.keys.length;i++){
					if(val>=actNode.keys[i] && (actNode.keys[i+1]==undefined || val<actNode.keys[i+1])){
						index=i+1; // because pointer.length+1 == keys.length 
						break;
					}
				}
			}
			actNode=actNode.pointers[index];
		}
		
		for(var i=0;i<actNode.keys.length;i++){if(actNode.keys[i]==val)return;}
		
		//the target node has available space for one more key.
		if(actNode.keys.length<this.order*2){
			actNode.keys.push(val);
			actNode.keys.sort(function(a, b){return a-b});
		}
		//the target node is full and its root
		else if(actNode.keys.length==this.order*2 && actNode==this.root){
			//sibling leaf
			var rightSibling=new Node();
			
			//get all values to sort and split siblings
			var values=actNode.keys;
			values.push(val);
			values.sort(function(a, b){return a-b});
			
			var valuesLeftSibling=[];
			for(var i=0;i<this.order;i++){
				valuesLeftSibling.push(values[i]);
			}
			actNode.keys=valuesLeftSibling;
			
			var valuesRightSibling=[];
			for(var i=this.order;i<=this.order*2;i++){
				valuesRightSibling.push(values[i]);
			}
			rightSibling.keys=valuesRightSibling;
			
			var newRoot=new Node();
			newRoot.is_leaf=false;
			newRoot.keys.push(values[this.order]);
			newRoot.pointers[0]=actNode;
			actNode.parent=newRoot;
			newRoot.pointers[1]=rightSibling;
			rightSibling.parent=newRoot;
			
			this.root=newRoot;
		}
		//the target node is full, but its parent has space for one more key.
		else if(actNode.keys.length==this.order*2 && actNode.parent!=undefined && actNode.parent.keys.length<this.order*2){
			//window.alert("in3");
			//sibling leaf
			var rightSibling=new Node();
			
			//get all values to sort and split siblings
			var values=actNode.keys;
			values.push(val);
			values.sort(function(a, b){return a-b});
			
			var valuesLeftSibling=[];
			for(var i=0;i<this.order;i++){
				valuesLeftSibling.push(values[i]);
			}
			actNode.keys=valuesLeftSibling;
			
			var valuesRightSibling=[];
			for(var i=this.order;i<=this.order*2;i++){
				valuesRightSibling.push(values[i]);
			}
			rightSibling.keys=valuesRightSibling;
			
			//add middle key to parent: find index, then splice
			var index=0;
			for(var i=0;i<actNode.parent.keys.length;i++){
				if(values[this.order]<actNode.parent.keys[i]){
					index=i;
					break;
				}
				else if(i+1==actNode.parent.keys.length){
					index=i+1;
				}
			}
			
			actNode.parent.keys.push(values[this.order]);
			actNode.parent.keys.sort(function(a, b){return a-b});
			
			//update the right
			actNode.parent.pointers.splice([index+1],0,rightSibling);
			
			//set parent for new sibling
			rightSibling.parent=actNode.parent;
		}
		//the target node and its parent are both full
		else if(actNode.keys.length==this.order*2 && actNode.parent!=undefined && actNode.parent.keys.length==this.order*2){
			var finished=false
			
			var oldLeft=undefined;
			var oldRight=undefined;
			var left=false
			
			while(!finished){
				//sibling leaf
				var rightSibling=new Node();
				//window.alert(actNode.keys);
				//get all values to sort and split siblings
				var values=actNode.keys;
				values.push(val);
				values.sort(function(a, b){return a-b});
				
				var valuesLeftSibling=[];
				for(var i=0;i<this.order;i++){
					valuesLeftSibling.push(values[i]);
				}
				actNode.keys=valuesLeftSibling;
				
				var valuesRightSibling=[];
				for(var i=this.order;i<=this.order*2;i++){
					//for internal split do not use the middle value for right sibling
					if(oldLeft!=undefined){
						if(i>this.order)
							valuesRightSibling.push(values[i]);
					}
					else
						valuesRightSibling.push(values[i]);
				}
				
				rightSibling.keys=valuesRightSibling;

				
				//adapt pointers
				if(oldLeft!=undefined){
					rightSibling.is_leaf=false;
					//update pointers to old & old 
					//split pointers in half and add pointer to new sibling to the needed side 
					var pointers=actNode.pointers;
					var pointersLeftParent=[];
					var pointersRightParent=[];
					
					//if middle leaf is split
					if(pointers[this.order]==oldLeft){
						for(var i=0;i<=this.order;i++){
							pointersLeftParent.push(pointers[i]);
						}
						pointersRightParent.push(oldRight);
						oldRight.parent=rightSibling;
						for(var i=this.order+1;i<pointers.length;i++){
							pointersRightParent.push(pointers[i]);
							pointers[i].parent=rightSibling;
						}
					}

					else{
						var left=false;
						
						for(var i=0; i<this.order;i++){
							if(pointers[i]==oldLeft)left=true;
						}
						
						if(left){
							for(var i=0;i<this.order;i++){
								pointersLeftParent.push(pointers[i]);
							}
							var index=0;
							for(var i=0;i<pointersLeftParent.length;i++){
								if(pointersLeftParent[i]==oldLeft){index=i;break;}
							}
							pointersLeftParent.splice(index+1,0,oldRight);
							pointersLeftParent.join();
							oldRight.parent=actNode;
							
							for(var i=this.order;i<pointers.length;i++){
								pointersRightParent.push(pointers[i]);
								pointers[i].parent=rightSibling;
							}
						}
						else{
							for(var i=0;i<=this.order;i++){
								pointersLeftParent.push(pointers[i]);
							}
							for(var i=this.order+1;i<pointers.length;i++){
								pointersRightParent.push(pointers[i]);
								pointers[i].parent=rightSibling;
							}
							
							var index=0;
							for(var i=0;i<pointersRightParent.length;i++){
								if(pointersRightParent[i]==oldLeft){
									index=i;break;
								}
							}
							pointersRightParent.splice(index+1,0,oldRight);
							pointersRightParent.join();
							oldRight.parent=rightSibling;
						}
					}
					
					actNode.pointers=pointersLeftParent;
					rightSibling.pointers=pointersRightParent;

				}
				
				//if parent=root. cant enter here in 1st iteration!
				if(actNode==this.root){
					actNode.pointers=pointersLeftParent;
					rightSibling.pointers=pointersRightParent;
						
					//make new root
					var newRoot=new Node();		
					newRoot.is_leaf=false;
						
					//set pointers from new root to act and its sibling
					newRoot.keys.push(values[this.order]);
					newRoot.pointers.push(actNode);
					newRoot.pointers.push(rightSibling);
						
					actNode.parent=newRoot;
					rightSibling.parent=newRoot;
						
					this.root=newRoot;
						
					return;
				}
				//or if parent has free space for new index. cant enter here in 1st interation!
				else if(actNode.parent!=undefined && actNode.parent.keys.length<this.order*2){
				//insert into parent the middle + pointer
					actNode.parent.keys.push(values[this.order]);
					actNode.parent.keys.sort(function(a, b){return a-b});
						
					var index=0;
					for(var i=0;i<actNode.parent.pointers.length;i++){
						if(actNode.parent.pointers[i]==actNode){
							index=i+1;break;
						}
						else if(i==actNode.parent.pointers.length-1){
							index=i+1;break;
						}
					}
					actNode.parent.pointers.splice(index,0,rightSibling);
					rightSibling.parent=actNode.parent;
						
					return;
				}
				
				else{				
					//if parent!=root and has no free space
					oldLeft=actNode;
					oldRight=rightSibling;

					val=values[this.order];
					actNode=actNode.parent;
				}
			}
		}
	}
}

function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
}

BPlusTree.prototype.random=function(){
	this.root=undefined;
	this.history="";
	var number=parseInt(Math.random()*25,10);
	var _order=parseInt(getRandomInt(1,3)); 
	this.order=_order;
	
	for(var i=0;i<number;i++){
		this.addFixed(parseInt(getRandomInt(0,100),10));
	}
	
	this.draw();
	this.saveInDB();
}


BPlusTree.prototype.remove=function(){
	
	if(this.order<0){
		window.alert("Create the tree first!");return;
	}
	//empty tree:
	if(this.root==undefined){
		return;
	}
	//if root exists
	else{
		var val=parseInt(prompt("Remove:"));
		if(isNaN(val))return;
		//find target leaf node first:
		var actNode=this.root;
		actNode.color="#FF8000";
		this.draw();

			function whileLoop(tree,actNode){
				setTimeout(function (){
					//find index of pointer leading to target:
					//assume its on first place
					var index=0;
					//if not, iterate
					if(val>=actNode.keys[0]){
						for(var i=0;i<actNode.keys.length;i++){
							if(val>=actNode.keys[i] && (actNode.keys[i+1]==undefined || val<actNode.keys[i+1])){
								index=i+1; // because pointer.length+1 == keys.length 
								break;
							}
						}
					}
					actNode.neededKid=index;
					actNode=actNode.pointers[index];
					actNode.color="#FF8000";
					
					actNode.parent.color="#ADFF2F";
					tree.draw();
					actNode.parent.neededKid=undefined;
					if(!actNode.is_leaf)whileLoop(tree,actNode);
					
				},1000)
			}
			if(!actNode.is_leaf)whileLoop(tree,actNode);
			//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			
		actNode=this.root;
		var steps=0;
		while(!actNode.is_leaf){
			var index=0;
			//if not, iterate
			if(val>=actNode.keys[0]){
				for(var i=0;i<actNode.keys.length;i++){
					if(val>=actNode.keys[i] && (actNode.keys[i+1]==undefined || val<actNode.keys[i+1])){
						index=i+1; // because pointer.length+1 == keys.length 
						break;
					}
				}
			}
			actNode=actNode.pointers[index];
			steps++;
		}
		
		//window.alert(steps);
		function forLoop(tree,actNode){
			setTimeout(function(){
				actNode.color="#ADFF2F";
				//if element not there
				//window.alert("in");
				var found=false;
				for(var i=0;i<actNode.keys.length;i++){if(actNode.keys[i]==val)found=true;}
				if(!found){actNode.parent.neededKid=undefined;tree.draw();return;}
				
				//if no underflow will occur
				if(actNode==tree.root){
					for(var i=0;i<actNode.keys.length;i++){
						if(actNode.keys[i]==val){
							actNode.keys.splice(i,1);break;
						}
					}
					if(actNode.keys.length==0)
						tree.root=undefined;
				}
		
				else if(actNode.keys.length>tree.order){
					var indexVal=0;
					for(var i=0;i<actNode.keys.length;i++){
						if(actNode.keys[i]==val){
							indexVal=i;break;
						}
					}
					
					//if the same key is referenced by parent(=its first in the node) replace by next in the parent
					if(actNode.keys[0]==val && actNode!=actNode.parent.pointers[0]){
						var index=1;
						for(var i=1;i<actNode.parent.pointers.length;i++){
							if(actNode.parent.pointers[i]==actNode){
								index=i;break;
							}
						}
						actNode.parent.keys[index-1]=actNode.keys[1];
					}
					
					var index=0;
					for(var i=0;i<actNode.keys.length;i++){
						if(actNode.keys[i]==val){
							index=i;break;
						}
					}
					actNode.keys.splice(index,1);
					
					//if its most left value: replace till root
					if(actNode==actNode.parent.pointers[0] && indexVal==0){
		
						var gp=actNode.parent;
						while(gp!=undefined){
		
							for(var i=0;i<gp.keys.length;i++){
								if(gp.keys[i]==val){
									gp.keys[i]=actNode.keys[0];
								}
							}
							gp=gp.parent;
						}
					}
				}
				
				//underflow
				else{
					//borrowing
					var index=0;
					for(var i=0;i<actNode.parent.pointers.length;i++){
						if(actNode.parent.pointers[i]==actNode){
							index=i;break;
						}
					}
					//try borrowing from left:
					if(index!=0 && actNode.parent.pointers[index-1].keys.length>tree.order){
						//delete:
						var indexVal=0;
						for(var i=0;i<actNode.keys.length;i++){
							if(actNode.keys[i]==val){
								indexVal=i;break;
							}
						}
						actNode.keys.splice(indexVal,1);
						
						//borrow the rightmost
						actNode.keys.splice(0,0,actNode.parent.pointers[index-1].keys[actNode.parent.pointers[index-1].keys.length-1]);
						actNode.keys.join();
						
						actNode.parent.pointers[index-1].keys.splice(actNode.parent.pointers[index-1].keys.length-1,1);	
						actNode.parent.keys[index-1]=actNode.keys[0];
					}
					//try borrowing from right:
					else if(index!=actNode.parent.pointers.length-1 && actNode.parent.pointers[index+1].keys.length>tree.order){
						//delete:
						var indexVal=0;
						for(var i=0;i<actNode.keys.length;i++){
							if(actNode.keys[i]==val){
								indexVal=i;break;
							}
						}
						actNode.keys.splice(indexVal,1);
						
						//borrow the leftmost
						actNode.keys.push(actNode.parent.pointers[index+1].keys[0]);
						actNode.parent.pointers[index+1].keys.splice(0,1);
					
						actNode.parent.keys[index]=actNode.parent.pointers[index+1].keys[0];
						actNode.parent.keys[index-1]=actNode.keys[0];
						
						//if its most left value: replace till root
						if(actNode==actNode.parent.pointers[0] && indexVal==0){
		
							var gp=actNode.parent;
							while(gp!=undefined){
		
								for(var i=0;i<gp.keys.length;i++){
									if(gp.keys[i]==val){
										gp.keys[i]=actNode.keys[0];
									}
								}
								gp=gp.parent;
							}
						}
					}
					//merging
					else{
						//delete:
						var indexVal=0;
						for(var i=0;i<actNode.keys.length;i++){
							if(actNode.keys[i]==val){
								indexVal=i;break;
							}
						}
						actNode.keys.splice(indexVal,1);
						
						//if act is most left
						if(actNode==actNode.parent.pointers[0]){
							
							for(var i=0;i<actNode.parent.pointers[1].keys.length;i++){
								actNode.keys.push(actNode.parent.pointers[1].keys[i]);
								//no pointers to push into leaf
							}
							actNode.parent.keys.splice(0,1);
							actNode.parent.pointers.splice(1,1);
							
							//if its most left value: replace till root
							if(indexVal==0){
								var gp=actNode.parent;
								while(gp!=undefined){
									for(var i=0;i<gp.keys.length;i++){
										if(gp.keys[i]==val){
											gp.keys[i]=actNode.keys[0];
										}
									}
									gp=gp.parent;
								}
							}
						}
						else{
							var index=0;
							for(var i=0;i<actNode.parent.pointers.length;i++){
								if(actNode.parent.pointers[i]==actNode){
									index=i;break;
								}
							}
							
							for(var i=0;i<actNode.keys.length;i++){
								actNode.parent.pointers[index-1].keys.push(actNode.keys[i]);
							}
							actNode.parent.keys.splice(index-1,1);
							actNode.parent.pointers.splice(index,1);
							actNode=actNode.parent.pointers[index-1];
						}
						
						if(actNode.parent==tree.root && actNode.parent.keys.length==0){
							tree.root=actNode;actNode.parent=undefined;
						
						 	tree.history+="r"+val;
							tree.saveInDB();
							tree.draw();return;
						}
						if((actNode.parent!=tree.root && actNode.parent.keys.length>=tree.order)||actNode.parent==tree.root){
						 	tree.history+="r"+val;
							tree.saveInDB();
							tree.draw();return;
						}
						
						actNode=actNode.parent;
						
						while(actNode.keys.length<tree.order && actNode!=tree.root){
							//borrowing from left
							var index=0;
							for(var i=0;actNode.parent.pointers.length;i++){
								if(actNode.parent.pointers[i]==actNode){index=i;break;}
							}
							
							if(index!=0 && actNode.parent.pointers[index-1].keys.length>tree.order){
								actNode.keys.splice(0,0,actNode.parent.keys[index-1]);
								actNode.pointers.splice(0,0,actNode.parent.pointers[index-1].pointers[actNode.parent.pointers[index-1].pointers.length-1]);
								
								actNode.parent.keys[index-1]=actNode.parent.pointers[index-1].keys[actNode.parent.pointers[index-1].keys.length-1];
								
								actNode.parent.pointers[index-1].keys.splice(actNode.parent.pointers[index-1].keys.length-1,1);
								actNode.parent.pointers[index-1].pointers[actNode.parent.pointers[index-1].pointers.length-1].parent=actNode;
								actNode.parent.pointers[index-1].pointers.splice(actNode.parent.pointers[index-1].pointers.length-1,1);
							}
							//borrowing from right
							else if(index!=actNode.parent.pointers.length-1 && actNode.parent.pointers[index+1].keys.length>tree.order){
								
								actNode.keys.push(actNode.parent.keys[index]);
								actNode.pointers.push(actNode.parent.pointers[index+1].pointers[0]);
								actNode.parent.pointers[index+1].pointers[0].parent=actNode;
								
								actNode.parent.keys[index]=actNode.parent.pointers[index+1].keys[0];
								
								actNode.parent.pointers[index+1].keys.splice(0,1);
								actNode.parent.pointers[index+1].pointers.splice(0,1);
							}
							//merge to left
							else{
								if(index==0){
									// First the appropriate key from the parent is moved down to the left node
									actNode.keys.push(actNode.parent.keys[0]);
									actNode.parent.keys.splice(0,1);
									
									//then all keys and pointers are moved from the right node
									for(var i=0;i<actNode.parent.pointers[1].pointers.length;i++){
										actNode.parent.pointers[1].pointers[i].parent=actNode;
									}
									actNode.keys=actNode.keys.concat(actNode.parent.pointers[1].keys);
									actNode.pointers=actNode.pointers.concat(actNode.parent.pointers[1].pointers);
									
									//Finally the pointer to the right node is removed
									actNode.parent.pointers.splice(1,1);
								}
								else{
									// First the appropriate key from the parent is moved down to the left node
									actNode.parent.pointers[index-1].keys.push(actNode.parent.keys[index-1]);
									actNode.parent.keys.splice(index-1,1);
									
									//then all keys and pointers are moved from the right node
									for(var i=0;i<actNode.pointers.length;i++){
										actNode.pointers[i].parent=actNode.parent.pointers[index-1];
									}
									actNode.parent.pointers[index-1].keys=actNode.parent.pointers[index-1].keys.concat(actNode.keys);
									actNode.parent.pointers[index-1].pointers=actNode.parent.pointers[index-1].pointers.concat(actNode.pointers);
									
									//Finally the pointer to the right node is removed
									actNode.parent.pointers.splice(index,1);
								}
							}
							actNode=actNode.parent;
							if(actNode==tree.root&&actNode.keys.length==0){
								tree.root=actNode.pointers[0];actNode=tree.root;actNode.parent=undefined;
							}
						}
					}
				}
				tree.draw();
				
			 	tree.history+="r"+val;
				tree.saveInDB();
			},steps*1000+1000)
		}
		forLoop(this,actNode);
		
	}
	
}

BPlusTree.prototype.search=function(){
	if(this.order<0){
		window.alert("Create the tree first!");return;
	}
	//empty tree:
	if(this.root==undefined){
		return;
	}
	//if root exists
	else{
		var val=parseInt(prompt("Search for:"));
		if(isNaN(val))return;
		//find target leaf node first:
		var actNode=this.root;
		actNode.color="#FF8000";
		this.draw();

			function whileLoop(tree,actNode){
				setTimeout(function (){
					//find index of pointer leading to target:
					//assume its on first place
					var index=0;
					//if not, iterate
					if(val>=actNode.keys[0]){
						for(var i=0;i<actNode.keys.length;i++){
							if(val>=actNode.keys[i] && (actNode.keys[i+1]==undefined || val<actNode.keys[i+1])){
								index=i+1; // because pointer.length+1 == keys.length 
								break;
							}
						}
					}
					actNode.neededKid=index;
					actNode=actNode.pointers[index];
					actNode.color="#FF8000";
					
					actNode.parent.color="#ADFF2F";
					tree.draw();
					actNode.parent.neededKid=undefined;
					if(!actNode.is_leaf)whileLoop(tree,actNode);
					else{
						function notFound(tree){
							setTimeout(function(){
									actNode.color="#ADFF2F";
									actNode.parent.neededKid=undefined;
									tree.draw();
									return;
							},1000)
						}
						notFound(tree);
					}
					
				},1000)
			}
			
			//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			function notFound(tree){
				setTimeout(function(){
						actNode.color="#ADFF2F";
						tree.draw();
						return;
				},1000)
			}

			if(!actNode.is_leaf)whileLoop(tree,actNode);
			else notFound(this);
			
	}
}

BPlusTree.prototype.draw=function(){
	this.view.draw();
}
