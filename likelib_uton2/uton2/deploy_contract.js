const Likelib = require('../likelib-js/likelib.js');
const bs58 = require('bs58');
const NFTArtifact = require('./truffle/build/contracts/NFT.json');
//const NFTStoreArtifact = require('./truffle/build/contracts/NFTStore.json');


let lk = new Likelib("ws://node.eacsclover.ml");
const account = new Likelib.Account("2aef91bc6d2df7c41bd605caa267e8d357e18b741c4a785e06650d649d650409"); //private key
//0x7BB1af1242c890F71d03822cC600fD31ddd541c5 // public key


const abi = NFTArtifact.abi;
const compiled = NFTArtifact.bytecode.slice(2);

let contract = Likelib.Contract.nondeployed(lk, account, abi, compiled);


// NFT contract deployment

contract.deploy(10, 1636539480,1636971480, 0, 100000000, function(err, fee_left) {
    if(err) {
        console.log("Error during deployment: " + err);
    }
    else {
        console.log("Contract was successfully deployed fee_left: " + fee_left);
        console.log("Contract address: " + contract._address + " Set it address in contract call");
        
    }
});



// NFT Store contract deployment

// contract.deploy(0, 100000000, function(err, fee_left) {
//     if(err) {
//         console.log("Error during deployment: " + err);
//     }
//     else {
//         console.log("Contract was successfully deployed fee_left: " + fee_left);
//         console.log("Contract address: " + contract._address + " Set it address in contract call");
        
//     }
// });



