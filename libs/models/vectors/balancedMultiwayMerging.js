/*
 Software License Agreement (BSD License)
 Copyright (c), Raphael Raditsch
 All rights reserved.


 Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following condition is met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

//tape model which will be saved into the tape_array
function Tape(){
    this.elements = new Array();
    this.elements_colour = new Array();
    this.head_position = 0;
}

//state model which will be saved into the database for playback
function State(){
    this.state_tape_array = new Array();
    this.state_alternating = new Boolean();
    this.state_text = new String();
}

function BalancedMultiwayMerging(){
    this.tapes = 0;
    this.main_memory = 0;
    this.tape_array = [];
    this.alternating = true;
    this.text = "";
    this.speed = 3;
    this.database = [];
    this.playIndex = 0;

    this.view = new BalancedMultiwayMergingView(this);
}

BalancedMultiwayMerging.prototype.init = function(){
    //Specify number of tapes, the size of the main memory & the initial elements. set the playback index to 0 & reset the database
    this.playIndex = 0;
    this.database.length = 0;
    this.text = "";
    this.alternating = true;

    //Create the tapes and give them a place in the tape array
    for(var index = 0; index < this.tapes; index++){
        this.tape_array[index] = new Tape(this.elements.length);
    }

    //fill in the tape 0
    this.tape_array[0].elements = this.elements.slice();

    //draw the initial start
    this.draw();

    //start the sorting
    this.sorting();
}

BalancedMultiwayMerging.prototype.saveState = function(){
    var newState = new State();

    //parse all the current data into the state that will be saved
    newState.state_tape_array = JSON.parse(JSON.stringify(this.tape_array));
    newState.state_alternating = this.alternating;
    newState.state_text = this.text;

    this.database.push(newState);
}

BalancedMultiwayMerging.prototype.restoreState = function(){
    //restore a state by copying over the current data
    this.tape_array = JSON.parse(JSON.stringify(this.database[this.playIndex].state_tape_array));
    this.alternating = this.database[this.playIndex].state_alternating;
    this.text = this.database[this.playIndex].state_text;
}

BalancedMultiwayMerging.prototype.draw = function(){
    this.view.draw();
}

BalancedMultiwayMerging.prototype.play = async function(){
    function waitforme(timew) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('resolved');
            }, timew/3);
        });
    }

    //playback the saved states with a buffer inbetween
    for(; this.playIndex < this.database.length; this.playIndex++){
        this.restoreState();
        this.draw();
        await waitforme(250*this.speed);
    }
}

BalancedMultiwayMerging.prototype.stop = function (){
    //stop the running program by killing all timers
    var id = window.setTimeout(null,0);
    while (id--)
    {
        window.clearTimeout(id);
    }
}

BalancedMultiwayMerging.prototype.back = function(){
    if (this.playIndex == 0) {
        return false;
    }
    this.playIndex--;
    this.restoreState();
    this.draw();
}

BalancedMultiwayMerging.prototype.forward = function(){
    if (this.playIndex == this.database.length-1) {
        return false;
    }
    this.playIndex++;
    this.restoreState();
    this.draw();
}

BalancedMultiwayMerging.prototype.firstState = function(){
    this.playIndex = 0;
    this.restoreState();
    this.draw();
}

BalancedMultiwayMerging.prototype.lastState = function(){
    this.playIndex = this.database.length-1;
    this.restoreState();
    this.draw();
}

BalancedMultiwayMerging.prototype.example = function(){
    //example data - can be edited!
    this.tapes = 8;
    this.main_memory = 4;
    this.elements=[10,2,11,5,8,3,13,14,15,9,4,7,6,3,34,45,92,12,10,29,23,40,32,50,93,"*"];

    //initialize the object with it
    this.init();
}

BalancedMultiwayMerging.prototype.random = function(){
    this.stop();

    this.elements = [];

    //random number of elements
    var number_of_elements = Math.floor(Math.random() * (41 - 9)) + 9;

    //generate random elements
    for(var i = 0; i < number_of_elements; i++){
        this.elements.push(Math.floor(Math.random() * (100 - 1)) + 1);
    }
    this.elements.push("*");

    this.init();
}

BalancedMultiwayMerging.prototype.getUserInput = function(){
    this.stop();

    var message = prompt("Please enter random numbers separated by space. Numbers > 99 will be ignored.");

    //if there's something in the message box, process it
    if(message) {

        this.elements= [];

        var message = message.split(" ");

        for(var i = 0; i < message.length; i++){
            var tempValue = parseInt(message[i]);

            if(!isNaN(tempValue) && tempValue < 100){
                this.elements.push(tempValue);
            }
        }
        this.elements.push("*");

        this.init();
        return true;
    }
    return false;
}

BalancedMultiwayMerging.prototype.sorting = function(){
    var bmwm = this;

    function initialDistribution(){
        var counter = bmwm.elements.length-1; //-1 as the * shouldn't be copied over
        var index = 0;
        var run = 0;
        bmwm.text = "starting the initial distribution";
        bmwm.saveState();

        do {
            //create a temporary array and put in elements according to main memory size (already sorted)
            var temp;
            temp = bmwm.tape_array[0].elements.slice(index*bmwm.main_memory,(index+1)*bmwm.main_memory).sort(function(a, b){return a-b});
            //colour all the marked elements orange
            for(var i = index*bmwm.main_memory; i < (index+1)*bmwm.main_memory; i++){
                bmwm.tape_array[0].elements_colour[i] = 2;
            }
            bmwm.text = "selected elements for distribution";
            bmwm.saveState();

            //now go through the temporary array and copy the numbers to the output tape. skip at *
            for(var i = 0; i < temp.length ; i++) {
                if(temp[i] === "*"){
                    continue;
                }
                //save what will be copied in new array and display it!
                bmwm.tape_array[bmwm.tapes/2+run].elements.push(temp[i]);
                bmwm.tape_array[bmwm.tapes/2+run].elements_colour[bmwm.tape_array[bmwm.tapes/2+run].elements.length-1] = 2;
                bmwm.text = "copying "+temp[i]+" now";
                bmwm.saveState();
                
                bmwm.tape_array[bmwm.tapes/2+run].elements_colour[bmwm.tape_array[bmwm.tapes/2+run].elements.length-1] = 0;
                bmwm.saveState();
                bmwm.saveState(); //to slow down the animation we use another inbetween state
            }
            //finish the tape and apply a white colour to the elements already distributed
            bmwm.tape_array[bmwm.tapes/2+run].elements.push("*");
            for(var i = index*bmwm.main_memory; i < (index+1)*bmwm.main_memory; i++){
                bmwm.tape_array[0].elements_colour[i] = 0;
            }

            run++;
            index++;

            //if the run reaches the last tape, reset it and start putting it into new tapes
            if(run === bmwm.tapes/2){
                run = 0;
            }

            //reduce the counter by the size of elements removed, then check if it is still above 0
            counter = counter-bmwm.main_memory;
        } while (counter>0);

        //delete the whole old array
        bmwm.tape_array[0].elements.length = 0;
        bmwm.text = "distribution round finished!";
        bmwm.saveState();
    }

    function kwaymerge (alternating){
        //the output tape at the moment
        var output_tape = 0;
        //where you start going through
        var startingtape = bmwm.tapes/2;
        //where you end going through
        var endingtape = bmwm.tapes;

        //if the whole output/input is turned, it's the other way around
        if(alternating){
            output_tape = bmwm.tapes/2;
            startingtape = 0;
            endingtape = bmwm.tapes/2;
        }

        bmwm.text = "output tape is now tape number "+output_tape;
        bmwm.saveState();

        do {
            while (true) {
                //how many tapes have been gone through
                var finished_tapes = 0;
                //defines the end of a set
                var endofset = 0;
                //working array
                var temp = new Array();
                for (var x = startingtape; x < endingtape; x++) {
                    var working = bmwm.tape_array[x].elements[bmwm.tape_array[x].head_position];

                    //if the working array is end of the current set or above it finish the tape or the tape, else push it to the temporary array
                    if (working === "*" || working == undefined) {
                        endofset++;
                        if (bmwm.tape_array[x].head_position >= bmwm.tape_array[x].elements.length - 1) {
                            finished_tapes++;
                        }
                        if (working === "*") {
                            bmwm.tape_array[x].elements_colour[bmwm.tape_array[x].head_position] = 2;
                        }
                    } else {
                        temp.push(working);
                        bmwm.tape_array[x].elements_colour[bmwm.tape_array[x].head_position] = 2;
                    }
                    bmwm.saveState();
                }

                //endofset defines how many tapes ran through their first set. if all of them are through, break the loop and reset it
                if (endofset === bmwm.tapes / 2) {
                    for (var x = startingtape; x < endingtape; x++){
                        bmwm.tape_array[x].elements_colour[bmwm.tape_array[x].head_position] = 0;
                    }
                    break;
                }

                //sort the temp array
                temp = temp.sort(function (a, b) {
                    return a - b
                });

                //now check in which tape the lowest number was and then colour it according to that, copy it & move the head forward
                for (var x = startingtape; x < endingtape; x++) {
                    var working = bmwm.tape_array[x].elements[bmwm.tape_array[x].head_position];
                    if (working == temp[0]) {
                        bmwm.text = "copying element "+working;
                        bmwm.saveState();

                        //push the number in the new array and colour it
                        bmwm.tape_array[output_tape].elements.push(temp[0]);
                        bmwm.tape_array[output_tape].elements_colour[bmwm.tape_array[output_tape].elements.length-1] = 2;
                        bmwm.saveState();

                        //remove the colour in the old array
                        bmwm.tape_array[x].elements_colour[bmwm.tape_array[x].head_position] = 0;
                        bmwm.saveState();

                        //remove the colour in the new array
                        bmwm.tape_array[output_tape].elements_colour[bmwm.tape_array[output_tape].elements.length-1] = 0;
                        bmwm.saveState();

                        bmwm.tape_array[x].head_position++;
                    }
                    bmwm.text = "";
                    bmwm.saveState();
                }
                bmwm.saveState();
            }
            bmwm.saveState();

            //finish the output tape by ending it with a * and advance to the next one
            if(bmwm.tape_array[output_tape].elements[bmwm.tape_array[output_tape].elements.length-1] !== "*"){
                bmwm.tape_array[output_tape].elements.push("*");
            }
            output_tape++;
            bmwm.saveState();

            //advance all of the tape heads to circumvent the *
            for (var x = startingtape; x < endingtape; x++) {
                bmwm.tape_array[x].head_position++;
            }

            //if the output tape reaches the end it resets according to if alternating or not
            if(alternating && output_tape == bmwm.tapes){
                output_tape = bmwm.tapes/2;
            }
            if(!alternating && output_tape == bmwm.tapes/2){
                output_tape = 0;
            }
        } while (finished_tapes < bmwm.tapes / 2);

        //clean up the input tapes
        for (var x = startingtape; x < endingtape; x++) {
            bmwm.tape_array[x].elements.length = 0;
            bmwm.tape_array[x].elements_colour.length = 0;
            bmwm.tape_array[x].head_position = 0;
        }
    }

    //execute the inital distribution
    initialDistribution();
    bmwm.text = "";
    bmwm.saveState();

    //do the k-way merge until only one tape has elements, then finish
    while (true) {
        //alternating of the disks. start with disk 0 first as target = true
        bmwm.text = "switching input/output tapes now";
        bmwm.alternating = !bmwm.alternating;
        bmwm.saveState();

        kwaymerge(bmwm.alternating);

        var tapecheck = 0;
        for (var index = 0; index<bmwm.tapes; index++) {
                if(bmwm.tape_array[index].elements.length > 0) {
                    tapecheck++;
                }
        }
        if(tapecheck>1) {
            continue;
        } else {
            break;
        }
    }
    bmwm.saveState();

    //check if 0 is the tape with the elements, if not, copy over
    if(bmwm.tape_array[0].elements.length === 0) {
        bmwm.text = "solution is on the wrong disk! copying now to 0..",
        bmwm.saveState();
        bmwm.alternating = !bmwm.alternating;
        bmwm.saveState();
        bmwm.tape_array[0].elements = bmwm.tape_array[bmwm.tapes/2].elements.slice(0,bmwm.tape_array[bmwm.tapes/2].elements.length);
        bmwm.tape_array[bmwm.tapes/2].elements.length = 0;
        bmwm.tape_array[bmwm.tapes/2].head_position = 0;
        bmwm.saveState();
    }

    bmwm.text = "finished.";
    bmwm.saveState();
}