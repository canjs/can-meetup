

	var Paginate = can.Map.extend({
		define : {
			count : {
				type : "number",
				value : Infinity,
				// Keeps count above 0.
				set : function(newCount) {
					return newCount < 0 ? 0 : newCount;
				}
			},
			offset : {
				type : "number",
				value : 0,
				// Keeps offset between 0 and count
				set : function(newOffset) {
					console.log("SETTING","newValue=", newOffset);
					var count = this.attr("count");
					return newOffset < 0 ? 0 : Math.min(newOffset, !isNaN(count - 1) ? count - 1 : Infinity);
				}
			},
			limit : {
				type : "number",
				value : 20
			},
			page : {
				// Setting page changes the offset
				set : function(newVal) {
					this.attr('offset', (parseInt(newVal) - 1) * this.attr('limit'));
				},
				// The page value is derived from offset and limit.
				get : function(newVal) {
					return Math.floor(this.attr('offset') / this.attr('limit')) + 1;
				}
			},
			pageCount: {
				get: function(){
					return this.attr('count') ? Math.ceil(this.attr('count') / this.attr('limit')) : null;
				}
			},
			nextPageNum: {
				get: function(){
					return this.attr("page")+1;
				}
			},
			prevPageNum: {
				get: function(){
					return this.attr("page")-1;
				}
			}
		},
		next : function() {
			this.attr('offset', this.offset + this.limit);
		},
		prev : function() {
			this.attr('offset', this.offset - this.limit);
		},
		canNext : function() {
			return this.attr('offset') < this.attr('count') - this.attr('limit');
		},
		canPrev : function() {
			return this.attr('offset') > 0;
		}
	});

	can.Component.extend({
		tag: "b-contacts",
		template: can.view("components/contacts.stache"),
		scope: {
			define: {
				paginate: {
					Value: Paginate
				},
				page: {
					type: "number",
					get: function(){
						return this.attr("paginate").attr("page");
					},
					set: function(newValue){
						return this.attr("paginate").attr("page",newValue);
					}
				}
			}
		}
	});

	can.Component.extend({
		tag: "contacts-list",
		scope: {
			define: {
				contacts: {
					Value: Contact.List,
					get: function(current){
						var paginate = this.attr("paginate"),
							offset = paginate.attr("offset");
						console.log("GETTING CONTACTS", "paginate.offset=",offset);
						var deferred = Contact.findAll({
							offset: offset,
							limit: paginate.attr("limit")
						});
						setTimeout(function(){
							current.replace(deferred);
						},1);
						
						deferred.then(function(items){
							paginate.attr("count",items.count);
						});
						return current;
					}
				}
			}
		}
	});


	can.Component.extend({
		tag: "c-paginate",
		scope: {
			define: {
				
			}
		}
	});
	
