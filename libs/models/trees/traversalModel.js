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

function Node(){	
	this.color = "grey"; 
	this.value = 0;
	this.rightChild = undefined;
	this.leftChild = undefined;
	this.parent = undefined;
	this.xPosition = 0;
	this.yPosition = 0;
	this.lineColor = "black";
	this.checkedleft = false;
	this.isDone = false; 
}

function BinTree(){
	this.view = new BinTreeView(this);
	this.db = [];
	this.root = undefined;
	this.actStateID = -1;
	this.processedNodes = [];
	this.nodeOrder = [];
	this.nodes = [];
	this.speed = 1;
	this.numberRandom = undefined;
}
var running = "";
var marker = 0;
var hj = 0; 
var lastStep = "";
var save1 = []; 
var save2 = [];
var nodeDone = [];
var idone = undefined;


/*var greens = ["#00ff00", "#00f700", "#00ef00", "#00e700", "#00df00", "#00d700", "#00cf00",
				"#00c700", "#00bf00", "#00b700", "#00af00", "#00a700", "#009f00", "#009700",
				"#008f00", "#008700", "#007f00", "#007700", "#006f00", "#006700", "#005f00",
				"#005700", "#004f00", "#004700", "#003f00", "#003700", "#002f00", "#002700"]; */
				
var greens = ["#00ff00", "#00ef00", "#00df00", "#00cf00", "#00bf00", "#00af00", "#009f00", 
				"#008f00", "#008700" , "#007f00",  "#006f00",  "#005f00", "#004f00",  "#003f00", "#002f00"];
var cc = 0; 


BinTree.prototype.preorder=function(btn, oldColor){ 
	if (running == "" || running == "pre") { 	
		if (this.processedNodes!=undefined  && running == "" && marker == 0) { 
			for (i = 0; i < this.processedNodes.length; i++) {
				this.processedNodes[i].color = "grey"; 
			}
		}
		this.processedNodes = [];
		if (marker == 0 && running == "") {
			this.nodeOrder = [];
			cc = 0;
		}
			
		running = "pre";
		this.saveInDB();
		this.draw();
		
		function _pre(tree, node){
			tree.processedNodes.push(node);
			if (tree.processedNodes.includes(node)) {
				if (node.leftChild != undefined) {
					_pre(tree, node.leftChild);						
				} else {
					var leftPseudo = new Node();
					leftPseudo.value = "lpseudo";
					leftPseudo.parent = node;
					tree.processedNodes.push(leftPseudo);
				}
				if (node.rightChild != undefined) {
					_pre(tree, node.rightChild);			
				}
				else {
					var rightPseudo = new Node();
					rightPseudo.value = "rpseudo";
					rightPseudo.parent = node;
					tree.processedNodes.push(rightPseudo);
					return;
				}
			}		
		}
		var tree = this;
		var root = this.root;
		if (this.root!=undefined) {
			_pre(tree, root);
		}
		this.saveInDB();
		if (this.speed == 0)
			pre_manually(this, btn, oldColor);
		else
			precolor(this, btn, oldColor);
	}
	else {
		var string = "";
		switch (running) {
			case "pre":
				string = "Preorder-";
				break;
			case "in":
				string = "Inorder-";
				break;
			case "post":
				string = "Postorder-";
				break;
		}
		alert(string+"Algorithm is already running! Please wait until it is finished or reload the page.");
	}
}

function precolor(tree, btn, oldColor) {
	var delay = 0;
	if (tree.processedNodes!=undefined) {
		function stepOne(i) {
				setTimeout(function() { 
					tree.processedNodes[i].color = "coral";
					tree.nodeOrder.push(tree.processedNodes[i].value);
					if (tree.processedNodes[i]!=undefined) {
						tree.processedNodes[i].lineColor = "black";
					}
					
					marker = i;
					lastStep = "one";
				
					tree.saveInDB();
					tree.draw();
				}, delay+=(1000*tree.speed));
		}
		
		function stepTwo(i) {
			setTimeout(function() {
				tree.processedNodes[i].color = greens[cc];
				cc++;
				
				marker = i;
				lastStep = "two";
			
				tree.saveInDB();
				tree.draw();
			}, delay+=(1000*tree.speed));
		}
		
		function stepThree(i) {
			setTimeout(function() {
				//red line
				if (tree.processedNodes[i+1]!=undefined) {
					tree.processedNodes[i+1].lineColor = "coral";
				}
				
				marker = i;
				lastStep = "three";
			
				tree.saveInDB();
				tree.draw();	
			}, delay+=(1000*tree.speed));
		}
		
		function stepPseudoLeft(i) {
			setTimeout (function() {
				marker = i;
				lastStep = "left";
		
				tree.saveInDB();
				tree.view.draw(tree.processedNodes[i]);
			}, delay+=(1000*tree.speed));
		}
		
		function stepPseudoRight(i) {
			setTimeout(function() {
				marker = i;
				lastStep = "right";
		
				tree.saveInDB();
				tree.view.draw(tree.processedNodes[i]);
			}, delay+=(1000*tree.speed));
		}
		i = marker;
		for (i; i < tree.processedNodes.length; i++) {
			if ((lastStep == "two" || lastStep == "left" || lastStep == "right") &&
			tree.processedNodes[i] != undefined && tree.processedNodes[i].value != "lpseudo" && tree.processedNodes[i].value != "rpseudo") {
				stepThree(i-1)
			}
			
			if (tree.processedNodes[i].value != "lpseudo" && tree.processedNodes[i].value != "rpseudo") {
				switch (lastStep) {
					case "":
						stepOne(i);
						stepTwo(i);
						break;
					case "one":
						stepTwo(i);
						lastStep = "";
						break;				
					case "two":
						stepOne(i);
						stepTwo(i);
						break;
					case "three":
						stepOne(i);
						stepTwo(i);
						break;
					case "left":
						stepOne(i);
						stepTwo(i);
						break;
					case "right":
						stepOne(i);
						stepTwo(i);
						break;	
				}				
			}
			if (tree.processedNodes[i].value == "lpseudo") {
				stepPseudoLeft(i);
			}
			if (tree.processedNodes[i].value == "rpseudo") {
				stepPseudoRight(i);
			}
			if (tree.processedNodes[i+1] != undefined && tree.processedNodes[i+1].value != "lpseudo" && tree.processedNodes[i+1].value != "rpseudo") {
				stepThree(i);	
			}
		}
		setTimeout(function() {
			tree.saveInDB();
			tree.draw();
			running = "";
			marker = 0;
			hj = 0;
			lastStep = "";
			btn.style.backgroundColor = oldColor;
		}, delay+=(1000*tree.speed));
	}
}

