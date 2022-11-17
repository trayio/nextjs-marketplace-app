const jwt = require('jsonwebtoken');

const json_to_tokenize = {
    "id": "marketplace-demo",
    "name": "Marketplace Demo User",
    "instanceId": "9d9977c8-782f-404a-bd69-a91d043ec9e3",
    "message": "You have been invited by ronnieredhat@tray.io to update the following solution"
  }

const token = jwt.sign(JSON.stringify(json_to_tokenize), process.env.MASTER_TOKEN)

console.log('token:', token)
