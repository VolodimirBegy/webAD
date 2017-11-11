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

function DataBlock(block_size) {
    this.values = new Array(block_size);
    this.marked = false; // Boolean zur Markierung des aktuellen Datenblocks
}

function IndexBlock() {
    this.marked = false;
    this.counter = 0; // Anzahl der Expandierung
    this.datablock_array = [];
}

function Index() {
    this.indexblock_array = [];
}

function Biseh() {
    this.view = new BisehView(this);
    this.index_depth = 2;
    this.entrie_depth = 2;
    this.index_array = [];
    this.datablock_size = 2;
    this.db = [];
    this.actStateID = -1;
    this.lastactStateID = -1;
    this.working = false; // Lock-Mechanismus für Operationen und Tape Recorder
    this.queueWorks = false; // Lock-Mechanismus , wird freigegeben wenn Quaue abgearbeitet ist
    this.task = undefined;
    this.speed = 3;
    this.element = '';
    this.actValue = undefined;
    this.actCounter = undefined;
    this.expanded = false;
    this.enabletodraw = true;
    this.contExpand = false;
    this.expandFinished = false;
    this.count = 0;
}


// Clear db history and data
Biseh.prototype.resetThis = function () {
    this.index_array = [];
    this.db = [];
    this.actStateID = -1;
    this.actValue = undefined;
    this.actCounter = undefined;
}

Biseh.prototype.copy = function (toCopy) {

    var newBISEH = new Biseh();
    newBISEH.index_depth = toCopy.index_depth;
    newBISEH.entrie_depth = toCopy.entrie_depth;
    newBISEH.datablock_size = toCopy.datablock_size;
    newBISEH.element = toCopy.element;
    newBISEH.task = toCopy.task;
    newBISEH.actValue = toCopy.actValue;
    newBISEH.actCounter = toCopy.actCounter;
    newBISEH.expanded = toCopy.expanded;
    newBISEH.contExpand = toCopy.contExpand;


    for (var i = 0; i < toCopy.index_array.length; i++) {
        newBISEH.index_array[i] = new Index();

        for (var j = 0; j < toCopy.index_array[i].indexblock_array.length; j++) {
            newBISEH.index_array[i].indexblock_array[j] = new IndexBlock();
            newBISEH.index_array[i].indexblock_array[j].counter = toCopy.index_array[i].indexblock_array[j].counter;
            newBISEH.index_array[i].indexblock_array[j].marked = toCopy.index_array[i].indexblock_array[j].marked;

            for (var k = 0; k < toCopy.index_array[i].indexblock_array[j].datablock_array.length; k++) {
                newBISEH.index_array[i].indexblock_array[j].datablock_array[k] = new DataBlock(toCopy.datablock_size);

                for (var z = 0; z < toCopy.datablock_size; z++) {
                    newBISEH.index_array[i].indexblock_array[j].datablock_array[k].values[z] = toCopy.index_array[i].indexblock_array[j].datablock_array[k].values[z];
                }
            }
        }
    }

    return newBISEH;


}

Biseh.prototype.init = function () {
    var index = parseInt(prompt("Indexdepth:\n (For a good representation of Biseh choose a \n Value < 4) Max. 5"));
    /* user input */
    if (isNaN(index) || index < 1)return;
    /* user input should always be
     validated */
    var entries = parseInt(prompt("Entrydepth:\n ((For a good representation of Biseh choose a \n Value < 4) Max. 5"));
    if (isNaN(entries) || entries < 1)return;

    var block_size = parseInt(prompt("Blocksize:"));
    if (isNaN(block_size) || block_size < 1)return;

    this.resetThis();
    if (index > 5) index = 5;
    this.index_depth = index;

    this.datablock_size = block_size;
    if (entries > 5) entries = 5;
    this.entrie_depth = entries;

    for (var i = 0; i < (1 << this.index_depth); i++) {
        this.index_array[i] = new Index();

        for (var j = 0; j < (1 << this.entrie_depth); j++) {
            this.index_array[i].indexblock_array[j] = new IndexBlock();
        }
    }
    this.saveInDB();
    /* store the newly created state */
    this.draw();

}


Biseh.prototype.prev = function () {
    if (this.actStateID > 0) {
        var prev_id = this.actStateID - 1;
        this.actStateID = prev_id;
        var rs = this.db[prev_id];
        this.replaceThis(rs);
        this.draw();
    }

}

