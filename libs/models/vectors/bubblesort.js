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
	this.actStateID=-1;
	this.elements=[];
}

Vector.prototype.init=function(){
	this.elements=[];
	this.finished=false;
	this.i=0;
	this.j=0;
	this.speed=5;
	this.paused=false;
	this.finished=false;
	
	this.col1="#00FF80";
	this.col2="#FF0000";
	this.col3="#F7D358";
	this.col4="#CC2EFA";
	
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
	
	if(last_state==undefined || last_state.elements.length!=new_state.elements.length ||
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
	newVector.finished=toCopy.finished;
	newVector.i=toCopy.i;
	newVector.j=toCopy.j;
	
	newVector.col1=toCopy.col1;
	newVector.col2=toCopy.col2;
	newVector.col3=toCopy.col3;
	newVector.col4=toCopy.col4;
	
	newVector.paused=true;
	newVector.swapflag=toCopy.swapflag;
	newVector.speed=toCopy.speed;
	newVector.elements=[];
	for(var i=0;i<toCopy.elements.length;i++){
		newVector.elements.push(new Element(toCopy.elements[i].value));
		newVector.elements[i].color=toCopy.elements[i].color;
	}
	return newVector;
}

Vector.prototype.replaceThis=function(toCopy){
	this.finished=toCopy.finished;
	this.i=toCopy.i;
	this.j=toCopy.j;
	
	this.col1=toCopy.col1;
	this.col2=toCopy.col2;
	this.col3=toCopy.col3;
	this.col4=toCopy.col4;
	
	this.paused=true;
	this.swapflag=toCopy.swapflag;
	this.speed=toCopy.speed;
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
	 this.j=this.size()-1;
	 this.bubbleSort();
 }
 
Vector.prototype.setColorsBubbleSort=function(){
	if(!this.finished){
		for(var j=0;j<=this.j;j++){
			this.elements[j].color=this.col4;
		}
	
		for(var j=this.j;j<this.size()-1;j++){
			this.elements[j+1].color=this.col3;
		}
	 

		if(this.i<this.size()-1){
			if(this.elements[this.i].value>this.elements[this.i+1].value){
				this.elements[this.i].color=this.col2;
				this.elements[this.i+1].color=this.col2;
			}
			else{
				this.elements[this.i].color=this.col1;
				this.elements[this.i+1].color=this.col1;
			}
		}
	}
	
	else{
		for(var i=0;i<this.size();i++){
			this.elements[i].color=this.col3;
		}
	}
}

Vector.prototype.bubbleSort=function(){
	//this.finished=false;
	if(this.elements.length==1 || this.finished){
		this.elements[0].color=this.col3;
		this.draw();
		this.saveInDB();
		return;
	}
	
	function step(vector){
		vector.setColorsBubbleSort();
		vector.saveInDB();
	 	vector.draw();
	 	var firstDelay=0;
        setTimeout(function(){
					 function sort(vector){
      					 firstDelay=100*vector.speed;
						 setTimeout(function(){
							 var extraState=false;
							 if(vector.elements[vector.i].value>vector.elements[vector.i+1].value){
								 extraState=true;
								 var temp=vector.elements[vector.i].value;
								 vector.elements[vector.i].value=vector.elements[vector.i+1].value;
								 vector.elements[vector.i+1].value=temp;
								 vector.swapflag=true;
							 }
							 
							 vector.setColorsBubbleSort();
							 if(extraState)
								 vector.saveInDB();
							 vector.draw();
							 
							 function delay(vector){
      							 setTimeout(function(){
          							 vector.i=vector.i+1;
          							 if(vector.i<vector.j){
          								 vector.setColorsBubbleSort();
	          							 vector.saveInDB();
	          							 vector.draw();
	          							 sort(vector);
          							 }
          							 else if((vector.swapflag)||(!vector.swapflag && !vector.isSorted())){
          								 vector.i=0;
          								 vector.j=vector.j-1;
          								 vector.swapflag=false;
          								 step(vector);
          							 }
          							 else{
          								 vector.finished=true;
          								 vector.setColorsBubbleSort();
	          							 vector.saveInDB();
	          							 vector.draw();
          							 }
          							 
      							 	},100*vector.speed)
							 	}
						 	   delay(vector);
					 	},100*vector.speed)
				     } 
					sort(vector);
        },firstDelay)
	 
	 }
	 
	step(this);
 }

Vector.prototype.isSorted=function(){
	 var tempElements=this.elements;
	 
	 for(var i=0;i<tempElements.length-1;i++){
		 if(tempElements[i].value>tempElements[i+1].value){
			 return false;
		 }	
	 }
	 return true;
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
		 this.j=this.size()-1;
		 this.bubbleSort();
		 return true;
	 }
	 else
		 return false;
	 
}

Vector.prototype.example=function(){
	this.init();
	var vals=[10,2,11,5,8,3,13,14,15,9,4,7,6,3];
	 for(var i=0;i<vals.length;i++){
		this.elements.push(new Element(vals[i]));
	 }
	this.j=this.size()-1;
	this.setColorsBubbleSort();
	this.paused=true;
	this.saveInDB();
	this.draw();
}

Vector.prototype.size=function(){
	 return this.elements.length;
 }

Vector.prototype.draw=function(){
	 this.view.draw();
 }