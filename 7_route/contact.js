(function(){
	
var firsts = ["Nate", "Danny", "Allen", "Kevin", "Giovanni", "Ron", "Gabe", "Kim", "Sara", "Christy", "Payal", "Kathrine", "Paula"], 
    lasts = ["Shah", "Meyer", "Jazwiak", "Anderson", "Eck", "Joshnson", "Montgomery", "Phillips", "Arroyo", "Larson", "Gonzalez"],
	streets = ["Fullerton","Stave","State","Adams","Wacker","Western","Chase","Wrightwood"],
	cities = ["Chicago","Boston","LA","New York","Savanna"],
	rand = can.fixture.rand;


if( localStorage.getItem("contacts")) {
	var contactStore = can.fixture.store(JSON.parse( localStorage.getItem("contacts") ,{}) );
	
} else {
	var contactStore = can.fixture.store(100, function(id) {
		return {
			id : id,
			first : rand(firsts,1)[0],
			last : rand(lasts,1)[0],
			address: rand(10000)+" "+rand(streets,1)[0]+" St., "+rand(cities,1)[0]
		};
	});
	localStorage.setItem("contacts", JSON.stringify( contactStore.findAll({data:{}}).data ) );
}


can.fixture("/services/contacts", contactStore.findAll);
can.fixture("/services/contacts/{id}", contactStore.findOne);


Contact = can.Model.extend({
	resource : "/services/contacts"
}, {});




})();

can.fixture.delay = 2000;