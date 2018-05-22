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

function Datablock(local_depth,datablock_size){
    this.elements = new Array(datablock_size);
    this.local_depth = local_depth;
    this.marked={ 					  // View-Specific rendering information			  
                    eIndex:undefined, // Index of element in Databucket
                    rIndex:undefined, // Index of the Databucket
                    overflow:false, 
                    splitt:false,
                    splittRow:false,
                    expansion:false,
                };
}



function ExtendibleHashing(){
    this.global_depth = 1;
    this.datablock_array = [];
    this.datablock_size = 1; // Number of elements within a Block
    
    this.task = {				// View-Specific and Algorithm-Specific information
        queue : [], 			// Holds multiple input values  -V & A
        status : '', 			// {Insert, Remove, Search}	    -V & A
        element : undefined, 	// Task performed 			    -V
        expanded : false, 		// Already expanded			    -V
        expansion : false 		// Yet to expand 				-V
    }
    
    this.consistentState = false; // Indicates whether this state is valid for further manipulation
                                  // Value is set by saveInDB only! See saveInDB, copy, replace functions

    this.view = new ExtendibleHashView(this);

    this.db =[]; 			// tape recorder array for storing state
    this.actStateID = -1; 	// counter of the actual state


    
    this.working = false; 		// locking mechanism for consistency
    this.speed = 3;				// controls the view specific delay
    
    this.drawToScreen = true; 	// Always set to True or False!
                                // Purpose: as the name suggests
                                // When speed = 0, it is used to remember the actStateID  
                                // of the last drawn state, see functions draw, add, remove & search
    this.actStateID_lastDrawn = undefined;

}



// Clear db history and data
ExtendibleHashing.prototype.resetThis = function(eh){
    this.datablock_array = [];
    this.db =[]; 
    this.actStateID = -1;
    this.task = {				
        queue : [], 			
        status : '', 			
        element : undefined, 	
        expanded : false, 		
        expansion : false 		
    }
    
}

ExtendibleHashing.prototype.saveInDB = function(consistentState_){ // only true = consistent
    var count = this.db.length-1;

    if(count!=this.actStateID){
         this.db.splice(this.actStateID+1,count-this.actStateID);
 
     }
    // Set consistencyState of 'this' state, which will copied in the copy function.
    if(typeof consistentState_ === 'undefined' || consistentState_ === false){
        this.consistentState = false;
    } 
    else{
        this.consistentState = true;
    }

     var nextID = this.db.length;
    var last_id = this.db.length -1;
    var last_state = this.db[last_id];
    var new_state = this.copy(this);

    this.db.push(new_state);
    this.actStateID=nextID;



}

ExtendibleHashing.prototype.copy = function(toCopy){
    
    var new_instance = new ExtendibleHashing();
    new_instance.global_depth = toCopy.global_depth;
    new_instance.datablock_size = toCopy.datablock_size;
    new_instance.datablock_array = [];

    new_instance.consistentState = toCopy.consistentState; // Set in saveInDB

    // Copy Datablock by Datablock
    for (var index = 0; index < toCopy.datablock_array.length; index++){

        // In case different indices share (with previous ones) same Datablock 
        var sharesBlock = false;
        for (var i = 0; i < index; i++) {
            if(toCopy.datablock_array[index] === toCopy.datablock_array[i]) 
            {
                // Map index to existing Datablock
                new_instance.datablock_array[index] = new_instance.datablock_array[i];
                sharesBlock = true;
                break;
            }
        }

        if(!sharesBlock){ 
            // Create corresponding new Datablocks
            new_instance.datablock_array[index] = new Datablock(
                toCopy.datablock_array[index].local_depth,
                toCopy.datablock_size
                );

            // Copy elements from the "old" into the new Datablock
            for (var i = 0; i < toCopy.datablock_size; i++) {
                new_instance.datablock_array[index].elements[i] = toCopy.datablock_array[index].elements[i];
            }

            //B Copy marked info
            new_instance.datablock_array[index].marked={ 					  
                                        eIndex: 	toCopy.datablock_array[index].marked.eIndex,
                                        rIndex: 	toCopy.datablock_array[index].marked.rIndex,
                                        overflow: 	toCopy.datablock_array[index].marked.overflow,
                                        splitt: 	toCopy.datablock_array[index].marked.splitt,
                                        splittRow: 	toCopy.datablock_array[index].marked.splittRow,
                                        expansion: 	toCopy.datablock_array[index].marked.expansion
                                    };
        }
    }
    //B
    new_instance.task = {
        queue : toCopy.task.queue.slice(),
        status : toCopy.task.status,
        element :  toCopy.task.element, 
        expanded :  toCopy.task.expanded,
        expansion : toCopy.task.expansion
    }

    return new_instance;
}
// Replace current state from a db copy 
ExtendibleHashing.prototype.replaceThis = function(eh){
    var stateCopy = this.copy(eh);
    this.global_depth = stateCopy.global_depth;
    this.datablock_array = stateCopy.datablock_array;

    this.task = stateCopy.task;
    this.consistentState = stateCopy.consistentState;
}



