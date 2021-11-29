const Likelib = require('../likelib-js/likelib.js');

let lk = new Likelib("ws://node.eacsclover.ml:50054");
const account = new Likelib.Account("c4233ff3dbdea94a8c9c076be53e71f36f0c788e4feaac288e53b2f65ef99c85");

console.log(account.getAccountInfo(account.getAddress(), function(err, reply) {
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
