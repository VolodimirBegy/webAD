function show(type){ 
	param=document.getElementById(type); 
	if(param.style.display == "none") 
		param.style.display = "block"; 
	else 
		param.style.display = "none";
}
function bot(type){ 
	param=document.getElementById(type); 
	if(param.style.height == "500px") 
		param.style.height = "50px"; 
	else 
	param.style.height = "500px"; 
}

function org(type){

	if(type != 'info') { 
		info=document.getElementById('info');
		info.style.bottom = "50%";
		info.style.top = "50%";
		info.style.left = "50%";
		info.style.right = "50%";
		info.style.padding = "0px";
		info.style.border = "0px solid white";
		info.style.boxShadow = "0 0 0 transparent";
	}
	if(type != 'configs') { 
		configs=document.getElementById('configs');
		configs.style.bottom = "50%";
		configs.style.top = "50%";
		configs.style.left = "50%";
		configs.style.right = "50%";
		configs.style.padding = "0px";
		configs.style.border = "0px solid white";
		configs.style.boxShadow = "0 0 0 transparent";
	}
	if(type != 'ideas') {  
		ideas=document.getElementById('ideas');
		ideas.style.bottom = "50%";
		ideas.style.top = "50%";
		ideas.style.left = "50%";
		ideas.style.right = "50%";
		ideas.style.padding = "0px";
		ideas.style.border = "0px solid white";
		ideas.style.boxShadow = "0 0 0 transparent";
	}
	
	if(type != 'vectors') {  
		vectors=document.getElementById('vectors');
		vectors.style.bottom = "50%";
		vectors.style.top = "50%";
		vectors.style.left = "50%";
		vectors.style.right = "50%";
		vectors.style.padding = "0px";
		vectors.style.border = "0px solid white";
		vectors.style.boxShadow = "0 0 0 transparent";
	}
	
	if(type != 'dictionaries') {  
		dictionaries=document.getElementById('dictionaries');
		dictionaries.style.bottom = "50%";
		dictionaries.style.top = "50%";
		dictionaries.style.left = "50%";
		dictionaries.style.right = "50%";
		dictionaries.style.padding = "0px";
		dictionaries.style.border = "0px solid white";
		dictionaries.style.boxShadow = "0 0 0 transparent";
	}
	
	if(type != 'lists') {  
		lists=document.getElementById('lists');
		lists.style.bottom = "50%";
		lists.style.top = "50%";
		lists.style.left = "50%";
		lists.style.right = "50%";
		lists.style.padding = "0px";
		lists.style.border = "0px solid white";
		lists.style.boxShadow = "0 0 0 transparent";
	}
	
	if(type != 'graphs') {  
		graphs=document.getElementById('graphs');
		graphs.style.bottom = "50%";
		graphs.style.top = "50%";
		graphs.style.left = "50%";
		graphs.style.right = "50%";
		graphs.style.padding = "0px";
		graphs.style.border = "0px solid white";
		graphs.style.boxShadow = "0 0 0 transparent";
	}
	
	if(type != 'trees') {  
		trees=document.getElementById('trees');
		trees.style.bottom = "50%";
		trees.style.top = "50%";
		trees.style.left = "50%";
		trees.style.right = "50%";
		trees.style.padding = "0px";
		trees.style.border = "0px solid white";
		trees.style.boxShadow = "0 0 0 transparent";
	}
	param=document.getElementById(type);  
	 
	if(param.style.bottom == "50%") {  
		param.style.bottom = "100px";
		param.style.top = "100px";
		param.style.left = "200px";
		param.style.right = "200px";
		param.style.padding = "20px";
		param.style.border = "5px solid white";
		param.style.boxShadow = "5px 5px 20px rgba(0,0,0,0.5)";
	} else { 
		param.style.bottom = "50%";
		param.style.top = "50%";
		param.style.left = "50%";
		param.style.right = "50%";
		param.style.padding = "0px";
		param.style.border = "0px solid white";
		param.style.boxShadow = "0 0 0 transparent";
	}
}