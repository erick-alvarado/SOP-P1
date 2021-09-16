const {PubSub} = require('@google-cloud/pubsub');

const pubSubClient = new PubSub();
const subscriptionName = 'olimpiada-sub';

exports.getAll = async (req, res) => {
    const subscription = pubSubClient.subscription(subscriptionName);

    // Create an event handler to handle messages
    const messageHandler = message => {
      console.log(message);
      // "Ack" (acknowledge receipt of) the message
      //message.ack();
    };
  
    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);
};
