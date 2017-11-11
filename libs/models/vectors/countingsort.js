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

function Element(value) {
	this.color=undefined;
  this.colorIndex=undefined;
  this.colorStroke=undefined;
	this.value=value;
}
function Vector(){
    this.view = new VectorView(this);
    this.db = [];
    this.actStateID = -1;
}
Vector.prototype.init = function(){
    this.elements = [];

    this.count=[];
    this.sorted=[];
    this.maxValue = 0;
    this.a = 0;
    this.b = 0;
    this.c = 0;
    this.substep = 0;
    this.insert = false;
    this.arrow1 = [];
    this.arrow1[0] = -1;
    this.arrow1[1] = -1;
    this.arrow2 = [];   
    this.arrow2[0] = -1;
    this.arrow2[1] = -1;
    
    this.speed = 10;
    this.paused = true;
    this.finished = false;
    
    if(this.actStateID != -1) this.saveInDB();
}
//----------
//----- DB-Functions -----
//----------
Vector.prototype.saveInDB = function(){
    var count=this.db.length-1;
 	if(count!=this.actStateID){
 		this.db.splice(this.actStateID+1,count-this.actStateID);
 	}

	var nextID=this.db.length;
	
	var new_state = this.copy();
	var last_id=this.db.length-1;
	var last_state=this.db[last_id];
	
	var same=true;
 /*if(last_state==undefined || last_state.count==undefined || last_state.sorted==undefined || last_state.elements.length!=new_state.elements.length ||
			last_state.speed!=new_state.speed || last_state.a != new_state.a || last_state.b != new_state.b || last_state.c != new_state.c || last_state.substep != new_state.substep || last_state.arrow1 != new_state.arrow1 || last_state.arrow2 != new_state.arrow2){
  	same=false;
	}*/
    if(last_state==undefined || last_state.count==undefined || last_state.sorted==undefined || 
			last_state.speed!=new_state.speed || last_state.a != new_state.a || last_state.b != new_state.b || last_state.substep != new_state.substep || last_state.arrow1 != new_state.arrow1 || last_state.arrow2 != new_state.arrow2){
  	same=false;
	}
	else{
  	for(var i=0;i<new_state.elements.length;i++){
			if(new_state.elements[i].color!=last_state.elements[i].color ||
					new_state.elements[i].value!=last_state.elements[i].value || new_state.elements[i].colorIndex!=last_state.elements[i].colorIndex)
				same=false;
		} 
    for(var j=0;j<new_state.count.length;j++){
			if(new_state.count[j].ceolor!=last_state.count[j].color ||
					new_state.count[j].value!=last_stat.count[j].value || new_state.count[j].colorIndex!=last_state.count[j].colorIndex)
				same=false;
		}
    for(var k=0;k<new_state.sorted.length;k++){
			if(new_state.sorted[k].color!=last_state.sorted[k].color ||
					new_state.sorted[k].value!=last_state.sorted[k].value || new_state.sorted[k].colorIndex!=last_state.sorted[k].colorIndex)
				same=false;
		}              
     
	}
	if(!same){   
    	this.db.push(new_state);
		
		this.actStateID=nextID;
	}
}
Vector.prototype.copy = function() {
    var newVector = new Vector();
    
    newVector.elements=[];
	  for(var i=0;i<this.elements.length;i++){
		  newVector.elements.push(new Element(this.elements[i].value));
		  newVector.elements[i].color=this.elements[i].color;
      newVector.elements[i].colorIndex=this.elements[i].colorIndex;
	  }
    newVector.count=[];
    for(var j=0;j<this.count.length;j++){
		  newVector.count.push(new Element(this.count[j].value));
		  newVector.count[j].color=this.count[j].color;
      newVector.count[j].colorIndex=this.count[j].colorIndex;
      newVector.count[j].colorStroke=this.count[j].colorStroke;
	  }                     
    newVector.sorted=[];
    for(var k=0;k<this.sorted.length;k++){
		  newVector.sorted.push(new Element(this.sorted[k].value));
		  newVector.sorted[k].color=this.sorted[k].color;
      newVector.sorted[k].colorIndex=this.sorted[k].colorIndex;
	  }
    
    newVector.a = this.a;
    newVector.b = this.b;
    newVector.c = this.c;
    newVector.substep = this.substep;
    newVector.insert = this.insert;
    newVector.arrow1 = this.arrow1.slice();
    newVector.arrow2 = this.arrow2.slice();
    
    newVector.speed = this.speed;
    newVector.paused = true;    
        newVector.finished = this.finished;
    
    return newVector;
}
Vector.prototype.replaceThis = function(toCopy){
    this.elements=[];
	  for(var i=0;i<toCopy.elements.length;i++){
		  this.elements.push(new Element(toCopy.elements[i].value));
		  this.elements[i].color=toCopy.elements[i].color;
      this.elements[i].colorIndex=toCopy.elements[i].colorIndex;
	  }
    this.count=[];
    for(var j=0;j<toCopy.count.length;j++){
		  this.count.push(new Element(toCopy.count[j].value));
		  this.count[j].color=toCopy.count[j].color;
      this.count[j].colorIndex=toCopy.count[j].colorIndex;
      this.count[j].colorStroke=toCopy.count[j].colorStroke;
	  }                     
    this.sorted=[];
    for(var k=0;k<toCopy.sorted.length;k++){
		  this.sorted.push(new Element(toCopy.sorted[k].value));
		  this.sorted[k].color=toCopy.sorted[k].color;
      this.sorted[k].colorIndex=toCopy.sorted[k].colorIndex;
	  }

    this.a = toCopy.a;
    this.b = toCopy.b;
    this.c = toCopy.c;
    this.substep = toCopy.substep;
    this.insert = toCopy.insert;
    this.arrow1 = toCopy.arrow1.slice();
    this.arrow2 = toCopy.arrow2.slice();
    
    this.speed = toCopy.speed;
    this.paused = true;    
    this.finished = toCopy.finished;
}
//----------
//----- Tape Recorder Functions -----
//----------
Vector.prototype.prev = function(){
    if(this.paused){
        if(this.actStateID > 0){
            var prev_id = this.actStateID - 1;
            
            this.actStateID = prev_id;
            this.replaceThis(this.db[prev_id]);
            this.draw();
        }
    } else window.alert("Pause the sorting first!");
}
Vector.prototype.next = function(){
    if(this.paused){
        if(this.actStateID < this.db.length - 1){
            var next_id = this.actStateID + 1;
            
            this.actStateID = next_id;
            this.replaceThis(this.db[next_id]);
            this.draw();
        }
    } else window.alert("Pause the sorting first!");
}
Vector.prototype.firstState = function(){
    if(this.paused){
        this.actStateID = 0;
        this.replaceThis(this.db[0]);
        this.draw();
    } else window.alert("Pause the sorting first!");
}
Vector.prototype.lastState = function(){
    if(this.paused){
        var last_id = this.db.length - 1;
        
        this.actStateID = last_id;
        this.replaceThis(this.db[last_id]);
        this.draw();
    } else window.alert("Pause the sorting first!");
}