// Initializes and saves the instancean in db
ExtendibleHashing.prototype.init = function (useDefault) { // false: read user input

    if(!useDefault){
        var bucket_size=parseInt(prompt("Bucket Size:"));
        if( isNaN(bucket_size) || bucket_size < 1 ) return alert("Bucket Size must be > 0");

        var global_depth=parseInt(prompt("Global Depth:"));
        if( isNaN(global_depth) || global_depth < 1 ) return alert("Global Depth must be > 0");

        this.resetThis();
        this.global_depth = global_depth;
        this.datablock_size = bucket_size;
    } 
    else {
        this.resetThis();// Use default global_depth and datablock_size
    }

    // Strategy: In the initial phase every index shall reference its own 
    // personal Databucket, thus local = global depth for all Databuckets 
    for (var index = 0; index < (1 << this.global_depth); index++){
        this.datablock_array[index] = new Datablock(this.global_depth, this.datablock_size);
    }
    this.saveInDB(true);
    this.draw();
}

ExtendibleHashing.prototype.example = function () {

    this.global_depth = 1;
    this.datablock_size = 2;
    this.init(true); // Use default values

    this.draw();
}

ExtendibleHashing.prototype.prev = function(){
    this.working = true;
        if(this.actStateID>0){
            var prev_id=this.actStateID-1;
            this.actStateID=prev_id;
            var eh=this.db[prev_id];
            
            this.replaceThis(eh);
              
        }
    this.working = false;
    this.draw();
}

ExtendibleHashing.prototype.next = function(){
    this.working = true;
        if(this.actStateID<this.db.length-1){
            var next_id=this.actStateID+1;
            this.actStateID=next_id;
            var eh=this.db[next_id];

            this.replaceThis(eh);  	
        }
    this.working = false;
    this.draw();
}

ExtendibleHashing.prototype.firstState=function(){
    this.working = true;
        this.actStateID=0;
        var eh=this.db[0];
        this.replaceThis(eh);
    this.working = false; 
    this.draw();
}

ExtendibleHashing.prototype.lastState=function(){
    this.working = true;
        var last_id=this.db.length-1;
        this.actStateID=last_id;
        var eh=this.db[last_id];
        this.replaceThis(eh);
    this.working = false;
    this.draw();
}


ExtendibleHashing.prototype.draw = function(){
    if(this.drawToScreen)
        this.view.draw();
}

ExtendibleHashing.prototype.hash = function (key, global_depth){
    var mask_depth = Math.pow(2,global_depth)-1; // Sum of 2^x series 1 + 2 + 4 ...
    return key & mask_depth;
}


