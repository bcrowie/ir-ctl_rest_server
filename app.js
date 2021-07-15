const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => console.log(`Service listening on port ${port}`));

app.use("/command", require("./commands"));