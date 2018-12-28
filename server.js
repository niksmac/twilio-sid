"use strict";

require("dotenv").load();
const accountSid = process.env.TW_ACCOUNTSID;
const authToken = process.env.TW_AUTHTOKEN;
const CALL_RATE = process.env.CALL_RATE;
const CALL_CURRENCY = process.env.CALL_CURRENCY;

const Hapi = require("hapi");
const client = require("twilio")(accountSid, authToken);
const chargebee = require("chargebee");
chargebee.configure({
  site: "callanswering",
  api_key: process.env.CB_API
});

const server = Hapi.server({
  host: "localhost",
  port: 8000
});

server.route({
  method: "GET",
  path: "/",
  handler: function(request, h) {
    return "hello world";
  }
});

server.route({
  method: "POST",
  path: "/call",
  handler: function(request, h) {
    return client.calls.create({
      url: "http://demo.twilio.com/docs/voice.xml",
      to: request.payload.toNumber || process.env.TW_VERIFIED_NO,
      from: process.env.TW_VERIFIED_NO
    });
  }
});

server.route({
  method: "POST",
  path: "/rates",
  handler: function(request, h) {
    const sid = request.payload.sid || "CA69f225dc2ebc10d92097edd8d088eb62";
    const thisCallRate = request.payload.callRate || CALL_RATE;
    client
      .calls(sid)
      .fetch()
      .then(call => {
        const duration = call.duration;
        const roundedDuration = duration / 60;
        const callCost = Math.ceil(roundedDuration);
        const actualCallRate = callCost * thisCallRate;
        return {
          rate: actualCallRate,
          priceUnit: CALL_CURRENCY,
          meta: call
        };
      })
      .then(rate => {
        rate.k = "k";
        chargebee.invoice
          .create({
            customer_id: "HngTogORDRflVaSqd",
            charges: [
              {
                amount: 1000,
                description: "Test Support charge"
              }
            ]
          })
          .request(function(error, result) {
            if (error) {
              //handle error
              console.log(error);
            } else {
              console.log(result);
              var invoice = result.invoice;
              return "k";
            }
          });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
});

const start = async function() {
  try {
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Server running at:", server.info.uri);
};

start();