Biseh.prototype.example = function () {
    this.index_depth = 2;
    this.entrie_depth = 2;
    this.datablock_size = 2;

    for (var i = 0; i < (1 << this.index_depth); i++) {
        this.index_array[i] = new Index();

        for (var j = 0; j < (1 << this.entrie_depth); j++) {
            this.index_array[i].indexblock_array[j] = new IndexBlock();
        }
    }
    this.saveInDB();
    this.draw();
}

//Safe State for Tape Recorder
Biseh.prototype.saveInDB = function () {
    var count = this.db.length - 1;

    if (count != this.actStateID) {
        this.db.splice(this.actStateID + 1, count - this.actStateID);

    }

    var nextID = this.db.length;
    var last_id = this.db.length - 1;
    var last_state = this.db[last_id];
    var new_state = this.copy(this);

    this.db.push(new_state);
    this.actStateID = nextID;

}


Biseh.prototype.next = function () {
    if (this.actStateID < this.db.length - 1) {
        var next_id = this.actStateID + 1;
        this.actStateID = next_id;
        var rs = this.db[next_id]; //make actual node to THIS
        this.replaceThis(rs);
        this.draw();


    }
}

Biseh.prototype.firstState = function () {
    this.actStateID = 0;
    var rs = this.db[0];
//make actual node to THIS:
    this.replaceThis(rs);
    this.draw();
}


Biseh.prototype.lastState = function () {
    var last_id = this.db.length - 1;
    this.actStateID = last_id;
    var rs = this.db[last_id];
//make actual node to THIS:
    this.replaceThis(rs);
    this.draw();
}

Biseh.prototype.replaceThis = function (replaceWith) {
    var c_copy = this.copy(replaceWith);
    this.expanded = c_copy.expanded;
    this.contExpand = c_copy.contExpand;
    this.actValue = c_copy.actValue;
    this.actCounter = c_copy.actCounter;
    this.index_depth = c_copy.index_depth;
    this.entrie_depth = c_copy.entrie_depth;
    this.index_array = c_copy.index_array;
    this.datablock_size = c_copy.datablock_size;
    this.element = c_copy.element;
    this.task = c_copy.task;
}

