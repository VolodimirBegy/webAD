/*
Bernhard Hirsch
 
 */

function Element(value){
	this.color=undefined;
	this.value=value;
}


function Vector(){
	this.view=new VectorView(this);
	if(this.db == null){
		this.db=[];
		this.actStateID=-1;
	}
	this.elements=[];
	
	this.seperatedElements=[];
	/*Statuswert zwischen 0 (nichts berechnet) und 3 (komplett fertig berechne)
	*/
	this.status=0;
	this.doesSort=false;
	
	this.start = 0;
	this.start2 = 0;
	this.len2 = 0;
	
	this.pointer1=0;
	this.pointer2=0;
	this.newVector=[];
	this.newPointer=0;
	
	this.lastPos = -1;
	//Helper for saving when the status = 0
	this.savedStatus = false;
        this.doneAction = false;
}

Vector.prototype.init=function(){
	this.elements=[];
	if(this.db == null){
		this.db=[];
		this.actStateID=-1;
	}
	this.col1="#00FF80";
	//this.col2="#00FFFF";
	this.col3="#FF0000";
	this.col4="#F7D358";
	this.col2="#CC2EFA";
	this.col5="#00FFFF";

	this.status=0;
	this.doesSort=false;
	this.pointer1=0;
	this.pointer2=0;
	this.newVector=[];
	this.newPointer=0;
	this.lastPos = -1;
	this.start = 0;
	this.start2 = 0;
	this.len2 = 0;
	this.seperatedElements=[];

	this.speed=10;
	
	this.stepDelay=0;
	
	this.paused=true;
	this.finished=false;
	this.savedStatus = false;
        //Indicates that a separation is done (used for going back)
        this.doneAction = false;
	if(this.actStateID!=-1){
            //Save empty array
            this.saveInDB();
            this.savedStatus = false;
        }
}

Vector.prototype.saveInDB=function(){
	if(this.status > 0 || !this.savedStatus){
		this.savedStatus = true;
		var count=this.db.length-1;
	 	if(count!=this.actStateID){
	 		this.db.splice(this.actStateID+1,count-this.actStateID);
	 	}

		var nextID=this.db.length;
	
		var new_state = this.copy();
		//code snippet for ignoring duplicates
		var last_id=this.db.length-1;
		var last_state=this.db[last_id];
	
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
			if(new_state.doesSort != last_state.doesSort){
				same = false;
			}
			else if (new_state.newVector.length != last_state.newVector.length){
				same = false;
			}
			else{
				for(var i=0;i<new_state.newVector.length;i++){
					if(new_state.newVector[i].color!=last_state.newVector[i].color ||
							new_state.newVector[i].value!=last_state.newVector[i].value)
						same=false;
				}
			}
			if(typeof new_state.seperatedElements != typeof last_state.seperatedElements){
				same = false;
			}
			else if(typeof new_state.seperatedElements != 'undefinied'){
				if(new_state.seperatedElements.length != last_state.seperatedElements.length){
					same = false;
				}
				else{
					for(var i = 0; i < new_state.seperatedElements.length; i++){
						if(new_state.seperatedElements[i].length != last_state.seperatedElements[i])
							same = false;
						//wir müsse nicht weiter prüfen, da die Reihenfolge innerhalb der Arrays gleich sein sollte
					}
				}
			}
		}
		//end code snippet for ignoring duplicates
		if(!same){
			this.db.push(new_state);
		
			this.actStateID=nextID;
		}
	}
}

