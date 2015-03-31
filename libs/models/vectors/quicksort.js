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

function Element(value){
	this.color=undefined;
	this.value=value;
}

function Vector(){
	this.view=new VectorView(this);
	this.elements=[];

	this.pivot=undefined;
	this.range=undefined;
	this.sortedElements=[];
	
	this.paused=false;
	this.db=TAFFY();
	this.actStateID=0;
	this.finished=false;
}

Vector.prototype.init=function(){
	this.elements=[];

	this.pivot=undefined;
	this.range=undefined;
	this.sortedElements=[];
	
	this.paused=false;
	this.finished=false;
	this.saveInDB();
}


Vector.prototype.saveInDB=function(){
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
	//code snippet for ignoring duplicates
	var last_id=tmp_db().count();
	var rs=tmp_db({id:last_id}).select("state");
	var last_state=rs[0];
	
	var same=true;
	
	if(last_state==undefined || last_state.elements.length!=new_state.elements.length || new_state.r!=last_state.r
			||new_state.pivot!=last_state.pivot||new_state.l!=last_state.l){
		same=false;
	}
	else{
		for(var i=0;i<new_state.elements.length;i++){
			if(new_state.elements[i].color!=last_state.elements[i].color ||
					new_state.elements[i].value!=last_state.elements[i].value)
				same=false;
		}
	}
	//end code snippet for ignoring duplicates
	if(!same){
		tmp_db.insert({id: nextID,state:new_state});
		
		this.db=tmp_db;
		this.actStateID=nextID;
	}
}

Vector.prototype.copy=function(toCopy){
	var newVector=new Vector();
	newVector.paused=true;

	newVector.pivot=toCopy.pivot;
	newVector.range=toCopy.range;
	newVector.sortedElements=toCopy.sortedElements;
	newVector.r=toCopy.r;
	newVector.l=toCopy.l;
	newVector.sortedElements=[];
	for(var i=0;i<toCopy.sortedElements.length;i++){
		newVector.sortedElements.push(toCopy.sortedElements[i]);
	}
	newVector.elements=[];
	for(var i=0;i<toCopy.elements.length;i++){
		newVector.elements.push(new Element(toCopy.elements[i].value));
		newVector.elements[i].color=toCopy.elements[i].color;
	}
	return newVector;
}

Vector.prototype.replaceThis=function(toCopy){
	this.paused=true;
	
	this.pivot=toCopy.pivot;
	this.range=toCopy.range;
	this.sortedElements=[];
	for(var i=0;i<toCopy.sortedElements.length;i++){
		this.sortedElements.push(toCopy.sortedElements[i]);
	}
	this.r=toCopy.r;
	this.l=toCopy.l;
	this.crossed=toCopy.crossed;
	this.elements=[];
	for(var i=0;i<toCopy.elements.length;i++){
		this.elements.push(new Element(toCopy.elements[i].value));
		this.elements[i].color=toCopy.elements[i].color;
	}
}

Vector.prototype.prev=function(){
	if(this.paused){
		if(this.actStateID>1){
			var tmp_db=this.db;
			var prev_id=this.actStateID-1;
			this.actStateID=prev_id;
			var rs=tmp_db({id:prev_id}).select("state");
			//make actual node to THIS:
	      	this.replaceThis(rs[0]);
	      	this.draw();
		}
	}
	else
		window.alert("Pause the sorting first!");
}

Vector.prototype.next=function(){
	if(this.paused){
		if(this.actStateID<this.db().count()){
			var tmp_db=this.db;
			var next_id=this.actStateID+1;
			this.actStateID=next_id;
			var rs=tmp_db({id:next_id}).select("state");
			//make actual node to THIS:
	      	this.replaceThis(rs[0]);
	      	this.draw();
		}
	}
	else
		window.alert("Pause the sorting first!");
}

