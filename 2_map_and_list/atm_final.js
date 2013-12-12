Card = can.Map.extend({
	state: "unverified",
	verify: function(){
		$.post("/verifyCard", this.serialize() )
		.then(
			
			$.proxy(function(){
				console.log("setting state to verified")
				this.attr("state","verified");
			}, this),
			$.proxy(function(){
				this.attr("state","invalid")
			}, this)
			
			)
		
	},
	serialize: function(){
		var attrs = this.attr();
		delete attrs.state;
		return attrs;
	}
})


Transaction = can.Map.extend({
	executed: false,
	executing: false,
	state: can.compute(function(){
		if(this.attr("executed")){
			return "executed"
		}
		if(this.attr("executing")){
			return "executing"
		}
		// make sure there's an amount, account, and card
		if( this.isReady() ) {
			return "ready"
		}
		return "invalid"
	}),
	execute: function(){
		if( this.attr("state") === "ready" ) {
			
			this.attr("executing", true);
			
			var def = this.executeStart(),
				self = this;
				
			def.then(function(){
				can.batch.start();
				self.attr({
					executing: false,
					executed: true
				})
				self.executeEnd();
				can.batch.stop();
			})
		} 
	}
})

Deposit = Transaction.extend({
	amount: null,
	account: null,
	setAmount: function(val){
		return val == null ? null : +val;
	},
	isReady: function(){
		console.log("isReady", this.attr("amount") )
		return typeof this.attr("amount") === "number" && 
			this.attr("account") &&
			this.attr("card")
	},
	executeStart: function(){
		return $.post("/deposit", {
			card: this.attr("card").serialize(),
			accountId: this.attr("account.id"),
			amount: this.attr("amount")
		})
	},
	executeEnd: function(data){
		this.attr("account.balance", this.attr("account.balance") + this.attr("amount") )
	}
})

Withdrawal = Transaction.extend({
	amount: null,
	account: null,
	setAmount: function(val){
		return val == null ? null : +val;
	},
	isReady: function(){
		return typeof this.attr("amount") === "number" && 
			this.attr("account") &&
			this.attr("card")
	},
	executeStart: function(){
		return $.post("/withdraw", {
			card: this.attr("card").serialize(),
			accountId: this.attr("account.id"),
			amount: this.attr("amount")
		})
	},
	executeEnd: function(data){
		this.attr("account.balance", this.attr("account.balance") - this.attr("amount") )
	}
})


Account = can.Model.extend({
	findAll: function(card){
		return $.get("/accounts", card.serialize ? card.serialize() : card)
	}
},{})




ATM = can.Map.extend({
	isReadingCard: function(){
		return this.attr("state") === "readingCard"
	},
	isReadingPin: function(){
		return /verifyingPin|readingPin/.test( this.attr("state") );
	},
	isVerifyingPin: function(){
		return this.attr("state") === "verifyingPin"
	},
	isPickingAccount: function(){
		return this.attr("state") === "pickingAccount"
	},
	isChoosingTransaction: function(){
		return this.attr("state") === "choosingTransaction"
	},
	isDepositInfo: function(){
		return  /deposit/i.test( this.attr("state") );
	},
	isWithdrawalInfo: function(){
		return  /withdrawal/i.test( this.attr("state") );
	},
	isTransactionReady : function(){
		return this.attr("currentTransaction") && this.attr("currentTransaction").attr("state") === "ready"
	},
	isTransactionExecuting: function(){
		return this.attr("currentTransaction") && this.attr("currentTransaction").attr("state") === "executing"
	},
	isTransactionSuccessful: function(){
		return this.attr("state") == "successfulTransaction"
	},
	isPrintingReceipt: function(){
		return this.attr("state") == "printingReceipt"
	},
	state: can.compute(function(){
		if(this.attr("printingReceipt")) {
			return "printingReceipt"
		}
		var transaction = this.attr("currentTransaction")
		if(transaction) {
			if( transaction.attr("state") === "executed") {
				return "successfulTransaction"
			} 
			else if(transaction.attr("account")) {

				if( transaction instanceof Deposit ) {
					return "depositInfo"
				} else if( transaction instanceof Withdrawal ) {
					return "withdrawalInfo"
				} else {
					return "invalid-state"
				}
				
			} else {
				if( this.attr("accounts").attr("length") ) {
					return "pickingAccount";
				} else {
					return "waitingForAccounts";
				}
			}
		}
		
		var card = this.attr("card")
		if(card) {
			if(card.attr("state") === "verified") {
				return "choosingTransaction"
			} else if( card.attr("pin") ) {
				return "verifyingPin"
			}
			return "readingPin"
		}
		return "readingCard"
	}),
	cardNumber: function(number){
		this.attr("card", new Card({
			number: number
		}))
	},
	pinNumber: function(pin){
		var card = this.attr("card");
		
		card.attr("pin", pin);
		card.verify()
		this.attr("accounts" , new Account.List( card.serialize() )  );
		this.attr("transactions",new can.List() )
	},
	chooseDeposit: function(){
		this.attr("currentTransaction", new Deposit({
			card: this.attr("card")
		}))
	},
	chooseWithdraw: function(){
		this.attr("currentTransaction", new Withdrawal({
			card: this.attr("card")
		}))
	},
	setCurrentTransaction: function(newTransaction, success){
		// if current was executed, move it to transactions array
		var currentTransaction = this.attr("currentTransaction")
		if(currentTransaction && currentTransaction.attr("state") === "executed") {
			this.attr("transactions").push(currentTransaction)
		}
		success(newTransaction)
	},
	chooseAccount: function(account){
		this.attr("currentTransaction").attr("account",account )
	},
	removeTransaction: function(){
		var currentTransaction = this.removeAttr("currentTransaction");
		if(currentTransaction && currentTransaction.attr("state") === "executed") {
			this.attr("transactions").push(currentTransaction)
		}
	},
	printReceiptAndExit: function(){
		this.removeTransaction()
		this.attr("printingReceipt", true);
		var self = this;
		setTimeout(function(){
			self.exit();
		},5000)
	},
	exit: function(){
		can.batch.start()
		this.removeAttr("currentTransaction")
		this.removeAttr("card")
		this.attr("printingReceipt", false);
		can.batch.stop()
	}
});
	
	
can.Component.extend({
	tag: "atm-machine",
	template: can.view("atm.mustache"),
	scope: ATM.extend({
		addCardNumber: function(context, el){
			this.cardNumber( el.val() )
		},
		addPinNumber: function(context, el){
			this.pinNumber( el.val() )
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
	console.log("getting accounts!!!!")
	return {
		data: [ {balance: 100, id: 1, name: "checking"},
				{balance: 10000, id: 2, name: "savings"}]
	}
})

can.fixture.delay = 1000;