Vector.prototype.copy=function(){
	var newVector=new Vector();
	newVector.finished=this.finished;
	newVector.paused=true;

	newVector.col1=this.col1;
	newVector.col2=this.col2;
	newVector.col3=this.col3;
	newVector.col4=this.col4;
	newVector.col5=this.col5;
	
	newVector.status = this.status;
	newVector.doesSort=this.doesSort;
	newVector.savedStatus = this.savedStatus;
	if(this.doesSort){
		newVector.pointer1=this.pointer1;
		newVector.pointer2=this.pointer2;
		newVector.newVector=[];
		for(var i=0;i<this.newVector.length;i++){
			newVector.newVector.push(new Element(this.newVector[i].value));
			newVector.newVector[i].color=this.newVector[i].color;
		}
		newVector.newPointer=this.newPointer;
		newVector.start = this.start;
		newVector.start2 = this.start2;
		newVector.len2 = this.len2;
	}
	else{
		newVector.pointer1 = 0;
		newVector.pointer2 = 0;
		newVector.start = 0;
		newVector.start2 = 0;
		newVector.len2 = 0;
		newVector.newVector = [];
		newVector.newPointer = 0;
	}
	newVector.lastPos = this.lastPos;
	
	newVector.seperatedElements = [];
	if(typeof this.seperatedElements != 'undefined'){
		for(var i = 0; i < this.seperatedElements.length; i++){
			newVector.seperatedElements[i] = this.seperatedElements[i];
		}
	}
	
	newVector.speed=this.speed;
	
	newVector.stepDelay=this.stepDelay;
        newVector.doneAction = this.doneAction;
	
	newVector.elements=[];
	for(var i=0;i<this.elements.length;i++){
		newVector.elements.push(new Element(this.elements[i].value));
		newVector.elements[i].color=this.elements[i].color;
	}
	return newVector;
}

Vector.prototype.replaceThis=function(toCopy){
	this.finished=toCopy.finished;
	this.paused=true;
	
	this.col1=toCopy.col1;
	this.col2=toCopy.col2;
	this.col3=toCopy.col3;
	this.col4=toCopy.col4;
	this.col5=toCopy.col5;
	
	this.status = toCopy.status;
	
	this.doesSort=toCopy.doesSort;
	this.savedStatus = toCopy.savedStatus;
	if(toCopy.doesSort){
		this.pointer1=toCopy.pointer1;
		this.pointer2=toCopy.pointer2;
		this.newVector=[];
		for(var i=0;i<toCopy.newVector.length;i++){
			this.newVector.push(new Element(toCopy.newVector[i].value));
			this.newVector[i].color=toCopy.newVector[i].color;
		}
		this.newPointer=toCopy.newPointer;
		this.start = toCopy.start;
		this.start2 = toCopy.start2;
		this.len2 = toCopy.len2;
	}
	else{
		this.pointer1 = 0;
		this.pointer2 = 0;
		this.start = 0;
		this.start2 = 0;
		this.len2 = 0;
		this.newVector = [];
		this.newPointer = 0;
	}
	this.lastPos = toCopy.lastPos;
	
	this.seperatedElements = [];
	if(typeof toCopy.seperatedElements != 'undefined'){
		for(var i = 0; i < toCopy.seperatedElements.length; i++){
			this.seperatedElements[i] = toCopy.seperatedElements[i];
		}
	}
	
	this.speed=toCopy.speed;
	
	this.stepDelay=toCopy.stepDelay;
        this.doneAction = toCopy.doneAction;
	
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
                    if(this.status == 0 && this.doneAction){
                        prev_id=this.actStateID;
                    }
                    this.actStateID=prev_id;
                    var rs=this.db[prev_id];
                    //make actual node to THIS:
                    this.replaceThis(rs);
                    this.draw();
		}
		else if(this.actStateID == 0){
                    this.firstState();
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
	this.setColorsMergeSort();
	this.saveInDB();
	this.draw();
	this.mergeSort();
}
 
