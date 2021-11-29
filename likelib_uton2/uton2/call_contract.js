const Likelib = require('../likelib-js/likelib.js');
const NFTArtifact = require('./truffle/build/contracts/NFT.json');

function sleep() {
  delay = 2000
  delay += new Date().getTime();
  while (new Date() < delay){}
}

let lk = new Likelib("ws://node.eacsclover.ml:50051");
const account = new Likelib.Account("2aef91bc6d2df7c41bd605caa267e8d357e18b741c4a785e06650d649d650409");

const abi = NFTArtifact.abi;


const contract_address = '3t4YXZ3DTQrQ2jwh6HnXa9YhxqAY'


let contract = Likelib.Contract.deployed(lk, account, abi, contract_address);
console.log("Try setup methods, contract address: " + contract._address)
contract._setupMethods(abi);
console.log("Property of contract: " + Object.getOwnPropertyNames(contract))


contract.mint(0, 500000, function(err, result, hash) {
    if(err){
        console.log("Error while get: " + err);
    }else{
	  console.log("Result is: " + result.data);
      // console.log("Hash: " + hash);
      sleep();
    }
});


contract.getProducedAmount(0, 500000, function(err, result, hash) {
    if(err){
        console.log("Error while get: " + err);
    }else{
      	console.log("Result is: " + result.data);
        // console.log("Hash: " + hash);
        sleep();
    }
});



/*
	Decode base58 address to hex
	Used to pass an address as an argument to solidity functions
*/
// const address = '5raaqQegnrqXW6haKjzjTKn4Sgq'
// const bytes = bs58.decode(address)
// let add = "0x" + bytes.toString('hex')
// console.log(add)