Vector.prototype.setColorsCountingSort=function(){
	for(var i = 0; i < this.elements.length; i++){
    this.elements[i].color = 5;
    this.elements[i].colorIndex = 5;
    this.sorted[i].color = 5;
    this.sorted[i].colorIndex = 5;
  }
  for(var j = 0; j < this.maxValue; j++){
    this.count[j].color = 5;
    this.count[j].colorIndex = 5;
    this.count[j].colorStroke = 4;
  }
}
Vector.prototype.valueInit = function(){
    var max = 0;
    for(var i = 0; i < this.elements.length;i++){
        this.sorted.push(new Element(""));      
        this.sorted[i].color = 5;
        this.sorted[i].colorIndex = 5;
        this.elements[i].color = 5;
        this.elements[i].colorIndex = 5;
        if(this.elements[i].value > max){
          max = this.elements[i].value;
        }        
    }
    this.maxValue = max;
    for(var j = 0; j < this.maxValue; j++){
        this.count.push(new Element(0));
        this.count[j].color = 5;
        this.count[j].colorIndex = 5;
        this.count[j].colorStroke = 4;  
    } 
}
Vector.prototype.clearArrows = function(){
    this.arrow1[0] = -1;
    this.arrow1[1] = -1;
    this.arrow2[0] = -1;
    this.arrow2[1] = -1; 
}

//----- Value Functions -----

