
module("ATM system")

test("Good Card", function () {

	var c = new Card({
		number: "01234567890",
		pin: 1234
	});

	equal(c.attr("state"), "unverified");

	stop();

	c.verify();

	c.bind("state", function (ev, newVal) {

		equal(newVal, "verified", "card is verified");

		start();
	});

	equal(c.attr("state"), "verifying", "card is verifying");
})

test("Bad Card", function () {

	var c = new Card({});

	equal(c.attr("state"), "unverified");

	stop();

	c.verify();

	c.bind("state", function (ev, newVal) {

		equal(newVal, "invalid", "card is invalid");

		start();
	})

	equal(c.attr("state"), "verifying");
})

test("Deposit", function () {

	expect(6);
	// you can only get account details with a card
	var card = new Card({
		number: "0123456789",
		pin: "1122"
	});

	var deposit = new Deposit({
		amount: 100,
		card: card
	});

	equal(deposit.attr("state"), "invalid")

	stop();

	deposit.bind("state", function (ev, newVal) {

		if (newVal === "ready") {

			ok(true, "deposit is ready")
			deposit.execute();

		} else if (newVal === "executing") {

			ok(true, "executing a deposit")

		} else if (newVal === "executed") {

			ok(true, "executed a deposit");
			equal(deposit.attr("account.balance"), 100 + startingBalance);
			start();

		}
	});

	var startingBalance;

	Account.findAll(card, function (accounts) {
		ok(true, "got accounts");
		startingBalance = accounts[0].attr("balance");
		deposit.attr("account", accounts[0]);
	});

})



test("ATM basics", function () {

	var atm = new ATM()

	equal(atm.attr("state"), "readingCard", "starts at reading card state");

	atm.cardNumber("01233456789");

	equal(atm.attr("state"), "readingPin", "moves to reading card state");

	atm.pinNumber("1234");

	ok(atm.isVerifyingPin(), "pin is verified after set");

	ok(atm.attr("state"), "readingPin", "remain in the reading pin state")


	stop();

	atm.bind("state", function (ev, newVal) {
		
		if (newVal == "choosingTransaction") {

			ok(!atm.isVerifyingPin(), "no longer verifing the pin");
			atm.chooseDeposit();

		} else if (newVal === "pickingAccount") {

			ok(true, "in picking account state");
			atm.chooseAccount(atm.attr("accounts.0"))

		} else if (newVal === "depositInfo") {

			ok(true, "in depositInfo state");
			atm.attr("currentTransaction.amount", 120);
			ok(atm.isTransactionReady(), "is executing");
			atm.attr("currentTransaction").execute();
			equal(atm.attr("state"), "depositInfo", "in deposit state");
			ok(atm.isTransactionExecuting(), "is executing");

		} else if (newVal === "transactionSuccessful") {

			ok(true, "in transactionSuccessful state");
			atm.attr("receiptTime",100)
			atm.printReceiptAndExit();
			
		} else if (newVal === "printingReceipt") {

			ok(true, "in printingReceipt state");

		} else if (newVal === "readingCard") {

			ok(true, "in readingCard state");
			ok( !atm.attr("card"), "card is removed");
			ok( !atm.attr("transactions"), "transactions removed");
			start();

		}

	})


})
