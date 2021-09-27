const { startTheBot } = require("./bot");
const { startDB } = require("./common/db");
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const app = express();
const port = process.env.PORT || 3000;
const { router } = require("./api");

app.use(express.json({ limit: "50mb" }));

app.use(
  express.urlencoded({
    limit: "50mb",
    extended: false,
    parameterLimit: 50000,
  })
);
app.use(helmet());
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", router);

app.listen(port, async () => {
  console.log(`App listening at http://localhost:${port}`);
  await startDB();
  await runBot();
});

const runBot = async () => {
  while (1) {
    await startTheBot();
  }
};
