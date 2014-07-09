can.Component.extend({
	tag: "b-contact",
	template: can.view("components/contact.stache"),
	scope: {
		define: {
			contact: {
				get: function(current, set){
					Contact.findOne({id: this.attr("contactId")}, set);
				}
			}
		}
	}
});