Vector.prototype.getElementsByPrompt = function(){
    var valueInString = prompt("Please enter the elements (separated by space):\nValues > 45 are ignored");
    
    if(valueInString) {
        this.init();
        
        var tempValsStr = valueInString.split(" ");

        for(var i = 0; i < tempValsStr.length; i++){
            var tempValue = parseInt(tempValsStr[i]);
            
            if(!isNaN(tempValue) && tempValue < 46){
                this.elements.push(new Element(tempValue));
            }
        }
        this.valueInit();
        this.saveInDB();
    this.draw();
        this.countingsort();
        return true;
    }
    return false;
}
Vector.prototype.setRandomElements = function(){
    var valueInString = prompt("Please enter the number of values and the highest possible value (separated by space):\nValues > 45 are ignored");
    
    if(valueInString) {
        this.init();
        
        var tempValsStr = valueInString.split(" ");

        var numberValues = parseInt(tempValsStr[0]);
        var maxValues = parseInt(tempValsStr[1]);
            
            if(!isNaN(numberValues) && numberValues < 46 && !isNaN(maxValues) && maxValues < 46){
                for(var i = 0; i < numberValues; i++) {
                    this.elements.push(new Element(Math.floor((Math.random() * maxValues) + 1)));
                }
            }
        this.valueInit();
        this.saveInDB();
    this.draw();
        this.countingsort();
    }
}
Vector.prototype.editElements = function(){
    var valueInString = "";
    
        for(var i = 0; i < this.elements.length; i++){
       valueInString += this.elements[i].value + " ";
    }
    valueInString = valueInString.substring(0, (valueInString.length - 1));
    
    var newValueInString = prompt("Add new values or delete/edit existing ones\nValues > 45 are ignored", valueInString);
    
    if(newValueInString && !(newValueInString == valueInString)) {
        this.init();
        
        var tempValsStr = newValueInString.split(" ");

        for(var i = 0; i < tempValsStr.length; i++){
            var tempValue = parseInt(tempValsStr[i]);
            
            if(!isNaN(tempValue) && tempValue < 46){
                this.elements.push(new Element(tempValue));
            }
        }
        this.valueInit();
    }
    this.saveInDB();
    this.draw();
    this.countingsort();
}
Vector.prototype.example = function(){
    this.init();
    
    var vals=[3, 10, 8, 4, 12, 1, 7, 15, 13, 5];
	 for(var i=0;i<vals.length;i++){
		this.elements.push(new Element(vals[i]));
	 }
    
    this.valueInit();
    this.saveInDB();
    this.draw();
}
//----------
//----- Algorithm -----
//----------
Vector.prototype.countingsort = function(){
    var vector = this;
    
    function step(){
        if(vector.a < vector.elements.length && !vector.insert){
            ++vector.substep; 
            if(vector.substep == 1){
              vector.setColorsCountingSort();
              vector.clearArrows();
              vector.elements[vector.a].color = 1;
            }
            if(vector.substep == 2){
              vector.arrow1[0] = vector.a+1;
              vector.arrow1[1] = vector.elements[vector.a].value;
            }
            if(vector.substep == 3){
              vector.count[vector.elements[vector.a].value-1].colorIndex = 1;
            }
            if(vector.substep == 4){
              var value = vector.elements[vector.a].value-1;
              vector.count[value].value += 1;
              vector.count[value].colorStroke = 6;
              vector.a++;
              vector.substep = 0;
            }
            vector.saveInDB();
            vector.draw();
            if(vector.speed != 0){
                setTimeout(step, 100 * vector.speed);    
            }
            
        }else if(vector.b < vector.maxValue){
                vector.insert = true;
                vector.clearArrows();
                ++vector.substep;
                if(vector.b != vector.maxValue-1){
                if(vector.substep == 1){
                  vector.setColorsCountingSort();
                }
                if(vector.substep == 2){
                 vector.count[vector.b].color = 2; 
                }
                if(vector.substep == 3){
                  vector.count[vector.b+1].color = 2;
                }
                if(vector.substep == 4){
                  vector.count[vector.b+1].value += vector.count[vector.b].value;
                  vector.b++;
                  vector.substep = 0;
                }
                }else{
                  vector.count[vector.b].color = 2; 
                 vector.b++;
                  vector.substep = 0;
                }
                vector.saveInDB();                
                vector.draw();
            if(vector.speed != 0){
                setTimeout(step, 100 * vector.speed);
            }
                
              }else if(vector.c < vector.elements.length){
                      if(vector.a == vector.elements.length){
                        vector.a -= 1;
                        vector.setColorsCountingSort();
                      }
                      var val1 = vector.elements[vector.a].value;
                      var val2 = vector.elements[vector.a].value-1;
                       if(vector.substep==1){
                        vector.setColorsCountingSort();
                        vector.clearArrows();
                        vector.elements[vector.a].color = 1;
                      }
                      if(vector.substep==2){
                        vector.arrow1[0] = vector.a+1;
                        vector.arrow1[1] = vector.elements[vector.a].value;
                      }
                      if(vector.substep==3){
                        vector.count[val2].colorIndex = 1;
                      }
                      if(vector.substep==4){
                        vector.count[val2].color = 3;
                      }
                      if(vector.substep==5){
                        vector.arrow2[0] = val2+1;
                        vector.arrow2[1] = vector.count[val2].value;
                      } 
                      if(vector.substep==6){
                        vector.sorted[vector.count[val2].value-1].colorIndex = 3;  
                      }
                      if(vector.substep==7){
                        vector.sorted[vector.count[val2].value-1].value = val1;
                      }
                      if(vector.substep==8){ 
                        vector.count[val2].colorStroke = 6;
                        vector.count[val2].value-=1;
                        vector.elements[vector.a].value = "";
                        vector.substep=0;
                        vector.c++;
                        vector.a--;  
                      }
                      
                      vector.saveInDB();
                      vector.draw();                       
                      ++vector.substep;
                  if(vector.speed != 0){
                    setTimeout(step, 100 * vector.speed);    
                  } 
                    }else{ 
                      vector.setColorsCountingSort();
                      vector.clearArrows();
                      vector.saveInDB();
                      vector.draw();
                      clearTimes();
                      vector.finished = true;
                    }
         }
    step();
}
Vector.prototype.draw = function(){
    this.view.draw();
}
Vector.prototype.size = function(){
    return this.elements.length;
}