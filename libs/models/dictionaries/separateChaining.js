/*
 Software License Agreement (BSD License)
 Copyright (c), David Tomic
 All rights reserved.


 Redistribution and use of this software in source and binary forms, with or without modification, are permitted provided that the following condition is met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND RIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR RIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN RACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

function Row() {
	this.values = [];
}

function SepChain() {
	this.view = new SepChainView(this);
	this.rows = [];
	this.db = [];
	this.actStateID = -1;
	this.calc = "k % size = pos"; 
	this.dynamic = false;
	this.numItems = 0;
	this.color = "#9AFE2E";
}

SepChain.prototype.init = function(size) {
	for(var i = 0; i < size; ++i) {
		this.rows.push(new Row());
	}
	this.saveInDB();
}

SepChain.prototype.reinit = function(size) {
	this.rows = [];
	this.calc = "k % size = pos";
	this.numItems = 0;
	this.init(size);
}

/*
This method was not planned initally, but added on demand
It is therefore not best suited for using other methods
Cosequently, the method body contains code which more/less does
the same thing as some of the other methods do (without delays,
drawings and so on)
*/
SepChain.prototype.resize = function(scN) {
	scN.init(this.rows.length * 2);
	for(var i = 0; i < this.rows.length; ++i) {
		for(var j = 0; j < this.rows[i].values.length; ++j) {
			var pos = this.rows[i].values[j] % scN.rows.length;
			scN.rows[pos].values.push(this.rows[i].values[j]);
		}
	}
	this.replaceThis(scN);
	scN.view.model = this;
	this.view = scN.view;
	this.saveInDB();
}

SepChain.prototype.prev = function() {
	if(this.actStateID > 0) {
		var prev_id = this.actStateID - 1;
		this.actStateID = prev_id;
		var rs = this.db[prev_id];
      	this.replaceThis(rs);
      	this.draw();
	}
}

SepChain.prototype.next = function() {
	if(this.actStateID < this.db.length - 1) {
		var next_id = this.actStateID + 1;
		this.actStateID = next_id;
		var rs = this.db[next_id];
      	this.replaceThis(rs);
      	this.draw();
	}
}

SepChain.prototype.firstState = function() {
	this.actStateID = 0;
	var rs = this.db[0];
    this.replaceThis(rs);
    this.draw();
}

SepChain.prototype.lastState = function() {
	var last_id = this.db.length - 1;
	this.actStateID = last_id;
	var rs = this.db[last_id];
    this.replaceThis(rs);
    this.draw();
}

SepChain.prototype.saveInDB = function() {
	var count = this.db.length - 1;
 	if(count != this.actStateID) {
 		this.db.splice(this.actStateID + 1, count - this.actStateID);
 	}

	var nextID = this.db.length;
	var last_state = this.db[this.db.length - 1];
	var new_state = this.copy();
	var same = true;
	
	if(last_state == undefined || new_state.rows.length != last_state.rows.length) {
		same = false;
	}
	else {
		for(var i = 0; i < new_state.rows.length; ++i) {
			if(new_state.rows[i].values.length != last_state.rows[i].values.length) {
				same = false;
			}
		}
	
		for(var i = 0; i < new_state.rows.length; ++i) {
			for(var j = 0; j < new_state.rows[i].values.length; ++j) {
				if(new_state.rows[i].values[j] != last_state.rows[i].values[j]) {
					same = false;
				}
			}
		}
	}
	
	if(!same) {
		this.db.push(new_state);
		this.actStateID = nextID;
	}
}

SepChain.prototype.copy = function() {
	var newSC = new SepChain();
	for(var i = 0; i < this.rows.length; ++i) {
		newSC.rows.push(new Row());
	}
	for(var i = 0; i < this.rows.length; ++i) {
		for(var j = 0; j < this.rows[i].values.length; ++j) {
			newSC.rows[i].values[j] = this.rows[i].values[j];
		}
	}
	newSC.calc = this.calc;
	newSC.numItems = this.numItems;
	newSC.dynamic = this.dynamic;
	return newSC;
}

SepChain.prototype.replaceThis = function(sc) {
	this.rows = [];
	for(var i = 0; i < sc.rows.length; ++i) {
		this.rows.push(new Row());
	}
	for(var i = 0; i < sc.rows.length; ++i) {
		for(var j = 0; j < sc.rows[i].values.length; ++j) {
			this.rows[i].values[j] = sc.rows[i].values[j];
		}
	}
	this.calc = sc.calc;
}

SepChain.prototype.insert = function(data) {
	this.working = true;
	var sc = this;
	function timeout(sc, d, i, last) {
		setTimeout(function() {
			if(!isNaN(parseInt(d)) && parseInt(d) <= 100000000) {
				var pos = sc.hash(parseInt(d));
				sc.calc = parseInt(d) + " % " + sc.rows.length + " = " + pos;
				sc.rows[pos].values.unshift(parseInt(d));
				++sc.numItems;
				sc.saveInDB();
				sc.draw();
			}
			if(last) {
				sc.working = false;
			}
		}, i * 1000);
	}
	for(var i = 0; i < data.length; ++i) {
		if((data.length - 1) == i) {
			timeout(sc, data[i], i, true);
		} else {
			timeout(sc, data[i], i, false);
		}
	}
}

SepChain.prototype.delete = function(data) {
	var pos = this.hash(data);
	for(var i = 0; i < this.rows[pos].values.length; ++i) {
		if(this.rows[pos].values[i] == data) {
			this.calc = this.rows[pos].values[i] + " % " + this.rows.length + " = " + pos;
			this.rows[pos].values.splice(i, 1);
			--this.numItems;
			break;
		}
	}
	this.saveInDB();
	this.draw();
}

SepChain.prototype.hash = function(data) {
	return data % this.rows.length;
}

SepChain.prototype.draw = function() {
	this.view.draw();
}

// for browser console testing only
SepChain.prototype.print = function() {
	for(var i = 0; i < this.rows.length; ++i) {
		for(var j = 0; j < this.rows[i].values.length; ++j) {
			console.log(i + ": " + this.rows[i].values[j]);
		}
	}
}