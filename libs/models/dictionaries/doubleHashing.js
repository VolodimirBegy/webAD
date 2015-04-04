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

function Row (){
	this.value=undefined;
	this.occupied=false;
	this.color="black";
	this.extraCheck=false;
}

function DoubleHashing(){
	this.view=new HashTableView(this);
	this.rows=[];

	this.fillFactor=0;
	this.overflow=[];
	this.prime=undefined;
	this.db=[];
	this.actStateID=-1;
}

DoubleHashing.prototype.init=function(){
	this.rows=[];
	this.fillFactor=0;
	this.calc=undefined;
	var prime=1;
	this.overflow=[];
	
	while(!isPrime(prime))
		--prime;
	this.prime=prime;
	
	for(var i=0;i<2;i++){
		this.rows.push(new Row());	
	}
	
	this.saveInDB();
	this.draw();
}

DoubleHashing.prototype.copy=function(){
	var newHT=new DoubleHashing();

	for(var i=0;i<this.rows.length;i++){
		var newRow=new Row();
		newRow.value=this.rows[i].value;
		newRow.occupied=this.rows[i].occupied;
		newRow.color=this.rows[i].color;
		newRow.extraCheck=this.rows[i].extraCheck;
		
		newHT.rows.push(newRow);
	}

	newHT.fillFactor=this.fillFactor;
	newHT.calc=undefined;
	newHT.prime=this.prime;
	return newHT;
}

DoubleHashing.prototype.replaceThis=function(ht){
	this.rows=[];

	for(var i=0;i<ht.rows.length;i++){
		var newRow=new Row();
		newRow.value=ht.rows[i].value;
		newRow.occupied=ht.rows[i].occupied;
		newRow.color=ht.rows[i].color;
		newRow.extraCheck=ht.rows[i].extraCheck;
		
		this.rows.push(newRow);
	}

	this.fillFactor=ht.fillFactor;
	this.calc=undefined;
	this.prime=this.prime;
}

