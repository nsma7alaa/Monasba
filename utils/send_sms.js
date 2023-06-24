const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
    

const sendSMS = async (options) => {
  client.messages
    .create({
      from: options.from,
      to: options.to,
      subject: options.subject,
      body: options.message,
      // from: '+15746867218',
      // to: '+201228383363',
    });
    // .then((message) => console.log(message.sid));
};

module.exports = sendSMS;
