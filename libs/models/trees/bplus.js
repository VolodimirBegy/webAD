
function Node(){ // Knoten
	this.keys=[]; 
	this.pointers=[];
	this.isLeaf=true; 
	this.parent=undefined; 
	this.rightPointer=undefined;
	this.isOrphan=false;
}

function BPlusTree(ord, spe, lim, cont, hd, vd, colCode, prot){
	this.view=new BPlusTreeView(cont, prot);
	this.root=undefined;
	this.order=ord;
	this.speed=spe;
	this.limit=lim;
	this.hdist=hd;
	this.vdist=vd;
	this.color=colCode;
	this.history=[];
	this.remOps=[];
	this.opCount=0;
	this.paused=false;
	this.hasArrived=false;
}


BPlusTree.prototype.prev=function(fs=0){	

	if(tree.history.length>tree.limit){
		var i, hist, code, val, len=tree.history.length-1;
		tree.root=undefined;
		var oldHist=[];
		tree.remOps.unshift(tree.history[len]);
		for(i=0; i<len; i++) oldHist.push(tree.history[i]); // altes Protokoll speichern
		tree.history=[];
		for(i=0; i<len; i++){
			hist=oldHist[i];
			code=hist.charAt(0); // a fuer add oder r fuer remove
			val=hist.substr(2); // der Zahlenwert
			if(code=='a') tree.addSimple(val);
			else if(code=='r') tree.removeSimple(val);
		}
		if(fs==0) tree.draw(undefined, -1, -1);
	}
}

BPlusTree.prototype.next=function(ls=0){

	var hist, code, val, len=tree.remOps.length;
	if(len>0){
		hist=tree.remOps[0];
		code=hist.charAt(0); // a fuer add oder r fuer remove
		val=hist.substr(2); // der Zahlenwert
		if(code=='a') tree.addSimple(val);
		else if(code=='r') tree.removeSimple(val);	
		tree.remOps.splice(0, 1);
		if(ls==0) tree.draw(undefined, -1, -1);
	}
}

BPlusTree.prototype.firstState=function(){
	while(tree.history.length>tree.limit) tree.prev(1);
	tree.draw(undefined, -1, -1);
}

BPlusTree.prototype.lastState=function(){
	if(tree.remOps.length>0){
		while(tree.remOps.length>0) tree.next(1);
		tree.draw(undefined, -1, -1);
	}
}


BPlusTree.prototype.makePause=function(){
	if(tree.speed!=0){
		if(tree.paused) tree.paused=false;
		else tree.paused=true;
	}else tree.paused=false;
}



BPlusTree.prototype.update=function(){
	tree.root=undefined;
	var oldHist=[];
	var i, hist, code, val, len=tree.history.length;
	for(i=0; i<len; i++) oldHist.push(tree.history[i]); // altes Protokoll speichern
	tree.history=[];
	tree.remOps=[];
	for(i=0; i<len; i++){
		hist=oldHist[i];
		code=hist.charAt(0); // a fuer add oder r fuer remove
		val=hist.substr(2); // der Zahlenwert
		if(code=='a') tree.addSimple(val);
		else if(code=='r') tree.removeSimple(val);		
	}
}



