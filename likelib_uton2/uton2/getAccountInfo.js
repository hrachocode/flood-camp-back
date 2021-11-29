const Likelib = require('../likelib-js/likelib.js');

let lk = new Likelib("ws://91.229.218.238:50054");
const account = new Likelib.Account("1d656a3dd121455faaad38837b9d966c3f86fc1af1f15202f445613bfcd29e45");

console.log(lk.getAccountInfo(account.getAddress(), function(err, reply) {
    if(err) {
        console.log(err);
    }
    else if(reply.status_code != Likelib.Tx.Status.Success) {
        console.log(reply);
    }
    else {
        console.log(reply);
    }
}));


// 0.996675995 1d 
// 0.996675995