function pre_manually(tree, btn, oldColor) {
	if (tree.processedNodes!=undefined) {
		if (lastStep == "" || lastStep == "three") {
			tree.processedNodes[marker].color = "coral";
			tree.nodeOrder.push(tree.processedNodes[marker].value);
			if (tree.processedNodes[marker]!=undefined) {
				tree.processedNodes[marker].lineColor = "black";
			}
			lastStep = "one";	
			tree.saveInDB();
			tree.draw();
		}
		else if (lastStep == "one") {
			tree.processedNodes[marker].color = greens[cc];
			cc++;	
			lastStep = "two";
			tree.saveInDB();
			tree.draw();
		}
		else if ((lastStep == "two" || lastStep == "right" || lastStep == "left")&& tree.processedNodes[marker+1] != undefined && tree.processedNodes[marker+1].value != "lpseudo" && tree.processedNodes[marker+1].value != "rpseudo") {
			if (tree.processedNodes[marker+1]!=undefined) {
				tree.processedNodes[marker+1].lineColor = "coral";
			}	
			marker = marker + 1;
			lastStep = "three";
			tree.saveInDB();
			tree.draw();
		}
		else if (lastStep == "two" && tree.processedNodes[marker+1].value == "lpseudo") {
			marker = marker + 1;
			lastStep = "left";
			tree.saveInDB();
			tree.view.draw(tree.processedNodes[marker]);
		}
		else if (lastStep == "two" && tree.processedNodes[marker+1] != undefined && tree.processedNodes[marker+1].value == "rpseudo") {
			marker = marker + 1;
			lastStep = "right";
			tree.saveInDB();
			tree.view.draw(tree.processedNodes[marker]);
		}
		else if ((lastStep == "left" || lastStep == "right") && tree.processedNodes[marker+1] != undefined && tree.processedNodes[marker+1].value == "rpseudo") {
			marker = marker + 1;
			lastStep = "right";
			tree.saveInDB();
			tree.view.draw(tree.processedNodes[marker]);
		}
		else if (tree.processedNodes[marker+2] == undefined) {
			lastStep = "";
			running = "";
			cc = 0;
			marker = 0;
			btn.style.backgroundColor = oldColor;
			tree.saveInDB();
			tree.draw();
		}	
	}
}

BinTree.prototype.postorder=function(btn, oldColor){ 
	if (running == "" || running == "post") {
		if (this.processedNodes!=undefined && running == "" && marker == 0) { 
			for (i = 0; i < this.processedNodes.length; i++) {
				this.processedNodes[i].color = "grey";
			}
		}
		this.processedNodes = [];
		running = "post";
		if (marker == 0) {
			this.nodeOrder = [];
			cc = 0;
		}
		this.saveInDB();
		this.draw();
		var visited1 = [];
		var visited2 = [];
	
		function _post(tree, node){
			if (node.leftChild != undefined && !visited1.includes(node)) {
				visited1.push(node);
				_post(tree, node.leftChild);
				return;
			} 
			else if (node.leftChild == undefined && !visited1.includes(node) ) {
				var leftPseudo = new Node();
				leftPseudo.value = "lpseudo";
				leftPseudo.parent = node;
				tree.processedNodes.push(leftPseudo);
				visited1.push(node);
				visited1.push(leftPseudo);
			}
		
			if (node.rightChild != undefined && !visited2.includes(node)) {
				visited2.push(node);
				_post(tree, node.rightChild);
				return;
			}
			else if (node.rightChild == undefined && !visited2.includes(node)) {
				var rightPseudo = new Node();
				rightPseudo.value = "rpseudo";
				rightPseudo.parent = node;
				tree.processedNodes.push(rightPseudo);
				visited2.push(node);
				visited1.push(rightPseudo);
			}
			
			if (node.leftChild == undefined && node.rightChild == undefined) { //leaf 
				if (!visited1.includes(node))
				visited1.push(node);
				visited2.push(node);
				tree.processedNodes.push(node);
				if (node.parent != undefined) {
					_post(tree, node.parent);
					return;
				}
				return;
			}
			else if (tree.processedNodes.includes(node.leftChild) && tree.processedNodes.includes(node.rightChild)) {
				tree.processedNodes.push(node);
				if (node.parent != undefined) {
					_post(tree, node.parent);
					return;
				} else {
					return;
				}
			}
			else if (tree.processedNodes.includes(node.leftChild) || node.leftChild == undefined) {
				if (node.rightChild != undefined && !visited2.includes(node) ) {
					_post(tree, node.rightChild);
					return;
				}
				else {
					tree.processedNodes.push(node);
					if (node.parent != undefined) {
						_post(tree, node.parent);
						return;
					}
				}			
			}
		}
	
		var tree = this;
		var root = this.root;
		if (this.root!=undefined) {
			_post(tree, root);
		}
		if (this.speed == 0)
			post_manually(this, visited1, btn, oldColor);
		else
			postcolor(this, visited1, btn, oldColor);
	}
	else {
		var string = "";
		switch (running) {
			case "pre":
				string = "Preorder-";
				break;
			case "in":
				string = "Inorder-";
				break;
			case "post":
				string = "Postorder-";
				break;
		}
		alert(string+"Algorithm is already running! Please wait until it is finished or reload the page.");
	}
}