BPlusTree.prototype.add=function(mode) { // Funktion hinzufuegen

	var mo=parseInt(mode), val=0, index=0, i=0, origVal, origLen, nVal=true, index=0, waitTime2=3000, invalTime=100, dOrd=tree.order*2; 
	if(mo==-2){ // -2 bedeutet: Benutzer gibt Wert ein
		val=parseInt(prompt("Choose a value between 0 and 1000"));
		if(isNaN(val)||val<1||val>999) return;
	}else if(mo==-1) val=Math.floor((Math.random() * 999) + 1); // Zufallszahl generieren
	else val=mo; // wenn der Wert mit dem Parameter uebermittelt wurde

	tree.update();
	tree.hasArrived=false;
	tree.opCount++;
	var savedOpCount=tree.opCount;
	origVal=val;

	if(tree.speed==0){
		tree.paused=true;
		waitTime2=10;
	}else{
		var pauseSymb = $("#p");
		pauseSymb.addClass("p1");
		tree.paused=false;
	}
	

	if(tree.root==undefined){ // wenn noch keine Wurzel existiert
		var str1 = "a-" + val.toString();		
		tree.history.push(str1);
		var root=new Node();
		root.keys[0]=val; 
		tree.root=root;

	}else{ // Wenn schon eine Wurzel existiert, passendes Blatt finden

		var actNode=tree.root; // Bei der Wurzel beginnen
		while(!actNode.isLeaf){
			index=0;
			if(val>=actNode.keys[0]){
				for(i=0; i<actNode.keys.length; i++){
					if(val>=actNode.keys[i]&&(actNode.keys[i+1]==undefined||val<actNode.keys[i+1])){
						index=i+1;
						break;
					}
				}
			}
			actNode=actNode.pointers[index];
		}

		if(savedOpCount==tree.opCount) tree.draw(actNode, val, 1); // Baum im alten Zustand zeichnen mit wanderndem kreis
		for(i=0; i<actNode.keys.length; i++) if(actNode.keys[i]==val) nVal=false;
		
		if(!nVal){ // bei doppeltem Wert
			var inval1=setInterval(function(){
				if(savedOpCount!=tree.opCount) clearInterval(inval1);
				if(!tree.paused&&tree.hasArrived){
					tree.hasArrived=false;
					if(savedOpCount==tree.opCount) tree.draw(undefined, origVal, 4); 
					clearInterval(inval1);
					if(tree.speed==0) tree.paused=true;
				}
			}, invalTime);

		}else{

			var str1 = "a-" + val.toString();		
			tree.history.push(str1);
			
			if(actNode.keys.length<dOrd){ // im Blatt ist Platz, kein Ueberlauf
				actNode.keys.push(val);
				actNode.keys.sort(function(a, b){return a-b});

				if(actNode==tree.root) tree.draw(undefined, origVal, 1); 
				else{
					var inval1=setInterval(function(){
						if(savedOpCount!=tree.opCount) clearInterval(inval1);
						if(!tree.paused&&tree.hasArrived){
							tree.hasArrived=false;
							if(savedOpCount==tree.opCount) tree.draw(undefined, origVal, 1); 		
							clearInterval(inval1);
						}
					}, invalTime);					
				}
			}else if(actNode.keys.length==dOrd&&actNode==tree.root){ // Baum besteht nur aus Wurzel, Wurzel ist voll

				var rightSibling=new Node(); // rechtes Kind
				var values=actNode.keys;
				values.push(val); // Array "values" enthaelt jetzt die alten und den neuen Wert
				values.sort(function(a, b){return a-b}); // alte Werte und neuen Wert sortieren

				actNode.keys=values; // Aktueller Knoten hat jetzt einen Wert zu viel
				if(savedOpCount==tree.opCount) tree.draw(undefined, origVal, 1); 

				setTimeout(function(){
					var inval1=setInterval(function(){
						if(savedOpCount!=tree.opCount) clearInterval(inval1);
						if(!tree.paused){
							var valuesLeftSibling=[];
							for(i=0; i<=this.order; i++) valuesLeftSibling.push(values[i]); // Werte fuer das linke Kind
							actNode.keys=valuesLeftSibling; // Wurzel erhaelt die Werte fuer den linken Knoten
							var valuesRightSibling=[];
							for(var i=this.order+1; i<=dOrd; i++) valuesRightSibling.push(values[i]);
							rightSibling.keys=valuesRightSibling;
							var newRoot=new Node(); // neue Wurzel
							newRoot.isLeaf=false;
							newRoot.keys.push(values[this.order+1]);
							newRoot.pointers[0]=actNode;
							actNode.parent=newRoot;
							newRoot.pointers[1]=rightSibling;
							rightSibling.parent=newRoot;
							tree.root=newRoot;
							if(savedOpCount==tree.opCount) tree.draw(undefined, origVal, 1);
							clearInterval(inval1);
							if(tree.speed==0) tree.paused=true;
						}
					}, invalTime);
				}, waitTime2);
				
			}else if(actNode.keys.length==dOrd&&actNode.parent!=undefined&&actNode.parent.keys.length<dOrd){
				// Blatt ist voll, Elternknoten hat noch Platz (nur Blatt spalten, Elternknoten nicht)
				var rightSibling=new Node();
				var values=actNode.keys;
				values.push(val); // Array "values" enthaelt jetzt die alten und den neuen Wert
				values.sort(function(a, b){return a-b});

				var inval1=setInterval(function(){

					if(savedOpCount!=tree.opCount) clearInterval(inval1);
					if(!tree.paused&&tree.hasArrived){
						tree.hasArrived=false;
						actNode.keys=values; // Aktueller Knoten hat jetzt einen Wert zu viel
						if(savedOpCount==tree.opCount) tree.draw(undefined, origVal, 1); 
						var valuesLeftSibling=[];
						for(i=0; i<=this.order; i++) valuesLeftSibling.push(values[i]);
						actNode.keys=valuesLeftSibling;	
						var valuesRightSibling=[];
						for(i=this.order+1; i<=dOrd; i++) valuesRightSibling.push(values[i]);
						rightSibling.keys=valuesRightSibling;
						rightSibling.isOrphan=true;
						rightSibling.parent=actNode.parent;
						actNode.rightPointer=rightSibling;
						setTimeout(function(){ 
							var inval2=setInterval(function(){
								if(savedOpCount!=tree.opCount) clearInterval(inval2);
								if(!tree.paused){
									if(savedOpCount==tree.opCount) tree.draw(undefined, origVal, 1);
									rightSibling.isOrphan=false;
									actNode.rightPointer=undefined;
									index=0;
									for(i=0; i<actNode.parent.keys.length; i++){
										if(values[this.order+1]<actNode.parent.keys[i]){
											index=i;
											break;
										}else if(i+1==actNode.parent.keys.length) index=i+1;
									}
									val=values[this.order+1];
									actNode.parent.keys.push(val);
									actNode.parent.keys.sort(function(a, b){return a-b});		
									actNode.parent.pointers.splice(index+1, 0, rightSibling);
									setTimeout(function(){ 
										var inval3=setInterval(function(){

											if(savedOpCount!=tree.opCount) clearInterval(inval3);
											if(!tree.paused){
												if(savedOpCount==tree.opCount) tree.draw(undefined, val, 1); 
												clearInterval(inval3);
												if(tree.speed==0) tree.paused=true;
											}

										}, invalTime);
									}, waitTime2);
									clearInterval(inval2);
									if(tree.speed==0) tree.paused=true;
								}
							}, invalTime);
						}, waitTime2);	
						clearInterval(inval1);
						if(tree.speed==0) tree.paused=true;
					}
				}, invalTime);

			}else if(actNode.keys.length==dOrd&&actNode.parent!=undefined&&actNode.parent.keys.length==dOrd){
							// Blatt voll, Elternknoten auch voll
				var oldLeft=undefined, oldRight=undefined, rightSibling=undefined, left=false, limit=0, i=0;
				var helpValues=[];
				var helpValuesActNode=[];
				helpValues=[];
				helpValuesActNode=[];
				helpValues=actNode.keys;
				helpValues.push(val);
				helpValues.sort(function(a, b){return a-b});

				var inval0=setInterval(function(){

					if(savedOpCount!=tree.opCount) clearInterval(inval0);
					if(!tree.paused&&tree.hasArrived){
	
						tree.hasArrived=false;
						actNode.keys=helpValues; // Aktueller Knoten hat jetzt einen Wert zu viel
						if(savedOpCount==tree.opCount) tree.draw(undefined, origVal, 1); 
						rightSibling=new Node();
						rightSibling.isOrphan=true;
						rightSibling.parent=actNode.parent;
						actNode.rightPointer=rightSibling;
						for(i=this.order+1; i<helpValues.length; i++) rightSibling.keys.push(helpValues[i]);
						for(i=0; i<=this.order; i++) helpValuesActNode.push(helpValues[i]);
						val=rightSibling.keys[0]; // Wert fuer Indexknoten
						actNode.keys=helpValuesActNode; // jetzt sind die Werte in den Blaettern aufgeteilt

						setTimeout(function(){ // jetzt die internen Knoten
							var inval1=setInterval(function(){

								if(savedOpCount!=tree.opCount) clearInterval(inval1);
								if(!tree.paused){
									if(savedOpCount==tree.opCount) tree.draw(undefined, origVal, 1); 
									rightSibling.isOrphan=false;
									actNode.rightPointer=undefined;
					 
									function iteration(){

										oldLeft=actNode;
										oldRight=rightSibling;
										actNode=actNode.parent; //actNode ist jetzt Indexknoten
										helpValues=[];
										helpValuesActNode=[];
										helpValues=actNode.keys;
										helpValues.push(val); 
										helpValues.sort(function(a, b){return a-b});

										actNode.keys=helpValues; // Indexknoten hat jetzt einen Wert zu viel
										for(i=0; i<actNode.pointers.length; i++){
											if(actNode.pointers[i]==oldLeft){
												index=i; // Position des gespaltenen Blattes
												break;
											}
										}		
										actNode.pointers.splice(index+1, 0, oldRight); 

										setTimeout(function(){
											var inval1komma5=setInterval(function(){
												if(savedOpCount!=tree.opCount) clearInterval(inval1komma5);
												if(!tree.paused){
													if(savedOpCount==tree.opCount) tree.draw(undefined, origVal, 1); 
													actNode.pointers.splice(index+1, 1);

													rightSibling=new Node();
													rightSibling.isOrphan=true;
													rightSibling.parent=actNode.parent;
													actNode.rightPointer=rightSibling;
						
													for(i=this.order+1; i<helpValues.length; i++) rightSibling.keys.push(helpValues[i]);
													for(i=0; i<this.order; i++) helpValuesActNode.push(helpValues[i]);

													val=helpValues[this.order];
													rightSibling.isLeaf=false;
													actNode.keys=helpValuesActNode; 
													helpValues=actNode.pointers;
													helpValuesActNode=[];

													if(actNode.pointers[this.order]==oldLeft){
														rightSibling.pointers.push(oldRight);
														for(i=this.order+1; i<actNode.pointers.length; i++){
															rightSibling.pointers.push(actNode.pointers[i]);
															actNode.pointers[i].parent=rightSibling;	
														}
														for(i=0; i<=this.order; i++) helpValuesActNode.push(helpValues[i]);
														actNode.pointers=helpValuesActNode;
														oldRight.parent=rightSibling;

													}else{
														var left=false;
														for(i=0; i<this.order; i++) if(actNode.pointers[i]==oldLeft) left=true; 
														if(left){ // neues Blatt links einhaengen
															for(i=this.order; i<actNode.pointers.length; i++){
																rightSibling.pointers.push(actNode.pointers[i]);
																actNode.pointers[i].parent=rightSibling;
															}
															for(i=0; i<this.order; i++) helpValuesActNode.push(helpValues[i]);
															actNode.pointers=helpValuesActNode;
															index=0;
															for(i=0; i<actNode.pointers.length; i++){
																if(actNode.pointers[i]==oldLeft){
																	index=i; // Position des gespaltenen Blattes
																	break;
																}
															}		
															actNode.pointers.splice(index+1, 0, oldRight); // neues Blatt links einfuegen
															oldRight.parent=actNode;
														}else{
															for(i=this.order+1; i<actNode.pointers.length; i++){
																rightSibling.pointers.push(actNode.pointers[i]);
																actNode.pointers[i].parent=rightSibling;
															}
															for(i=0; i<=this.order; i++) helpValuesActNode.push(helpValues[i]);
															actNode.pointers=helpValuesActNode;		
															index=0;
															for(i=0; i<rightSibling.pointers.length; i++){
																if(rightSibling.pointers[i]==oldLeft){
																	index=i;
																	break;
																}
															}
															rightSibling.pointers.splice(index+1, 0, oldRight);
															oldRight.parent=rightSibling;
														}
													}
													setTimeout(function(){ 
														var inval2=setInterval(function(){
															if(savedOpCount!=tree.opCount) clearInterval(inval2);
															if(!tree.paused){
																if(savedOpCount==tree.opCount) tree.draw(undefined, val, 1);
																rightSibling.isOrphan=false;
																actNode.rightPointer=undefined;
																if(actNode==tree.root){ // Wurzel spalten								
																	var newRoot=new Node();	// neue Wurzel	
																	newRoot.isLeaf=false;
																	newRoot.keys.push(val);
																	newRoot.pointers.push(actNode);
																	newRoot.pointers.push(rightSibling);				
																	actNode.parent=newRoot;
																	rightSibling.parent=newRoot;
																	tree.root=newRoot;
																	setTimeout(function(){ 
																		var inval3=setInterval(function(){
																			if(savedOpCount!=tree.opCount) clearInterval(inval3);
																			if(!tree.paused){
																				if(savedOpCount==tree.opCount) tree.draw(undefined, val, 1); 
																				rightSibling.isOrphan=false;
																				actNode.rightPointer=undefined;
																				clearInterval(inval3);
																				if(tree.speed==0) tree.paused=true;
																			}
																		}, invalTime);
																	}, waitTime2);
																}else if(actNode.parent!=undefined&&actNode.parent.keys.length<dOrd){ 
																	actNode.parent.keys.push(val);
																	actNode.parent.keys.sort(function(a, b){return a-b});
																	index=0;
																	for(i=0; i<actNode.parent.pointers.length; i++){
																		if(actNode.parent.pointers[i]==actNode||i==actNode.parent.pointers.length-1){
																			index=i+1;
																			break;
																		}
																	}
																	actNode.parent.pointers.splice(index,0,rightSibling);
																	rightSibling.parent=actNode.parent;
																	setTimeout(function(){ 
																		var inval4=setInterval(function(){
																			if(savedOpCount!=tree.opCount) clearInterval(inval4);
																			if(!tree.paused){
																				if(savedOpCount==tree.opCount) tree.draw(undefined, val, 1); 
																				rightSibling.isOrphan=false;
																				actNode.rightPointer=undefined;
																				clearInterval(inval4);
																				if(tree.speed==0) tree.paused=true;
																			}
																		}, invalTime);
																	}, waitTime2);
																}else{
																	rightSibling.isOrphan=false;
																	actNode.rightPointer=undefined;
																	iteration();
																}
																clearInterval(inval2);
																if(tree.speed==0) tree.paused=true;
															}
														}, invalTime);
													}, waitTime2);	
													clearInterval(inval1komma5);
													if(tree.speed==0) tree.paused=true;
												}
											}, invalTime);
										}, waitTime2);	
									}
									iteration();
									clearInterval(inval1);
									if(tree.speed==0) tree.paused=true;
								}
							}, invalTime);
						}, waitTime2);	
						clearInterval(inval0);
						if(tree.speed==0) tree.paused=true;
					}
				}, invalTime);
			}
		}	
	}
}




