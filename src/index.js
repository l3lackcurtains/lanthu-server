const { startTheBot } = require("./bot");

const runBot = async () => {
  while (1) {
    await startTheBot();
  }
};

runBot();