ExtendibleHashing.prototype.search = function () {

    var instance = this;
    instance.working = true;

    var timer = function (){ return instance.drawToScreen ? 350* instance.speed : 0;}


    // Fetch input
    var inputValues = instance.getUserInput("Search: \nPlease enter the elements (separated by space),\nvalues > 99999999 are ignored.");
        
    // Return when array is empty
    if(inputValues.length == 0){
        instance.working = false;
        return;
    }

    // Prepare Task
    instance.task.status = "Search";
    instance.task.queue = [];
    for (var i = inputValues.length-1; i >= 0 ; i--) {
        instance.task.queue.push(inputValues[i]);
    }

    instance.draw();
    instance.saveInDB(true); //B
    

    function searchNextValueOrEnd() {
        if (instance.task.queue.length > 0) {
            // Search next value
            searchValue(instance.task.queue.pop());
        } 
        else { 
            //CLEAN UP
             instance.setActStateIDofLastDrawn();
            instance.working = false;
            instance.draw(); // Update Play button
        }

    }


    function searchValue(val) {

        setTimeout( function(){
                    
            // Mark Index and Pointer
            var index = instance.hash(val, instance.global_depth);
            instance.datablock_array[index].marked.rIndex = index;
            instance.task.element = val;
            instance.disableDrawingOnPause();	
            instance.draw();
            instance.saveInDB(); //B

            
            setTimeout(function(){
                
                for (var i = 0; i < instance.datablock_array[index].elements.length ; i++) {
                    if( instance.datablock_array[index].elements[i] === val ){

                        // Mark target element
                        instance.datablock_array[index].marked.eIndex = i;
                        instance.disableDrawingOnPause();	
                        instance.draw();
                        instance.saveInDB(); //B

                        if(instance.drawToScreen){
                            alert("Value " + val+ " found.");
                        }

                        instance.datablock_array[index].marked = {};
                        instance.task.element = undefined;
                        instance.disableDrawingOnPause();	
                        instance.draw();
                        instance.saveInDB(true); //B consistent state


                        searchNextValueOrEnd();

                        return;
                    
                    };
                }

                instance.datablock_array[index].marked = {};
                instance.task.element = undefined;
                instance.disableDrawingOnPause();	
                instance.draw();
                instance.saveInDB(true); //B consistent state				
                if(instance.drawToScreen){
                    alert("Value " + val+ " not found.");
                }

                searchNextValueOrEnd();
                
            },timer() );
        },timer() );
    }

    searchNextValueOrEnd();
}