BPlusTree.prototype.addSimple=function(mode) { // Funktion hinzufuegen

	var mo=parseInt(mode), val=0, index=0, i=0, cc=1, origVal, nVal=true, dOrd=this.order*2;
	if(mo==-2){ // -2 bedeutet: Benutzer gibt Wert ein
		val=parseInt(prompt("Choose a value between 0 and 1000"));
		if(isNaN(val)||val<1||val>999) return;	
		tree.remOps=[];
	}else if(mo==-1||mo==-3){ 
		val=Math.floor((Math.random() * 999) + 1); // Zufallszahl generieren
		tree.remOps=[];
	}else val=mo; // wenn der Wert mit dem Parameter uebermittelt wurde

	tree.opCount++;
	var savedOpCount=tree.opCount;
	origVal=val;	
	tree.hasArrived=false;

	if(tree.speed==0){
		tree.paused=true;
		waitTime2=10;
	}else{
		var pauseSymb = $("#p");
		pauseSymb.addClass("p1");
		tree.paused=false;
	}

	if(tree.root==undefined){ // wenn noch keine Wurzel existiert

		var str1 = "a-" + val.toString();		
		tree.history.push(str1);

		var root=new Node();
		root.keys[0]=val; 
		tree.root=root;

	}else{ // Wenn schon eine Wurzel existiert, passendes Blatt finden

		var actNode=tree.root; // Bei der Wurzel beginnen
		while(!actNode.isLeaf){
			index=0;
			if(val>=actNode.keys[0]){
				for(i=0; i<actNode.keys.length; i++){
					if(val>=actNode.keys[i]&&(actNode.keys[i+1]==undefined||val<actNode.keys[i+1])){
						index=i+1;
						break;
					}
				}
			}
			actNode=actNode.pointers[index];
		}
		if(mo==-1||mo==-2) tree.draw(actNode, val, 1); // Baum im alten Zustand zeichnen mit wanderndem kreis
		for(i=0; i<actNode.keys.length; i++){ // Man befindet sich bereits in einem Blatt
			if(actNode.keys[i]==val) nVal=false;
		}


		if(nVal){
			var str1 = "a-" + val.toString();		
			tree.history.push(str1);
			if(actNode.keys.length<dOrd){ // im Blatt ist Platz
				actNode.keys.push(val); // Wert in das Array "keys" einfuegen
				actNode.keys.sort(function(a, b){return a-b}); // Werte im Blatt sortieren
			}else if(actNode.keys.length==dOrd&&actNode==tree.root){ // Baum besteht nur aus Wurzel, Wurzel ist voll

				var rightSibling=new Node(); // rechtes Kind
				var values=actNode.keys;
				values.push(val); // Array "values" enthaelt jetzt die alten und den neuen Wert
				values.sort(function(a, b){return a-b}); // alte Werte und neuen Wert sortieren

				var valuesLeftSibling=[];
				for(i=0; i<=this.order; i++) valuesLeftSibling.push(values[i]); // Werte fuer das linke Kind
				actNode.keys=valuesLeftSibling; // Wurzel erhaelt die Werte fuer den linken Knoten

				var valuesRightSibling=[];
				for(i=this.order+1; i<=dOrd; i++) valuesRightSibling.push(values[i]);
				rightSibling.keys=valuesRightSibling;

				var newRoot=new Node(); // neue Wurzel
				newRoot.isLeaf=false;
				newRoot.keys.push(values[this.order+1]);
				newRoot.pointers[0]=actNode;
				actNode.parent=newRoot;
				newRoot.pointers[1]=rightSibling;
				rightSibling.parent=newRoot;
				tree.root=newRoot;

			}else if(actNode.keys.length==dOrd&&actNode.parent!=undefined&&actNode.parent.keys.length<dOrd){ 
							// Blatt ist voll, Elternknoten hat noch Platz (nur Blatt spalten, Elternknoten nicht)					
				var rightSibling=new Node();
				var values=actNode.keys;
				values.push(val); // Array "values" enthaelt jetzt die alten und den neuen Wert
				values.sort(function(a, b){return a-b});
				var valuesLeftSibling=[];
				for(i=0; i<=this.order; i++) valuesLeftSibling.push(values[i]);
				actNode.keys=valuesLeftSibling;
					
				var valuesRightSibling=[];
				for(i=this.order+1; i<=dOrd; i++) valuesRightSibling.push(values[i]);
				rightSibling.keys=valuesRightSibling;
					
				index=0;
				for(i=0; i<actNode.parent.keys.length; i++){
					if(values[this.order+1]<actNode.parent.keys[i]){
						index=i;
						break;
					}else if(i+1==actNode.parent.keys.length) index=i+1;
				}
				actNode.parent.keys.push(values[this.order+1]);
				actNode.parent.keys.sort(function(a, b){return a-b});		
				actNode.parent.pointers.splice(index+1, 0, rightSibling);
				rightSibling.parent=actNode.parent;

			}else if(actNode.keys.length==dOrd&&actNode.parent!=undefined&&actNode.parent.keys.length==dOrd){
				var oldLeft=undefined, oldRight=undefined, rightSibling=undefined, finished=false, left=false, i=0;
				var helpValues=[], helpValuesActNode=[];
				while(!finished){
					helpValues=[];
					helpValuesActNode=[];
					helpValues=actNode.keys;
					helpValues.push(val);
					helpValues.sort(function(a, b){return a-b});
					rightSibling=new Node();
					for(i=this.order+1; i<helpValues.length; i++) rightSibling.keys.push(helpValues[i]);
					if(!actNode.isLeaf){
						for(i=0; i<this.order; i++) helpValuesActNode.push(helpValues[i]);
						val=helpValues[this.order];
						rightSibling.isLeaf=false;
					}else{
						for(i=0; i<=this.order; i++) helpValuesActNode.push(helpValues[i]);
						val=rightSibling.keys[0];
					}
					actNode.keys=helpValuesActNode;
					if(oldLeft!=undefined){
						helpValues=actNode.pointers;
						helpValuesActNode=[];
						if(actNode.pointers[this.order]==oldLeft){
							rightSibling.pointers.push(oldRight);
							for(i=this.order+1; i<actNode.pointers.length; i++){
								rightSibling.pointers.push(actNode.pointers[i]);
								actNode.pointers[i].parent=rightSibling;	
							}
							for(i=0; i<=this.order; i++) helpValuesActNode.push(helpValues[i]);
							actNode.pointers=helpValuesActNode;
							oldRight.parent=rightSibling;
						}else{
							var left=false;
							for(i=0; i<this.order; i++) if(actNode.pointers[i]==oldLeft) left=true; 
							if(left){ // neues Blatt links einhaengen
								for(i=this.order; i<actNode.pointers.length; i++){
									rightSibling.pointers.push(actNode.pointers[i]);
									actNode.pointers[i].parent=rightSibling;
								}
								for(i=0; i<this.order; i++) helpValuesActNode.push(helpValues[i]);
								actNode.pointers=helpValuesActNode;

								index=0;
								for(i=0; i<actNode.pointers.length; i++){
									if(actNode.pointers[i]==oldLeft){
										index=i; // Position des gespaltenen Blattes
										break;
									}
								}		
								actNode.pointers.splice(index+1, 0, oldRight); // neues Blatt links einfuegen
								oldRight.parent=actNode;
							}else{
								for(i=this.order+1; i<actNode.pointers.length; i++){
									rightSibling.pointers.push(actNode.pointers[i]);
									actNode.pointers[i].parent=rightSibling;
								}
								for(i=0; i<=this.order; i++) helpValuesActNode.push(helpValues[i]);
								actNode.pointers=helpValuesActNode;		
								index=0;
								for(i=0; i<rightSibling.pointers.length; i++){
									if(rightSibling.pointers[i]==oldLeft){
										index=i;
										break;
									}
								}
								rightSibling.pointers.splice(index+1, 0, oldRight);
								oldRight.parent=rightSibling;
							}
						}
					}
					if(actNode==tree.root){ // Wurzel spalten								
						var newRoot=new Node();	// neue Wurzel	
						newRoot.isLeaf=false;
						newRoot.keys.push(val);
						newRoot.pointers.push(actNode);
						newRoot.pointers.push(rightSibling);
						actNode.parent=newRoot;
						rightSibling.parent=newRoot;
						tree.root=newRoot;
						finished=true;
					}else if(actNode.parent!=undefined&&actNode.parent.keys.length<dOrd){
						actNode.parent.keys.push(val);
						actNode.parent.keys.sort(function(a, b){return a-b});
						index=0;
						for(i=0; i<actNode.parent.pointers.length; i++){
							if(actNode.parent.pointers[i]==actNode||i==actNode.parent.pointers.length-1){
								index=i+1;
								break;
							}
						}
						actNode.parent.pointers.splice(index,0,rightSibling);
						rightSibling.parent=actNode.parent;
						finished=true;
					}else{				
						oldLeft=actNode;
						oldRight=rightSibling;
						actNode=actNode.parent;
					}
				}
			}
		}else cc=4;	
	}
	if(mo==-1||mo==-2){
		var inval=setInterval(function(){

			if(savedOpCount!=tree.opCount) clearInterval(inval);
			if(!tree.paused&&tree.hasArrived){
				tree.hasArrived=false;
				if(savedOpCount==tree.opCount) tree.draw(undefined, origVal, cc); // neuen Baum zeichnen 
				clearInterval(inval);
				if(tree.speed==0) tree.paused=true;
			}																		
		}, 200);
	}
}


