#!/usr/bin/env node
const assert = require('assert');
var fs = require("fs");
var solc = require('solc');
var Artifactor = require("truffle-artifactor"); 
const input = fs.readFileSync("../contracts/Mortgage.sol");
const output = solc.compile(input.toString(), 1);
console.log(output.errors);
const bytecode = output.contracts[':Mortgage'].bytecode;
const abi = JSON.parse(output.contracts[':Mortgage'].interface);
var async = require("async");
var TestRPC = require("ethereumjs-testrpc");
var TruffleContract = require('truffle-contract');
var Web3 = require("web3");
const util = require('util');
var Contract;
var DeployedContract;
var allAccounts;

var provider = TestRPC.provider({
//   fork: "http://localhost:8545@" + block,
  total_accounts: 10,
  time:new Date(),
//   verbose: true,
//   gasLimit: 
//   accounts:[
//       {secretKey:"0x7231a774a538fce22a329729b03087de4cb4a1119494db1c10eae3bb491823e7", balance: 20000000000000000000}
//     // {balance: 20000000}
//     //   ,
//     // {balance: 20000000}
// ],
  mnemonic: "42",
  logger: console
});
var web3 = new Web3(provider);

const sendAsyncPromisified = util.promisify(provider.sendAsync).bind(provider);
var tmp_func = web3.eth.getBalance;
delete tmp_func['call'];
const getBlockNumberPromisified= util.promisify(web3.eth.getBlockNumber);
const getBalancePromisified = util.promisify(tmp_func).bind(web3.eth);
const artifactor = new Artifactor("./build/contracts");
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function getBalance(address) {
    return async function(){
        if (!address){
            address = DeployedContract.address;
        }
        console.log("Getting balance of "+address);
        var res = await getBalancePromisified.call(web3.eth, address);
        console.log(res.toNumber());
        console.log("Got balance");
    }
}

function printResultsArray(results){
    results.forEach((el) => {
        if (el.__proto__ && el.__proto__.constructor.name == "BigNumber"){
            console.log(el.toNumber());
        }
        else if (typeof el == "string"){
            console.log(el);
        }
        else{
            console.log(web3.toAscii(el));
        }
    })
}

// function jump(duration) {
//     return async function() {
//       console.log("Jumping " + duration + "...");

//       var params = duration.split(" ");
//       params[0] = parseInt(params[0])

//       var seconds = moment.duration.apply(moment, params).asSeconds();
//       await sendAsyncPromisified({
//         jsonrpc: "2.0",
//         method: "evm_mine",
//         params: [seconds],
//         id: new Date().getTime()
//         });
//     }
// }



function deployContract(parties, rosreestr, depository) {
    return async function() {
            console.log("Deploying contract...");
            DeployedContract = await Contract.new(parties, rosreestr, depository);
            console.log("Deployed at " + DeployedContract.address);
    }
}



function createEdition() {
    return async function() {
            console.log("Creating edition...");
            res = await DeployedContract.createEdition.call();
            console.log(res.toNumber());
            res = await DeployedContract.createEdition();
            console.log(res);
    }
}

function appendToEdition(fieldName, fieldTag, fieldValue, editionID) {
    return async function() {
            console.log("Appending to edition...");
            res = await DeployedContract.appendToEdition.call(fieldName, fieldTag, fieldValue, editionID);
            console.log(res);
            res = await DeployedContract.appendToEdition(fieldName, fieldTag, fieldValue, editionID);
            console.log(res);
    }
}

function getNumFieldsInEdition(editionID) {
    return async function() {
            console.log("Num fields in edition...");
            res = await DeployedContract.getNumberOfFieldsInEdition(editionID);
            console.log(res.toNumber());
    }
}

function finalizeEdition(editionID) {
    return async function() {
            console.log("Finalizing edition...");
            res = await DeployedContract.finalizeEdition.call(editionID);
            console.log(res);
            res = await DeployedContract.finalizeEdition(editionID);
            console.log(res);
    }
}

function confirmEdition(editionID, fromAcc) {
    return async function() {
            console.log("Comfirming edition...");
            res = await DeployedContract.confirmEdition.call(editionID, {from:fromAcc});
            console.log(res);
            res = await DeployedContract.confirmEdition(editionID,{from:fromAcc});
            console.log(res);
    }
}

function getEditionContent(fieldNameNum, editionID) {
    return async function() {
            console.log("Getting edition content...");
            res = await DeployedContract.getEditionContent(fieldNameNum, editionID);
            printResultsArray(res);
    }
}

function getUID() {
    return async function() {
            console.log("Getting UID...");
            res = await DeployedContract.UID();
            console.log(res.toString(64));
    }
}

function getRequired() {
    return async function() {
            console.log("Getting required...");
            res = await DeployedContract.required();
            console.log(res.toNumber());
    }
}

function getNumFields() {
    return async function() {
            console.log("Getting number of fields in mortgate...");
            res = await DeployedContract.fieldNamesCount();
            console.log(res.toNumber());
    }
}

function getLastAcceptedEdition() {
    return async function() {
            console.log("Getting last accepted edition...");
            res = await DeployedContract.lastAcceptedEdition();
            console.log(res.toNumber());
    }
}

function getFieldContent(fieldNameNum) {
    return async function() {
            console.log("Getting mortgate content...");
            res = await DeployedContract.getFieldContent(fieldNameNum);
            printResultsArray(res);
    }
}



function mine(numBlocks){
    return async function() {
    console.log("Mining a block");
    for (var i=0; i< numBlocks; i++){
        await sendAsyncPromisified({
                jsonrpc: "2.0",
                method: "evm_mine",
                params: [],
                id: new Date().getTime()
        });
    }
    }
}

function populate_def_acc(){
    return function(callback){ 
     web3.eth.getAccounts(function(err, accounts) {
        if (err || !accounts){
            console.log(err);
            console.log("Second entry")
            return;
        }
        allAccounts = accounts;
        callback();
     });
    }
}

    web3.eth.getAccounts(async function(err, accounts) {
        if (err || !accounts){
            console.log(err);
            console.log("Second entry")
            return;
        }
        allAccounts = accounts;
        await artifactor.save({contract_name: "Mortgage",  abi: abi, unlinked_binary: bytecode});
        Contract = new TruffleContract(require("../build/contracts/Mortgage.json"));
        [Contract].forEach(function(contract) {
            contract.setProvider(web3.currentProvider);
            contract.defaults({
            gas: 3.5e6,
            from: allAccounts[0]
            })
        });
        try {
        await deployContract([accounts[0], accounts[1]], accounts[2], accounts[3])();
        await getUID()();
        await getRequired()();
        await createEdition()();
        await appendToEdition("test", 1, "test",1)();
        await getNumFieldsInEdition(1)();
        await getEditionContent(0,1)();
        await finalizeEdition(1)();
        await confirmEdition(1, accounts[0])();
        await confirmEdition(1, accounts[1])();
        await confirmEdition(1, accounts[2])();
        await confirmEdition(1, accounts[3])();
        await getNumFields()();
        await getLastAcceptedEdition()();
        await getFieldContent(0)();
        }
        catch (err){
            console.log(err);
        }
        
    });

