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

	this.db=[];
	this.actStateID=0;
	this.elements=[];
}

Vector.prototype.init=function(){
	this.elements=[];

	this.pivot=undefined;
	this.range=undefined;
	this.sortedElements=[];
	this.r=undefined;
	this.l=undefined;
	
	this.speed=10;
	this.col1="#3366FF";
	this.col2="#FF0000";
	this.col3="#FF66FF";
	this.col4="#FFFF66";
	this.col5="#DDDDE0";
	
	this.paused=false;
	this.finished=false;
	this.saveInDB();
}


Vector.prototype.saveInDB=function(){
	var count=this.db.length-1;
 	if(count!=this.actStateID){
       	for(var i=this.actStateID+1;i<=count;++i){
           	this.db.splice(this.db.length-1,1);
       	}
 	}

	var nextID=this.db.length;
	
	var new_state = this.copy(this);
	var last_state=this.db[this.db.length-1];
	
	var same=true;
	
	if(last_state==undefined || last_state.elements.length!=new_state.elements.length || new_state.r!=last_state.r
			||new_state.pivot!=last_state.pivot||new_state.l!=last_state.l ||
			last_state.speed!=new_state.speed){
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
		this.db.push(new_state);
		
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
	
	newVector.col1=toCopy.col1;
	newVector.col2=toCopy.col2;
	newVector.col3=toCopy.col3;
	newVector.col4=toCopy.col4;
	newVector.col5=toCopy.col5;
	
	newVector.speed=toCopy.speed;
	
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
	
	this.col1=toCopy.col1;
	this.col2=toCopy.col2;
	this.col3=toCopy.col3;
	this.col4=toCopy.col4;
	this.col5=toCopy.col5;
	
	this.speed=toCopy.speed;
	
	this.crossed=toCopy.crossed;
	this.elements=[];
	for(var i=0;i<toCopy.elements.length;i++){
		this.elements.push(new Element(toCopy.elements[i].value));
		this.elements[i].color=toCopy.elements[i].color;
	}
}

Vector.prototype.prev=function(){
	if(this.paused){
		if(this.actStateID>0){
			var prev_id=this.actStateID-1;
			this.actStateID=prev_id;
			var rs=this.db[prev_id];
			//make actual node to THIS:
	      	this.replaceThis(rs);
	      	this.draw();
		}
	}
	else
		window.alert("Pause the sorting first!");
}

Vector.prototype.next=function(){
	if(this.paused){
		if(this.actStateID<this.db.length-1){
			var next_id=this.actStateID+1;
			this.actStateID=next_id;
			var rs=this.db[next_id];
			//make actual node to THIS:
	      	this.replaceThis(rs);
	      	this.draw();
		}
	}
	else
		window.alert("Pause the sorting first!");
}

Vector.prototype.firstState=function(){
	if(this.paused){
		this.actStateID=0;
		var rs=this.db[0];
		//make actual node to THIS:
	    this.replaceThis(rs);
	    this.draw();
	}
	else
		window.alert("Pause the sorting first!");
}

Vector.prototype.lastState=function(){
	if(this.paused){
		var last_id=this.db.length-1;
		this.actStateID=last_id;
		var rs=this.db[last_id];
		//make actual node to THIS:
	     this.replaceThis(rs);
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
	 
	 this.init();
	 this.elements=tempElements;
	 this.quicksort();
}

Vector.prototype.setColorsQuicksort=function(){
	var range=this.range.split("-"); //e.g. 10-15
	range[0]=parseInt(range[0]);range[1]=parseInt(range[1]);
	for(var i=0;i<this.size();i++){

		//pivot
		if(i==this.pivot){
			this.elements[i].color=this.col3;
		}
		//smaller than pivot in range
		else if(i>=(range[0]+1) && i<=range[1] && this.elements[i].value<this.elements[this.pivot].value){
			this.elements[i].color=this.col1;
		}
		//bigger than pivot in range
		else if(i>=(range[0]+1)&&i<=range[1]&&this.elements[i].value>this.elements[this.pivot].value){
			this.elements[i].color=this.col2;
		}
		//==pivot in range
		else if(i>=(range[0]+1)&&i<=range[1]&&this.elements[i].value==this.elements[this.pivot].value){
			this.elements[i].color=this.col3;
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
			this.elements[i].color=this.col5;
		}
		
		if(inSorted){
			this.elements[i].color=this.col4;
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
					
				},100*vector.speed)
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
	
		}
		vector.crossed=false;
		function step(vector){	
			var rToLeftDelay=100*vector.speed;
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
				},100*vector.speed)
			}
			if(vector.l<vector.r)
				lToRight(vector);
			else
				rToLeft(vector);
			
			//let r go to left until a blue/purple/end of range
			function rToLeft(vector){
				
				setTimeout(function(){
					rToLeftDelay=100*vector.speed;
					
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
								if($.inArray(i,vector.sortedElements)==-1){
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
									if($.inArray(i,vector.sortedElements)==-1){
										canGoRight=true;rangeStart=i;break;
									}
								}
							}
							
							if(canGoRight){
								var rangeEnd=111;
								for(var i=rangeStart;i<vector.size();i++){
									if($.inArray(i,vector.sortedElements)>-1){
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

	 var _in=false;
	 for(var i=0;i<tempValsStr.length;i++){
		 if(!isNaN(parseInt(tempValsStr[i])) && parseInt(tempValsStr[i])<1000){
			 tempElements.push(new Element(parseInt(tempValsStr[i])));
			 _in=true;
		 }
	 }

	 if(_in){
		 this.init();
		 this.elements=tempElements;
		 this.quicksort();
		 return true;
	 }
	 else
		 return false;
}

Vector.prototype.example=function(){
	this.init();
	var vals=[7,2,3,6,1,0,21,4,18,8];
	 for(var i=0;i<vals.length;i++){
		this.elements.push(new Element(vals[i]));
	 }
	 
	 this.range="0-"+(this.size()-1);
	 this.pivot=0;
	 var _range=this.range.split("-");
	 this.l=this.pivot+1;
	 this.r=_range[1];
	 
	 this.setColorsQuicksort();
	 this.draw();
}

Vector.prototype.size=function(){
	 return this.elements.length;
 }

Vector.prototype.draw=function(){
	 this.view.draw();
 }