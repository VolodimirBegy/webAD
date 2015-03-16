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
	this.values=[];
	this.overflow=undefined;
	this.index=undefined;
	
	this.color="black";
}

function LinearHashing(){
	this.view=new HashTableView(this);
	this.rows=[];

	this.b=undefined;
	this.d=undefined;
	this.nts=0;

	this.db=TAFFY();
	this.actStateID=0;
}

LinearHashing.prototype.init=function(c1){

	var b=parseInt(prompt("Bucket size:"));
	var d=parseInt(prompt("D:"));
	
	if(isNaN(b)||isNaN(d))return;
	this.d=d;
	this.b=b;
	
	this.rows=[];
	this.nts=0;
	
	for(var i=0;i<Math.pow(2,this.d);i++){
		var newRow=new Row();
		newRow.index=decbin(i,this.d);
		this.rows.push(newRow);
	}
	
	this.saveInDB();
	
	this.draw(c1);
}

LinearHashing.prototype.copy=function(){
	var newT = new LinearHashing();
	
	for(var i=0;i<this.rows.length;i++){
		var newRow=new Row();
		//copy values
		for(var j=0;j<this.rows[i].values.length;j++){
			newRow.values.push(this.rows[i].values[j]);
		}
		
		//copy overflows
		var actRow=newRow;
		var actRowCopy=this.rows[i];
		
		while(actRowCopy.overflow!=undefined){
			var newOverflow=new Row();
			
			for(var j=0;j<actRowCopy.overflow.values.length;j++){
				newOverflow.values.push(actRowCopy.overflow.values[j]);
			}

			newOverflow.color=actRowCopy.overflow.color;
			
			actRow.overflow=newOverflow;
			
			actRowCopy=actRowCopy.overflow;
			actRow=actRow.overflow;
		}
		
		newRow.color=this.rows[i].color;
		newRow.index=this.rows[i].index;
		newT.rows.push(newRow);
	}
	
	newT.b=this.b;
	newT.d=this.d;
	newT.nts=this.nts;
	
	return newT;
}

LinearHashing.prototype.replaceThis=function(ht){
	this.rows=[];
	
	for(var i=0;i<ht.rows.length;i++){
		var newRow=new Row();
		//copy values
		for(var j=0;j<ht.rows[i].values.length;j++){
			newRow.values.push(ht.rows[i].values[j]);
		}
		//copy overflows
		var actRow=newRow;
		var actRowCopy=ht.rows[i];
		
		while(actRowCopy.overflow!=undefined){
			var newOverflow=new Row();
			
			for(var j=0;j<actRowCopy.overflow.values.length;j++){
				newOverflow.values.push(actRowCopy.overflow.values[j]);
			}
			
			newOverflow.color=actRowCopy.overflow.color;
			
			actRow.overflow=newOverflow;
			
			actRowCopy=actRowCopy.overflow;
			actRow=actRow.overflow;
		}
		
		newRow.color=ht.rows[i].color;
		newRow.index=ht.rows[i].index;
		this.rows.push(newRow);
	}
	
	this.newBlockVals=[];
	this.manipulatedIndex=undefined;	
	
	this.b=ht.b;
	this.d=ht.d;
	this.nts=ht.nts;
}

LinearHashing.prototype.prev=function(con){
	if(this.actStateID>1){
		var tmp_db=this.db;
		var prev_id=this.actStateID-1;
		this.actStateID=prev_id;
		var rs=tmp_db({id:prev_id}).select("state");
		this.replaceThis(rs[0]);
		this.draw(con);
	}
}

LinearHashing.prototype.next=function(con){
	if(this.actStateID<this.db().count()){
		var tmp_db=this.db;
		var next_id=this.actStateID+1;
		this.actStateID=next_id;
		var rs=tmp_db({id:next_id}).select("state");
		this.replaceThis(rs[0]);
		this.draw(con);
	}
}

LinearHashing.prototype.firstState=function(con){
	var tmp_db=this.db;
	this.actStateID=1;
	var rs=tmp_db({id:1}).select("state");
	this.replaceThis(rs[0]);
	this.draw(con);
}