DoubleHashing.prototype.prev=function(){
	if(this.actStateID>0){
		var prev_id=this.actStateID-1;
		this.actStateID=prev_id;
		var rs=this.db[prev_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

DoubleHashing.prototype.next=function(){
	if(this.actStateID<this.db.length-1){
		var next_id=this.actStateID+1;
		this.actStateID=next_id;
		var rs=this.db[next_id];
		//make actual node to THIS:
      	this.replaceThis(rs);
      	this.draw();
	}
}

DoubleHashing.prototype.firstState=function(){
	this.actStateID=0;
	var rs=this.db[0];
	//make actual node to THIS:
    this.replaceThis(rs);
    this.draw();
}

DoubleHashing.prototype.lastState=function(){
	var last_id=this.db.length-1;
	this.actStateID=last_id;
	var rs=this.db[last_id];
	//make actual node to THIS:
     this.replaceThis(rs);
     this.draw();
}

DoubleHashing.prototype.saveInDB=function(){
	var count=this.db.length-1;
 	if(count!=this.actStateID){
       	for(var i=this.actStateID+1;i<=count;++i){
           	this.db.splice(this.db.length-1,1);
       	}
 	}

	var nextID=this.db.length;
	
	var new_state = this.copy(this);
	this.db.push(new_state);
	
	this.actStateID=nextID;
}

DoubleHashing.prototype.extend=function(){
	
		var vals=[];
		
		for(var i=0;i<this.rows.length;i++){
			if(this.rows[i].occupied==true)
				vals.push(this.rows[i].value);
		}
		
		var s=this.rows.length+1;
		while(!isPrime(s)){
			++s;
		}
		
		this.calc=undefined;
		this.rows=[];
		
		for(var i=0;i<s;i++){
			this.rows.push(new Row());
		}
		
		var prime=this.rows.length-1;
		while(!isPrime(prime))
			--prime;
		this.prime=prime;
		
		this.fillFactor=0;
		this.overflow=vals;
		this.draw();
		this.add(vals,0);
}

DoubleHashing.prototype.add=function(toAdd,addIndex){
	this.cal=undefined;
	
	var counter=0;
	var prevI;
	//if(count==this.actStateID){
		if(this.rows.length>0){
			
			var newVal=undefined;

			if(toAdd==undefined){
				newVal=parseInt(prompt("Add: \n(values > 1000000000000000000 are ignored)"));
				if(isNaN(newVal) || newVal>1000000000000000000)return;
			}
			else{
				newVal=toAdd[addIndex];
				if(ht.overflow!=undefined && ht.overflow.length>0){
					vals=ht.overflow;
					ht.overflow=[];
					for(var i=1;i<vals.length;i++){
						ht.overflow.push(vals[i]);
					}
				}
			}
			
			this.working=true;
			var index=newVal%this.rows.length;
			var searchingNextFree=false;
			var tmpRow=this.rows[index];

			function addInner(ht){
				setTimeout(function(){
			
					if(!searchingNextFree){
						if(tmpRow.occupied==false){
							if(counter==0){
								ht.calc="a"+counter+" = "+newVal+" mod "+ht.rows.length+" = "+index;
								ht.actCalc=index;
							}
							else{
								ht.calc="a"+counter+" = ("+prevI+" + "+" ( "+ht.prime+" - ( "+newVal+" mod "+ht.prime+" ) ) ) mod "+ht.rows.length+" = "+index;
								ht.actCalc=index;
							}
							tmpRow.value=newVal;
							tmpRow.occupied=true;
							
							var filled=0;
							
							for(var i=0;i<ht.rows.length;i++){
								if(ht.rows[i].occupied)
									filled++;
							}
							
							ht.fillFactor=filled/ht.rows.length;

							ht.draw();
							
							function modify(ht){
								setTimeout(function(){
									if(ht.fillFactor>0.7 && toAdd==undefined){
										ht.extend();
										return;
									}
									
									if(addIndex!=undefined && addIndex<toAdd.length-1){
										ht.add(toAdd,addIndex+1);
										return;
									}
	
								},1000)
							}
							
							if((ht.fillFactor>0.7 && toAdd==undefined) || (addIndex!=undefined && addIndex<toAdd.length-1)){
								modify(ht);
								return;
							}
							
							else{
								//ht.overflow=[];
								ht.draw();
                             	ht.saveInDB();
                             	ht.working=false;
								return;
							}
						}
						else if(tmpRow.occupied==true){
							if(counter==0){
								ht.calc="a"+counter+" = "+newVal+" mod "+ht.rows.length+" = "+index;
								ht.actCalc=index;
								}
							else{
								ht.calc="a"+counter+" = ("+prevI+" + "+" ( "+ht.prime+" - ( "+newVal+" mod "+ht.prime+" ) ) ) mod "+ht.rows.length+" = "+index;
								ht.actCalc=index;
							}
							tmpRow.color="red";
							tmpRow.extraCheck=true;
							searchingNextFree=true;
							ht.draw();
						}
					}
					else{
						if(tmpRow.occupied==false){
							tmpRow.value=newVal;
							tmpRow.occupied=true;
							ht.calc="a"+counter+" = ("+prevI+" + "+" ( "+ht.prime+" - ( "+newVal+" mod "+ht.prime+" ) ) ) mod "+ht.rows.length+" = "+index;
							ht.actCalc=index;
							//set all white
							for(var i=0;i<ht.rows.length;i++){
								ht.rows[i].color="black";
							}
					
							var filled=0;
							
							for(var i=0;i<ht.rows.length;i++){
								if(ht.rows[i].occupied)
									filled++;
							}
							
							ht.fillFactor=filled/ht.rows.length;

							ht.draw();
							
							function modify2(ht){
								setTimeout(function(){
									if(ht.fillFactor>0.7 && toAdd==undefined){
										ht.extend();
										return;
									}
									
									if(addIndex!=undefined && addIndex<toAdd.length-1){
										ht.add(toAdd,addIndex+1);
										return;
									}
	
								},1000)
							}
							if((ht.fillFactor>0.7 && toAdd==undefined) || (addIndex!=undefined && addIndex<toAdd.length-1)){
								modify2(ht);
								return;
							}
							else{
								//ht.overflow=[];
								ht.draw();
                             	ht.saveInDB();
                             	ht.working=false;
								return;
							}
						}
						else{
							ht.calc="a"+counter+" = ("+prevI+" + "+" ( "+ht.prime+" - ( "+newVal+" mod "+ht.prime+" ) ) ) mod "+ht.rows.length+" = "+index;
							ht.actCalc=index;
							tmpRow.color="red";
							tmpRow.extraCheck=true;
							ht.draw();
						}
					}
					prevI=index;
					var actInd=(prevI+(ht.prime-(newVal%ht.prime)))%ht.rows.length;
					var _i=0;
					tmpRow=ht.rows[actInd];

					index=actInd;
					counter++;
					addInner(ht);
				},1000)
			}
			
			addInner(this);
		}
		else if(this.rows.length==0){
			window.alert("No table created");
			this.working=false;
			return;
		}
		
}

DoubleHashing.prototype.search=function(){
	
	//var count=this.db().count();
	var counter=0;
	var prevI;
	//if(count==this.actStateID){
		if(this.rows.length>0){

			var newVal=parseInt(prompt("Search:"));
			if(isNaN(newVal))return;
			
			this.working=true;
			var index=newVal%this.rows.length;
			var searchingNextFree=false;

			var tmpRow=this.rows[index];
			
			function search(ht){
				setTimeout(function(){
			
					if(!searchingNextFree){
						if(tmpRow.value==newVal||!tmpRow.extraCheck){
							if(counter==0){
								ht.calc="a"+counter+" = "+newVal+" mod "+ht.rows.length+" = "+index;
								ht.actCalc=index;
							}
							else{
								ht.calc="a"+counter+" = ("+prevI+" + "+" ( "+ht.prime+" - ( "+newVal+" mod "+ht.prime+" ) ) ) mod "+ht.rows.length+" = "+index;
								ht.actCalc=index;
							}
							tmpRow.color="red";
							ht.draw();
							ht.calc=undefined;
							if(tmpRow.value==newVal){
								window.alert("Found");
							}
							else
								window.alert("Not found");
							
							ht.working=false;
							return;
							
						}
						else if((tmpRow.occupied==true && tmpRow.value!=newVal)||(tmpRow.extraCheck)){
							if(counter==0){
								ht.calc="a"+counter+" = "+newVal+" mod "+ht.rows.length+" = "+index;
								ht.actCalc=index;
								}
							else{
								ht.calc="a"+counter+" = ("+prevI+" + "+" ( "+ht.prime+" - ( "+newVal+" mod "+ht.prime+" ) ) ) mod "+ht.rows.length+" = "+index;
								ht.actCalc=index;
							}
							tmpRow.color="red";
							searchingNextFree=true;
							ht.draw();
						}
					}
					else{
						if((tmpRow.occupied==true && tmpRow.value==newVal)||(!tmpRow.extraCheck && tmpRow.value!=newVal)){
							
							ht.calc="a"+counter+" = ("+prevI+" + "+" ( "+ht.prime+" - ( "+newVal+" mod "+ht.prime+" ) ) ) mod "+ht.rows.length+" = "+index;
							ht.actCalc=index;
							tmpRow.color="red";
							ht.draw();
							ht.calc=undefined;
							if(tmpRow.value==newVal){
								window.alert("Found");
							}
							else
								window.alert("Not found");

							ht.working=false;
							return;
		
						}
						else{
							ht.calc="a"+counter+" = ("+prevI+" + "+" ( "+ht.prime+" - ( "+newVal+" mod "+ht.prime+" ) ) ) mod "+ht.rows.length+" = "+index;
							ht.actCalc=index;
							tmpRow.color="red";
							ht.draw();
						}
					}
					if(counter==ht.rows.length-1){
						ht.draw();
						ht.calc=undefined;
						if(tmpRow.value==newVal){
							window.alert("Found");
						}
						else
							window.alert("Not found");
						ht.working=false;
						return;
					}	
					prevI=index;
					index=(prevI+(ht.prime-(newVal%ht.prime)))%ht.rows.length;
					
					tmpRow=ht.rows[index];

					counter++;
					search(ht);
				},1000)
			}
			
			search(this);
		}
		else if(this.rows.length==0){
			window.alert("No table created");
			this.working=false;
		}
		
}

function isPrime(n){
	
    if (n%2==0) return false;
    //if not, then just check the odds
    for(var i=3;i*i<=n;i+=2) {
        if(n%i==0)
            return false;
    }
    return true;
}

DoubleHashing.prototype.remove=function(){
	//var count=this.db().count();
	var counter=0;
	var prevI;
	//if(count==this.actStateID){
		if(this.rows.length>0){
			var remVal=parseInt(prompt("Remove:"));
			if(isNaN(remVal))return;

					this.working=true;
					var index=remVal%this.rows.length;
					var searchingNextFree=false;

					var tmpRow=this.rows[index];
					function remove(ht){
						setTimeout(function(){

							if(!searchingNextFree){
								if(tmpRow.value==remVal){
									if(counter==0){
										ht.calc="a"+counter+" = "+remVal+" mod "+ht.rows.length+" = "+index;
										ht.actCalc=index;
									}
									else{
										ht.calc="a"+counter+" = ("+prevI+" + "+" ( "+ht.prime+" - ( "+remVal+" mod "+ht.prime+" ) ) ) mod "+ht.rows.length+" = "+index;
										ht.actCalc=index;
									}
									tmpRow.value=undefined;
									tmpRow.extraCheck=true;
									tmpRow.occupied=false;
									ht.draw();
									ht.calc=undefined;
									
									ht.saveInDB();
									ht.working=false;
									return;
								}
								else if((tmpRow.occupied==true && tmpRow.value!=remVal)||(tmpRow.occupied==false && tmpRow.extraCheck)){
									if(counter==0){
										ht.calc="a"+counter+" = "+remVal+" mod "+ht.rows.length+" = "+index;
										ht.actCalc=index;
									}
									else{
										ht.calc="a"+counter+" = ("+prevI+" + "+" ( "+ht.prime+" - ( "+remVal+" mod "+ht.prime+" ) ) ) mod "+ht.rows.length+" = "+index;
										ht.actCalc=index;
									}
									tmpRow.color="red";
									searchingNextFree=true;
									ht.draw();
								}
								else if(tmpRow.occupied==false && tmpRow.extraCheck==false){
									if(counter==0){
										ht.calc="a"+counter+" = "+remVal+" mod "+ht.rows.length+" = "+index;
										ht.actCalc=index;
										}
									else{
										ht.calc="a"+counter+" = ("+prevI+" + "+" ( "+ht.prime+" - ( "+remVal+" mod "+ht.prime+" ) ) ) mod "+ht.rows.length+" = "+index;
										ht.actCalc=index;
									}
									tmpRow.color="red";
									//tmpRow.calc=undefined;
									ht.draw();
									ht.calc=undefined;
									window.alert("Value not found!");
									ht.working=false;
									return;
								}
		
							}
							else{
								if(tmpRow.occupied==true && tmpRow.value==remVal){
									tmpRow.value=undefined;
									tmpRow.occupied=false;
									tmpRow.extraCheck=true;
									ht.calc="a"+counter+" = ("+prevI+" + "+" ( "+ht.prime+" - ( "+remVal+" mod "+ht.prime+" ) ) ) mod "+ht.rows.length+" = "+index;
									ht.actCalc=index;
									//set all white
									for(var i=0;i<ht.rows.length;i++){
										ht.rows[i].color="black";
									}
							
									ht.draw();	
									ht.calc=undefined;
									
									ht.saveInDB();
									ht.working=false;
									return;
				
								}
								else if(tmpRow.extraCheck==true){
									ht.calc="a"+counter+" = ("+prevI+" + "+" ( "+ht.prime+" - ( "+remVal+" mod "+ht.prime+" ) ) ) mod "+ht.rows.length+" = "+index;
									ht.actCalc=index;
									tmpRow.color="red";
									ht.draw();
								}
								else if((tmpRow.occupied==false && tmpRow.extraCheck==false)||(tmpRow.occupied==true&&tmpRow.extraCheck==false&&tmpRow.value!=remVal)){
									ht.calc="a"+counter+" = ("+prevI+" + "+" ( "+ht.prime+" - ( "+remVal+" mod "+ht.prime+" ) ) ) mod "+ht.rows.length+" = "+index;
									ht.actCalc=index;
									
									tmpRow.color="red";
									tmpRow.calc=undefined;
									ht.draw();
									ht.calc=undefined;
									window.alert("Value not found!");
									ht.working=false;
									return;
								}
							}
							if(counter==ht.rows.length-1){
								window.alert("Value not found!");
								//ht.calc=undefined;
								ht.draw();
								ht.calc=undefined;
								ht.working=false;
								return;
							}	
							prevI=index;
							index=(prevI+(ht.prime-(remVal%ht.prime)))%ht.rows.length;
							tmpRow=ht.rows[index];
							counter++;
							remove(ht);
						},1000)
					}
					
					remove(this);

		}
		else{
			window.alert("Table not created!");
			this.working=false;
		}
	//}
}

DoubleHashing.prototype.draw=function(){
	this.view.draw();
}