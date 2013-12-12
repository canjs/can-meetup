Card = can.Map.extend({
	state: "unverified",
	verify: function(){
		// Post data to /verifyCard and set state
	},
	serialize: function(){
		var attrs = this.attr();
		delete attrs.state;
		return attrs;
	}
})

// Dummy way to get accounts
Account = can.Model.extend({
	findAll: function(card){
		return $.get("/accounts", card.serialize ? card.serialize() : card)
	}
},{})


Deposit = can.Map.extend({
	// isReady with an amount, account, and card
	
	// if ready, posts to /deposit card, accountId, and amount, 
	// and updates executing and executed when execute starts and stops
})


// Withdrawal is very similar and should inherit



ATM = can.Map.extend({
	isReadingCard: function(){ },
	isReadingPin: function(){ },
	isVerifyingPin: function(){ },
	isPickingAccount: function(){ },
	isChoosingTransaction: function(){ },
	isDepositInfo: function(){ },
	isWithdrawalInfo: function(){ },
	isTransactionReady : function(){ },
	isTransactionExecuting: function(){ },
	isTransactionSuccessful: function(){ },
	isPrintingReceipt: function(){ },
	state: can.compute(function(){
		
		// if printingReceipt
		// if a currentTransaction
		//    and the transaction is executed -> successfulTransaction
		//    if an account
		//        is it a deposit or withdraw
		//    else
		//        pick account or wait for accounts
		// if a card
		//    is card verified -> chosingTransaction
		//    if pin -> verifyingPin
		//    else -> readingPin
		// readingCard
		return "readingCard"
	}),
	cardNumber: function(number){
		// create a card
	},
	pinNumber: function(pin){
		// update the card's pin and verify
		
		// get accounts
		
		// setup a list of transactions
	},
	chooseDeposit: function(){
		// set currentTransaction as a new Deposit (deposit should have the card)
		this.attr("currentTransaction", new Deposit({
			card: this.attr("card")
		}))
	},
	chooseWithdraw: function(){
		// set currentTransaction as a new Withdrawal (deposit should have the card)
	},
	// if the transaction changes, save the old executed one.
	// setCurrentTransaction: function(newTransaction, success){ },
	
	chooseAccount: function(account){
		// set the account on the transaction
	},
	removeTransaction: function(){
		// save executed transaction
	},
	printReceiptAndExit: function(){
		// remove transaction, set printingReceipt and exit in 5000s
	},
	exit: function(){
		// clean up currentTransaction, card, printingReceipt
	}
});
	
	
can.Component.extend({
	tag: "atm-machine",
	template: can.view("atm.mustache"),
	scope: ATM.extend({
		addCardNumber: function(context, el){
			console.log("call cardNumber")
		},
		addPinNumber: function(context, el){
			console.log("call addPinNumber")
		}
	}),
	helpers: {
		actionName: function(options){
			return options.context instanceof Deposit ? "deposited" : "withdrew"
		},
		actionPrep: function(options){
			return options.context instanceof Deposit ? "into" : "from"
		}
	}

})


can.fixture("/verifyCard", function(request, response){
	if(!request.data || !request.data.number || !request.data.pin) {
		response(400,{});
	} else {
		return {}
	}
})
can.fixture("/deposit", function(){
	return {};
})
can.fixture("/withdraw", function(){
	return {};
})
can.fixture("/accounts", function(){
	return {
		data: [ {balance: 100, id: 1, name: "checking"},
				{balance: 10000, id: 2, name: "savings"}]
	}
})

can.fixture.delay = 1000;