LinearHashing.prototype.lastState=function(con){
	var tmp_db=this.db;
	var last_id=tmp_db().count();
	this.actStateID=last_id;
	var rs=tmp_db({id:last_id}).select("state");
	this.replaceThis(rs[0]);
	this.draw(con);
}

LinearHashing.prototype.saveInDB=function(){
	var count=this.db().count();
 	if(count!=this.actStateID){
       	for(var i=this.actStateID+1;i<=count;++i){
           	this.db({id:i}).remove();
       	}
 	}
	
	var tmp_db=this.db;

	count=tmp_db().count();
	var nextID=count+1;
	
	var new_state = this.copy(this);
	tmp_db.insert({id: nextID,state:new_state});
	
	this.db=tmp_db;
	this.actStateID=nextID;
}

function decbin(dec,length){
	var out = "";
	while(length--)
		out += (dec >> length ) & 1;    
	return out;  
}

LinearHashing.prototype.add=function(cont){
	if(this.rows.length>0){
		var newVal=parseInt(prompt("Add:\n (values > 99999 are ignored)"));
		if(isNaN(newVal)||newVal>99999)return;
		this.working=true;
		this.manipulationInProgress=false;
		this.newBlockVals=[];
		this.newBlockBins=[];
		var a_bin=decbin(newVal,this.d);
		var a_dec=parseInt(a_bin,2);
		
		if(a_dec<this.nts){
			a_bin=decbin(newVal,this.d+1);
			a_dec=parseInt(a_bin,2);
		}
		
		if(this.rows[a_dec].values.length<this.b){
			this.rows[a_dec].values.push(newVal);
			this.manipulatedIndex=a_bin;
			this.manipulated=newVal;
			this.manipulatedBin=parseInt(newVal, 10).toString(2);
			if(a_dec<this.nts){
				if(this.manipulatedBin.length<this.d+1){
					this.manipulatedBin=decbin(newVal,this.d+1);
				}
			}
			else{
				if(this.manipulatedBin.length<this.d)
					this.manipulatedBin=decbin(newVal,this.d);
			}
			
			this.working=false;
			
        	this.saveInDB();
        	
        	this.draw(cont);
        	this.newBlockVals=[];
    		this.newBlockBins=[];
			return;
		}
		else{
			//get last overflow to save value
			
			//leave only for drawing
			var actRow=this.rows[a_dec];
			while(actRow.overflow!=undefined){
				actRow=actRow.overflow;
			}
			var split=false;
			
			if(actRow.values.length<this.b){
				actRow.values.push(newVal);
				this.manipulatedIndex=a_bin;
				this.manipulated=newVal;
				this.manipulatedBin=parseInt(newVal, 10).toString(2);
				if(a_dec<this.nts){
					if(this.manipulatedBin.length<this.d+1){
						this.manipulatedBin=decbin(newVal,this.d+1);
					}
				}
				else{
					if(this.manipulatedBin.length<this.d)
						this.manipulatedBin=decbin(newVal,this.d);
				}
				
				this.working=false;
	        	this.saveInDB();
	        	
	        	this.draw(cont);
	        	this.newBlockVals=[];
	    		this.newBlockBins=[];
				return;
			}
			else{
				var newOverflow=new Row();
				newOverflow.values.push(newVal);
				actRow.overflow=newOverflow;
				//window.alert(actRow.overflow.values);
				split=true;
			}
			//leave only for drawing
		
			//split
			if(split){
				//show where value wants to fit inn
				this.manipulatedIndex=a_bin;
				this.manipulated=newVal;
				this.manipulatedBin=parseInt(newVal, 10).toString(2);
				if(a_dec<this.nts){
					if(this.manipulatedBin.length<this.d+1){
						this.manipulatedBin=decbin(newVal,this.d+1);
					}
				}
				else{
					if(this.manipulatedBin.length<this.d)
						this.manipulatedBin=decbin(newVal,this.d);
				}
				this.draw(cont);
				//delay
				function to_split(ht){
					setTimeout(function (){
				
						//add new Row at the end && update vars
						actRow=ht.rows[ht.nts];
						var newRow=new Row();
						newRow.index="1"+actRow.index;
						ht.rows.push(newRow);
						
						//get all values from act row+overflows
		
						var vals=[];
						while(actRow!=undefined){
							for(var i=0;i<actRow.values.length;i++){
								vals.push(actRow.values[i]);
							}
							actRow=actRow.overflow;
						}
						
						//delete all values overflows of act row
						actRow=ht.rows[ht.nts];
						actRow.values=[];
						actRow.overflow=undefined;
						actRow.index="0"+actRow.index;
						
						ht.nts++;
						if(ht.nts==Math.pow(2,ht.d)){ht.d++;ht.nts=0;}
						//redistribute
						for(var i=0;i<vals.length;i++){
							a_bin=decbin(vals[i],ht.d);
							a_dec=parseInt(a_bin,2);
							
							if(a_dec<ht.nts){
								a_bin=decbin(vals[i],ht.d+1);
								a_dec=parseInt(a_bin,2);
							}
							
							actRow=ht.rows[a_dec];
							while(actRow.overflow!=undefined){
								actRow=actRow.overflow;
							}
							
							if(actRow.values.length<ht.b){
								if(a_dec==ht.rows.length-1){
									var found=false;
									for(var k=0;k<ht.newBlockVals.length;k++){
										if(ht.newBlockVals[k]==vals[i]){
											found=true;break;
										}
									}
									if(!found){
										ht.newBlockVals.push(vals[i]);
										ht.newBlockBins.push(parseInt(vals[i], 10).toString(2));
									}
								}
								
								actRow.values.push(vals[i]);
							}
							else{
								var newOverflow=new Row();
								newOverflow.values.push(vals[i]);
								actRow.overflow=newOverflow;
							}
						}
						
						
						ht.working=false;						
			        	ht.saveInDB();
						
			        	ht.draw(cont);
			        	ht.newBlockVals=[];
			    		ht.newBlockBins=[];
						return;
					},1000)
				}
				to_split(this);
			}
			//finished
		}	
	}
	else{
		window.alert("Table not created!");
	}
}