Vector.prototype.firstState=function(){
	if(this.paused){
		var tmp_db=this.db;
		this.actStateID=1;
		var rs=tmp_db({id:1}).select("state");
		//make actual node to THIS:
	     this.replaceThis(rs[0]);
	     this.draw();
	}
	else
		window.alert("Pause the sorting first!");
}

Vector.prototype.lastState=function(){
	if(this.paused){
		var tmp_db=this.db;
		var last_id=tmp_db().count();
		this.actStateID=last_id;
		var rs=tmp_db({id:last_id}).select("state");
		//make actual node to THIS:
	     this.replaceThis(rs[0]);
	     this.draw();
	}
	else
		window.alert("Pause the sorting first!");
}

Vector.prototype.getElementValue=function(index){
	 return this.elements[index].value;
}
 
Vector.prototype.setRandomElements=function(){
	 var tempElements=[];
	 var tempVal;
	 var number=Math.floor(Math.random() * (20 - 1 + 1)) + 1;

	 for(var i=0;i<number;i++){
		 tempVal=parseInt(Math.random()*40,10);
		 tempElements.push(new Element(tempVal));
	 }

	 this.elements=tempElements;
}

Vector.prototype.setColorsQuicksort=function(){
	var range=this.range.split("-"); //e.g. 10-15
	range[0]=parseInt(range[0]);range[1]=parseInt(range[1]);
	for(var i=0;i<this.size();i++){

		//pivot
		if(i==this.pivot){
			this.elements[i].color="purple";
		}
		//smaller than pivot in range
		else if(i>=(range[0]+1) && i<=range[1] && this.elements[i].value<this.elements[this.pivot].value){
			this.elements[i].color="blue";
		}
		//bigger than pivot in range
		else if(i>=(range[0]+1)&&i<=range[1]&&this.elements[i].value>this.elements[this.pivot].value){
			this.elements[i].color="red";
		}
		//==pivot in range
		else if(i>=(range[0]+1)&&i<=range[1]&&this.elements[i].value==this.elements[this.pivot].value){
			this.elements[i].color="purple";
		}
		
		if(this.sortedElements!=undefined){
			//sorted elements:yellow
			var inSorted=false;
			for(var j=0;j<this.sortedElements.length;j++){
				if(this.sortedElements[j]==i){
					inSorted=true;break;
				}
			}
		}
		//not in range: grey:
		if(i<range[0]||i>range[1]){
			this.elements[i].color="grey";
		}
		
		if(inSorted){
			this.elements[i].color="yellow";
		}
		
	}
}