function postcolor(tree, visited, btn, oldColor) {
	var delay = 0;
	var postorder = [];
	for (var k = 0; k < tree.processedNodes.length; k++) {
		if (tree.processedNodes[k].value != "lpseudo" && tree.processedNodes[k].value != "rpseudo") {
			postorder.push(tree.processedNodes[k]);
		}
	}
	if (tree.processedNodes!=undefined) {
		function stepOne(i) { 
			setTimeout(function() { 
				visited[i].color = "#00FFFF";
				if (visited[i]!=undefined) {
					visited[i].lineColor = "black";
				}
				
				marker = i;
				lastStep = "one";
				
				tree.saveInDB();
				tree.draw();
			}, delay+=(1000*tree.speed));
		}
		
		function stepTwo(i) { 
			setTimeout(function() {
				if (visited[i+1]!=undefined) {
					visited[i+1].lineColor = "coral";
				}
				
				marker = i;
				lastStep = "two";
				
				tree.saveInDB();
				tree.draw();
			}, delay+=(1000*tree.speed));
		}
		
		function stepTwoExtra(i) { 
			setTimeout(function() {
				if (visited[i+1]!=undefined) {
					visited[i+1].lineColor = "coral";
				}
				
				marker = i;
				lastStep = "twoex";
				
				tree.saveInDB();
				tree.draw();
			}, delay+=(1000*tree.speed));
		}
		
		function stepThree(actual, giveni, givenj, sp1, sp2) { 
			setTimeout(function() {
				actual.color = "coral";
				tree.nodeOrder.push(actual.value);
				
				marker = giveni;
				hj = givenj;
				save1 = jQuery.extend(true, [], sp1);
				save2 = jQuery.extend(true, [], sp2);
				lastStep = "three";
				
				tree.saveInDB();
				tree.draw();	
			}, delay+=(1000*tree.speed));
		}
		
		function stepFour(actual, giveni, givenj, sp1, sp2) { 
			setTimeout(function() {
				actual.color = greens[cc];
				cc++;
				
				marker = giveni;
				hj = givenj;
				save1 = jQuery.extend(true, [], sp1);
				save2 = jQuery.extend(true, [], sp2);
				nodeDone.push(actual);
				lastStep = "four";
				
				tree.saveInDB();
				tree.draw();	
			}, delay+=(1000*tree.speed));
		}
		
		function stepPseudoLeft(i, sp1, sp2) {
			setTimeout (function() {
				
				marker = i;	
				lastStep = "left";
				save1 = jQuery.extend(true, [], sp1);
				save2 = jQuery.extend(true, [], sp2);				
				
				tree.saveInDB();
				tree.view.draw(visited[i]);
			}, delay+=(1000*tree.speed));
		}
		
		function stepPseudoRight(i, sp1, sp2) {
			setTimeout(function() {
				
				marker = i;
				lastStep = "right";
				idone = i;
				save1 = jQuery.extend(true, [], sp1);
				save2 = jQuery.extend(true, [], sp2);
				
				tree.saveInDB();
				tree.view.draw(visited[i]);
			}, delay+=(1000*tree.speed));
		}
		var saveParent1 = jQuery.extend(true, [], save1);
		var saveParent2 = jQuery.extend(true, [], save2);
		
		var usedj = false;
		var j = hj;
		var i = marker;
		var jdone = undefined;
		for (i; i < visited.length; i++) {
			var done = false;
			while (!done) {
				if (lastStep == "four" && saveParent1.includes(postorder[j]) && saveParent2.includes(postorder[j]) ) {
					var num = i;
					if (i == visited.length-1)
						num = i - 1;
						if (nodeDone.includes(postorder[j]))
							j = j + 1;
						var sp1 = jQuery.extend(true, [], saveParent1);
						var sp2 = jQuery.extend(true, [], saveParent2);
						stepThree(postorder[j], i, j, sp1, sp2);
						stepFour(postorder[j], num, j, sp1, sp2);
						j = j + 1;
						lastStep = "four";
				}
				else done = true;
			}

			if ( lastStep == "four" && visited[i] != undefined && visited[i].value != "lpseudo" && visited[i].value != "rpseudo") {
					stepTwoExtra(i-1);	
					lastStep = "twoex";
			}
			
			if (visited[i].value != "lpseudo" && visited[i].value != "rpseudo" && visited[i].color !="#00FFFF" ) {
				stepOne(i);	
				lastStep = "one";
			}			
			
			if (visited[i].value == "lpseudo") {
				if (lastStep == "" || lastStep == "one") {
					var sp1 = jQuery.extend(true, [], saveParent1);
					var sp2 = jQuery.extend(true, [], saveParent2);
					stepPseudoLeft(i, sp1, sp2);
					lastStep = "left";
				}
			}
			
			if (visited[i].value == "rpseudo" && i != idone) {
				if (lastStep == "" || lastStep == "left" || lastStep == "four") {
					var sp1 = jQuery.extend(true, [], saveParent1);
					var sp2 = jQuery.extend(true, [], saveParent2);
					stepPseudoRight(i, sp1, sp2);
					lastStep = "";	
				}
			}
					
			if (!saveParent1.includes(visited[i].parent) && visited[i].parent != undefined) {
				saveParent1.push(visited[i].parent);
			}
			else if (saveParent1.includes(visited[i].parent) && !saveParent2.includes(visited[i].parent) && visited[i].parent != undefined) {
				saveParent2.push(visited[i].parent);
			}
			
			var done = false;
			while (!done) {
				if (saveParent1.includes(postorder[j]) && saveParent2.includes(postorder[j]) ) {
					var num = i;
					if (i == visited.length-1)
						num = i - 1;
					if (lastStep == "three") {
						var sp1 = jQuery.extend(true, [], saveParent1);
						var sp2 = jQuery.extend(true, [], saveParent2);
						stepFour(postorder[j], num, j, sp1, sp2);
						j = j + 1;
						lastStep = "";
					}
					else if (lastStep == "right" || lastStep == "four" || lastStep == "") {
						if (nodeDone.includes(postorder[j]))
							j = j + 1;
						var sp1 = jQuery.extend(true, [], saveParent1);
						var sp2 = jQuery.extend(true, [], saveParent2);
						stepThree(postorder[j], i, j, sp1, sp2);
						stepFour(postorder[j], num, j, sp1, sp2);
						j = j + 1;
						lastStep = "";
					}
					else 
						done = true;
				}
				else done = true;
			}
			

			if (visited[i+1] != undefined && visited[i+1].value != "lpseudo" && visited[i+1].value != "rpseudo") {
				if (lastStep == "" || lastStep == "one" || lastStep == "four" || lastStep == "twoex" || lastStep == "left") {
					stepTwo(i);	
					lastStep = "";
				}
			}
			
			if (i == visited.length-1) {
				var num = i-1;
				for (k = j; k < postorder.length; k++) {
					if (lastStep == "three") {
						var sp1 = jQuery.extend(true, [], saveParent1);
						var sp2 = jQuery.extend(true, [], saveParent2);
						stepFour(postorder[k], num, k, sp1, sp2);
						lastStep = "";
					}
					else if (lastStep == "right" || lastStep == "four" || lastStep == "") {
						var sp1 = jQuery.extend(true, [], saveParent1);
						var sp2 = jQuery.extend(true, [], saveParent2);
						stepThree(postorder[k], i, k, sp1, sp2);
						stepFour(postorder[k], num, k, sp1, sp2);
						lastStep = "";
					}	
				}	
			}
		}
		setTimeout(function() {
				tree.saveInDB();
				tree.draw();
				marker = 0;
				running = "";
				lastStep = "";
				hj = 0;
				save1 = [];
				save2 = [];
				idone = undefined;
				nodeDone = [];
				btn.style.backgroundColor = oldColor;
			}, delay+=(1000*tree.speed));
	}
}