Biseh.prototype.add = function (initState, value, finished) {

    this.task = 'Add';
    var biseh = this;
    var values = [];
    var alreadyInserted = false;

    // Zeit zwischen den einzelnen Schritten der Darstellung
    var timer = function () {
        return 350 * biseh.speed;
    };

    // Callback Funktion : Werte in der Queue werden nacheinander eingefügt
    function checkWorking(value, finished, len) {
        if (biseh.working) {
            setTimeout(checkWorking, 100, value, finished, len);
        } else {
            biseh.count++;
            if (biseh.count === len)
                biseh.add(true, value, true);
            else
                biseh.add(true, value, false);

        }
    }
    // Wenn der Datenbereich erfolgreich expandiert wurde, soll der Add-Vorgang beendet werden
    function checkExpand() {
        if (!biseh.expandFinished) {
            setTimeout(checkExpand, 1000);
        } else {
            biseh.expandFinished = false;
            cleanUp();
        }
    }
    // Werte werden vom User-Input verarbeitet
    if (!initState) {
        values = biseh.getValues();
        for (var i = 0; i < values.length; i++) {
            if (i === values.length - 1) {
                checkWorking(values[i], i, values.length);
            }
            else {
                checkWorking(values[i], i, values.length);
            }

        }
        return;
    }

    // Datenbereich expanidert und aktueller Wert wird hinzugefügt
    function expandandadd(value, expand_flage, contExp) {
        if (!expand_flage) {
            biseh.expanded = true;
            if (contExp) biseh.contExpand = true;
            biseh.expand(index, value);
            biseh.savelastID();
            biseh.saveInDB();
            biseh.draw();


            for (var j = 0; j < biseh.datablock_size; j++) {
                datablock_index = biseh.hashBlock(value, index.counter);
                if (index.datablock_array[datablock_index].values[j] === undefined && index.datablock_array[datablock_index] !== undefined) {
                    biseh.element = value;
                    index.datablock_array[datablock_index].values[j] = value;
                    biseh.expandFinished = true;
                    return;
                }
            }


            setTimeout(function () {
                expandandadd(value, false, true);
            }, timer(), value);


        } else return;

    }

    this.working = true;
    if (!finished) this.queueWorks = true;

    var x_index = this.hashIndex(value);
    var y_index = this.hashEntry(value);

    var datablock_index = undefined;
    var index = this.index_array[x_index].indexblock_array[y_index];

    setTimeout(function () {
        biseh.actValue = value;
        biseh.actCounter = index.counter;
        index.marked = true;
        biseh.savelastID();
        biseh.saveInDB();
        biseh.draw();


        setTimeout(function () {

            if (index.datablock_array[0] === undefined) {
                index.datablock_array[0] = new DataBlock(biseh.datablock_size);

                biseh.savelastID();
                biseh.saveInDB();
                biseh.draw();
            }
            setTimeout(function () {

                for (var i = 0; i < biseh.datablock_size; i++) {
                    datablock_index = biseh.hashBlock(value, index.counter);
                    if (index.datablock_array[datablock_index].values[i] === value) {
                        biseh.element = value;
                        biseh.savelastID();
                        biseh.saveInDB();
                        biseh.draw();
                        alreadyInserted = true;
                        cleanUp();
                        break;
                    }
                }

                if (!alreadyInserted) {
                    for (var i = 0; i < biseh.datablock_size; i++) {
                        if (index.counter === 0) {
                            if (index.datablock_array[0].values[i] === undefined) {
                                index.datablock_array[0].values[i] = value;
                                biseh.element = value;
                                biseh.savelastID();
                                biseh.saveInDB();
                                biseh.draw();
                                cleanUp();
                                break;
                            }

                        } else {
                            datablock_index = biseh.hashBlock(value, index.counter);
                            if (index.datablock_array[datablock_index].values[i] === undefined && index.datablock_array[datablock_index] !== undefined) {
                                biseh.element = value;
                                index.datablock_array[datablock_index].values[i] = value;
                                biseh.savelastID();
                                biseh.saveInDB();
                                biseh.draw();
                                cleanUp();
                                break;
                            }
                        }
                        //Expand and try to fill in
                        if (i === biseh.datablock_size - 1) {
                            expandandadd(value, false, false);
                            checkExpand();
                        }
                    }
                }
            }, timer());
        }, index.datablock_array[0] === undefined ? timer() : 0);
    }, timer());

    function cleanUp() {
        setTimeout(function () {
            if (biseh.expanded) {
                biseh.actCounter = index.counter;
                biseh.expanded = false;
                biseh.savelastID();
                biseh.saveInDB();
                biseh.draw();

            }

            setTimeout(function () {
                biseh.expanded = false;
                biseh.element = '';
                index.marked = false;
                biseh.task = undefined;
                biseh.actCounter = undefined;
                biseh.working = false;
                biseh.savelastID();
                biseh.saveInDB();
                if (finished) {
                    biseh.queueWorks = false;
                    biseh.count = 0;
                    biseh.savelastState();
                }
                biseh.draw();
            }, timer());
        }, timer());

    }


}

Biseh.prototype.expand = function (index) {

    var new_datablock = new IndexBlock();
    var newHash = undefined;
    index.counter++;


    for (var i = 0; i < index.datablock_array.length; i++) {
        new_datablock.datablock_array[i] = index.datablock_array[i];
        for (var j = 0; j < index.datablock_array[i].values.length; j++) {
            if (index.datablock_array[i].values !== undefined)
                new_datablock.datablock_array[i].values[j] = index.datablock_array[i].values[j];

        }
    }

    for (var i = 0; i < Math.pow(2, index.counter); i++) {
        index.datablock_array[i] = new DataBlock(this.datablock_size);
    }


    for (var i = 0; i < new_datablock.datablock_array.length; i++) {
        for (var j = 0; j < new_datablock.datablock_array[i].values.length; j++) {
            if (new_datablock.datablock_array[i].values[j] !== undefined) {
                newHash = this.hashBlock(new_datablock.datablock_array[i].values[j], index.counter);
                if (newHash !== undefined) {
                    for (var k = 0; k < this.datablock_size; k++) {
                        if (index.datablock_array[newHash].values[k] === undefined) {
                            index.datablock_array[newHash].values[k] = new_datablock.datablock_array[i].values[j];
                            break;
                        }
                    }
                }
            }
        }
    }
}