Vector.prototype.setColorsMergeSort=function(){
	if(this.finished){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].color=this.col4; //finished gold
		}
	}
	else{
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].color=this.col2; //violett
		}
		if(this.doesSort){
			if(this.pointer1 < this.start2)
				this.elements[this.pointer1].color=this.col3;
			if(this.pointer2 < this.start2 + this.len2)
				this.elements[this.pointer2].color=this.col3;
			for(var i = 0;i < this.newVector.length; i++){
				this.newVector[i].color = this.col5;
			}
			for(var i = this.start; i < this.start2 + this.len2; i++){
				if((i != this.pointer1 || this.pointer1 >= this.start2) 
					&& (i != this.pointer2 || this.pointer2 >= this.start2 + this.len2)){
					this.elements[i].color = this.col1;
				}
			}
		}
	}
}

Vector.prototype.mergeSort=function(){
	if(this.elements.length==0){
		this.draw();
		return;
	}
	else if(this.elements.length==1){
		this.finished=true;
		this.setColorsMergeSort();
		this.draw();
		this.saveInDB();
		clearTimes();
		return;
	}
	var start=0;
	var end=this.elements.length-1;

	this.setColorsMergeSort();
	this.draw();
	//this.saveInDB();

	function step(vector){
		var firstDelay=0;
		
		setTimeout ( function (){
			firstDelay=100*vector.speed;

			function organisator(vector){
				setTimeout(function(){
					var status = vector.status;
				
					if(status == 0){
						//weiter aufteilen
						if(typeof vector.seperatedElements == 'undefined' || vector.seperatedElements.length == 0){
							//noch nicht definiert
							vector.seperatedElements = [];
							vector.seperatedElements[0] = vector.elements.length;
						}
						if(vector.seperatedElements.length < vector.elements.length){
							//Wir müssen weiter seperieren
							var helpSeperated = [];
							var counter = 0;
							//Count of HelpSeperated with only one vector. So if this counter == helpSeperated.lengh --> then status + 1 if 
							var oneCounter = 0;				
							for(var i=0;i<vector.seperatedElements.length;i++){
								helpSeperated[counter] = 0;
								if(vector.seperatedElements[i] >= 2){
									//Aufteilen des Vektors und 
									var middle = Math.floor(vector.seperatedElements[i] / 2);
									helpSeperated[counter] = middle;
									if(middle == 1)
										oneCounter++;
									//helpSeperated[i].push(help2Seperated);
									helpSeperated[counter + 1] = vector.seperatedElements[i] - middle;
									if(vector.seperatedElements[i] - middle == 1)
										oneCounter++;
									//helpSeperated[i].push(help2Seperated);
									counter ++;
								}
								else{
									helpSeperated[counter] = 1;
									oneCounter++;
								}
								counter ++;
							}
							vector.seperatedElements = helpSeperated;
							if(oneCounter == helpSeperated.length){
								//Wir müssen den Status erhöhen
								status ++;
								this.savedStatus = false;
								vector.lastPos = -1;
							}
							
						}
						else{
							//Wir müssen den Status erhöhen
							status ++;
							this.savedStatus = false;
							vector.lastPos = -1;
						}
						vector.doneAction = true;
						vector.status = status;
						vector.setColorsMergeSort();
						vector.draw();
						//Saving to much: Only save when status > 0
						if(status > 0){
							vector.saveInDB();
						}
						//if(status == 0){
							step(vector);
							//Only do step when there will be no other action.
						//}
					}
					else if(status == 1){
						
						if(vector.doesSort){
							sort(vector);
							return;
						}
						
						//wähle den nächsten Bereich aus
						
						if(typeof vector.seperatedElements[vector.lastPos + 2] == 'undefined'){
							if(vector.lastPos == 0 && typeof vector.seperatedElements[vector.lastPos + 1] == 'undefined'){
								//Wir haben alles durch, daher wird hier abgebrochen
								vector.finished=true;
								vector.setColorsMergeSort();
								vector.draw();
								vector.saveInDB();
								clearTimes();
								return;
							}
							vector.lastPos = 0;
							
						}
						else{
							vector.lastPos ++;
						}
						
						var start = 0;
						var start2 = 0;
						var len2 = 0;
						
						for(var i = 0; i < vector.lastPos; i++){
							//zähle alle Elemente durch und sage, wo wir anfangen müssen
							start += vector.seperatedElements[i];
						}
						
						start2 = start + vector.seperatedElements[vector.lastPos];
						len2 = vector.seperatedElements[vector.lastPos + 1];
						
						vector.start = start;
						vector.start2 = start2;
						vector.len2 = len2;
						
						vector.seperatedElements[vector.lastPos] += vector.seperatedElements[vector.lastPos + 1];
						vector.seperatedElements.splice(vector.lastPos + 1, 1);
						
						//nun ist er bereit zum sortieren. Start muss noch festgelegt werden
						//sort(vector);
						vector.doesSort=true;
						vector.pointer1=start;
						vector.pointer2=start2;
						vector.newVector=[];
						for(var i=0;i<start2 - start + len2;i++){
							var el=new Element(0);
							el.color=this.col2;
							vector.newVector[i]=el;
						}
						vector.newPointer=0;
						vector.setColorsMergeSort();
						vector.draw();
						vector.saveInDB();
						step(vector);
						return;
					}
				}, firstDelay)
			}

			function sort(vector){
				//setTimeout(function(){
					
					var start = vector.start;
					var start2 = vector.start2;
					var len2 = vector.len2;

					var done=true;
					
					if(start - start2 == 0 || len2 == 0){
						//Hier gibt es nichts zu sortieren
						vector.newVector=[];
						vector.doesSort=false;
						vector.status++;
						vector.setColorsMergeSort();
						vector.draw();
						vector.saveInDB();
						step(vector);
						return;
					}
					
					if(!vector.doesSort){

					}
					if(vector.pointer1>=start2 && vector.pointer2 < start2 + len2)
					{
						vector.newVector[vector.newPointer ]=vector.elements[vector.pointer2];
						vector.elements[vector.pointer2] = new Element(0);
						vector.pointer2++;
						done=false;
					}
					else if(vector.pointer2 == start2 + len2 && vector.pointer1 < start2)
					{
						vector.newVector[vector.newPointer]=vector.elements[vector.pointer1];
						vector.elements[vector.pointer1] = new Element(0);
						vector.pointer1++;
						done=false;
					}
					else if(vector.pointer2< start2 + len2 && vector.pointer1 < start2)
					{
						if(vector.elements[vector.pointer1].value<vector.elements[vector.pointer2].value)
						{
							vector.newVector[vector.newPointer]=vector.elements[vector.pointer1];
							//vector.elements[vector.pointer1].value = 0;
							vector.elements[vector.pointer1] = new Element(0);
							vector.pointer1++;
							done=false;
						}
						else{
							vector.newVector[vector.newPointer]=vector.elements[vector.pointer2];
							//vector.elements[vector.pointer2].value = 0;
							vector.elements[vector.pointer2] = new Element(0);
							vector.pointer2++;
							done=false;
						}
					}
					
					vector.newPointer++;
						
					if(vector.pointer1>=start2 && vector.pointer2==start2 + len2 && done)
					{
						for(var i=0;i<(start2 - start) + len2;i++){
							vector.elements[start+i]=vector.newVector[i];
						}
						//Aufräumen
						vector.newVector=[];
						vector.doesSort=false;
					}
					vector.setColorsMergeSort();
					vector.draw();
					vector.saveInDB();
					step(vector);
					
				//}, 100*vector.speed)
			}
			organisator(vector);
		},firstDelay)
	}

	this.status[0]=0;
	step(this);

	

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
		 this.setColorsMergeSort();
		 this.saveInDB();
		 this.draw();
		 this.mergeSort();
		 return true;
	 }
	 else return false;
}

Vector.prototype.example=function(){
	this.init();
	var vals=[10,2,11,5,8,3,13,14,15,9,4,7,6,3];
	 for(var i=0;i<vals.length;i++){
		this.elements.push(new Element(vals[i]));
	 }
	this.setColorsMergeSort();
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
