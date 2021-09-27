const { startTheBot } = require("./bot");
const { startDB } = require("./common/db");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const app = express();
const port = 3000;
const { router } = require("./api");

app.use(bodyParser.json({ limit: "50mb" }));

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
    parameterLimit: 50000,
  })
);
app.use(helmet());
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", router);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
  runBot();
});

const runBot = async () => {
  await startDB();

  while (1) {
    await startTheBot();
  }
};
