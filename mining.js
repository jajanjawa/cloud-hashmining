const fetch = require('node-fetch');
const {initVexjs} = require('./vex');

const api = initVexjs("speakapp");

const MINE_BITVEXA = 'mine.bitvexa';
const MINER_ACCOUNT = process.env.MINER_ACCOUNT;
let taskID = 0;

function randomID(mask, map) {
    if (mask === void 0) {
        mask = 'xxxx-xxxx-xxxx';
    }
    if (map === void 0) {
        map = '0123456789abcdef';
    }
    const length = map.length;
    return mask.replace(/x/g, () => map[Math.floor(Math.random() * length)]);
}

function minerEnter(account) {
    const endPoint = 'https://api.bitvexa.id/v1/users/enter';
    fetch(endPoint, {
        method: "POST",
        headers: {"Content-Type": "application/json;charset=UTF-8"},
        body: JSON.stringify({name: account})
    });
}

async function doMining(account) {
    try {
        await api.getAbi(MINE_BITVEXA);
        const tx = api.buildTransaction();
        const authorization = [{actor: account, permission: 'cron'}];
        tx.with(MINE_BITVEXA).as(authorization).hashmining(account, randomID());

        let result = await tx.send({blocksBehind: 3, expireSeconds: 30});
        return `berhasil: ${result.transaction_id}`;
    } catch (e) {
        console.error(e.message);
        throw new Error("terjadi kesalahan");
    }
}

async function hashmining(req, res) {
    try {
        minerEnter(MINER_ACCOUNT);
        let response = await doMining(MINER_ACCOUNT);
        return res.json(response);
    } catch (e) {
        return res.json(e.message);
    } finally {
        if (taskID > 0) clearInterval(taskID);
        taskID = setInterval(() => {
            doMining(MINER_ACCOUNT);
        }, 1000);
    }
}

module.exports = {hashmining};