LinearHashing.prototype.remove=function(cont){
	if(this.rows.length>0){
		var remVal=parseInt(prompt("Remove:"));
		if(isNaN(remVal))return;
		
		this.working=true;
		var a_bin=decbin(remVal,this.d);
		var a_dec=parseInt(a_bin,2);
		
		if(a_dec<this.nts){
			a_bin=decbin(remVal,this.d+1);
			a_dec=parseInt(a_bin,2);
		}
		
		//find block with it
		var actBlock=this.rows[a_dec];
		var prevBlock=undefined;
		var found=false;
		var index=0;
		var counter=0;
		while(!found){
			for(var i=0;i<this.b;i++){
				if(actBlock.values[i]==remVal){
					found=true;
					index=i;
					break;
				}
				else if(actBlock.values[i]==undefined)
					break;
			}
			if(!found){
				prevBlock=actBlock;
				actBlock=actBlock.overflow;
				counter++;
			}
			if(actBlock==undefined){
				this.manipulatedIndex=a_bin;
				this.manipulated=remVal;
				this.manipulatedBin=parseInt(remVal, 10).toString(2);
				if(a_dec<this.nts){
					if(this.manipulatedBin.length<this.d+1){
						this.manipulatedBin=decbin(remVal,this.d+1);
					}
				}
				else{
					if(this.manipulatedBin.length<this.d)
						this.manipulatedBin=decbin(remVal,this.d);
				}
				
				this.working=false;
				this.draw(cont);
				window.alert("Value not found!");
				return;
			}
		}
		
		function manipulate(ht){
			setTimeout(function (){
				//remove value
				actBlock.values.splice(index,1);
		
				//move all values to the left
				var overflow=actBlock.overflow;
				if(overflow==undefined && actBlock.values.length<1 && prevBlock!=undefined){
					
					prevBlock.overflow=undefined;
					
					ht.manipulatedIndex=undefined;
					
					ht.working=false;
					ht.manipulationInProgress=false;
					ht.saveInDB();
					
					ht.draw(cont);
					return;
				}
				
				while(overflow!=undefined){
					actBlock.values.push(overflow.values[0]);
					overflow.values.splice(0,1);
					
					//overflow now empty:
					if(overflow.values.length<1){
						if(overflow.overflow==undefined)
							actBlock.overflow=undefined;
						else
							actBlock.overflow=overflow.overflow;
						
						ht.manipulatedIndex=undefined;
						
						ht.working=false;
						ht.manipulationInProgress=false;
			        	ht.saveInDB();
						
						ht.draw(cont);return;
					}
					else{
						actBlock=overflow;
						overflow=actBlock.overflow;
					}
				}
				
				ht.manipulatedIndex=undefined;
				
				ht.working=false;
				ht.manipulationInProgress=false;
	        	ht.saveInDB();
				
				ht.draw(cont);return;
			},1000)
		}
		this.manipulationInProgress=true;
		
		manipulate(this);

		this.manipulatedIndex=a_bin;
		this.manipulated=remVal;
		this.manipulatedBin=parseInt(remVal, 10).toString(2);
		if(a_dec<this.nts){
			if(this.manipulatedBin.length<this.d+1){
				this.manipulatedBin=decbin(remVal,this.d+1);
			}
		}
		else{
			if(this.manipulatedBin.length<this.d)
				this.manipulatedBin=decbin(remVal,this.d);
		}
		
		this.draw(cont);
	}
	else{
		window.alert("Table not created!");
	}
}

