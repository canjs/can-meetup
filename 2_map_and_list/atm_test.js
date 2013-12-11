
module("ATM system")


test("Deposit", function(){
	expect(4)
	// you can only get account details with a card
	var card = new Card({
		number: "0123456789",
		pin: "1122"
	})
	
	var deposit = new Deposit({
		amount: 100,
		card: card
	})
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
			
			
		} else if (newVal === "deposit") {
			
			ok(atm.isDeposit(), "in deposit state");
			
			atm.attr("currentTransaction.amount", 120)
			
			atm.attr("currentTransaction").execute();
			
			
		} else if(newVal === "executingDeposit"){
			ok(atm.isDeposit(), "still in deposit state");
			
			ok(atm.isTransactionExecuting(), "is executing");
		} else if( newVal === "successfulTransaction" ) {
			ok( atm.isTransactionSuccessful() );
			start();
		}
		
	})
	
	
})