BPlusTree.prototype.randomTree=function(){ // zufaelligen Baum erstellen
	tree.root=undefined;
	tree.paused=false;
	tree.history=[];	
	tree.remOps=[];
	tree.opCount=0;
	var i;
	for(i=0; i<tree.limit; i++) tree.addSimple(-3);
	tree.draw(undefined, -1, -1);
}

BPlusTree.prototype.draw=function(actNode, val, op){
	tree.view.draw(actNode, val, op);
}


BPlusTree.prototype.setValues=function(nsp, nhd, nvd, ncol){
	tree.speed=nsp;
	tree.hdist=nhd;
	tree.vdist=nvd;
	tree.color=ncol;
	if(tree.speed==0) tree.paused=true;
	else tree.paused=false;
	tree.update();
}


BPlusTree.prototype.remove=function(mode){

	var mo=parseInt(mode), val, i=0, j=0, helpNode, waitTime2=3000, invalTime=200, found=false;
	if(mo==-2){
		val=parseInt(prompt("Choose a value between 0 and 1000"));
		if(isNaN(val)||val<1||val>999) return;
	}else if(mo==-1){ // zufaelligen Wert loeschen
	
		var tmpNodes=[];
		var values=[];
		tmpNodes.push(tree.root);
		while(tmpNodes[i]!=undefined){
			helpNode=tmpNodes[i];
			for(j=0; j<helpNode.pointers.length; j++) tmpNodes.push(helpNode.pointers[j]);
			i++;
		}

		for(i=0; i<tmpNodes.length; i++){
			if(tmpNodes[i].isLeaf){
				helpNode=tmpNodes[i];
				for(j=0; j<helpNode.keys.length; j++) values.push(helpNode.keys[j]);
			}
		}
		var limit=values.length;
		val=values[Math.floor(Math.random() * limit)]; // Zufallszahl generieren
	}

	tree.update();
	tree.hasArrived=false;
	tree.opCount++;
	var savedOpCount=tree.opCount;

	if(tree.speed==0){
		tree.paused=true;
		waitTime2=10;
	}else{
		var pauseSymb = $("#p");
		pauseSymb.addClass("p1");
		tree.paused=false;
	}

	if(tree.root==undefined){ 
		window.alert("Create the tree first!");
		return;	
	}else{
		var index=0, indexVal=0, borVal, parentNode, actNode=tree.root, leftSibling=undefined, rightSibling=undefined;

		while(!actNode.isLeaf){ // zustaendigen Knoten finden

			index=0;
			if(val>=actNode.keys[0]){
				for(i=0; i<actNode.keys.length; i++){
					if(val>=actNode.keys[i] && (actNode.keys[i+1]==undefined || val<actNode.keys[i+1])){
						index=i+1; 
						break;
					}
				}
			}
			actNode=actNode.pointers[index];	
		}
		if(mo<0) tree.draw(actNode, val, 2); 
		for(i=0; i<actNode.keys.length; i++) if(actNode.keys[i]==val) found=true;
		
		if(found){

			var str1 = "r-" + val.toString();		
			tree.history.push(str1);

			if(actNode==tree.root){ // Wenn der Baum nur aus der Wurzel besteht
				for(i=0; i<actNode.keys.length; i++){
					if(actNode.keys[i]==val){
						actNode.keys.splice(i, 1); 
						break;
					}
				}
				if(actNode.keys.length==0) tree.root=undefined; // Wenn die Wurzel jetzt leer ist, wird der Baum geloescht
			}else if(actNode.keys.length > this.order){ // Knoten wird nicht unterlaufen

				parentNode=actNode.parent;
				if(actNode.keys[0]==val){ // wenn der zu loeschende Wert in einem Indexknoten steht
					if(actNode!=parentNode.pointers[0]){ 
						index=1;
						for(i=1; i<parentNode.pointers.length; i++){
							if(parentNode.pointers[i]==actNode){
								index=i;
								break;
							}
						}
						actNode.keys.splice(0, 1);
						parentNode.keys[index-1]=actNode.keys[0];
					}else{
						actNode.keys.splice(0, 1);
						helpNode=parentNode;

						while(helpNode!=undefined){
							for(i=0; i<helpNode.keys.length; i++) if(helpNode.keys[i]==val) helpNode.keys[i]=actNode.keys[0];
							helpNode=helpNode.parent;
						}
					}
				}else{ // Wert steht nicht im Indexknoten
					index=0;
					for(i=0; i<actNode.keys.length; i++){
						if(actNode.keys[i]==val){
							index=i;
							break;
						}
					}
					actNode.keys.splice(index, 1);
				}

				var inval1=setInterval(function(){
					if(savedOpCount!=tree.opCount) clearInterval(inval1);
					if(!tree.paused&&tree.hasArrived){
						tree.hasArrived=false;
						if(savedOpCount==tree.opCount) tree.draw(undefined, val, 2);
						clearInterval(inval1);
						if(tree.speed==0) tree.paused=true;
					}
				}, invalTime);

			}else{ // Knoten wird unterlaufen		

				index=0;
				parentNode=actNode.parent;
				for(i=0; i<parentNode.pointers.length; i++){
					if(parentNode.pointers[i]==actNode){
						index=i;
						break;
					}
				}
				if(index!=0) leftSibling=parentNode.pointers[index-1]; // Geschwister feststellen
				rightSibling=parentNode.pointers[index+1];
				if(index!=0 && leftSibling.keys.length > this.order){ // links ausborgen
					for(i=0; i<actNode.keys.length; i++){
						if(actNode.keys[i]==val){
							indexVal=i;
							break;
						}
					}

					borVal = leftSibling.keys[leftSibling.keys.length-1];
					actNode.keys.splice(indexVal, 1); // Wert entfernen	

					var inval1=setInterval(function(){

						if(savedOpCount!=tree.opCount) clearInterval(inval1);

						if(!tree.paused&&tree.hasArrived){

							tree.hasArrived=false;
							if(savedOpCount==tree.opCount) tree.draw(undefined, val, 2);   
							actNode.keys.unshift(borVal); // geborgten Wert vorne einfuegen
							actNode.keys.join();		
							leftSibling.keys.splice(leftSibling.keys.length-1, 1);	// Geborgten Wert im linken Blatt loeschen
							parentNode.keys[index-1]=actNode.keys[0];

							setTimeout(function(){ 
								var inval2=setInterval(function(){
									if(savedOpCount!=tree.opCount) clearInterval(inval2);
									if(!tree.paused){
										if(savedOpCount==tree.opCount) tree.draw(undefined, borVal, 2);
										clearInterval(inval2);
										if(tree.speed==0) tree.paused=true;
									}
								}, invalTime);
							}, waitTime2);	

							clearInterval(inval1);
							if(tree.speed==0) tree.paused=true;
						}
					}, invalTime);
					

				}else if(index!=parentNode.pointers.length-1 && rightSibling.keys.length > this.order){ // rechts ausborgen

					for(i=0; i<actNode.keys.length; i++){
						if(actNode.keys[i]==val){
							indexVal=i;
							break;
						}
					}
					borVal=rightSibling.keys[0];
					actNode.keys.splice(indexVal,1);

					var inval1=setInterval(function(){

						if(savedOpCount!=tree.opCount) clearInterval(inval1);

						if(!tree.paused&&tree.hasArrived){
							tree.hasArrived=false;

							if(savedOpCount==tree.opCount) tree.draw(undefined, val, 2);   
							actNode.keys.push(borVal);
							rightSibling.keys.splice(0,1);		
							parentNode.keys[index]=rightSibling.keys[0];

							if(index!=0) parentNode.keys[index-1]=actNode.keys[0];
							else{	
								helpNode=parentNode;
								while(helpNode!=undefined){
									for(i=0; i<helpNode.keys.length; i++) if(helpNode.keys[i]==val) helpNode.keys[i]=actNode.keys[0];
									helpNode=helpNode.parent;
								}
							}

							setTimeout(function(){ 
								var inval2=setInterval(function(){
									if(savedOpCount!=tree.opCount) clearInterval(inval2);
									if(!tree.paused){
										if(savedOpCount==tree.opCount) tree.draw(undefined, borVal, 2); // neuen Baum zeichnen 
										clearInterval(inval2);
										if(tree.speed==0) tree.paused=true;
									}
								}, invalTime);

							}, waitTime2);	

							clearInterval(inval1);
							if(tree.speed==0) tree.paused=true;
						}
					}, invalTime);

				}else{ // Wenn weder links noch rechts ausgeborgt werden kann
			
					for(i=0; i<actNode.keys.length; i++){
						if(actNode.keys[i]==val){
							indexVal=i;
							break;
						}
					}
					actNode.keys.splice(indexVal, 1); // Wert im Blatt loeschen
					var inval1=setInterval(function(){
						if(savedOpCount!=tree.opCount) clearInterval(inval1);
						if(!tree.paused&&tree.hasArrived){
							tree.hasArrived=false;
							if(savedOpCount==tree.opCount) tree.draw(undefined, val, 2); // Baum zeichnen mit Wert im Blatt geloescht
								// Werte im geloeschten Blatt neu verteilen, unterlaufenes Blatt loeschen
								if(actNode==parentNode.pointers[0]){ //aktuelles Blatt ist ganz links
									for(i=0; i<parentNode.pointers[1].keys.length;i++) actNode.keys.push(parentNode.pointers[1].keys[i]);
									parentNode.keys.splice(0,1); // Index im Elternknoten loeschen
									parentNode.pointers.splice(1,1); // Zeiger loeschen
									if(indexVal==0){
										helpNode=parentNode;
										while(helpNode!=undefined){
											for(i=0; i<helpNode.keys.length; i++) if(helpNode.keys[i]==val) helpNode.keys[i]=actNode.keys[0];
											helpNode=helpNode.parent;
										}
									}
								}else{ // aktuelles Blatt nicht ganz links
									index=1;
									for(i=1; i<parentNode.pointers.length; i++){
										if(parentNode.pointers[i]==actNode){
											index=i;
											break;
										}
									}
									for(i=0; i<actNode.keys.length; i++) leftSibling.keys.push(actNode.keys[i]); // Werte links hinzufuegen
									parentNode.keys.splice(index-1, 1); // Index des unterlaufenen Blattes loeschen
									parentNode.pointers.splice(index, 1); // Zeiger loeschen
								}
								actNode=parentNode;	
								if(actNode==tree.root && actNode.keys.length==0){ // Wenn die Wurzel jetzt leer ist
									tree.root=actNode.pointers[0];
									actNode=tree.root;
									actNode.parent=undefined;
								}

								function iteration2(){

									parentNode=actNode.parent;
					
									index=0;
									for(i=0; parentNode.pointers.length; i++){
										if(parentNode.pointers[i]==actNode){
											index=i;
											break;
										}
									}

									if(index!=0) leftSibling=parentNode.pointers[index-1];
									rightSibling=parentNode.pointers[index+1];
							
									if(index!=0 && leftSibling.keys.length>this.order){ // Werte links ausborgen

										actNode.keys.unshift(parentNode.keys[index-1]);
										actNode.pointers.unshift(leftSibling.pointers[leftSibling.pointers.length-1]);
										parentNode.keys[index-1]=leftSibling.keys[leftSibling.keys.length-1];		
										leftSibling.keys.splice(leftSibling.keys.length-1, 1); // Wert ganz rechts loeschen
										leftSibling.pointers[leftSibling.pointers.length-1].parent=actNode;
										leftSibling.pointers.splice(leftSibling.pointers.length-1, 1); // Pfeil ganz rechts loeschen
										actNode=parentNode; 

									}else if(index!=parentNode.pointers.length-1 && rightSibling.keys.length>this.order){ // rechts ausborgen
								
										actNode.keys.push(parentNode.keys[index]);
										actNode.pointers.push(rightSibling.pointers[0]);
										rightSibling.pointers[0].parent=actNode;
										parentNode.keys[index]=rightSibling.keys[0];
										rightSibling.keys.splice(0,1);
										rightSibling.pointers.splice(0,1);
										actNode=parentNode; 
									}else{  // Wert kann weder links noch rechts ausgeborgt werden. Achtung: Wurzel kann jetzt leer werden
										if(index==0){
											actNode.keys.push(parentNode.keys[0]);
											parentNode.keys.splice(0,1);
											for(i=0; i<parentNode.pointers[1].pointers.length; i++) parentNode.pointers[1].pointers[i].parent=actNode;
											actNode.keys=actNode.keys.concat(parentNode.pointers[1].keys);
											actNode.pointers=actNode.pointers.concat(parentNode.pointers[1].pointers);
											parentNode.pointers.splice(1,1);

										}else{
											leftSibling.keys.push(parentNode.keys[index-1]); // Wert vom Elternknoten holen
											parentNode.keys.splice(index-1,1); // Wert im Elternknoten loeschen. Kann jetzt unterbesetzt sein
											for(i=0; i<actNode.pointers.length; i++) actNode.pointers[i].parent=leftSibling;
											leftSibling.keys=leftSibling.keys.concat(actNode.keys);
											leftSibling.pointers=leftSibling.pointers.concat(actNode.pointers);
											parentNode.pointers.splice(index, 1);	
										}
						
										actNode=parentNode; // Elternknoten wird aktueller Knoten

										if(actNode==tree.root && actNode.keys.length==0){ // Wenn die Wurzel jetzt leer ist
											tree.root=actNode.pointers[0];
											actNode=tree.root;
											actNode.parent=undefined;
										}
									}

									setTimeout(function(){ 
										var inval2=setInterval(function(){
											if(savedOpCount!=tree.opCount) clearInterval(inval2);
											if(!tree.paused){
												if(savedOpCount==tree.opCount) tree.draw(undefined, undefined, 2); // neuen Baum zeichnen 
												if(actNode.keys.length<this.order && actNode!=tree.root) iteration2();
												clearInterval(inval2);
												if(tree.speed==0) tree.paused=true;
											}
										}, invalTime);

									}, waitTime2);	
								}

								setTimeout(function(){ 
									var inval3=setInterval(function(){
										if(savedOpCount!=tree.opCount) clearInterval(inval3);
										if(!tree.paused){
											if(savedOpCount==tree.opCount) tree.draw(undefined, undefined, 2); // neuen Baum zeichnen 
											if(actNode.keys.length<this.order && actNode!=tree.root) iteration2();
											clearInterval(inval3);
											if(tree.speed==0) tree.paused=true;
										}
									}, invalTime);
								}, waitTime2);	
								clearInterval(inval1);
								if(tree.speed==0) tree.paused=true;
						}
					}, invalTime);
				}
			}
		}
	}
}