function post_manually(tree, visited, btn, oldColor) {
	var postorder = [];
	for (var k = 0; k < tree.processedNodes.length; k++) {
		if (tree.processedNodes[k].value != "lpseudo" && tree.processedNodes[k].value != "rpseudo") {
			postorder.push(tree.processedNodes[k]);
		}
	}
	if (tree.processedNodes!=undefined) {
		if (!save1.includes(visited[marker].parent) && visited[marker].parent != undefined) {
			save1.push(visited[marker].parent);
		}
		else if (save1.includes(visited[marker].parent) && !save2.includes(visited[marker].parent) && visited[marker].parent != undefined) {
			save2.push(visited[marker].parent);
		}
		var index = postorder.indexOf(visited[marker+1]);
		if (lastStep == "" || lastStep == "two") {
			visited[marker].color = "#00FFFF";
			if (visited[marker]!=undefined) {
				visited[marker].lineColor = "black";
			}
			lastStep = "one";	
			tree.saveInDB();
			tree.draw();
		}
		else if ((lastStep == "one" || lastStep == "four" || lastStep == "left")  && visited[marker+1] != undefined && visited[marker+1].value != "lpseudo" && visited[marker+1].value != "rpseudo" && (postorder[index-1] == undefined || greens.includes(postorder[index-1].color) || postorder[index-1].color == "grey")) {
			if (visited[marker+1]!=undefined) {
				visited[marker+1].lineColor = "coral";
			}
			marker = marker + 1;
			lastStep = "two";	
			tree.saveInDB();
			tree.draw();
		}
		else if (lastStep == "one" && visited[marker+1] != undefined && visited[marker+1].value == "lpseudo") {
			marker = marker + 1;	
			lastStep = "left";
			tree.saveInDB();
			tree.view.draw(visited[marker]);
		}
		else if ((lastStep == "left" || lastStep == "four") && visited[marker+1] != undefined && visited[marker+1].value == "rpseudo" && (greens.includes(postorder[hj].color) || visited[marker+1].parent == postorder[hj])) {
			marker = marker + 1;
			lastStep = "right";
			tree.saveInDB();
			tree.view.draw(visited[marker]);
		}
		
		else if ((lastStep == "right" || lastStep == "four")) {
			if (save1.includes(postorder[hj]) && save2.includes(postorder[hj]) ) {
				postorder[hj].color = "coral";
				tree.nodeOrder.push(postorder[hj].value);
				lastStep = "three";
				tree.saveInDB();
				tree.draw();
			}
		}
		else if (lastStep == "three" && hj < postorder.length) {
			postorder[hj].color = greens[cc];
			cc++;
			hj = hj + 1;
			nodeDone.push(postorder[hj]);
			lastStep = "four";
			tree.saveInDB();
			tree.draw();	
		}
		if (visited[marker+1] == undefined && hj >= postorder.length) {
			lastStep = "";
			running = "";
			cc = 0;
			marker = 0;
			hj = 0;
			btn.style.backgroundColor = oldColor;
			tree.saveInDB();
			tree.draw();
		}
	}
}

