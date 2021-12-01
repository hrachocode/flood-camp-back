const Likelib = require('../likelib-js/likelib.js');

let lk = new Likelib("ws://node.eacsclover.ml");
const account = new Likelib.Account("2aef91bc6d2df7c41bd605caa267e8d357e18b741c4a785e06650d649d650409");

const recipient = new Likelib.Account("c4233ff3dbdea94a8c9c076be53e71f36f0c788e4feaac288e53b2f65ef99c85");

const tx = new Likelib.Tx({
    from: account.getAddress(),
    to: recipient.getAddress(),
    amount: 1000000000,
    fee: 10000,
    data: "".toString('base64')
});

account.sign(tx);

lk.pushTransaction(tx, function(err, reply) {
    if(err) {
        console.log(err);
    }
    else if(reply.status_code == Likelib.Tx.Status.Pending) {
        return;
    }
    else if(reply.status_code != Likelib.Tx.Status.Success) {
        console.log(reply);
        console.log("Transfer failed with status code " + reply.status_code);
    }
    else {
        console.log("Fee left ", reply.fee_left);
    }
});