BPlusTree.prototype.removeSimple=function(mode){

	var mo=parseInt(mode), val, i=0, j=0, helpNode;
	if(mo==-2){
		val=parseInt(prompt("Choose a value between 0 and 1000"));
		if(isNaN(val)||val<1||val>999) return;
		tree.remOps=[];
	}else if(mo==-1){ // zufaelligen Wert loeschen
			
		var tmpNodes=[];
		var values=[];
		tmpNodes.push(tree.root);
		while(tmpNodes[i]!=undefined){
			helpNode=tmpNodes[i];
			for(j=0; j<helpNode.pointers.length; j++) tmpNodes.push(helpNode.pointers[j]);
			i++;
		}
		for(i=0; i<tmpNodes.length; i++){
			if(tmpNodes[i].isLeaf){
				helpNode=tmpNodes[i];
				for(j=0; j<helpNode.keys.length; j++) values.push(helpNode.keys[j]);
			}
		}
		var limit=values.length;
		val=values[Math.floor(Math.random() * limit)]; // Zufallszahl generieren
		tree.remOps=[];

	}else val=mo;

	tree.opCount++;
	tree.hasArrived=false;
	var savedOpCount=tree.opCount;

	if(tree.speed==0){
		tree.paused=true;
	}else{
		var pauseSymb = $("#p");
		pauseSymb.addClass("p1");
		tree.paused=false;
	}
	
	if(tree.root==undefined){ 
		alert("Create the tree first!");
		return;	
	}else{

		var parentNode, actNode=tree.root, leftSibling=undefined, rightSibling=undefined;
		var index=0, indexVal=0, borVal;

		while(!actNode.isLeaf){ // zustaendigen Knoten finden

			index=0;
			if(val>=actNode.keys[0]){
				for(i=0; i<actNode.keys.length; i++){
					if(val>=actNode.keys[i] && (actNode.keys[i+1]==undefined || val<actNode.keys[i+1])){
						index=i+1; 
						break;
					}
				}
			}
			actNode=actNode.pointers[index];	
		}
		if(mo<0) tree.draw(actNode, val, 2); 
		var found=false;

		for(i=0; i<actNode.keys.length; i++) if(actNode.keys[i]==val) found=true;
		
		if(found){
			var str1 = "r-" + val.toString();		
			tree.history.push(str1);
			if(actNode==tree.root){ // Wenn der Baum nur aus der Wurzel besteht
				for(i=0; i<actNode.keys.length; i++){
					if(actNode.keys[i]==val){
						actNode.keys.splice(i, 1); 
						break;
					}
				}

				if(actNode.keys.length==0) tree.root=undefined; // Wenn die Wurzel jetzt leer ist, wird der Baum geloescht

			}else if(actNode.keys.length > this.order){ // Knoten wird nicht unterlaufen
				parentNode=actNode.parent;
				if(actNode.keys[0]==val){ // wenn der zu loeschende Wert in einem Indexknoten steht
					if(actNode!=parentNode.pointers[0]){ 
						index=1;
						for(i=1; i<parentNode.pointers.length; i++){
							if(parentNode.pointers[i]==actNode){
								index=i;
								break;
							}
						}
						actNode.keys.splice(0, 1);
						parentNode.keys[index-1]=actNode.keys[0];

					}else{
						actNode.keys.splice(0, 1);
						helpNode=parentNode;
						while(helpNode!=undefined){
							for(i=0; i<helpNode.keys.length; i++) if(helpNode.keys[i]==val) helpNode.keys[i]=actNode.keys[0];
							helpNode=helpNode.parent;
						}
					}
				}else{ // Wert steht nicht im Indexknoten

					index=0;
					for(i=0; i<actNode.keys.length; i++){
						if(actNode.keys[i]==val){
							index=i;
							break;
						}
					}
					actNode.keys.splice(index, 1);
				}
			}else{ // Knoten wird unterlaufen
				index=0;
				parentNode=actNode.parent;
				for(i=0; i<parentNode.pointers.length; i++){
					if(parentNode.pointers[i]==actNode){
						index=i;
						break;
					}
				}
				
				if(index!=0) leftSibling=parentNode.pointers[index-1];
				rightSibling=parentNode.pointers[index+1];

				if(index!=0 && leftSibling.keys.length > this.order){ // Links ausborgen

					for(i=0; i<actNode.keys.length; i++){
						if(actNode.keys[i]==val){
							indexVal=i;
							break;
						}
					}

					borVal = leftSibling.keys[leftSibling.keys.length-1];
					actNode.keys.splice(indexVal, 1); // Wert entfernen		
					actNode.keys.unshift(borVal); // geborgten Wert vorne einfuegen
					actNode.keys.join();		
					leftSibling.keys.splice(leftSibling.keys.length-1, 1);	// Geborgten Wert im linken Blatt loeschen
					parentNode.keys[index-1]=actNode.keys[0];
				
				}else if(index!=parentNode.pointers.length-1 && rightSibling.keys.length > this.order){ // rechts ausborgen

					for(i=0; i<actNode.keys.length; i++){
						if(actNode.keys[i]==val){
							indexVal=i;
							break;
						}
					}
					borVal=rightSibling.keys[0];
					actNode.keys.splice(indexVal,1);
					actNode.keys.push(borVal);
					rightSibling.keys.splice(0,1);		
					parentNode.keys[index]=rightSibling.keys[0];
					if(index!=0){
						parentNode.keys[index-1]=actNode.keys[0];
					}else{	
						helpNode=parentNode;
						while(helpNode!=undefined){
							for(i=0; i<helpNode.keys.length; i++) if(helpNode.keys[i]==val) helpNode.keys[i]=actNode.keys[0];
							helpNode=helpNode.parent;
						}
					}
		
				}else{ // Wenn weder links noch rechts ausgeborgt werden kann
			
					for(i=0; i<actNode.keys.length; i++){
						if(actNode.keys[i]==val){
							indexVal=i;
							break;
						}
					}
					actNode.keys.splice(indexVal, 1); // Wert loeschen
						
					if(actNode==parentNode.pointers[0]){ //aktuelles Blatt ist ganz links
							
						for(i=0; i<parentNode.pointers[1].keys.length;i++) actNode.keys.push(parentNode.pointers[1].keys[i]);
						parentNode.keys.splice(0,1); // Index im Elternknoten loeschen
						parentNode.pointers.splice(1,1); // Zeiger loeschen

						if(indexVal==0){
							helpNode=parentNode;
							while(helpNode!=undefined){
								for(i=0; i<helpNode.keys.length; i++) if(helpNode.keys[i]==val) helpNode.keys[i]=actNode.keys[0];
								helpNode=helpNode.parent;
							}
						}

					}else{ // aktuelles Blatt nicht ganz links

						index=1;
						for(i=1; i<parentNode.pointers.length; i++){
							if(parentNode.pointers[i]==actNode){
								index=i;
								break;
							}
						}
						for(i=0; i<actNode.keys.length; i++) leftSibling.keys.push(actNode.keys[i]); // Werte links hinzufuegen
						parentNode.keys.splice(index-1, 1); // Index des unterlaufenen Blattes loeschen
						parentNode.pointers.splice(index, 1); // Zeiger loeschen
					}
					
					actNode=parentNode;	

					if(actNode==tree.root && actNode.keys.length==0){ // Wenn die Wurzel jetzt leer ist
						tree.root=actNode.pointers[0];
						actNode=tree.root;
						actNode.parent=undefined;
					}

					while(actNode.keys.length<this.order && actNode!=tree.root){ // wenn der Indexknoten auch unterlaufen wurde
						
						parentNode=actNode.parent;
					
						index=0;
						for(i=0; parentNode.pointers.length; i++){
							if(parentNode.pointers[i]==actNode){
								index=i;
								break;
							}
						}

						if(index!=0) leftSibling=parentNode.pointers[index-1];
						rightSibling=parentNode.pointers[index+1];
							
						if(index!=0 && leftSibling.keys.length>this.order){ // links probieren

							actNode.keys.unshift(parentNode.keys[index-1]);
							actNode.pointers.unshift(leftSibling.pointers[leftSibling.pointers.length-1]);
							parentNode.keys[index-1]=leftSibling.keys[leftSibling.keys.length-1];		
							leftSibling.keys.splice(leftSibling.keys.length-1, 1); // Wert ganz rechts loeschen
							leftSibling.pointers[leftSibling.pointers.length-1].parent=actNode;
							leftSibling.pointers.splice(leftSibling.pointers.length-1, 1); // Pfeil ganz rechts loeschen
							actNode=parentNode; 

						}else if(index!=parentNode.pointers.length-1 && rightSibling.keys.length>this.order){ // rechts probieren
								
							actNode.keys.push(parentNode.keys[index]);
							actNode.pointers.push(rightSibling.pointers[0]);
							rightSibling.pointers[0].parent=actNode;
							parentNode.keys[index]=rightSibling.keys[0];
							rightSibling.keys.splice(0,1);
							rightSibling.pointers.splice(0,1);
							actNode=parentNode; 

						}else{  // Wert kann weder links noch rechts ausgeborgt werden. Achtung: Wurzel kann jetzt leer werden

							if(index==0){
								actNode.keys.push(parentNode.keys[0]);
								parentNode.keys.splice(0,1);
								for(i=0; i<parentNode.pointers[1].pointers.length; i++) parentNode.pointers[1].pointers[i].parent=actNode;
								actNode.keys=actNode.keys.concat(parentNode.pointers[1].keys);
								actNode.pointers=actNode.pointers.concat(parentNode.pointers[1].pointers);
								parentNode.pointers.splice(1,1);

							}else{
							
								leftSibling.keys.push(parentNode.keys[index-1]); // Wert vom Elternknoten holen
								parentNode.keys.splice(index-1,1); // Wert im Elternknoten loeschen. Kann jetzt unterbesetzt sein
								for(i=0; i<actNode.pointers.length; i++) actNode.pointers[i].parent=leftSibling;
								leftSibling.keys=leftSibling.keys.concat(actNode.keys);
								leftSibling.pointers=leftSibling.pointers.concat(actNode.pointers);
								parentNode.pointers.splice(index, 1);
										
							}
						
							actNode=parentNode; // Elternknoten wird aktueller Knoten
							if(actNode==tree.root && actNode.keys.length==0){ // Wenn die Wurzel jetzt leer ist
								tree.root=actNode.pointers[0];
								actNode=tree.root;
								actNode.parent=undefined;
							}
						}
					}
				}
			}
		}
	}

	if(mo<0){
		var inval=setInterval(function(){
			if(savedOpCount!=tree.opCount) clearInterval(inval);
			if(!tree.paused&&tree.hasArrived){
				tree.hasArrived=false;
				if(savedOpCount==tree.opCount) tree.draw(undefined, val, 2);
				clearInterval(inval);
				if(tree.speed==0) tree.paused=true;
			}																		
		}, 200);
	}
}



