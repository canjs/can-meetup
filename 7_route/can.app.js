can.app = function(config){
	
	var importComponent = function(componentName){
		if(config["import"]) {	
			config["import"](componentName,function(){
				updatePage(componentName);
			});
		} else if(window.System && System["import"]) {
			System["import"](componentName).then(function(){
				updatePage(componentName);
			});
		} else {
			updatePage(componentName);
		}
	};
	
	
	var updatePage = function(componentName){
		
		var template =  config.componentTemplates[componentName] 
			|| "<"+componentName+"></"+componentName+">";
		
		var frag = can.stache(template)(config.scope);
		

		
		
		
		
		var newMain = main.cloneNode(false);
		main.removeAttribute("id");
		
		
		$(main).after(newMain);
		
		if( config.animate ) {
			$(newMain).hide();
			$(newMain).append(frag);
			
			config.animate(newMain, main, function(){
				$(main).remove();
				main = newMain;
			});
		} else {
			$(main).remove();
			$(newMain).append(frag);
			main = newMain;
		}
	};
	
	var component = can.compute(config.component),
		timer;
	
	component.bind("change",function(ev, newVal){
		clearTimeout(timer);
		timer = setTimeout(function(){
			importComponent(newVal);
		});
	});
	
	var main = document.getElementById("main");
	
	timer = setTimeout(function(){
		importComponent(newVal);
	});
	
};