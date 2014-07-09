can.stache.registerHelper("link",function(text, options){
	var params = {};
	can.each(options.hash,function(value, name){
		params[name] = can.isFunction(value) ? value() : value;
	});
	return can.stache.safeString( can.route.link(text, params) );
});

can.stache.registerHelper("url",function(options){
	var params = {};
	can.each(options.hash,function(value, name){
		params[name] = can.isFunction(value) ? value() : value;
	});
	return can.route.url( params );
});

can.stache.registerHelper("linkUnlessCurrent",function(text, options){
	var params = {};
	can.each(options.hash,function(value, name){
		params[name] = can.isFunction(value) ? value() : value;
		can.route.attr(name);
	});
	if(can.route.current(params)) {
		return can.stache.safeString( text );
	} else {
		return can.stache.safeString( can.route.link(text, params) );
	}
	
});