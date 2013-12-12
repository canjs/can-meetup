
module("ATM system")

test("Good Card", function(){
	var c = new Card({
		number: 01234567890,
		pin: "abcd"
	});
	
	equal( c.attr("state"), "unverified" );
	
	stop()
	
	
	c.verify();
	c.bind("state", function(ev, newVal){
		
		equal(newVal, "verified", "card is verified")
		
		start()
	})
	
	equal( c.attr("state"), "verifying", "card is verifying" );
})

test("Bad Card", function(){
	var c = new Card({});
	
	equal( c.attr("state"), "unverified" );
	
	stop()
	c.verify()
	c.bind("state", function(ev, newVal){
		
		equal(newVal, "invalid", "card is invalid")
		
		start()
	})
	
	
	
	equal( c.attr("state"), "verifying" );
})

test("Deposit", function(){
	expect(5)
	// you can only get account details with a card
	var card = new Card({
		number: "0123456789",
		pin: "1122"
	})
	
	var deposit = new Deposit({
		amount: 100,
		card: card
	})
	
	equal( deposit.attr("state"), "invalid" )
	
	stop();
	
	Account.findAll(card, function(accounts){
		ok(true, "got accounts")	
		deposit.attr("account", accounts[0])
	})
	
	
	
	deposit.bind("state", function(ev, newVal){
		if(newVal === "ready"){
			ok(true, "deposit is ready")
			deposit.execute();
		} else if(newVal === "executing") {
			ok(true, "executing a deposit")
		} else if(newVal === "executed") {
			ok(true, "executed a deposit")
			start();
		}
	})
	
})



test("ATM basics", function(){

	var atm = new ATM()
	
	ok( atm.isReadingCard(), "defaults to reading card state" )
	
	atm.cardNumber("01233456789")
	
	
	ok( atm.isReadingPin(), "moves to reading card state"   )
	
	
	atm.pinNumber("1234");
	
	
	ok( atm.isVerifyingPin(), "pin is verified after set");
	
	ok( atm.isReadingPin() , "but we are still in the reading pin state" )
	
	
	stop();
	
	atm.bind("state", function(ev, newVal){
		
		if(newVal == "choosingTransaction") {
			
			ok( !atm.isVerifyingPin(), "no longer verifing the pin" )
			ok( !atm.isReadingPin(), "no longer reading the pin" )
			ok( atm.isChoosingTransaction() , "choosing transaction state");
			
			atm.chooseDeposit();
		} else if (newVal === "pickingAccount") {
			
			ok(true, "in picking account state");
			
			atm.chooseAccount(atm.attr("accounts.0"))
			
			
		} else if (newVal === "depositInfo") {
			
			ok(atm.isDepositInfo(), "in deposit state");
			
			atm.attr("currentTransaction.amount", 120)
			
			atm.attr("currentTransaction").execute();
			
			ok(atm.isDepositInfo(), "still in deposit state");
			
			ok(atm.isTransactionExecuting(), "is executing");
		}  else if( newVal === "successfulTransaction" ) {
			ok( atm.isTransactionSuccessful() );
			start();
		}
		
	})
	
	
})



