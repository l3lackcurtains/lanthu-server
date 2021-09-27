const gcm = require("node-gcm");
require("dotenv").config();
// Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
const sender = new gcm.Sender(process.env.FB_KEY);

const sendMessage = (title, body) => {
  const message = new gcm.Message({
    notification: {
      title: title,
      icon: "ic_launcher",
      body: body,
    },
  });

  const devices = await DeviceModal.find();

  console.log(devices);

  // Specify which registration IDs to deliver the message to
  const registeredDevices = [
    "cvfmYPziRHq9DZfNhkUwIp:APA91bG_pAUgnyD4bZl6OfZycT9VADeXSo3NsjditobBla9ecH-Gbtc022XgB7PGZepqaxQqSLZ9O8HAp8zyl0DqkeOXMjeZpjLarlwuuuqVJXYbMsU1DFiGJBZ0--mVk0VRZuj7Zkie",
  ];

  // Actually send the message
  sender.send(
    message,
    { registrationTokens: registeredDevices },
    function (err, response) {
      if (err) console.error(err);
      else console.log("Notification sent.");
    }
  );
};

sendMessage("Hello", "test");

module.exports = { sendMessage };
