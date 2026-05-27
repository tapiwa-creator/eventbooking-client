require('dotenv').config();
const { Paynow } = require("paynow");

const paynow = new Paynow(
    process.env.PAYNOW_INTEGRATION_ID,
    process.env.PAYNOW_INTEGRATION_KEY
);

paynow.resultUrl = "http://localhost:5000/api/paynow/update";
paynow.returnUrl = "http://localhost:5173/payment-success";

async function test() {
    try {
        console.log("Creating payment...");
        // Omit authemail in test mode
        const payment = paynow.createPayment("Test Event");
        payment.add("Event Ticket", 10.0);

        console.log("Sending mobile payment...");
        const response = await paynow.sendMobile(payment, "0771111111", "ecocash");
        console.log("Response:", response);
    } catch (e) {
        console.error("Exception:", e);
    }
}

test();
