const fetch = require('node-fetch');
const {Api, JsonRpc} = require('vexaniumjs');
const {JsSignatureProvider} = require('vexaniumjs/dist/vexjs-jssig');
const {TextEncoder, TextDecoder} = require('util');

const nodes = {
    'databisnis': 'https://api.databisnis.id',
    'proit': 'https://api.vex.proit.id',
    'speakapp': 'https://vex.speakapp.me',
    'vexascan': 'https://v2.vexascan.com:2096'
};
let nodeIndex = 0;

function nextNode() {
    let keys = Object.keys(nodes);
    nodeIndex = (nodeIndex < keys.length - 1) ? nodeIndex + 1 : 0;
    return keys[nodeIndex];
}

function buildSignatureProvider() {
    return new JsSignatureProvider([process.env.ACTIVE_KEY, process.env.CRON_KEY]);
}

function initVexjs(node) {
    let signatureProvider = buildSignatureProvider();
    let rpc = new JsonRpc(nodes[node], {fetch});
    return new Api({rpc, signatureProvider, textEncoder: new TextEncoder(), textDecoder: new TextDecoder()});
}

module.exports = {initVexjs, nextNode};