Vector.prototype.quicksort=function(){
	
	function partition(vector){
		var range=vector.range.split("-");
		range[0]=parseInt(range[0]);range[1]=parseInt(range[1]);
		
		if(range[0]==range[1]){
			if(vector.r<range[0]||vector.r>range[1]||vector.l==undefined){
				vector.l=vector.pivot;
				vector.r=vector.pivot;
			}
			
			vector.setColorsQuicksort();
			vector.draw();
			vector.saveInDB();
			function delayedDrawing(vector){
				setTimeout(function(){
					vector.sortedElements.push(0);
					vector.setColorsQuicksort();
					//sorted INDEX!!!
					//vector.saveInDB();
					//vector.draw();
					
					//can go left if r!=0 and left part has non yellow elements
					
				},1000)
			}
			
			delayedDrawing(vector);
		}
		
		else{
			if(vector.r<range[0]||vector.r>range[1]||vector.l==undefined){
			vector.l=vector.pivot+1;
			vector.r=range[1];
			}
			vector.setColorsQuicksort();
			vector.draw();
			vector.saveInDB();
			function step(vector){	
				var rToLeftDelay=1000;
				//let l go to right until a red/purple/end of range
				function lToRight(vector){
					
					setTimeout(function(){
						
						if(vector.r==vector.l){
							vector.crossed=true;
						}
						if(vector.elements[vector.l].value<vector.elements[vector.pivot].value && vector.l<vector.r){
							vector.l=vector.l+1;
							vector.setColorsQuicksort();
							vector.draw();
							vector.saveInDB();
							lToRight(vector);
						}
						else{
							rToLeftDelay=0;
							rToLeft(vector);
						}
					},1000)
				}
				if(vector.l<vector.r)
					lToRight(vector);
				else
					rToLeft(vector);
				
				//let r go to left until a blue/purple/end of range
				function rToLeft(vector){
					
					setTimeout(function(){
						rToLeftDelay=1000;
						
						if(vector.r<=vector.l){
							vector.crossed=true;
						}
						if(vector.elements[vector.r].value>=vector.elements[vector.pivot].value && vector.r>range[0]){
							vector.r=vector.r-1;
							vector.setColorsQuicksort();
							vector.draw();
							vector.saveInDB();
							rToLeft(vector);
						}
						
						else if(!vector.crossed){
							var tmp=vector.elements[vector.l].value;
							vector.elements[vector.l].value=vector.elements[vector.r].value;
							vector.elements[vector.r].value=tmp;
							vector.setColorsQuicksort();
							vector.draw();
							vector.saveInDB();
							step(vector);
						}
						else{
							var tmp=vector.elements[vector.r].value;
							vector.elements[vector.r].value=vector.elements[vector.pivot].value;
							vector.elements[vector.pivot].value=tmp;
							
							//if you want more detailed animation of partition, drwa this and delay next step:
							//vector.setColorsQuicksort();
							//vector.draw();
							//vector.saveInDB();
							
							//sorted INDEX!!!
							vector.sortedElements.push(vector.r);
							vector.setColorsQuicksort();
							//can go left if r!=0 and left part has non yellow elements
							var canGoLeft=false;
							var pS=0;
							if(vector.r!=0){
								for(var i=0;i<vector.r;i++){
									if(vector.elements[i].color!="yellow"){
										canGoLeft=true;pS=i;break;
									}
								}
							}
							if(canGoLeft){
								vector.pivot=pS;
								vector.range=""+pS+"-"+(vector.r-1);
								partition(vector);return;
							}
							else{
								//can go left if r!=vector.size-1 and right part has non yellow elements
								var canGoRight=false;
								var rangeStart=0;
								if(vector.r!=vector.size()-1){
									for(var i=vector.r+1;i<vector.size();i++){
										if(vector.elements[i].color!="yellow"){
											canGoRight=true;rangeStart=i;break;
										}
									}
								}
								
								if(canGoRight){
									var rangeEnd=111;
									for(var i=rangeStart;i<vector.size();i++){
										if(vector.elements[i].color=="yellow"){
											rangeEnd=i-1;break;
										}
										else if(i==vector.size()-1){
											rangeEnd=i;break;
										}
									}
									vector.pivot=rangeStart;
									vector.range=""+vector.pivot+"-"+rangeEnd;
									partition(vector);return;
								}
								else{
									vector.pivot=undefined;vector.r=undefined;
									vector.l=undefined;vector.draw();vector.saveInDB();return;
								}
							}
						}
					},rToLeftDelay)
				}
				
			}
		}
		vector.crossed=false;
		step(vector);
	}
	
	if(this.range==undefined){
		this.range="0-"+(this.size()-1);
		this.pivot=0;
	}
	partition(this);
}
 
Vector.prototype.getElementsByPrompt=function(){
	 var tempElements=[];

	 var valuesInString=prompt("Please enter the elements (separated by space):\nValues > 999 are ignored");

	 var tempValsStr = valuesInString.split(" "); 

	 for(var i=0;i<tempValsStr.length;i++){
		 if(!isNaN(parseInt(tempValsStr[i])) && parseInt(tempValsStr[i])<1000)
			 tempElements.push(new Element(parseInt(tempValsStr[i])));
	 }

	 this.elements=tempElements;
 }

Vector.prototype.size=function(){
	 return this.elements.length;
 }

Vector.prototype.draw=function(){
	 this.view.draw();
 }