ExtendibleHashing.prototype.add = function (){
    
    var instance = this;
    instance.working = true;
    
    // Delays for Animation
    var timer = function (){ return instance.drawToScreen ? 350* instance.speed : 0;}
    

    // Fetch input
    var inputValues = instance.getUserInput("Add: \nPlease enter the elements (separated by space),\nvalues > 99999999 are ignored.");
    // Return when array is empty
    if(inputValues.length == 0){
        instance.working = false;
        return;
    }


    // Prepare Task
    instance.task.status = "Insert";
    instance.task.queue = [];		
    for (var i = inputValues.length-1; i >= 0 ; i--) {
        instance.task.queue.push(inputValues[i]);
    }
    instance.draw();
    instance.saveInDB(true); //B


    function addNextValueOrEnd() {
        if (instance.task.queue.length > 0) {
            // Add next value
            addValue(instance.task.queue.pop());
        } 
        else { 
            //CLEAN UP
             instance.setActStateIDofLastDrawn();
            instance.working = false;
            instance.draw(); // Update Play button
        }
    }


    function addValue(val){

        setTimeout( function(){

            
            // Mark index and pointer
            var index = instance.hash(val, instance.global_depth);
            instance.datablock_array[index].marked.rIndex = index;
            instance.task.element = val;
            instance.disableDrawingOnPause();			
            instance.draw();
                
                
                setTimeout( function(){
                    // 1) Add value
                    var free_element_index = undefined;

                    for (var i = 0; i < instance.datablock_size; i++){
                            
                            // Value exists 
                            if ( instance.datablock_array[index].elements[i] === val )
                            {
                                instance.datablock_array[index].marked.eIndex = i;
                                instance.saveInDB(); //B
                                instance.disableDrawingOnPause();
                                instance.draw();
                                
                                // Unmark
                                setTimeout(function(){

                                    instance.datablock_array[index].marked = {};
                                    instance.task.element = undefined;
                                    instance.disableDrawingOnPause();
                                    instance.draw();
                                    instance.saveInDB(true); //B consistent state
                                
                                    addNextValueOrEnd();
                                
                                }, timer() );
                                return;
                            }
                            // Remember the first free slot
                            if (free_element_index === undefined && instance.datablock_array[index].elements[i] === undefined) {
                                free_element_index = i;
                            }
                            // Insert value in a free slot
                            if (i === (instance.datablock_size-1)  && free_element_index !== undefined )
                            {			
                                
                                instance.datablock_array[index].marked.eIndex = free_element_index;
                                instance.saveInDB(); //B
                                instance.datablock_array[index].elements[free_element_index] = val;
                                instance.saveInDB(); //B
                                instance.disableDrawingOnPause();
                                instance.draw();
                                
                                // Unmark
                                setTimeout(function(){

                                    instance.datablock_array[index].marked = {};
                                    instance.task.element = undefined;
                                    instance.disableDrawingOnPause();
                                    instance.draw();
                                    instance.saveInDB(true); //B consistent state
                                    
                                    addNextValueOrEnd();
                                
                                }, timer() );
                                return;
                            }
                    }  

                    // ### Datablock Overflow ### 
                    instance.datablock_array[index].marked.overflow = true;
                    instance.saveInDB(); //B
                    instance.disableDrawingOnPause();
                    instance.draw();
                    instance.datablock_array[index].marked = {};
                    setTimeout(function(){
                        // 2.) Splitt the Datablock if local < global depth
                        if( instance.datablock_array[index].local_depth < instance.global_depth )
                        {
                            

                            instance.datablock_array[index].marked.splitt = true;
                            instance.datablock_array[index].marked.splittRow = true;
                            instance.saveInDB(); //B
                            instance.disableDrawingOnPause();
                            instance.draw();
                            instance.datablock_array[index].marked = {};
                            
                            setTimeout(function(){

                                // Save reference to old datablock elements and marked object (view purpose);
                                var ptr_old_marked = instance.datablock_array[index].marked;
                                var ptr_old_elements = instance.datablock_array[index].elements

                                var tmp_new_local_depth = instance.datablock_array[index].local_depth + 1;
                                instance.datablock_array[index].local_depth = tmp_new_local_depth	

                                // Create a new bucket and distribute the references 
                                var bucket_ptrs = []; 
                                for (var i = 0; i < instance.datablock_array.length; i++) // 2^(gDepth - lDepth) references
                                {if(instance.datablock_array[index] === instance.datablock_array[i]) bucket_ptrs.push(i); } 
                                
                                var bucketOne = instance.datablock_array[index];				
                                var bucketTwo = new Datablock(tmp_new_local_depth,instance.datablock_size);

                                var ptr_distribution = {} // Two groups
                                bucket_ptrs.forEach( b_ptr => { 
                                    var b_index = b_ptr % Math.pow(2,tmp_new_local_depth) // LSB based on incremented local depth
                                    if(!(b_index in ptr_distribution)) ptr_distribution[b_index]= [];
                                    ptr_distribution[b_index].push(b_ptr)

                                });
                                ptr_distribution[Object.keys(ptr_distribution)[0]].forEach(b_ptr =>{ instance.datablock_array[b_ptr] = bucketOne});
                                ptr_distribution[Object.keys(ptr_distribution)[1]].forEach(b_ptr =>{ instance.datablock_array[b_ptr] = bucketTwo});
                                

                                //  Move elements to new Block if necessary using the incremented local depth
                                var free_pos_new = 0;
                                for (var i = 0; i < instance.datablock_size; i++){
                                    var new_index = instance.hash(ptr_old_elements[i], tmp_new_local_depth);
                                    if(instance.datablock_array[new_index] !== bucketOne){
                                        bucketTwo.elements[free_pos_new] = ptr_old_elements[i];
                                        free_pos_new = free_pos_new + 1;
                                        ptr_old_elements[i] = undefined;
                                    }
                                }  	


    
                                bucketTwo.marked.splittRow = true;
                                ptr_old_marked.splittRow = true;
                                instance.saveInDB(); //B
                                instance.disableDrawingOnPause();
                                instance.draw(); 
                                bucketTwo.marked = {};
                                ptr_old_marked.splittRow = false;

                                setTimeout(function(){
                                    
                                         addValue(val);

                                }, timer() );	
                            }, timer() );
                            
                        }

                        // 3.) Indexexpansion if local = global depth
                        else if( instance.datablock_array[index].local_depth === instance.global_depth ) 
                        {
                            
                            instance.datablock_array[index].marked.expansion = true;
                            instance.task.expansion= true;
                            instance.saveInDB(); //B
                            instance.disableDrawingOnPause();
                            instance.draw();
                            instance.datablock_array[index].marked = {};
                            instance.task.expansion= false;

                            setTimeout(function(){
                                // Double the size of the datablock array and point the new fields to the
                                // old ones sequentially from 0 to the last field of the "old" array
                                var datablock_array_len_old = instance.datablock_array.length;
                                for (var i = datablock_array_len_old; i < 2*datablock_array_len_old; i++){
                                    instance.datablock_array[i] = instance.datablock_array[i - datablock_array_len_old];
                                }

                                instance.global_depth = 1 + instance.global_depth;

                                instance.task.expanded= true;
                                instance.saveInDB(); //B
                                instance.disableDrawingOnPause();
                                instance.draw();
                                instance.task.expanded = false;
                                // Retry adding the new value
                                setTimeout(function(){
                                    addValue(val);
                                }, timer() );
                            }, timer() );
                            
                        }

                    }, timer() );

                }, timer() );

        }, timer() );
    }

    addNextValueOrEnd();

}