BinTree.prototype.inorder=function(btn, oldColor){ 
	if (running == "" || running == "in"){
		
		if (this.processedNodes!=undefined && running == "" && marker == 0) { 
			for (i = 0; i < this.processedNodes.length; i++) {
				this.processedNodes[i].color = "grey";
			}
		}
		this.processedNodes = [];
		running = "in";
		if (marker == 0) {
			this.nodeOrder = [];
			cc = 0;
		}
		this.saveInDB();
		this.draw();
		var visited = [];
	
		function _in(tree, node){
			if (node.leftChild != undefined && !visited.includes(node)) {
				visited.push(node);
				_in(tree, node.leftChild);
			}
			else if (node.leftChild == undefined && !visited.includes(node)) {
				var leftPseudo = new Node();
				leftPseudo.value = "lpseudo";
				leftPseudo.parent = node;
				tree.processedNodes.push(leftPseudo);
				visited.push(node);
				visited.push(leftPseudo);
			}
		
			if ( visited.includes(node.leftChild) || node.leftChild == undefined ) {
				tree.processedNodes.push(node);
			}

			if (tree.processedNodes.includes(node) && node.rightChild != undefined) {
				_in(tree, node.rightChild);
			}
			else if (tree.processedNodes.includes(node) && node.rightChild == undefined) {
				var rightPseudo = new Node();
				rightPseudo.value = "rpseudo";
				rightPseudo.parent = node;
				tree.processedNodes.push(rightPseudo);
				visited.push(rightPseudo);
			}
		}
		var tree = this;
		var root = this.root;
		if (this.root!=undefined) {
			_in(tree, root);
		}
		if (this.speed == 0)
			in_manually(this, visited, btn, oldColor);
		else
			incolor(this, visited, btn, oldColor);
	}
	else {
		var string = "";
		switch (running) {
			case "pre":
				string = "Preorder-";
				break;
			case "in":
				string = "Inorder-";
				break;
			case "post":
				string = "Postorder-";
				break;
		}
		alert(string+"Algorithm is already running! Please wait until it is finished or reload the page.");
	}
}

function incolor(tree, visited, btn, oldColor) {
	var delay = 0;
	var inorder = [];
	for (var k = 0; k < tree.processedNodes.length; k++) {
		if (tree.processedNodes[k].value != "lpseudo" && tree.processedNodes[k].value != "rpseudo") {
			inorder.push(tree.processedNodes[k]);
		}
	}
	if (tree.processedNodes!=undefined) {
		function stepOne(i) { 
			setTimeout(function() { 
				visited[i].color = "#00FFFF";
				if (visited[i]!=undefined) {
					visited[i].lineColor = "black";
				}
				
				marker = i;
				lastStep = "one";
				
				tree.saveInDB();
				tree.draw();
			}, delay+=(1000*tree.speed));
		}
		
		function stepTwo(i) { 
			setTimeout(function() {
				if (visited[i+1]!=undefined) {
					visited[i+1].lineColor = "coral";
				}
				
				marker = i;
				lastStep = "two";
				
				tree.saveInDB();
				tree.draw();
			}, delay+=(1000*tree.speed));
		}
		
		function stepThree(actual, giveni, givenj) { 
			setTimeout(function() {
				actual.color = "coral";
				tree.nodeOrder.push(actual.value);
				
				marker = giveni;
				hj = givenj;
				lastStep = "three";
				
				tree.saveInDB();
				tree.draw();	
			}, delay+=(1000*tree.speed));
		}
		
		function stepFour(actual, giveni, givenj) { 
			setTimeout(function() {
				actual.color = greens[cc];
				cc++;
				
				marker = giveni;
				hj = givenj;
				lastStep = "four";
				
				tree.saveInDB();
				tree.draw();	
			}, delay+=(1000*tree.speed));
		}
		
		function stepPseudoLeft(i) {
			setTimeout (function() {
				marker = i;	
				lastStep = "left";
				
				tree.saveInDB();
				tree.view.draw(visited[i]);
			}, delay+=(1000*tree.speed));
		}
		
		function stepPseudoRight(i) {
			setTimeout(function() {
				marker = i;	
				lastStep = "right";
				
				tree.saveInDB();
				tree.view.draw(visited[i]);
			}, delay+=(1000*tree.speed));
		}
		
		
		var usedj = false;
		var j = hj;
		var i = marker;
		var jdone = undefined;
		
		for (i; i < visited.length; i++) {
			if (lastStep == "four" && visited[i].parent != undefined && greens.includes(visited[i].parent.color) && visited[i] != undefined && visited[i].value != "lpseudo" && visited[i].value != "rpseudo"&& visited[i].lineColor != "coral") {
				stepTwo(i-1);
			}
			
			if (visited[i].value != "lpseudo" && visited[i].value != "rpseudo" && visited[i].color !="#00FFFF" ) {
				stepOne(i);	
				lastStep = "";
			}			
			
			if (visited[i].value == "lpseudo") {
				if (lastStep == "one" || lastStep == "") {
					stepPseudoLeft(i);
					lastStep = "";
				}
			}
			
			if ((visited[i].value == "lpseudo" ) && i < visited.length-1) {
				if (lastStep == "left" || lastStep == "right") {
					if (greens.includes(inorder[j].color))
						j = j + 1;
					usedj = true;
					stepThree(inorder[j], i, j);
					stepFour(inorder[j], i, j);
					jdone = j;
				}
				else if (lastStep == "three") {
					stepFour(inorder[j], i, j);
					usedj = true;
					jdone = j;
					lastStep = "";
				}
				else {
					if (greens.includes(inorder[j].color))
						j = j + 1;
					stepThree(inorder[j], i, j);
					stepFour(inorder[j], i, j);
					usedj = true;
					jdone = j;
					lastStep = "";
				}	
			}
					
			if (visited[i].value == "rpseudo") {
				if (lastStep == "four" || lastStep == "" || lastStep == "left") {
					stepPseudoRight(i);
				}
			}
			
			if ((visited[i].value == "rpseudo") && i < visited.length-1) {
				if (lastStep == "left" || lastStep == "right") {
					if (greens.includes(inorder[j].color))
						j = j + 1;
					usedj = true;
					if (j == jdone) {
						j = j + 1;
						jdone = false;
					}
					stepThree(inorder[j], i, j);
					stepFour(inorder[j], i, j);
					lastStep = "";
				}
				else if (lastStep == "three") {
					stepFour(inorder[j], i, j);
					usedj = true;
					lastStep = "";
				}
				else {
					if (greens.includes(inorder[j].color))
						j = j + 1;
					stepThree(inorder[j], i, j);
					stepFour(inorder[j], i, j);
					usedj = true;
				}	
			}
			
			if (visited[i+1] != undefined && visited[i+1].value != "lpseudo" && visited[i+1].value != "rpseudo"&& visited[i+1].lineColor != "coral") {
				stepTwo(i);
			}
			
			if (usedj) {
				j = j + 1;
				usedj = false;
			} 
		}
		setTimeout(function() {
				tree.saveInDB();
				tree.draw();
				running = "";
				lastStep = "";
				marker = 0;
				hj = 0;
				btn.style.backgroundColor = oldColor;
			}, delay+=(1000*tree.speed));
	}
}

