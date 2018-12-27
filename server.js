"use strict";

require("dotenv").load();
const accountSid = process.env.TW_ACCOUNTSID;
const authToken = process.env.TW_AUTHTOKEN;
const CALL_RATE = process.env.CALL_RATE;
const CALL_CURRENCY = process.env.CALL_CURRENCY;

const Hapi = require("hapi");
const client = require("twilio")(accountSid, authToken);

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
