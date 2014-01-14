can.fixture({
	"/verifyCard": function (request, response) {
		if (!request.data || !request.data.number || !request.data.pin) {
			response(400, {});
		} else {
			return {}
		}
	},
	"/deposit": function () { return {}; },
	"/withdraw": function () { return {}; },
	"/accounts": function () {
		return {
			data: [{
				balance: 100,
				id: 1,
				name: "checking"
			}, {
				balance: 10000,
				id: 2,
				name: "savings"
			}]
		}
	}
});

can.fixture.delay = 1000;


Card = can.Map.extend({
	state: "unverified",
	verify: function () {

		this.attr("state", "verifying");

		var self = this;
		$.post("/verifyCard", this.serialize())
			.then(
				function () {
					self.attr("state", "verified");
				},
				function () {
					self.attr("state", "invalid")
				})

	},
	serialize: function () {
		var attrs = this.attr();
		delete attrs.state;
		return attrs;
	}
});


Account = can.Model.extend({
	findAll: function (card) {
		return $.get("/accounts", card.serialize ? card.serialize() : card)
	}
}, {})


Transaction = can.Map.extend({
	executed: false,
	executing: false,
	state: can.compute(function () {
		if (this.attr("executed")) {
			return "executed"
		}
		if (this.attr("executing")) {
			return "executing"
		}
		// make sure there's an amount, account, and card
		if (this.isReady()) {
			return "ready"
		}
		return "invalid"
	}),
	execute: function () {
		if (this.attr("state") === "ready") {

			this.attr("executing", true);

			var def = this.executeStart(),
				self = this;

			def.then(function () {
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
	setAmount: function (val) {
		return val == null ? null : +val;
	},
	isReady: function () {
		return typeof this.attr("amount") === "number" &&
			this.attr("account") &&
			this.attr("card")
	},
	executeStart: function () {
		return $.post("/deposit", {
			card: this.attr("card").serialize(),
			accountId: this.attr("account.id"),
			amount: this.attr("amount")
		})
	},
	executeEnd: function (data) {
		this.attr("account.balance", this.attr("account.balance") + 
			this.attr("amount"))
	}
})

Withdrawal = Transaction.extend({
	amount: null,
	account: null,
	setAmount: function (val) {
		return val == null ? null : +val;
	},
	isReady: function () {
		return typeof this.attr("amount") === "number" &&
			this.attr("account") &&
			this.attr("card")
	},
	executeStart: function () {
		return $.post("/withdraw", {
			card: this.attr("card").serialize(),
			accountId: this.attr("account.id"),
			amount: this.attr("amount")
		})
	},
	executeEnd: function (data) {
		this.attr("account.balance", this.attr("account.balance") - 
			this.attr("amount"))
	}
})


ATM = can.Map.extend({
	isVerifyingPin: function () {
		return this.attr("card.state") == "verifying"
	},
	isTransactionReady: function () {
		return this.attr("currentTransaction.state") === "ready"
	},
	isTransactionExecuting: function () {
		return this.attr("currentTransaction.state") === "executing"
	},
	state: can.compute(function () {
		// if printingReceipt
		// if a currentTransaction
		//    and the transaction is executed -> transactionSuccessful
		//    if an account
		//        is it a deposit or withdraw
		//    else
		//        pick account or wait for accounts
		// if a card
		//    is card verified -> choosingTransaction
		//    if pin -> verifyingPin
		//    else -> readingPin
		// readingCard
		if(this.attr("printingReceipt")){
			return "printingReceipt"
		}
		var currentTransaction = this.attr("currentTransaction");
		if(currentTransaction) {
			if(currentTransaction.attr("state") == "executed"){
				return "transactionSuccessful"
			}

			if(currentTransaction.attr("account")){
				if(currentTransaction instanceof Deposit) {
					return "depositInfo"
				} else {
					return "withdrawalInfo"
				}
			}

			if( this.attr("accounts").attr("length")) {
				return "pickingAccount"
			} else {
				return "waitingForAccounts";
			}
			
		}

		if(this.attr("card")){
			if(this.attr("card.state") === "verified") {
				return "choosingTransaction"
			}
			return "readingPin"
		}

		return "readingCard"
	}),
	cardNumber: function (number) {
		this.attr("card", new Card({
			number: number
		}))
	},
	pinNumber: function (pin) {
		var card = this.attr("card");

		card.attr("pin", pin);
		card.verify()
		this.attr("accounts", new Account.List(card.serialize()));
		this.attr("transactions", new can.List())
	},
	chooseDeposit: function () {
		this.attr("currentTransaction", new Deposit({
			card: this.attr("card")
		}))
	},
	chooseWithdraw: function () {
		this.attr("currentTransaction", new Withdrawal({
			card: this.attr("card")
		}))
	},
	setCurrentTransaction: function (newTransaction, success) {
		// if current was executed, move it to transactions array
		var currentTransaction = this.attr("currentTransaction");
		if (currentTransaction && 
			currentTransaction.attr("state") === "executed") {

			this.attr("transactions").push(currentTransaction)
		}
		success(newTransaction)
	},
	chooseAccount: function (account) {
		this.attr("currentTransaction").attr("account", account)
	},
	removeTransaction: function () {
		var currentTransaction = this.removeAttr("currentTransaction");
		if (currentTransaction && 
			currentTransaction.attr("state") === "executed") {

			this.attr("transactions").push(currentTransaction)
		}
	},
	printReceiptAndExit: function () {
		this.removeTransaction()
		this.attr("printingReceipt", true);
		var self = this;
		setTimeout(function () {
			self.exit();
		}, this.attr("receiptTime") || 5000)
	},
	exit: function () {
		can.batch.start()
		this.removeAttr("currentTransaction")
		this.removeAttr("card");
		this.removeAttr("transactions");
		this.attr("printingReceipt", false);
		can.batch.stop()
	}
});


can.Component.extend({
	tag: "atm-machine",
	template: can.view("atm.mustache"),
	scope: ATM.extend({
		addCardNumber: function(context, el){
			this.cardNumber(el.val())
		},
		addPinNumber: function(context, el) {
			this.pinNumber(el.val())
		}
	}),
	helpers: {
		actionName: function (options) {
			return options.context instanceof Deposit ? 
				"deposited" : "withdrew"
		},
		actionPrep: function (options) {
			return options.context instanceof Deposit ? "into" : "from"
		},
		isState: function (stateName, options) {
			if (this.attr("state") == stateName) {
				return options.fn(options.scope, options.options)
			} else {
				return options.inverse(options.scope, options.options)
			}
		}
	}

})