BPlusTree.prototype.searchTree=function(mode){

	var mo=parseInt(mode), val, index=0, i=0, j=0;
	if(mo==-2){
		val=parseInt(prompt("Choose a value between 0 and 1000"));
		if(isNaN(val)||val<1||val>999) return;
	}else if(mo==-1){
		var tmpNodes=[], values=[];
		tmpNodes.push(tree.root);
		while(tmpNodes[i]!=undefined){
			helpNode=tmpNodes[i];
			for(j=0; j<helpNode.pointers.length; j++) tmpNodes.push(helpNode.pointers[j]);		
			i++;
		}
		for(i=0; i<tmpNodes.length; i++){
			if(tmpNodes[i].isLeaf){
				helpNode=tmpNodes[i];
				for(j=0; j<helpNode.keys.length; j++)values.push(helpNode.keys[j]);	
			}
		}
		var limit=values.length;
		val=values[Math.floor(Math.random() * limit)]; // Zufallszahl generieren		
	}

	tree.update();
	tree.opCount++;
	var savedOpCount=tree.opCount;

	if(tree.speed==0){
		tree.paused=true;
	}else{
		var pauseSymb = $("#p");
		pauseSymb.addClass("p1");
		tree.paused=false;
	}
	if(tree.root==undefined){
		alert("Create the tree first!");
		return;
	}else{
		var actNode=tree.root; // Bei der Wurzel beginnen
		while(!actNode.isLeaf){
			index=0;
			if(val>=actNode.keys[0]){
				for(i=0; i<actNode.keys.length; i++){
					if(val>=actNode.keys[i]&&(actNode.keys[i+1]==undefined||val<actNode.keys[i+1])){
						index=i+1;
						break;
					}
				}
			}
			actNode=actNode.pointers[index];
		}
		tree.draw(actNode, val, 3); // Baum im alten Zustand zeichnen 
		var inval=setInterval(function(){
			if(savedOpCount!=tree.opCount) clearInterval(inval);
			if(!tree.paused&&tree.hasArrived){
				tree.hasArrived=false;
				if(savedOpCount==tree.opCount) tree.draw(undefined, val, 3);
				clearInterval(inval);
				if(tree.speed==0) tree.paused=true;
			}																	
		}, 200);
	}
}


