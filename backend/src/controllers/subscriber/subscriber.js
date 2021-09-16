const { PubSub } = require("@google-cloud/pubsub");

const pubSubClient = new PubSub();
const subscriptionName = "olimpiada-sub";

let messages = [];
const subscription = pubSubClient.subscription(subscriptionName);
const messageHandler = async (message) => {
  console.log(`\tData: ${message.data}`);
  // "Ack" (acknowledge receipt of) the message
  message.ack();
  messages.push({
    msg: String(message.data),
    id: message.id,
    ...message.attributes,
  });
};
subscription.on("message", messageHandler);

exports.getAll = async (req, res) => {
  // Create an event handler to handle messages
  // Listen for new messages until timeout is hit

  let lista = messages;
  messages = [];
  return res.json(lista);
};
