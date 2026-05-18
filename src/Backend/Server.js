require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Paynow } = require("paynow");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const paynow = new Paynow(
    process.env.PAYNOW_INTEGRATION_ID,
    process.env.PAYNOW_INTEGRATION_KEY
);

// URLs
paynow.resultUrl =
    "http://localhost:5000/api/paynow/update";

paynow.returnUrl =
    "http://localhost:5173/payment-success";


// CREATE PAYMENT
app.post("/api/paynow/pay", async (req, res) => {
    try {

        const {
            email,
            phone,
            amount,
            eventName
        } = req.body;

        const payment = paynow.createPayment(
            eventName,
            email
        );

        payment.add("Event Ticket", amount);

        const response = await paynow.sendMobile(
            payment,
            phone,
            "ecocash"
        );

        if (response && response.success) {
            return res.json({
                success: true,
                pollUrl: response.pollUrl,
                instructions: response.instructions
            });
        }

        console.log("Paynow Error Response:", response ? response.error : "No response");

        res.status(400).json({
            success: false,
            error: response ? response.error : "Payment provider failed to respond"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            error: "Payment failed"
        });
    }
});


// CHECK PAYMENT STATUS
app.post("/api/paynow/status", async (req, res) => {

    try {

        const { pollUrl } = req.body;

        const status = await paynow.pollTransaction(
            pollUrl
        );

        res.json(status);

    } catch (error) {

        res.status(500).json({
            error: "Failed to check status"
        });
    }
});


// CALLBACK
app.post("/api/paynow/update", (req, res) => {

    console.log("Payment Update:", req.body);

    res.sendStatus(200);
});


app.listen(5000, () => {
    console.log("Server running on port 5000");
});