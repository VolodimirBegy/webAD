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

function ExtendibleHashView(_model){
	this.scale=1;
	this.model=_model;
}

ExtendibleHashView.prototype.initStage=function(contMain,contSec,playBtn){
	this.stage = new Kinetic.Stage({
  		container: contMain,
  		draggable: true,
		width: 0,
		height: 0
	}); 

	this.elementDisplay = contSec;
	this.playButton = playBtn;
}

ExtendibleHashView.prototype.zoomIn=function(){
	if(this.scale<3)this.scale=this.scale+0.1;
	this.draw();
}

ExtendibleHashView.prototype.zoomOut=function(){
	if(this.scale>0.5)this.scale=this.scale-0.1;
	this.draw();
}

ExtendibleHashView.prototype.draw=function(){

	this.stage.removeChildren();
	
	var layer = new Kinetic.Layer();

	//
	// Configurable
	//
	var box_width = 90 * this.scale;
	var box_height = 25 * this.scale;
	
	var margin_left_x = 60*this.scale;
	var margin_top_y_dblock = 90 * this.scale; // starting point

	var margin_top_details1_row = 10 * this.scale;
	var margin_top_details2_row = 45 * this.scale;

	
	var offset_y_dblock_space = 10*this.scale; // space between datablocks
	var offset_x_status = 70*this.scale; // for messages next to dblock
	var offset_y_iblock = (Math.pow(2,this.model.global_depth)-1)*offset_y_dblock_space/2; //
	var offset_x_space_ib_id = 200*this.scale;

	var pos_y_next_row_dblock = margin_top_y_dblock;
	var pos_y_next_row_iblock = pos_y_next_row_dblock + offset_y_iblock; // iblock array y-centered to dblocks
	
	var fonts = 'Calibri , Helvetica';

	// Display Values settings
	this.elementDisplay.style.fontFamily = fonts;
	this.elementDisplay.style.fontWeight = 'normal';

	//  End -configurable




	var allValues = [];

	// Label local + global depth
	var details_label = new Kinetic.Text({
				x: margin_left_x,
				y: margin_top_details1_row,
				text: "d="+this.model.global_depth+"  b="+ this.model.datablock_size,
				fontSize: 27*this.scale,
				fontStyle: 'bold',
				fontFamily: fonts,
				fill: "black",
				align: 'left',
				width: 200,
			});
	layer.add(details_label);

	// Label Task Status
	if(this.model.task.element !== undefined) {
			var status_label = new Kinetic.Text({
						x: margin_left_x,
						y: margin_top_details2_row,
						text: this.model.task.status+": "+ this.model.task.element,
						fontSize: 27*this.scale,
						fontStyle: 'bold',
						fontFamily: fonts,
						fill: "black",
						align: 'left'
					});
			layer.add(status_label);

			var binary = this.model.task.element.toString(2);
			if( binary.length < this.model.global_depth ){binary = "0".repeat(this.model.global_depth-binary.length)+ binary}; // Fill up with zeros
		
			var binary_relevant = binary.substring(binary.length-this.model.global_depth, binary.length) ;
			var binary_irrelevant = binary.substring(0,binary.length-this.model.global_depth);

			var binary_black_label = new Kinetic.Text({
						x: margin_left_x+status_label.getWidth(),
						y: margin_top_details2_row,
						text: "="+binary_irrelevant,
						fontSize: 27*this.scale,
						fontStyle: 'bold',
						fontFamily: fonts,
						fill: "black",
						align: 'left'
					});
			layer.add(binary_black_label);

			var binary_orange_label = new Kinetic.Text({
						x: binary_black_label.getX()+binary_black_label.getWidth(),
						y: margin_top_details2_row,
						text: binary_relevant,
						fontSize: 27*this.scale,
						fontStyle: 'bold',
						fontFamily: fonts,
						fill: "orange",
						align: 'left'
					});
			layer.add(binary_orange_label);

			
	}


	if(this.model.task.queue !== undefined && this.model.task.queue.length !== 0) {
				var queue_label = new Kinetic.Text({
							x: 200*this.scale,
							y: margin_top_details1_row,
							text: "Queue: |" + this.model.task.queue.join(" ")+"|",
							fontSize: 27*this.scale,
							fontStyle: 'bold',
							fontFamily: fonts,
							fill: "black",
							align: 'left'
						});
				layer.add(queue_label);
	}


	// Marker for index expansion
	var old_array_len = this.model.datablock_array.length/2;

	// Run through each row
	for (var rowNumber = 0; rowNumber < this.model.datablock_array.length; rowNumber++){
		
		// Index - Array Row 
		var rect_iblock = new Kinetic.Rect({
					x: margin_left_x,
					y: pos_y_next_row_iblock,
					width: box_width ,
					height: box_height,
					fill: this.model.datablock_array[rowNumber].marked.rIndex === rowNumber  || this.model.task.expanded === true && rowNumber >= old_array_len || this.model.task.expansion === true? 'orange' : '#ADFF2F',
					stroke: 1,
					strokeWidth: 3*this.scale,					
				});
		layer.add(rect_iblock);
		
		// Index - Row Labels
		var indices_label = new Kinetic.Text({
				x: rect_iblock.getX() - rect_iblock.width() - 6,
				y: rect_iblock.getY(),
				text: ("0").repeat(this.model.global_depth-rowNumber.toString(2).length)+rowNumber.toString(2),
				fontSize: 20*this.scale,
				fontFamily: fonts,
				fill: this.model.datablock_array[rowNumber].marked.rIndex === rowNumber ? 'orange' : 'black',
				width: box_width,
				align: 'right'
			});
		layer.add(indices_label);

		// Check if current index is sharing the datablock with a previous one
		var draw_DataBlock = true;

		for (var i = 0; i < rowNumber; i++) {
			if(this.model.datablock_array[rowNumber] === this.model.datablock_array[i])
			{
				draw_DataBlock = false;

				// Draw dotted Line to shared Datablock
				var arrow = new Kinetic.Line({
						x: 0,
						y: 0,
						points: [ 	rect_iblock.getX()+box_width, 	rect_iblock.getY()+box_height/2,
									margin_left_x + offset_x_space_ib_id,	margin_top_y_dblock+(i*offset_y_dblock_space+box_height*i+box_height/2)
								],
						dash: [6, 5],
						tension: 1,
						stroke: this.model.datablock_array[rowNumber].marked.rIndex === rowNumber ? 'orange' : 'black',
						strokeWidth:3*this.scale,
						draggable:false,
					});
				layer.add(arrow);
				break;
			}	
		}

		// Datablock 
		if(draw_DataBlock){
				
				var pos_x_next_Datablock = margin_left_x + offset_x_space_ib_id;

				var arrow = new Kinetic.Line({
						x: 0,
						y: 0,
						points: [ 	rect_iblock.getX()+box_width, 	rect_iblock.getY()+box_height/2,
									pos_x_next_Datablock,	pos_y_next_row_dblock+box_height/2
								],
						tension: 1,
						stroke: this.model.datablock_array[rowNumber].marked.rIndex === rowNumber ? 'orange' : 'black',
						strokeWidth:3*this.scale,
						draggable:false,
					});
				layer.add(arrow);


				var group = new Kinetic.Group({ draggable: false }); // Group for blocks in a row
				for (var i = 0; i < this.model.datablock_array[rowNumber].elements.length; i++) {

					if(this.model.datablock_array[rowNumber].elements[i] !== undefined)
						allValues.push(this.model.datablock_array[rowNumber].elements[i]);

					var rect_dblock = new Kinetic.Rect({
							x: pos_x_next_Datablock,
							y: pos_y_next_row_dblock,
							width: box_width,
							height: box_height,
							fill: this.model.datablock_array[rowNumber].marked.eIndex === i || this.model.datablock_array[rowNumber].marked.splittRow === true ? 'orange' : '#ADFF2F',
							stroke: 1,
							strokeWidth: 3*this.scale,			
						});

					var label_data = new Kinetic.Text({
						x: rect_dblock.getX(),
						y: rect_dblock.getY()+2,
						text: this.model.datablock_array[rowNumber].elements[i] !== undefined ? this.model.datablock_array[rowNumber].elements[i]: "-",
						fontSize: 20*this.scale,
						fontFamily: fonts,
						fill: "black",
						width: box_width,
						align: 'center'
					});
				
				    group.add(rect_dblock);
				    group.add(label_data);
					
					pos_x_next_Datablock += box_width; 
				}

				layer.add(group);



				var local_depth_label = new Kinetic.Text({
						x: (pos_x_next_Datablock+3),
						y: pos_y_next_row_dblock + box_height - 15*this.scale,
						text: " k="+this.model.datablock_array[rowNumber].local_depth,
						fontSize: 21*this.scale,
						fontFamily: fonts,
						fontStyle : 'italic bold',
						fill: "black",
						align: 'center'
					});
				layer.add(local_depth_label);

				if(this.model.datablock_array[rowNumber].marked.overflow === true){
					var local_status = new Kinetic.Text({
							x: local_depth_label.getX() + offset_x_status,
							y: pos_y_next_row_dblock,
							text: " Bucket Overflow",
							fontSize: 22*this.scale,
							fontFamily: fonts,
							fontStyle : 'bold',
							fill: "black",
							align: 'center'
						});
					layer.add(local_status);
				}
				if(this.model.datablock_array[rowNumber].marked.splitt === true){
					var local_status = new Kinetic.Text({
							x: local_depth_label.getX() + offset_x_status,
							y: pos_y_next_row_dblock,
							text: " Split: k<d",
							fontSize: 22*this.scale,
							fontFamily: fonts,
							fontStyle : 'bold',
							fill: "black",
							align: 'center'
						});
					layer.add(local_status);
				}
				if(this.model.datablock_array[rowNumber].marked.expansion === true){
					var local_status = new Kinetic.Text({
							x: local_depth_label.getX() + offset_x_status,
							y: pos_y_next_row_dblock,
							text: " Index - Expansion: k=d",
							fontSize: 22*this.scale,
							fontFamily: fonts,
							fontStyle : 'bold',
							fill: "black",
							align: 'center'
						});
					layer.add(local_status);
				}
				

		}

		pos_y_next_row_iblock  += (box_height);
		pos_y_next_row_dblock  += (box_height) + offset_y_dblock_space;

	} // END FOR LOOP
	


	// Layer Width and Height

	var tmpBlockCount = this.model.datablock_size + 1;
	var heightStage = pos_y_next_row_dblock + 2*box_height;
	var widthStage = margin_left_x + box_width*tmpBlockCount + offset_x_space_ib_id + 
					 6*this.scale*tmpBlockCount + offset_x_status + 400*this.scale; // stroke,text offset + safety width
	
	if(heightStage< 600) heightStage=600;
	if(widthStage< 800)  widthStage=800;
	this.stage.setHeight(heightStage);
	this.stage.setWidth(widthStage);

	this.stage.add(layer);


	// Inserted elements in binary form 
	if(allValues.length > 0){
		allValues = allValues.sort(function(a, b){return a-b}); // accending order
		var valuesHTML = "";
		for (var i = 0; i < allValues.length; i++) {
			valuesHTML += allValues[i] + "="+allValues[i].toString(2)+"</br>" ;
		}
		this.elementDisplay.innerHTML=valuesHTML; // Pass values to the view.
	}
	else{
		this.elementDisplay.innerHTML="Empty...";
	}



	// Play-Pause Button
	if(this.model.working && this.model.speed !=0)
		this.playButton.addClass("p1"); // Show Pause Btn
	else
		this.playButton.removeClass("p1"); // Show Play Btn


}