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
	this.sorted=false;
	this.i=0;
	this.j=0;

	this.sstmpmin=0;
	
	this.paused=false;
	this.db=TAFFY();
	this.actStateID=0;
	this.finished=false;
}

Vector.prototype.init=function(){
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
	
	if(last_state==undefined || last_state.elements.length!=new_state.elements.length){
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
	newVector.sorted=toCopy.sorted;
	newVector.i=toCopy.i;
	newVector.j=toCopy.j;
	newVector.sstmpmin=toCopy.sstmpmin;
	newVector.paused=true;

	newVector.elements=[];
	for(var i=0;i<toCopy.elements.length;i++){
		newVector.elements.push(new Element(toCopy.elements[i].value));
		newVector.elements[i].color=toCopy.elements[i].color;
	}
	return newVector;
}

Vector.prototype.replaceThis=function(toCopy){
	this.sorted=toCopy.sorted;
	this.i=toCopy.i;
	this.j=toCopy.j;
	this.sstmpmin=toCopy.sstmpmin;
	this.paused=true;
	
	this.elements=[];
	for(var i=0;i<toCopy.elements.length;i++){
		this.elements.push(new Element(toCopy.elements[i].value));
		this.elements[i].color=toCopy.elements[i].color;
	}
}

Vector.prototype.prev=function(con){
	if(this.paused){
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
	else
		window.alert("Pause the sorting first!");
}

Vector.prototype.next=function(con){
	if(this.paused){
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
	else
		window.alert("Pause the sorting first!");
}

Vector.prototype.firstState=function(con){
	if(this.paused){
		var tmp_db=this.db;
		this.actStateID=1;
		var rs=tmp_db({id:1}).select("state");
		//make actual node to THIS:
	     this.replaceThis(rs[0]);
	     this.draw(con);
	}
	else
		window.alert("Pause the sorting first!");
}

Vector.prototype.lastState=function(con){
	if(this.paused){
		var tmp_db=this.db;
		var last_id=tmp_db().count();
		this.actStateID=last_id;
		var rs=tmp_db({id:last_id}).select("state");
		//make actual node to THIS:
	     this.replaceThis(rs[0]);
	     this.draw(con);
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
 
Vector.prototype.setColorsSelectionSort=function(){
	if(!this.sorted){
		for(var j=0;j<this.j;j++){
			this.elements[j].color="#F7D358";
		}
		
		if(this.j==this.sstmpmin)
			this.elements[this.sstmpmin].color="#00FFFF";
		else
			this.elements[this.j].color="red";
		
		for(var j=this.j+1;j<this.size();j++){
			this.elements[j].color="#CC2EFA";

			this.elements[this.i].color="#00FF80";
			if(j==this.sstmpmin)
				this.elements[this.sstmpmin].color="#00FFFF";
		}	 
		
	}
	
	else{
		for(var i=0;i<this.size();i++){
			this.elements[i].color="#F7D358";
		}
	}
}

Vector.prototype.selectionSort=function(con){
	if(this.elements.length==0){
		this.draw(con);
		return;
	}
	else if(this.elements.length==1){
		this.elements[0].color="#F7D358";
		this.draw(con);
		return;
	}
	
	function step(vector){

		function sort(vector){
			//bad end of swap comes from here... :
			vector.setColorsSelectionSort();
			vector.draw(con);
			vector.saveInDB();
			
			setTimeout(function(){

				if(vector.elements[vector.sstmpmin].value>vector.elements[vector.i].value){
					vector.sstmpmin=vector.i;
				}
				
				//sorting, end not reached
				if(vector.i!=vector.size()-1){
					vector.i=vector.i+1;
					vector.setColorsSelectionSort();
					vector.draw(con);
					//vector.saveInDB();
					sort(vector);
				}
				
				//end reached
				else if(vector.j!=vector.size()-1){
					var delay=0;
					//if min is last
					if(vector.sstmpmin==vector.i && vector.elements[vector.i].color!="#00FFFF"){
						vector.setColorsSelectionSort();
						vector.elements[vector.i].color="#00FFFF";
						vector.draw(con);
						vector.saveInDB();
						delay=1000;
					}
					
					
					setTimeout(function(){
						//swap
						var delay2=1000;
						if(vector.sstmpmin==vector.j)delay2=0;
						var tmp=vector.elements[vector.j].value;
						vector.elements[vector.j].value=vector.elements[vector.sstmpmin].value;
						vector.elements[vector.sstmpmin].value=tmp;
						if(delay!=1000)
							vector.setColorsSelectionSort();
						//inverse just for drawing
						var tmp_color=vector.elements[vector.j].color;
						vector.elements[vector.j].color=vector.elements[vector.sstmpmin].color;
						vector.elements[vector.sstmpmin].color=tmp_color;
						vector.draw(con);
						
						//reset indexes
						vector.j=vector.j+1;
						vector.sstmpmin=vector.j;
						vector.i=vector.j;
						vector.saveInDB();
						//window.alert(delay);
						setTimeout(function(){step(vector);},delay2)
						
					},delay)
					
				}
				//end reached and sorted
				else{
					vector.sorted=true;
					vector.setColorsSelectionSort();
					vector.saveInDB();
					vector.draw(con);
					return;
				}
			},1000)
		}
		
		sort(vector);
	}

	step(this);
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

Vector.prototype.draw=function(con){
	 this.view.draw(con);
 }