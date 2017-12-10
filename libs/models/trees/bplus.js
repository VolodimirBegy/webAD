


function Node(){ // Knoten
	this.color="#FFFF99"; // blassgelb
	this.keys=[]; 
	this.pointers=[];
	this.isLeaf=true; 
	this.parent=undefined; 
}

function BPlusTree(ord, spe, lim, cont){
	this.view=new BPlusTreeView(this, cont);
	this.root=undefined;
	this.order=ord;
	this.speed=spe;
	this.limit=lim;
	this.history=[];
	this.remValues=undefined;
}



BPlusTree.prototype.prev=function(){

	/*var limit=this.history.length-1;
	this.remValues=this.history[limit];
	var help=this.history;
	this.oldHistory=this.history;

	this.history=[];
	this.root=undefined;

	for(var i=0; i<limit; i++) this.add(help[i]);*/
}

BPlusTree.prototype.next=function(){

	this.add(this.remValues);

}

BPlusTree.prototype.firstState=function(){

}

BPlusTree.prototype.lastState=function(){

}


BPlusTree.prototype.add=function(mode) { // Funktion hinzufuegen


	var mo=parseInt(mode);
	var val=0, index=0, i=0, height=0, rollTime=this.speed*1000, cc=1;
	var nVal=true;

	if(mo==-2){
		val=parseInt(prompt("Add a value between 0 and 1000"));
		if(isNaN(val)||val<1||val>999) return;
	}else if(mo==-1){
		val=Math.floor((Math.random() * 999) + 1); // Zufallszahl generieren
	}else{
		val=mo;
	}

	

	if(this.order<1){
		window.alert("Create the tree first!");
		return;
	}

	if(this.root==undefined){ // wenn noch keine Wurzel existiert

		var str1 = "a-";
		var str2= val.toString();		
		var str3 = str1.concat(str2);
		this.history.push(str3);

		var root=new Node();
		root.keys[0]=val; 
		this.root=root;

	}else{ // Wenn schon eine Wurzel existiert, passendes Blatt finden

		var actNode=this.root; // Bei der Wurzel beginnen
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
			height++;
		}

		//jetzt muesste der aktuelle Knoten ein Blatt sein	
			
		this.draw(actNode, val, 1); // Baum im alten Zustand zeichnen (ohne den neuen Wert im Blatt)

		for(i=0; i<actNode.keys.length; i++){ // Man befindet sich bereits in einem Blatt
			if(actNode.keys[i]==val){ // Wenn der Wert schon im Blatt sitzt
				nVal=false;
			}
		}

		if(nVal){

			var str1 = "a-"; // nur neue Werte werden gespeichert
			var str2= val.toString();		
			var str3 = str1.concat(str2);
			this.history.push(str3);


			if(actNode.keys.length<this.order*2){ // im Blatt ist Platz

				actNode.keys.push(val); // Wert in das Array "keys" einfuegen
				actNode.keys.sort(function(a, b){return a-b}); // Werte im Blatt sortieren

			}else if(actNode.keys.length==this.order*2 && actNode==this.root){ // Baum besteht nur aus Wurzel, Wurzel ist voll

				var rightSibling=new Node(); // rechtes Kind
				var values=actNode.keys;
				values.push(val); // Array "values" enthaelt jetzt die alten und den neuen Wert
				values.sort(function(a, b){return a-b}); // alte Werte und neuen Wert sortieren

				var valuesLeftSibling=[];
				for(i=0; i<=this.order; i++) valuesLeftSibling.push(values[i]); // Werte fuer das linke Kind
				actNode.keys=valuesLeftSibling; // Wurzel erhaelt die Werte fuer den linken Knoten

				var valuesRightSibling=[];
				for(var i=this.order+1; i<=this.order*2; i++) valuesRightSibling.push(values[i]);
				rightSibling.keys=valuesRightSibling;

				var newRoot=new Node(); // neue Wurzel
				newRoot.isLeaf=false;
				newRoot.keys.push(values[this.order+1]);
				newRoot.pointers[0]=actNode;
				actNode.parent=newRoot;
				newRoot.pointers[1]=rightSibling;
				rightSibling.parent=newRoot;
				this.root=newRoot;

			}else if(actNode.keys.length==this.order*2&&actNode.parent!=undefined&&actNode.parent.keys.length<this.order*2){ // Blatt voll
							// Blatt ist voll, Elternknoten hat noch Platz (nur Blatt spalten, Elternknoten nicht)					
				var rightSibling=new Node();
				var values=actNode.keys;
				values.push(val); // Array "values" enthaelt jetzt die alten und den neuen Wert
				values.sort(function(a, b){return a-b});
				var valuesLeftSibling=[];
				for(i=0; i<=this.order; i++) valuesLeftSibling.push(values[i]);
				actNode.keys=valuesLeftSibling;
					
				var valuesRightSibling=[];
				for(var i=this.order+1; i<=this.order*2; i++) valuesRightSibling.push(values[i]);
				rightSibling.keys=valuesRightSibling;
					
				var index=0;
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

			}else if(actNode.keys.length==this.order*2&&actNode.parent!=undefined&&actNode.parent.keys.length==this.order*2){
							// Blatt voll, Elternknoten auch voll
				var finished=false;
				var oldLeft=undefined;
				var oldRight=undefined;
				var rightSibling=undefined;
				var helpValues=[];
				var helpValuesActNode=[];
				var left=false;
				var limit=0;
				var i=0;

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

								var index=0;
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

								var index=0;
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

					if(actNode==this.root){ // Wurzel spalten								
						var newRoot=new Node();	// neue Wurzel	
						newRoot.isLeaf=false;
						newRoot.keys.push(val);
						newRoot.pointers.push(actNode);
						newRoot.pointers.push(rightSibling);
											
						actNode.parent=newRoot;
						rightSibling.parent=newRoot;
								
						this.root=newRoot;
						finished=true;

					}else if(actNode.parent!=undefined&&actNode.parent.keys.length<this.order*2){

						actNode.parent.keys.push(val);
						actNode.parent.keys.sort(function(a, b){return a-b});
								
						var index=0;
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

	actNode=undefined; 
	setTimeout(function(){ 
		tree.draw(actNode, val, cc); // jetzt den neuen Baum zeichnen mit neuem Wert an der richtigen Stelle  
	}, rollTime*height + 1000);


}



BPlusTree.prototype.randomTree=function(){ // zufaelligen Baum erstellen
	this.root=undefined;
	this.history=[];	
	for(var i=0; i<this.limit; i++) this.add(-1);
}

BPlusTree.prototype.draw=function(actNode, val, op){
	this.view.draw(actNode, val, op);
}


BPlusTree.prototype.remove=function(mode){
	
	if(this.order<0){
		window.alert("Create the tree first!");return;
	}

	if(this.root==undefined){
		return;
	}else{

		var mo=parseInt(mode);
		var val=0;
		var parentNode;
		var index=0, indexVal=0, i=0, j=0, borVal, height=0, rollTime=this.speed*1000 + 1000;
		var actNode=this.root;
		var helpNode=undefined;
		var leftSibling=undefined;
		var rightSibling=undefined;

		if(mo==-2){
			val=parseInt(prompt("Add a value between 0 and 1000"));
			if(isNaN(val)||val<1||val>999) return;


		}else if(mo==-1){ // zufaelligen Wert loeschen

			var tmpNodes=[];
			var values=[];
			tmpNodes.push(this.root);
			while(tmpNodes[i]!=undefined){
				helpNode=tmpNodes[i];
				for(j=0; j<helpNode.pointers.length; j++){ 	
					tmpNodes.push(helpNode.pointers[j]);
				}		
				i++;
			}

			for(i=0; i<tmpNodes.length; i++){
				if(tmpNodes[i].isLeaf){
					helpNode=tmpNodes[i];
					for(j=0; j<helpNode.keys.length; j++){
						values.push(helpNode.keys[j]);
					}
				}
			}

			var limit=values.length;
			val=values[Math.floor(Math.random() * limit)]; // Zufallszahl generieren

		}else{
			val=mo;
		}

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
			height++;		

		}


		this.draw(actNode, val, 2); 


		var found=false;

		for(i=0; i<actNode.keys.length; i++){
			if(actNode.keys[i]==val) found=true;
		}
				
			
		if(found){


		var str1 = "r-";
		var str2= val.toString();		
		var str3 = str1.concat(str2);

		this.history.push(str3);


		if(actNode==this.root){ // Wenn der Baum nur aus der Wurzel besteht

			for(i=0; i<actNode.keys.length; i++){
				if(actNode.keys[i]==val){
					actNode.keys.splice(i, 1); 
					break;
				}
			}

			if(actNode.keys.length==0) this.root=undefined; // Wenn die Wurzel jetzt leer ist, wird der Baum geloescht


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
					//actNode=leftSibling;
				}
					
				actNode=parentNode;	
				// parentNode=actNode.parent;

				if(actNode==this.root && actNode.keys.length==0){ // Wenn die Wurzel jetzt leer ist
					this.root=actNode.pointers[0];
					actNode=this.root;
					actNode.parent=undefined;
				}

				while(actNode.keys.length<this.order && actNode!=this.root){ // wenn der Indexknoten auch unterlaufen wurde
						
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
						if(actNode==this.root && actNode.keys.length==0){ // Wenn die Wurzel jetzt leer ist
							this.root=actNode.pointers[0];
							actNode=this.root;
							actNode.parent=undefined;
						}
					}
				}
			}
		}

		}


	}

	actNode=undefined; 
	setTimeout(function(){ 
		tree.draw(actNode, val, 2); // jetzt den neuen Baum zeichnen mit neuem Wert an der richtigen Stelle  
	}, rollTime*height);

}

