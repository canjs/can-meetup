(function(lib){
	lib.sortedParamsKey = function(params){
		var sorted = {};
		Object.keys(params).sort().forEach(function(prop){
			sorted[prop] = params[prop];
		});
		return JSON.stringify(sorted);
	};
})(window.lib || (lib = {}));
