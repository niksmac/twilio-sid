# twilio-sid

Twilio SID tracking API

```
Scope: Create an endpoint which takes the Twilio SID (a specific call) and creates a transaction in Charge we with the following parameters:

> Call_Cost = call duration rounded up to the nearest minute (so 110 seconds would be 2 minutes) and multiplied by the Call_Rate = \$0.90
```

## Install

- Run `nvm use`
- Rum `cp .env.example .env` and fill in Twilio account details
- Run `yarn` or `npm install`
- Run `node server.js` or nodeomon, pm2 as you please.

## API

Base URL : `http://localhost:8000`

### Make Call

- endpoint: `/call`
- method: `POST`
- parameters:
  - `toNumber`: the number you want to call to

### Get Call rate

- endpoint: `/rates`
- method: `POST`
- parameters:
  - `sid`: SID of the call (hardcoded one default SID)
  - `callRate`: (Optional) If you want to play with it.