Biseh.prototype.search = function (initState, value, finished) {

    this.task = 'Search';

    var biseh = this;
    var values = [];
    var found = false;

    var timer = function () {
        return 350 * biseh.speed
    };

    function checkWorking(value, finished, len) {
        if (biseh.working) {
            setTimeout(checkWorking, 100, value, finished, len);
        } else {
            biseh.count++;
            if (biseh.count === len)
                biseh.search(true, value, true);
            else
                biseh.search(true, value, false);

        }
    }

    if (!initState) {
        values = biseh.getValues();
        for (var i = 0; i < values.length; i++) {
            if (i === values.length - 1) {
                checkWorking(values[i], i, values.length);
            }
            else {
                checkWorking(values[i], i, values.length);
            }

        }
        return;
    }

    this.working = true;
    if (!finished) this.queueWorks = true;
    var x_index = this.hashIndex(value);
    var y_index = this.hashEntry(value);

    var index = this.index_array[x_index].indexblock_array[y_index];

    var blockHash = this.hashBlock(value, index.counter);

    setTimeout(function () {
        biseh.actValue = value;
        biseh.actCounter = index.counter;
        index.marked = true;
        biseh.savelastID();
        biseh.saveInDB();
        biseh.draw();

        setTimeout(function () {
            if (index.datablock_array[blockHash] === undefined) {
                found = false;

            } else {
                for (var i = 0; i < index.datablock_array[blockHash].values.length; i++) {
                    if (value === index.datablock_array[blockHash].values[i]) {
                        found = true;
                        biseh.element = value;
                        biseh.savelastID();
                        biseh.saveInDB();
                        biseh.draw();
                        break;
                    }

                }
            }


            setTimeout(function () {
                if (found)
                    alert("VALUE FOUND : " + value);
                else
                    alert("VALUE NOT FOUND : " + value);
                biseh.task = undefined;
                biseh.working = false;
                biseh.element = '';
                index.marked = false;
                biseh.actCounter = undefined;
                biseh.savelastID();
                biseh.saveInDB();
                if (finished) {
                    biseh.count = 0;
                    biseh.queueWorks = false;
                    biseh.savelastState();
                }
                biseh.draw();


            }, timer());
        }, index.datablock_array[blockHash] === undefined ? 0 : timer());
    }, timer());


}

Biseh.prototype.remove = function (initState, value, finished) {

    this.task = 'Remove';

    var found = false;
    var biseh = this;
    var values = [];

    var timer = function () {
        return 350 * biseh.speed
    };

    function checkWorking(value, finished, len) {
        if (biseh.working) {
            setTimeout(checkWorking, 100, value, finished, len);
        } else {
            biseh.count++;
            if (biseh.count === len)
                biseh.remove(true, value, true);
            else
                biseh.remove(true, value, false);

        }
    }

    if (!initState) {
        values = biseh.getValues();
        for (var i = 0; i < values.length; i++) {
            if (i === values.length - 1) {
                checkWorking(values[i], i, values.length);
            }
            else {
                checkWorking(values[i], i, values.length);
            }

        }
        return;
    }


    this.working = true;
    if (!finished) this.queueWorks = true;

    var x_index = this.hashIndex(value);
    var y_index = this.hashEntry(value);

    var index = this.index_array[x_index].indexblock_array[y_index];

    var blockHash = this.hashBlock(value, index.counter);

    setTimeout(function () {
        biseh.actValue = value;
        biseh.actCounter = index.counter;
        index.marked = true;
        biseh.savelastID();
        biseh.saveInDB();
        biseh.draw();

        setTimeout(function () {

            if (index.datablock_array[blockHash] === undefined) {
                found = false;
            } else {
                for (var i = 0; i < index.datablock_array[blockHash].values.length; i++) {
                    if (value === index.datablock_array[blockHash].values[i]) {
                        biseh.element = value;
                        found = true;
                        biseh.savelastID();
                        biseh.saveInDB();
                        biseh.draw();
                        index.datablock_array[blockHash].values[i] = undefined;
                        break;
                    }

                }
            }
            setTimeout(function () {
                if (!found)
                    alert("VALUE NOT FOUND : " + value);
                biseh.element = '';
                biseh.task = undefined;
                index.marked = false;
                biseh.working = false;
                biseh.actCounter = undefined;
                biseh.savelastID();
                biseh.saveInDB();
                if (finished) {
                    biseh.count = 0;
                    biseh.queueWorks = false;
                    biseh.savelastState();
                }
                biseh.draw();

            }, timer())
        }, timer());
    }, timer());


}