BPlusTree.prototype.searchTree=function(mode){

	if(this.order<0){
		window.alert("Create the tree first!");
		return;
	}
	if(this.root==undefined){
		return;
	}else{

		var mo=parseInt(mode);
		var val=0, index=0, i=0, j=0, height=0, rollTime=6000;
		var found=false;

		if(mo==-2){
			val=parseInt(prompt("Add a value between 0 and 1000"));
			if(isNaN(val)||val<1||val>999) return;
		}else if(mo==-1){
 
			var tmpNodes=[];
			var values=[];
			tmpNodes.push(this.root);

			while(tmpNodes[i]!=undefined){
				helpNode=tmpNodes[i];
				for(j=0; j<helpNode.pointers.length; j++){ 	
					tmpNodes.push(helpNode.pointers[j]);
				}		
				i++;
			}

			for(i=0; i<tmpNodes.length; i++){
				if(tmpNodes[i].isLeaf){
					helpNode=tmpNodes[i];
					for(j=0; j<helpNode.keys.length; j++){
						values.push(helpNode.keys[j]);
					}
				}
			}

			var limit=values.length;
			val=values[Math.floor(Math.random() * limit)]; // Zufallszahl generieren

		}


	
		var actNode=this.root; // Bei der Wurzel beginnen
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
			height++;
		}

		//jetzt muesste der aktuelle Knoten ein Blatt sein				

		this.draw(actNode, val, 3); // Baum im alten Zustand zeichnen 

		for(i=0; i<actNode.keys.length; i++){ // Man befindet sich bereits in einem Blatt
			if(actNode.keys[i]==val){ // Wenn der Wert schon im Blatt sitzt
				found=true;
			}
		}

		actNode=undefined; 
		setTimeout(function(){ 
			this.draw(actNode, val, 3);   
		}, rollTime*height + 1000);


	}

}