function in_manually(tree, visited, btn, oldColor) {
	var inorder = [];
	for (var k = 0; k < tree.processedNodes.length; k++) {
		if (tree.processedNodes[k].value != "lpseudo" && tree.processedNodes[k].value != "rpseudo") {
			inorder.push(tree.processedNodes[k]);
		}
	}
	if (tree.processedNodes!=undefined) {
		if (lastStep == "" || lastStep == "two") {
			visited[marker].color = "#00FFFF";
			if (visited[marker]!=undefined) {
				visited[marker].lineColor = "black";
			}
			lastStep = "one";
			tree.saveInDB();
			tree.draw();
		}
		else if ((lastStep == "one" || lastStep == "four")&& visited[marker+1] != undefined && visited[marker+1].value != "lpseudo" && visited[marker+1].value != "rpseudo") {
			if (visited[marker+1]!=undefined) {
				visited[marker+1].lineColor = "coral";
			}
			lastStep = "two";
			marker = marker + 1;			
			tree.saveInDB();
			tree.draw();
		}
		else if (lastStep == "one" && visited[marker+1] != undefined && visited[marker+1].value == "lpseudo") {
			lastStep = "left";	
			marker = marker + 1;
			tree.saveInDB();
			tree.view.draw(visited[marker]);
		}
		else if ((lastStep == "four") && visited[marker+1].value == "rpseudo") {
			marker = marker + 1;
			lastStep = "right";
			tree.saveInDB();
			tree.view.draw(visited[marker]);
		}
		else if ((lastStep == "left" || lastStep == "right") && inorder[hj] != undefined) {
			inorder[hj].color = "coral";
			tree.nodeOrder.push(inorder[hj].value);
			lastStep = "three";
			tree.saveInDB();
			tree.draw();
		}
		else if (lastStep == "three") {
			inorder[hj].color = greens[cc];
			cc++;

			hj = hj + 1;
			lastStep = "four";
			tree.saveInDB();
			tree.draw();
		}
		else if (visited[marker+1] == undefined) {
			lastStep = "";
			running = "";
			cc = 0;
			marker = 0;
			hj = 0;
			btn.style.backgroundColor = oldColor;
			tree.saveInDB();
			tree.draw();
		}
	}
}

