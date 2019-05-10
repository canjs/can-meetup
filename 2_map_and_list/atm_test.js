
QUnit.module("ATM system")

QUnit.test("Good Card", function(assert) {

	var c = new Card({
		number: "01234567890",
		pin: 1234
	});

	assert.equal(c.attr("state"), "unverified");

	var done = assert.async();

	c.verify();

	c.bind("state", function (ev, newVal) {

		assert.equal(newVal, "verified", "card is verified");

		done();
	});

	assert.equal(c.attr("state"), "verifying", "card is verifying");
})

QUnit.test("Bad Card", function(assert) {

	var c = new Card({});

	assert.equal(c.attr("state"), "unverified");

	var done = assert.async();

	c.verify();

	c.bind("state", function (ev, newVal) {

		assert.equal(newVal, "invalid", "card is invalid");

		done();
	})

	assert.equal(c.attr("state"), "verifying");
})

QUnit.test("Deposit", function(assert) {

	assert.expect(6);
	// you can only get account details with a card
	var card = new Card({
		number: "0123456789",
		pin: "1122"
	});

	var deposit = new Deposit({
		amount: 100,
		card: card
	});

	assert.equal(deposit.attr("state"), "invalid")

	var done = assert.async();

	deposit.bind("state", function (ev, newVal) {

		if (newVal === "ready") {

			assert.ok(true, "deposit is ready")
			deposit.execute();

		} else if (newVal === "executing") {

			assert.ok(true, "executing a deposit")

		} else if (newVal === "executed") {

			assert.ok(true, "executed a deposit");
			assert.equal(deposit.attr("account.balance"), 100 + startingBalance);
			done();

		}
	});

	var startingBalance;

	Account.findAll(card, function (accounts) {
		assert.ok(true, "got accounts");
		startingBalance = accounts[0].attr("balance");
		deposit.attr("account", accounts[0]);
	});

})



QUnit.test("ATM basics", function(assert) {

	var atm = new ATM()

	assert.equal(atm.attr("state"), "readingCard", "starts at reading card state");

	atm.cardNumber("01233456789");

	assert.equal(atm.attr("state"), "readingPin", "moves to reading card state");

	atm.pinNumber("1234");

	assert.ok(atm.isVerifyingPin(), "pin is verified after set");

	assert.ok(atm.attr("state"), "readingPin", "remain in the reading pin state")


	var done = assert.async();

	atm.bind("state", function (ev, newVal) {
		
		if (newVal == "choosingTransaction") {

			assert.ok(!atm.isVerifyingPin(), "no longer verifing the pin");
			atm.chooseDeposit();

		} else if (newVal === "pickingAccount") {

			assert.ok(true, "in picking account state");
			atm.chooseAccount(atm.attr("accounts.0"))

		} else if (newVal === "depositInfo") {

			assert.ok(true, "in depositInfo state");
			atm.attr("currentTransaction.amount", 120);
			assert.ok(atm.isTransactionReady(), "is executing");
			atm.attr("currentTransaction").execute();
			assert.equal(atm.attr("state"), "depositInfo", "in deposit state");
			assert.ok(atm.isTransactionExecuting(), "is executing");

		} else if (newVal === "transactionSuccessful") {

			assert.ok(true, "in transactionSuccessful state");
			atm.attr("receiptTime",100)
			atm.printReceiptAndExit();
			
		} else if (newVal === "printingReceipt") {

			assert.ok(true, "in printingReceipt state");

		} else if (newVal === "readingCard") {

			assert.ok(true, "in readingCard state");
			assert.ok( !atm.attr("card"), "card is removed");
			assert.ok( !atm.attr("transactions"), "transactions removed");
			done();

		}

	})


})