ExtendibleHashing.prototype.remove = function (){
    
    
    var instance = this;
    instance.working = true;

    var timer = function(){ return instance.drawToScreen ? 350* instance.speed : 0;}
    
    
    // Fetch input
    var inputValues = instance.getUserInput("Remove: \nPlease enter the elements (separated by space),\nvalues > 99999999 are ignored.");
    
    // Return when array is empty
    if(inputValues.length == 0){
        instance.working = false;
        return;
    }

    // Prepare Task
    instance.task.status = "Remove";
    instance.task.queue = [];
    for (var i = inputValues.length-1; i >= 0 ; i--) {
        instance.task.queue.push(inputValues[i]);
    }

    instance.draw();
    instance.saveInDB(true); //B


    function removeNextValueOrEnd(){

        if (instance.task.queue.length > 0) {
            // Remove next value
            removeValue(instance.task.queue.pop());
        } 
        else { 
            //CLEAN UP
             instance.setActStateIDofLastDrawn();
            instance.working = false;
            instance.draw(); // Update Play button
        }
    }

    function removeValue(val) {

        setTimeout( function(){

            // Mark Index and Pointer
            
            var index = instance.hash(val, instance.global_depth);
            instance.datablock_array[index].marked.rIndex = index;
            instance.task.element = val;
            instance.disableDrawingOnPause();	
            instance.draw();
            instance.saveInDB(); //B

            
            setTimeout(function(){

                
                for (var i = 0; i < instance.datablock_array[index].elements.length ; i++) {
                    if( instance.datablock_array[index].elements[i] === val ){

                        // Mark target element
                        instance.datablock_array[index].marked.eIndex = i;
                        instance.disableDrawingOnPause();	
                        instance.draw();
                        instance.saveInDB(); //B
                        
                        setTimeout(function(){	
                            // Remove element
                            instance.datablock_array[index].elements[i] = undefined;
                            instance.datablock_array[index].marked = {};
                            instance.task.element = undefined;
                            instance.disableDrawingOnPause();	
                            instance.draw();
                            instance.saveInDB(true);
                        
                            setTimeout(function(){			
                                instance.disableDrawingOnPause();	
                                instance.draw();
                                removeNextValueOrEnd();
                            
                            },timer() );
                        },timer() );
                        return;
                        
                    };
                }
                instance.datablock_array[index].marked = {};
                instance.task.element = undefined;
                instance.disableDrawingOnPause();	
                instance.draw();
                instance.saveInDB(true);
                
                if(instance.drawToScreen){
                    alert("Value " + val+ " not found.");
                }
                setTimeout(function(){	
                    instance.disableDrawingOnPause();	
                    instance.draw();
                    removeNextValueOrEnd();
    
                },timer() );
            },timer() );
        },timer() );
    }

    removeNextValueOrEnd();
    
}
// Continue with a task that has been brought to halt.
ExtendibleHashing.prototype.continueTask = function(withSpeed){
    this.working = true;

    // Stop here if the current State is already the last in the db or the first one.
    if(this.task.queue === undefined || this.actStateID === this.db.length-1 || this.actStateID === 0){
        alert("Queue is empty, thus no values to be inserted, searched or removed.");
        this.working = false;
        return false;
    }
    this.speed = withSpeed;
    

    var instance = this;
    var timer = function(){ return 350* instance.speed};
    var nextStateID = instance.actStateID;

    function setNextState(){
        if( nextStateID < instance.db.length-1){

            // Set next state
            nextStateID  = nextStateID +1; 
            instance.actStateID=nextStateID;
            var eh=instance.db[nextStateID];
            instance.replaceThis(eh);
            instance.draw();

            // In case user paused 
            if(instance.speed <= 0)
            {
                instance.working = false;
                instance.draw();
                return;
            }

            // Get next State
            setTimeout(function(){
                setNextState();
            }, timer() );
    
        }
        else{ 
            // Update Play button
            instance.working = false;
            instance.draw();
            return;
        }
    }

    setNextState();

}


