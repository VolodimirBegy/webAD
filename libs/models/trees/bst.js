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
	this.value=0;
	this.rightChild=undefined;
	this.leftChild=undefined;
	this.parent=undefined;
	this.xPosition=0;
	this.yPosition=0;
	
}

function BinSearchTree(){
	this.view=new BinTreeView(this);
	this.db=[];
	this.root=undefined;
	this.actStateID=-1;
}

BinSearchTree.prototype.copy=function(){
	var newTree=new BinSearchTree();
			
	function recursivePreorderTraversal(newTree,node){
		if(node==undefined)
			return;
		
		newTree.addFixed(node.value);
		recursivePreorderTraversal(newTree,node.leftChild);
		recursivePreorderTraversal(newTree,node.rightChild);
	}

	recursivePreorderTraversal(newTree,this.root);

	return newTree;
}

BinSearchTree.prototype.replaceThis=function(toCopy){
	
	this.root=undefined;
	function recursivePreorderTraversal(tree,node){
		if(node==undefined)
			return;
		
		tree.addFixed(node.value);
		recursivePreorderTraversal(tree,node.leftChild);
		recursivePreorderTraversal(tree,node.rightChild);
	}

	recursivePreorderTraversal(this,toCopy.root);

}

BinSearchTree.prototype.prev=function(){
	if(this.actStateID>0){
		var prev_id=this.actStateID-1;
		this.actStateID=prev_id;
		var rs=this.db[prev_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

BinSearchTree.prototype.next=function(){
	if(this.actStateID<this.db.length-1){
		var next_id=this.actStateID+1;
		this.actStateID=next_id;
		var rs=this.db[next_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

BinSearchTree.prototype.firstState=function(){
	this.actStateID=0;
	var rs=this.db[0];
	//make actual node to THIS:
    this.replaceThis(rs);
    this.draw();
}

BinSearchTree.prototype.lastState=function(){
	var last_id=this.db.length-1;
	this.actStateID=last_id;
	var rs=this.db[last_id];
	//make actual node to THIS:
     this.replaceThis(rs);
     this.draw();
}

BinSearchTree.prototype.add=function() {
     //code snippet for disabling while actState!=last
	//var count=this.db().count();

	//if(count==this.actStateID){
		
	var val=parseInt(prompt("Add:"));
	if(isNaN(val))return;
	var node=new Node();
	node.value=val;
		
	if(this.root==undefined){
		this.root=node;
		this.draw();
		this.saveInDB();
	}

	else{
		var added=false;
		var root=this.root;
		var actNode=root;
		
		this.root.color="coral";
		if(val!=undefined)
			this.draw();
		
		var lc=0;
		function doLoop(tree){
			setTimeout(function (){
				tree.root.color="#ADFF2F";
				if(actNode.value>node.value && actNode.leftChild==undefined){
					actNode.color="#ADFF2F";
					actNode.leftChild=node;
					actNode.leftChild.parent=actNode;
					added=true;
					tree.draw();
				}

				else if(actNode.value<=node.value && actNode.rightChild==undefined){
					actNode.color="#ADFF2F";				
					actNode.rightChild=node;
					actNode.rightChild.parent=actNode;
					added=true;
					tree.draw();
				}

				else if(actNode.value>node.value && actNode.leftChild!=undefined){
					var tmpParent=actNode;
					actNode=actNode.leftChild;
					actNode.parent=tmpParent;
					actNode.color="coral";
					actNode.parent.color="#ADFF2F";
					tree.draw();
				}

				else if(actNode.value<=node.value && actNode.rightChild!=undefined){
					var tmpParent=actNode;
					actNode=actNode.rightChild;
					actNode.parent=tmpParent;
					actNode.color="coral";
					actNode.parent.color="#ADFF2F";
					tree.draw();
				}
				
				if(!added){
					doLoop(tree);
				}
				else{
					tree.saveInDB();
				}
				lc++;
			},1000)
		}
	
		if(!added)doLoop(this);
		

	}
	
	//}


}

BinSearchTree.prototype.addFixed=function(_val) {
	var node=new Node();
	
	node.value=_val;
		
	if(this.root==undefined){
		this.root=node;
	}

	else{
		var added=false;
		var root=this.root;
		var actNode=root;

		if(_val!=undefined)

		var lc=0;
		function doLoop(){

				if(actNode.value>node.value && actNode.leftChild==undefined){
					actNode.leftChild=node;
					actNode.leftChild.parent=actNode;
					added=true;

				}

				else if(actNode.value<=node.value && actNode.rightChild==undefined){					
					actNode.rightChild=node;
					actNode.rightChild.parent=actNode;
					added=true;

				}

				else if(actNode.value>node.value && actNode.leftChild!=undefined){
					var tmpParent=actNode;
					actNode=actNode.leftChild;
					actNode.parent=tmpParent;

				}

				else if(actNode.value<=node.value && actNode.rightChild!=undefined){
					var tmpParent=actNode;
					actNode=actNode.rightChild;
					actNode.parent=tmpParent;
				}
				
				if(!added){
					doLoop();
				}
				lc++;
		}
	
		if(!added)doLoop();
	
	}

}

BinSearchTree.prototype.saveInDB=function(){
	var count=this.db.length-1;
 	if(count!=this.actStateID){
 		this.db.splice(this.actStateID+1,count-this.actStateID);
 	}

	var nextID=this.db.length;
	
	var new_state = this.copy();
	this.db.push(new_state);
	
	this.actStateID=nextID;
}

BinSearchTree.prototype.search=function() {

	var value=parseInt(prompt("Search for:"));
	if(isNaN(value))return;
	
	var tree=this;
	
	if(tree.root==undefined){
		return;
	}

	else{
		var found=new Boolean();
		found=false;
		var root=tree.root;
		var actNode=root;
		
		tree.root.color="coral";
		tree.draw();
		
		var lc=0;
		function doLoop(tree){
			setTimeout(function (){
				tree.root.color="#ADFF2F";
				if(actNode.value>value && actNode.leftChild==undefined){
					actNode.color="#ADFF2F";
					tree.draw();
					return;
				}

				else if(actNode.value<value && actNode.rightChild==undefined){
					actNode.color="#ADFF2F";
					tree.draw();
					return;
				}

				else if(actNode.value>value && actNode.leftChild!=undefined){
					var tmpParent=actNode;
					actNode=actNode.leftChild;
					actNode.parent=tmpParent;
					actNode.color="coral";
					actNode.parent.color="#ADFF2F";
					tree.draw();
				}

				else if(actNode.value<value && actNode.rightChild!=undefined){
					var tmpParent=actNode;
					actNode=actNode.rightChild;
					actNode.parent=tmpParent;
					actNode.color="coral";
					actNode.parent.color="#ADFF2F";
					tree.draw();
				}
				
				else if(actNode.value==value){
					var tmpParent=actNode;
					//actNode=actNode.get("leftChild");
					//actNode.set({parent: tmpParent});
					actNode.color="gold";
					//actNode.get("parent").set({color:"#ADFF2F"});
					tree.draw();
					
					setTimeout(function(){
						actNode.color="#ADFF2F";
						tree.draw();
					},1000)
					return;
				}
				
				if(!found){
					doLoop(tree);
				}
				lc++;
			},1000)
		}
	
		if(!found)doLoop(tree);
		
	}

}


BinSearchTree.prototype.remove=function() { 
	//var count=this.db().count();

	//if(count==this.actStateID){
		
	var value=parseInt(prompt("delete:"));
	if(isNaN(value))return;
	if(this.root==undefined){
		return;
	}

	else{
		var found=new Boolean();
		found=false;
		var root=this.root;
		var actNode=root;
		
		this.root.color="coral";
		this.draw();
		
		var lc=0;
		function doLoop(tree){
			setTimeout(function (){
				tree.root.color="#ADFF2F";
				if(actNode.value>value && actNode.leftChild==undefined){
					actNode.color="#ADFF2F";
					tree.draw();
					return;
				}

				else if(actNode.value<value && actNode.rightChild==undefined){
					actNode.color="#ADFF2F";
					tree.draw();
					return;
				}

				else if(actNode.value>value && actNode.leftChild!=undefined){
					var tmpParent=actNode;
					actNode=actNode.leftChild;
					actNode.parent=tmpParent;
					actNode.color="coral";
					actNode.parent.color="#ADFF2F";
					tree.draw();
				}

				else if(actNode.value<value && actNode.rightChild!=undefined){
					var tmpParent=actNode;
					actNode=actNode.rightChild;
					actNode.parent=tmpParent;
					actNode.color="coral";
					actNode.parent.color="#ADFF2F";
					tree.draw();
				}
				
				else if(actNode.value==value){
					if(actNode!=tree.root){
						var parr=actNode.parent;
						var isLeft=new Boolean();
						isLeft=true;
						if(parr.rightChild==actNode){
							isLeft=false;
						}
					}
					
					//actNode=actNode.get("leftChild");
					//actNode.set({parent: tmpParent});
					actNode.color="gold";
					//actNode.get("parent").set({color:"#ADFF2F"});
					tree.draw();
				
					setTimeout(function(){
					var noKids=new Boolean();
					noKids=true;
					if(actNode.rightChild!=undefined || actNode.leftChild!=undefined)
						noKids=false;
						
					var onlyRightChild=false;
					if(actNode.rightChild!=undefined && actNode.leftChild==undefined){
						onlyRightChild=true;
					}
					var onlyLeftChild=false;
					if(actNode.leftChild!=undefined && actNode.rightChild==undefined){
						onlyLeftChild=true;
					}
					
					var twoKids=false;
					if(actNode.leftChild!=undefined && actNode.rightChild!=undefined){
						twoKids=true;
					}

						if(noKids){
							if(tree.root!=actNode){
								if(isLeft){
									parr.leftChild=undefined;
								}
								else
									parr.rightChild=undefined;
							}
							else
								tree.root=undefined;
						}
							
						else if(onlyLeftChild && tree.root==actNode){
							tree.root=actNode.leftChild;
						}
						
						else if(onlyRightChild && tree.root==actNode){
							tree.root=actNode.rightChild;
						
						}
						
						else if(onlyLeftChild && isLeft){
							//par.set({leftChild:undefined});
							parr.leftChild=actNode.leftChild;
							actNode.leftChild.parent=parr;
						}

						else if(onlyLeftChild && !isLeft){
							//par.set({rightChild:undefined});
							parr.rightChild=actNode.leftChild;
							actNode.leftChild.parent=parr;
						}
						
						else if(onlyRightChild && isLeft){
							//par.set({leftChild:undefined});
							parr.leftChild=actNode.rightChild;
							actNode.rightChild.parent=parr;
						}
						
						else if(onlyRightChild && !isLeft){
							//par.set({rightChild:undefined});
							parr.rightChild=actNode.rightChild;
							actNode.rightChild.parent=parr;
						}
						
						else if(onlyRightChild && tree.root==actNode)
							tree.root=actNode.rightChild;
							
						else if(onlyLeftChild && tree.root==actNode)
							tree.root=actNode.leftChild;
							
						else if(twoKids && actNode!=tree.root){
							//get most right of left subtree to be the root
							var oldLeft=actNode.leftChild;
							var oldRight=actNode.rightChild;
							var oldPar=actNode.parent;
							var oldLeftSec=oldLeft.leftChild;
							var newNode=oldLeft;
							
							if(newNode.rightChild==undefined){
								if(isLeft){
									parr.leftChild=newNode;
									newNode.parent=parr;
									newNode.rightChild=oldRight;
									oldRight.parent=newNode;
								}
								else{
									parr.rightChild=newNode;
									newNode.parent=parr;
									newNode.rightChild=oldRight;
									oldRight.parent=newNode; 
								}
							}
							
							else{
								var lastPar=undefined;
								var kidOfMoved=undefined;
								while(newNode.rightChild!=undefined){
									newNode=newNode.rightChild;
									lastPar=newNode.parent;
								}
								if(newNode.leftChild!=undefined){
									kidOfMoved=newNode.leftChild;
								}
								if(isLeft){
									lastPar.rightChild=undefined;
									if(kidOfMoved!=undefined){
										kidOfMoved.parent=undefined;
										lastPar.rightChild=kidOfMoved;
										kidOfMoved.parent=lastPar;
									}
									newNode.rightChild=undefined;
									newNode.leftChild=undefined;
									
									parr.leftChild=newNode;
									newNode.parent=parr;
									
									oldRight.parent=undefined;
									newNode.rightChild=oldRight;
									oldRight.parent=newNode;
									
									oldLeft.parent=undefined;
									newNode.leftChild=oldLeft;
									oldLeft.parent=newNode;	
								}
								else{
								
									lastPar.rightChild=undefined;
									if(kidOfMoved!=undefined){
										kidOfMoved.parent=undefined;
										lastPar.rightChild=kidOfMoved;
										kidOfMoved.parent=lastPar;
									}
									newNode.rightChild=undefined;
									newNode.leftChild=undefined;
									
									parr.rightChild=newNode;
									newNode.parent=parr;
									
									oldRight.parent=undefined;
									newNode.rightChild=oldRight;
									oldRight.parent=newNode;
									
									oldLeft.parent=undefined;
									newNode.leftChild=oldLeft;
									oldLeft.parent=newNode;
									
									}
							}
						}
						
						else if(twoKids && actNode==tree.root){
							//get most right of left subtree to be the root
							var oldLeft=actNode.leftChild;
							var oldRight=actNode.rightChild;
							//var oldPar=actNode.get("parent");
							var newNode=oldLeft;
							
							if(newNode.rightChild==undefined){
									newNode.parent=undefined;
									tree.root=newNode;
									newNode.rightChild=oldRight;
									oldRight.parent=newNode;
							}
							
							else{
								var lastPar=undefined;
								var kidOfMoved=undefined;
								while(newNode.rightChild!=undefined){
									newNode=newNode.rightChild;
									lastPar=newNode.parent;
								}
								if(newNode.leftChild!=undefined){
										kidOfMoved=newNode.leftChild;
								}
								lastPar.rightChild=undefined;
								if(kidOfMoved!=undefined){
									kidOfMoved.parent=undefined;
									lastPar.rightChild=kidOfMoved;
									kidOfMoved.parent=lastPar;
								}
								newNode.parent=undefined;
								tree.root=newNode;
								
								newNode.rightChild=undefined;
								newNode.leftChild=undefined;
																		
								oldRight.parent=undefined;
								newNode.rightChild=oldRight;
								oldRight.parent=newNode;
									
								oldLeft.parent=undefined;
								newNode.leftChild=oldLeft;
								oldLeft.parent=newNode;
							}
						}
						tree.draw();
						tree.saveInDB();
					},1000)

					return;
				}
				
				if(!found){
					doLoop(tree);
				}
				lc++;
			},1000)
		}
	
		if(!found)doLoop(this);
		
	}
	
	//}

}

BinSearchTree.prototype.random=function(){
	//var count=this.db().count();

	//if(count==this.actStateID){
		
		this.root=undefined;
		var number=parseInt(Math.random()*10,10); 
	
		for(var i=0;i<number;i++){
			this.addFixed(parseInt(Math.random()*1000,10));
		}
		
		this.saveInDB();
		this.draw();
	
	//}
}

BinSearchTree.prototype.example=function(){
	this.root=undefined;
	var numbers=[5,3,10,12,1,6];

	for(var i=0;i<numbers.length;i++){
		this.addFixed(numbers[i]);
	}
		
	this.saveInDB();
	this.draw();
}

BinSearchTree.prototype.draw=function(){
	this.view.draw();
}

