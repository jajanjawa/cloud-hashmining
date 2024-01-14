require("dotenv").config();
const fetch = require('node-fetch');
const {initVexjs, nextNode} = require('./vex');

const MINE_BITVEXA = 'mine.bitvexa';
const MINER_ACCOUNT = process.env.MINER_ACCOUNT;

let api = initVexjs(nextNode());
let loop = 1;

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

function readBalance() {
    api.rpc.get_currency_balance("bitvexatoken", MINER_ACCOUNT, "BTV").then(res => {
        console.log(`saldo ${MINER_ACCOUNT} ===> ${res[0]}`);
    });
}

async function doMining(account) {
    try {
        await api.getAbi(MINE_BITVEXA);
        const tx = api.buildTransaction();
        const authorization = [{actor: account, permission: 'active'}];
        tx.with(MINE_BITVEXA).as(authorization).hashmining(account, randomID());

        let result = await tx.send({blocksBehind: 3, expireSeconds: 30});
        let cpu_usage = result.processed.receipt.cpu_usage_us;

        let msg = `txid: ${result.transaction_id}, cpu usage: ${cpu_usage}`;
        console.log(msg);

        if (loop % 10 === 0) {
            api = initVexjs(nextNode());
            api.getAbi(MINE_BITVEXA);
            console.log('node ===> ', api.rpc.endpoint);
        }
        if (loop % 15 === 0) {
            readBalance();
            console.log('jumlah nambang ===> ', loop);
        }
        if (loop % 30 === 0) {
            minerEnter(MINER_ACCOUNT);
        }
    } catch (e) {
        console.log(e.message);
    }
}

function hashmining() {
    try {
        doMining(MINER_ACCOUNT);
        loop++;
    } catch (e) {
        console.log(e.message);
    } finally {
        setTimeout(hashmining, 1000);
    }
}

hashmining();