Biseh.prototype.hashIndex = function (value) {
    var binary_index = value.toString(2);
    var index_hash = binary_index.substring(binary_index.length - this.index_depth, binary_index.length);

    return parseInt(index_hash, 2) & Math.pow(2, this.index_depth) - 1;

}

Biseh.prototype.hashEntry = function (value) {
    var binary_entry = value.toString(2);
    var sub_string = binary_entry.substring(0, binary_entry.length - this.index_depth);
    var entry_hash = sub_string.substring(sub_string.length - this.entrie_depth, sub_string.length);

    return parseInt(entry_hash, 2) & Math.pow(2, this.entrie_depth) - 1;

}

Biseh.prototype.hashBlock = function (value, counter) {
    var binary_entry = value.toString(2);
    if (binary_entry.length < this.index_depth + this.entrie_depth + counter) {
        binary_entry = "0".repeat(this.index_depth + this.entrie_depth + counter - binary_entry.length) + binary_entry;
    }

    var sub_string = binary_entry.substring(0, binary_entry.length - this.index_depth);
    sub_string = sub_string.substring(0, sub_string.length - this.entrie_depth);
    return parseInt(sub_string, 2) & Math.pow(2, counter) - 1;

}

Biseh.prototype.draw = function () {
    if (this.enabletodraw)
        this.view.draw();
}

Biseh.prototype.print = function () {
    var bicopy = this.db[4];
    alert("stateid " + this.actStateID);
    for (var i = 0; i < bicopy.index_array[0].indexblock_array[3].datablock_array.length; i++) {
        for (var j = 0; j < bicopy.index_array[0].indexblock_array[3].datablock_array[i].values.length; j++) {
            alert("BLOCK :" + i + " " + "VALUES: " + this.index_array[0].indexblock_array[3].datablock_array[i].values[j]);

        }
    }

}


Biseh.prototype.getValues = function () {

    var values;
    var biseh = this;
    var returnValues = [];

    switch (this.task) {
        case "Add":
            values = prompt("Insert: \nPlease enter your Values (separated by space),\nvalues > 99999 are ignored.");
            break;

        case "Remove":
            values = prompt("Remove: \nPlease enter your Values (separated by space),\nvalues > 99999 are ignored.");
            break;

        case "Search":
            values = prompt("Search: \nPlease enter your Values (separated by space),\nvalues > 99999 are ignored.");
            break;

        default:
            break;
    }

    if (values == "" || values == null) return false;
    values = values.split(" ");
    var tempValue;
    for (var i = 0; i < values.length; i++) {
        tempValue = parseInt(values[i]);
        if (!isNaN(tempValue) && tempValue < 100000) {
            returnValues.push(tempValue)
        }

    }

    return returnValues;

}

Biseh.prototype.savelastID = function () {
    if (this.speed === 0 && this.enabletodraw) {
        this.lastactStateID = this.actStateID;
        this.enabletodraw = false;
    }

}


Biseh.prototype.continueTask = function (speed) {

    this.working = true;

    var biseh = this;
    biseh.speed = speed;

    var timer = function () {
        return 350 * biseh.speed
    };

    var count_actState = biseh.actStateID;

    if (count_actState >= biseh.db.length - 1) {
        alert("No more steps to show");
    }

    function performTask() {
        if (count_actState < biseh.db.length - 1) {
            count_actState++;
            biseh.actStateID = count_actState;
            var newbiseh = biseh.db[count_actState];
            biseh.replaceThis(newbiseh);
            biseh.draw();

            if (biseh.speed <= 0) {
                biseh.working = false;
                biseh.draw();
                return;
            }

            setTimeout(function () {
                performTask();
            }, timer());


        } else {
            biseh.working = false;
            biseh.draw();
            return;
        }

    }

    performTask();

}

Biseh.prototype.savelastState = function () {
    if (!this.enabletodraw) {
        this.actStateID = this.lastactStateID;
        this.replaceThis(this.db[this.actStateID]);
    }
    this.enabletodraw = true;


}

Biseh.prototype.print = function () {
    alert("count")
    alert("QUEUE" + this.queueWorks);
    alert("WORK" + this.working);
}