LinearHashing.prototype.search=function(cont){
	if(this.rows.length>0){
		var searchVal=parseInt(prompt("Search for:"));
		if(isNaN(searchVal))return;
		
		var a_bin=decbin(searchVal,this.d);
		var a_dec=parseInt(a_bin,2);
		
		if(a_dec<this.nts){
			a_bin=decbin(searchVal,this.d+1);
			a_dec=parseInt(a_bin,2);
		}
		
		//find block with it
		var actBlock=this.rows[a_dec];
		var prevBlock=undefined;
		var found=false;
		var index=0;
		var counter=0;
		while(!found){
			for(var i=0;i<this.b;i++){
				if(actBlock.values[i]==searchVal){
					found=true;
					index=i;
					break;
				}
				else if(actBlock.values[i]==undefined)
					break;
			}
			if(!found){
				prevBlock=actBlock;
				actBlock=actBlock.overflow;
				counter++;
			}
			if(actBlock==undefined){
				this.manipulatedIndex=a_bin;
				this.manipulated=searchVal;
				this.manipulatedBin=parseInt(searchVal, 10).toString(2);
				if(a_dec<this.nts){
					if(this.manipulatedBin.length<this.d+1){
						this.manipulatedBin=decbin(searchVal,this.d+1);
					}
				}
				else{
					if(this.manipulatedBin.length<this.d)
						this.manipulatedBin=decbin(searchVal,this.d);
				}
				
				this.working=false;
				this.draw(cont);
				window.alert("Value not found!");
				return;
			}
		}
		
		this.manipulationInProgress=true;

		this.manipulatedIndex=a_bin;
		this.manipulated=searchVal;
		this.manipulatedBin=parseInt(searchVal, 10).toString(2);
		if(a_dec<this.nts){
			if(this.manipulatedBin.length<this.d+1){
				this.manipulatedBin=decbin(searchVal,this.d+1);
			}
		}
		else{
			if(this.manipulatedBin.length<this.d)
				this.manipulatedBin=decbin(searchVal,this.d);
		}
		
		this.draw(cont);
		//this.manipulationInProgress=false;
	}
	else{
		window.alert("Table not created!");
	}
}


LinearHashing.prototype.draw=function(cont){
	this.view.draw(this,cont);
}