BinTree.prototype.createExp=function() {
	this.root=undefined;
	running = "";
	lastStep = "";
	marker = 0;
	hj = 0;
	this.processedNodes = undefined;
	this.nodeOrder = undefined;
	this.saveInDB()
	this.draw();
	var expression = prompt("Please enter an algebraic expression (e.g. (2+1)*3-4):");
	
	var ex = expression.split(" ");
	expression = ex.join("");
	
	var allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-+/*()";
	for (var m = 0; m < expression.length; m++) {
		if (allowed.indexOf(expression[m]) == -1) {
			alert("Input not valid. Please only use the allowed signs: a-z, A-Z, 0-9, +, -, *, /, (, )");
			return;
		}
	}

	for (var m = 0; m < expression.length-1; m++) {
		if (isOperand(expression[m]) && isOperand(expression[m+1]) ) {
			alert("Input not valid. Please only use single-digit values.");
			return;
		}
	}
	
	var cto = 0;
	var ctc = 0;
	for (var m = 0; m < expression.length; m++) {	
		if (expression[m] == "(") {
			cto = cto + 1;
		}
		if (expression[m] == ")") {
			ctc = ctc + 1;
		}
	} 
	if (!ctc == cto) {
		alert("Every opening bracket \"(\" needs a closing bracket \"(\".");
		return;
	}
	
	if (expression.length-cto-ctc > greens.length) {
		alert("This tree is too big. Please enter a shorter expression.");
		return;
	}
	
	var bez = [];
	for (var m = 0; m < expression.length; m++) {	
		var letterNumber = /^[0-9a-zA-Z]+$/;
		if (expression[m].match(letterNumber)) {
			bez[m] = "operand";
		}
		else if (expression[m] == "+" || expression[m] == "-" || expression[m] == "*" || expression[m] == "/") {
			bez[m] = "operator";
		}
		else if (expression[m] == "(" ) {
			bez[m] = "obracket";
		}
		else if (expression[m] == ")" ) {
			bez[m] = "cbracket";
		}
	}
	if (!wellformed(bez)) {
		alert("Please be aware that your input has to be wellformed!");
		return;
	}
	
	var revinfix = expression.split("").reverse();

	for (var i = 0; i<revinfix.length; i++) {
		var flag = true;
		if (revinfix[i] == "(") {
			revinfix[i] = ")";
			flag = false;
		}
		if (revinfix[i] == ")" && flag) {
			revinfix[i] = "(";
		}
		flag = true;
	}
	
	var output = [];
	var stack = [];
	var flag = true;
	for (var i = 0; i < revinfix.length; i++) {
		if (revinfix[i] != "+" && revinfix[i] != "-" && revinfix[i] != "*" && revinfix[i] != "/" && revinfix[i] != ")" && revinfix[i] != "(") {
			output.push(revinfix[i]);
		}
		if (revinfix[i] == "(") {
			stack.push(revinfix[i]);
		}
		if (revinfix[i] == "+" || revinfix[i] == "-" || revinfix[i] == "*" || revinfix[i] == "/") {
			oldOp = stack.pop();
			newOp = revinfix[i];
			if (oldOp == "+" || oldOp == "-" || oldOp == "*" || oldOp == "/") {
				if (priority(newOp) > priority(oldOp)) {
					stack.push(oldOp);
					stack.push(newOp);
				}
				else {
					stack.push(newOp);
					output.push(oldOp);
				}
			}
			else {
				stack.push(oldOp);
				stack.push(newOp);
			}
		}
		if (revinfix[i] == ")") { 
			var x = "a";
			while (x != "(") {
				x = stack.pop();
				if (x != "(") {
					output.push(x);
				}
			}
		}
	}
	if (stack.length > 0) {
		var len = stack.length;
		var y = undefined;
		for (var j = 0; j < len-1; j++) {
			y = stack.pop();
			output.push(y);
		}
	}
	
	var prefix = output.reverse();

	for (var k = 0; k < prefix.length; k++) {
		this.makeExpressionTree(prefix[k]);
	}
	
	this.saveInDB();
	this.draw();	
}

function wellformed(ex) {
	if (ex[0] != "operand" && ex[0] != "obracket") {
		return false;
	}
	else if (ex[ex.length-1] != "operand" && ex[ex.length-1] != "cbracket") {
		return false;
	}
	for (var i = 1; i < ex.length-1; i++) {
		if (ex[i] == "operand") {
			var okay = false;
			if (ex[i-1] == "obracket" && ex[i+1] == "operator") {
				okay = true;
			} 
			else if (ex[i-1] == "operator" && ex[i+1] == "cbracket") {
				okay = true;
			}
			else if (ex[i-1] == "operator" && ex[i+1] == "operator") {
				okay = true;
			}
			if (!okay) return false;	
			else return true;
		}
		else if (ex[i] == "operator") {
			var okay = false;
			if (ex[i-1] == "operand" && ex[i+1] == "operand") {
				okay = true;
			} 
			else if (ex[i-1] == "operand" && ex[i+1] == "obracket") {
				okay = true;
			}
			else if (ex[i-1] == "cbracket" && ex[i+1] == "operand") {
				okay = true;
			}
			else if (ex[i-1] == "cbracket" && ex[i+1] == "obracket") {
				okay = true;
			}
			if (!okay) return false;
			else return true;
		}
		else if (ex[i] == "obracket") {
			var okay = false;
			if (ex[i-1] == "operator" && ex[i+1] == "operand") {
				okay = true;
			} 
			else if (ex[i-1] == "operator" && ex[i+1] == "obracket") {
				okay = true;
			}
			else if (ex[i-1] == "obracket" && ex[i+1] == "operand") {
				okay = true;
			}
			else if (ex[i-1] == "obracket" && ex[i+1] == "obracket") {
				okay = true;
			}
			if (!okay) return false;
			else return true;
		}
		else if (ex[i] == "cbracket") {
			var okay = false;
			if (ex[i-1] == "operand" && ex[i+1] == "cbracket") {
				okay = true;
			} 
			else if (ex[i-1] == "operand" && ex[i+1] == "operator") {
				okay = true;
			}
			else if (ex[i-1] == "cbracket" && ex[i+1] == "operator") {
				okay = true;
			}
			else if (ex[i-1] == "cbracket" && ex[i+1] == "cbracket") {
				okay = true;
			}
			if (!okay) return false;
			else return true;
		}
		else return false;	
	}
}

function priority(op) {
	if (op == "*" || op == "/") {
		return 2; 
	}
	if (op == "+" || op == "-") {
		return 1; 
	}
}

function isOperator(op) {
	if (op == "+" || op == "-" || op == "*" || op == "/") {
		return true;
	} else {
		return false;
	}
}

function isOperand(op) {
	if (op == "+" || op == "-" || op == "*" || op == "/" || op == "(" || op == ")") {
		return false;
	} else {
		return true;
	}
}

function forwardIsDone(node) {
	if (node.parent != undefined && node.parent.leftChild != undefined && node.parent.rightChild != undefined &&node.parent.leftChild.isDone && node.parent.rightChild.isDone) {
		node.parent.isDone = true;
		forwardIsDone(node.parent);
	} else {
		return;
	}
}

BinTree.prototype.makeExpressionTree=function(val){
	var node = new Node();
	node.value = val;
	if (this.root == undefined) {
		this.root = node;
	} else {
		var added = false;
		if (val == undefined) {
			return;
		}
		var root = this.root;
		var current = root;
		function doLoop() {	
			if (current.leftChild != undefined && !current.checkedleft) { 
				current = current.leftChild;
				doLoop(); 
			}			
			else if (current.leftChild == undefined && isOperator(current.value) && !current.checkedleft) {
				current.leftChild = node;
				current.leftChild.parent = current;
				added = true;
				if (!isOperator(current.leftChild.value)) {
					current.leftChild.isDone = true;
				}
			}
			else if (!isOperator(current.value) || current.isDone) { 
				current = current.parent;
				current.checkedleft = true;
				doLoop();
			}
			else if (current.rightChild == undefined && isOperator(current.value)) {
				current.rightChild = node;
				current.rightChild.parent = current;
				added = true;
				if (!isOperator(current.rightChild.value)) {
					current.rightChild.isDone = true;
					current.isDone = true;
					forwardIsDone(current);
				}
			}
			else if (current.rightChild != undefined && current.checkedleft) {
				current = current.rightChild;
				doLoop(); 
			}
		}
		if (!added) {
			doLoop();
		}
	}
}

BinTree.prototype.copy=function(){
	var newTree=new BinTree();
				
	newTree.nodes = jQuery.extend(true, [], this.nodes);
	
	function recursivePreorderTraversal(newTree,node){
		if(node==undefined)
			return;
		
		newTree.addNode(node);
		recursivePreorderTraversal(newTree,node.leftChild);
		recursivePreorderTraversal(newTree,node.rightChild);
	}

	recursivePreorderTraversal(newTree,this.root);

	return newTree;
}

BinTree.prototype.addNode=function(_node) {
	var node = new Node();
	
	node.value = _node.value;
	node.color = _node.color;
	node.lineColor = _node.lineColor;
		
	if(this.root == undefined){
		this.root = node;
	}

	else{
		var added = false;
		var root = this.root;
		var actNode = root;

		if(_node != undefined)

		var lc = 0;
		function doLoop(){

				if(actNode.value>node.value && actNode.leftChild==undefined){
					actNode.leftChild=node;
					actNode.leftChild.parent=actNode;
					added=true;

				}

				else if(actNode.value<=node.value && actNode.rightChild==undefined){					
					actNode.rightChild=node;
					actNode.rightChild.parent=actNode;
					added=true;

				}

				else if(actNode.value>node.value && actNode.leftChild!=undefined){
					var tmpParent=actNode;
					actNode=actNode.leftChild;
					actNode.parent=tmpParent;

				}

				else if(actNode.value<=node.value && actNode.rightChild!=undefined){
					var tmpParent=actNode;
					actNode=actNode.rightChild;
					actNode.parent=tmpParent;
				}
				
				if(!added){
					doLoop();
				}
				lc++;
		}
		
		if(!added)
			doLoop();
	}
}

BinTree.prototype.replaceThis=function(toCopy){
	//for Tape Recorder
	
}

BinTree.prototype.prev=function(){
	if(this.actStateID>0){
		var prev_id=this.actStateID-1;
		this.actStateID=prev_id;
		var rs=this.db[prev_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

BinTree.prototype.next=function(){
	if(this.actStateID<this.db.length-1){
		var next_id=this.actStateID+1;
		this.actStateID=next_id;
		var rs=this.db[next_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

BinTree.prototype.firstState=function(){
	this.actStateID=0;
	var rs=this.db[0];
	//make actual node to THIS:
    this.replaceThis(rs);
    this.draw();
}

BinTree.prototype.lastState=function(){
	var last_id=this.db.length-1;
	this.actStateID=last_id;
	var rs=this.db[last_id];
	//make actual node to THIS:
     this.replaceThis(rs);
     this.draw();
}

BinTree.prototype.addFixed=function(_val) {
	var node = new Node();	
	node.value = _val;
		
	if(this.root == undefined){
		this.root = node;
	}
	else{
		var added = false;
		var root = this.root;
		var actNode = root;

		if(_val != undefined)

		var lc = 0;
		function doLoop(){
				if(actNode.value > node.value && actNode.leftChild == undefined){
					actNode.leftChild=node;
					actNode.leftChild.parent=actNode;
					added=true;
				}
				else if(actNode.value <= node.value && actNode.rightChild == undefined){					
					actNode.rightChild=node;
					actNode.rightChild.parent=actNode;
					added=true;
				}
				else if(actNode.value > node.value && actNode.leftChild != undefined){
					var tmpParent = actNode;
					actNode = actNode.leftChild;
					actNode.parent = tmpParent;
				}
				else if(actNode.value <= node.value && actNode.rightChild != undefined){
					var tmpParent=actNode;
					actNode=actNode.rightChild;
					actNode.parent=tmpParent;
				}
				
				if(!added){
					doLoop();
				}
				lc++;
		}
		
		if(!added)
			doLoop();
		
	}
}

BinTree.prototype.saveInDB=function(){
	var count=this.db.length-1;
 	if(count!=this.actStateID){
 		this.db.splice(this.actStateID+1,count-this.actStateID);
 	}

	var nextID=this.db.length;
	
	var new_state = this.copy();
	var last_state=this.db[this.db.length-1];
	var same = true;
	
	same = false;
	
	if (!same) {
		this.db.push(new_state);
		this.actStateID=nextID;
	}
}

BinTree.prototype.random=function(){
		running = "";
		lastStep = "";
		marker = 0;
		hj = 0;
		this.root=undefined;
		this.processedNodes = [];
		this.nodeOrder = undefined;
		if (this.numberRandom == undefined || isNaN(this.numberRandom)) {
			var number=parseInt((Math.random()*10)+1,10); 
		}
		else {
			var number = this.numberRandom;
		}
		for(var i=0;i<number;i++){
			this.addFixed(parseInt(Math.random()*1000,10));
		}
		this.draw();
}

BinTree.prototype.example=function(){
	this.root=undefined;
	var numbers=[5,3,10,12,1,6];
	this.processedNodes = [];
	for(var i=0;i<numbers.length;i++){
		this.addFixed(numbers[i]);
	}
	this.draw();
}

BinTree.prototype.draw=function(){
	this.view.draw();
}


/*expression examples
f+k-p*(d-s)
(a+(b/c))*d+(e/5)
(a+(b*c))-(((d/e-f)*g))*h
((2*3)/(2-1))+5*(4-1)
*/