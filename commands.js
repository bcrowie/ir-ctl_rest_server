const { exec } = require('child_process');
const { Router } = require('express');
const Codes = require('./codes.json');
const listener = new Router();

const txIr = (cmd) => {
    exec(`ir-ctl -S necx:${cmd}`)
}

listener.get("/:command", async (req, res) => {
    const { command } = req.params;

    if (Codes[command]) {
        txIr(Codes[command]);
        res.status(200).json({ msg: "Success" });
    } else {
        res.status(404).json({ msg: "Failed" });
    }
});

module.exports = listener;