// Returns an array of integers <= 99999999
// If no valid input, an empty array [] is returned
ExtendibleHashing.prototype.getUserInput = function(promptMessage){
    
    var tmpValues = prompt(promptMessage);

    // Return [] on invalid input 
    if(tmpValues == null || tmpValues == ""){ return []; }

    tmpValues = tmpValues.split(" ");
        
    var inputValues = [];
    var tmpVal;
    for (var i = 0; i < tmpValues.length; i++) {
        tmpVal = parseInt(tmpValues[i]);
        if ( !isNaN(tmpVal) && tmpVal < 100000000 ){
            inputValues.push(tmpVal);		
        }
    }
    return inputValues;

}

// Disable drawing and save the ID of the last state drawn on screen.
ExtendibleHashing.prototype.disableDrawingOnPause = function(){
    if(this.speed === 0 && this.drawToScreen === true){ 
        this.drawToScreen = false;				
        this.actStateID_lastDrawn = this.actStateID; 
    }
}

// Enable draw function and set current state back to the last drawn state,
// since every save to the db incremented the current actStateID.
ExtendibleHashing.prototype.setActStateIDofLastDrawn = function(){
    
    if(this.drawToScreen === false) {
        this.actStateID = this.actStateID_lastDrawn;
        var eh=this.db[this.actStateID];
        this.replaceThis(eh);
    }
    this.actStateID_lastDrawn = undefined;
    this.drawToScreen = true;
}


// Checks whether the current state is valid for further manipulation.
// If not, then the next possible consistent state will be set as the current state.
ExtendibleHashing.prototype.prepareNextConsistentStateAndInvokeTask = function(callbackTask){

    this.working = true;

    var instance = this;
    var timer = function(){ return 250} // Fast forward
    

    function invokeTask(task) {
        switch(task){
            case "add":
                instance.add();
                return;
            case "remove":
                instance.remove();
                return;
            case "search":
                instance.search();
                return;
            default:
                instance.working = false;
                return;
        }
    }


    var nextStateID = instance.actStateID;
    function setNextState(){
        if( nextStateID < instance.db.length-1){

            // Set next state
            nextStateID  = nextStateID +1; 
            instance.actStateID=nextStateID;
            var eh=instance.db[nextStateID];
            instance.replaceThis(eh);
            instance.draw();
            
            // If this state is also inconsistent move to next
            if(instance.consistentState === false){ 
                setTimeout(function(){
                    setNextState();
                },timer() );	
            }
            else{
                invokeTask(callbackTask);
                return;
            }
        } 
        else{
            // Clean up, in case no consistent state is found (unlikely)
            instance.working = false;
            instance.draw();
            return;
        }

    }

    // State already valid
    if(instance.consistentState === true){
        invokeTask(callbackTask);
        return;
    }
    // Find valid state
    setNextState();

}
