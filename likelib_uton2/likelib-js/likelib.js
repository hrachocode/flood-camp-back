const Ws = require('ws');
const Secp256k1 = require('secp256k1');
const Ripemd160 = require('ripemd160');
const Base58 = require('base-58');
const Crypto = require('crypto');
const Web3Abi = require('web3-eth-abi');
const { Console } = require('console');

class Likelib
{
    //=============================================
    static Account = class
    {
        constructor(private_key) {
            this._priv = Buffer.from(private_key, "hex");
            if(!Secp256k1.privateKeyVerify(this._priv)) {
                throw "invalid private key specified";
            }
            const public_key = Buffer.from(Secp256k1.publicKeyCreate(this._priv, false).buffer);
            const sha = Crypto.createHash('sha256').update(public_key).digest();
            const ripemd = new Ripemd160().update(sha).digest();
            this._address = Base58.encode(ripemd);
        }

        sign(tx) {
            const hash = tx.computeHash();
            const hash_of_hash = Crypto.createHash('sha256').update(hash);
            const buffer = hash_of_hash.digest().buffer;
            const arr = new Uint8Array(buffer);
            const ecdsa = Secp256k1.ecdsaSign(arr, this._priv);
            tx.sign = Buffer.concat([Buffer.from(ecdsa.signature), Buffer.from([ecdsa.recid])]).toString("base64");
        }

        getAddress() {
            const _this = this;
            return _this._address;
        }
    }


    static Tx = class Tx {
        constructor(raw) {
            this.from = raw.from;
            this.to = raw.to;
            this.amount = raw.amount;
            this.fee = raw.fee;
            this.timestamp = raw.timestamp || Math.floor((new Date()).getTime() / 1000);
            this.data = raw.data || "";
            this.sign = null;
            this.hash = null;
        }


        static Status = Object.freeze({
            Success: 0,
            Pending: 1,
            BadQueryForm: 2,
            BadSign: 3,
            NotEnoughBalance: 4,
            Revert: 5,
            Failed: 6
        })


        static ActionType = Object.freeze({
            None: 0,
            Transfer: 1,
            ContractCall: 2,
            ContractCreation: 3
        })


        _serialize() {
            let cc = this.from + this.to + this.amount + this.fee + this.timestamp + this.data;
            if(this.sign) {
                cc += this.sign;
            }
            return cc;
        }


        computeHash() {
            const _this = this;
            const raw = _this._serialize();
            const hash = Crypto.createHash('sha256').update(raw);
            this.hash = Crypto.createHash('sha256').update(raw).digest("base64");
            return hash.digest();
        }

        getHash() {
            return this.hash;
        }

    }


    static Contract = class Contract {
        static deployed(lk, account, abi, address) {
            let c = new Contract();
            c._lk = lk;
            c.abi = abi;
            c._account = account;
            c._bytecode = null;
            c._address = address;
            return c;
        }


        static nondeployed(lk, account, abi, bytecode) {
            let c = new Contract();
            c._lk = lk;
            c._account = account;
            c._abi = abi;
            c._bytecode = Buffer.from(bytecode, 'hex');
            c._address = null;
            c._setupMethods(c._abi);
            return c;
        }


        constructor() {            
        }


        deploy(...args) {
            const amount = args[args.length - 3];
            const fee = args[args.length - 2];
            const cb = args[args.length - 1];
            const spread = [...args].slice(0, args.length - 3);
            let data = this._bytecode;
            for(let i = 0; i < this._abi.length; ++i) {
                if(this._abi[i].type == 'constructor') {
                    const encoded_call = Web3Abi.encodeFunctionCall(this._abi[i], spread);
                    data = Buffer.concat([data, Buffer.from(encoded_call.replace('0x', '').slice(8, encoded_call.length), 'hex')]);
                    console.log("Concat: " + data);
                    break;
                }
            }

            if(this._address || !this._bytecode) {

                cb("Cannot deploy contract created by constructor for deployed contracts");
            }
            const ADDRESS_LENGTH = 20;
            const tx = new Likelib.Tx({
                from: this._account.getAddress(),
                to: Base58.encode(new Buffer.alloc(ADDRESS_LENGTH)),
                amount: amount,
                fee: fee,
                data: data.toString('base64')
            });
            this._account.sign(tx);
            let _this = this;
            this._lk.pushTransaction(tx, function(err, reply) {
                if(err) {
                    cb(err);
                }
                else if(reply.status_code == Likelib.Tx.Status.Pending) {
                    return;
                }
                else if(reply.status_code != Likelib.Tx.Status.Success) {
                    console.log(reply)
                    cb("Contract creation failed with status code " + reply.status_code);
                }
                else {
                    _this._address = reply.message;
                    _this._setupMethods(_this._abi);
                    cb(null, reply.fee_left)
                }
            });
        }


        _setupMethods(abi) {
            for(let i = 0; i < abi.length; ++i) {
                if(abi[i].type == 'function') {
                    this[abi[i].name] = function(...args) {
                        console.log("Call", abi[i].name)
                        const amount = args[args.length - 3];
                        const fee = args[args.length - 2];
                        const cb = args[args.length - 1];
                        let spread = [...args].slice(0, args.length - 3);
                        const encoded = Web3Abi.encodeFunctionCall(abi[i], spread);
                        const tx = new Likelib.Tx({
                            from: this._account.getAddress(),
                            to: this._address,
                            amount: amount,
                            fee: fee,
                            data: Buffer.from(encoded.replace('0x', ''), 'hex').toString('base64')
                        });
                        this._account.sign(tx);
                        const hex_hash = tx.getHash();
                        this._lk.pushTransaction(tx, function(err, reply) {
                            if(err) {
                                cb(err);
                            }
                            else if(reply.status_code != Likelib.Tx.Status.Pending && reply.status_code != Likelib.Tx.Status.Success) {
                                cb("Call failed with status " + reply.status_code);
                            }
                            else if(reply.status_code == Likelib.Tx.Status.Success) {
                                console.log(reply)
                                if(reply.message) {
                                    console.log('message',reply.message)
                                    let hex_reply = reply.message //Buffer.from(reply.message, 'base64').toString('hex');
                                    console.log('hex_reply',hex_reply)
                                    hex_reply = hex_reply.slice(8, hex_reply.length)
                                    console.log('hex_reply',hex_reply)
                                    console.log('type',abi[i].outputs[0].type)
                                    const decoded = Web3Abi.decodeParameters(abi[i].outputs, hex_reply);
                                    cb(null, decoded, hex_hash);
                                }
                                else {
                                    cb(null, hex_hash);
                                }
                            }
                        })
                    }
                }
            }
        }
    }


    constructor(url) {
        this.pendingRequests = new Map();
        this.responseHandlers = new Map();
        this.isConnected = false;
        this.nextId = 0;
        this.workingAccount = null;

        this.Ws = new Ws(url);
        this.Ws.on('message', this._on_message.bind(this));
        this.Ws.on('open', this._on_connect.bind(this));
    }

    //=============================================

    _on_connect() {
        this.isConnected = true;
        if(this.pendingRequests.size > 0) {
            this._sendAllPending();
        }
    }


    _on_message(msg) {
        let p = null;
        try {
            p = JSON.parse(msg);
        }
        catch(e) {
            console.log("Response parsing error: " + e);
            return;
        }

        const isGood = 'type' in p && 'id' in p && 'status' in p && ('result' in p ^ 'error' in p);
        if(!isGood) {
            console.log("Response parsing error: invalid set of fields");
            return;
        }

        if(Object.prototype.toString.call(p.id) === "[object String]") {
            p.id = parseInt(p.id); // TODO: remove this when server will be adjusted
        }

        if(this.responseHandlers.has(p.id)) {
            const entry = this.responseHandlers.get(p.id);
            const cb = entry.cb;

            if('error' in p) {
                cb(p.error);
            }
            else {
                cb(null, p.result);
            }

            if(entry.type == 'call') {
                this.responseHandlers.delete(p.id);
            }
        }
    }


    _sendAllPending() {
        this.pendingRequests.forEach(function(request) {
            this._send(this.nextId++, request);
        }.bind(this));
    }


    _send(id, request) {
        if(!this.isConnected) {
            this.pendingRequests.set(id, request);
            return;
        }

        if(this.pendingRequests.has(id)) {
            throw "Have such id already";
        }
        this.Ws.send(JSON.stringify(request));
    }

    _prepareRequest(type, id, method, args) {
        let request = {
            version: 2,
            type: type,
            id: id,
        };

        if(method) {
            request['name'] = method;
        }

        if(args) {
            request['args'] = args;
        }        

        return request;
    }


    _doRequest(type, method, args, cb) {
        const id = this.nextId++;
        this.responseHandlers.set(id, {type: type, cb: cb});
        console.log(this._prepareRequest(type, id, method, args))
        this._send(id, this._prepareRequest(type, id, method, args));
    }


    _doCallRequest(method, args, cb) {
        this._doRequest("call", method, args, cb);
    }  


    _doSubscribeRequest(method, args, cb) {
        this._doRequest("subscribe", method, args, cb);
    }


    _doUnsubscribeRequest(id, cb) {
        this._doRequest("unsubscribe", null, args, cb);
    }

    //=============================================

    lastBlockInfo(cb) {
        this._doCallRequest("last_block_info", {}, cb);
    }


    getAccountInfo(address, cb) {
        this._doCallRequest("account_info", {'address': address}, cb);
    }


    findBlock(param, cb) {
        if(Object.prototype.toString.call(param) === "[object String]") {
            this._doCallRequest("find_block", {'hash': param}, cb);
        }
        else {
            this._doCallRequest("find_block", {'number': param}, cb);
        }
    }


    findTransaction(hash, cb) {
        this._doCallRequest("find_transaction", {'hash': hash}, cb);
    }


    findTransactionStatus(hash, cb) {
        this._doCallRequest("find_transaction_status", {'hash': hash}, cb);
    }


    subLastBlockInfo(cb) {
        this._doSubscribeRequest("last_block_info", {}, cb);
    }


    pushTransaction(tx, cb) {
        this._doSubscribeRequest("push_transaction", {
            'from': tx.from,
            'to': tx.to,
            'amount': tx.amount.toString(),
            'fee': tx.fee.toString(),
            'timestamp': tx.timestamp,
            'data': tx.data || '',
            'sign': tx.sign,
            'hash': tx.hash
        }, cb);
    }


    subAccountInfo(address, cb) {
        this._doSubscribeRequest("account_info", {'address': address}, cb);
    }


    unsubscribe(id) {
        this._doUnsubscribeRequest(id);
    }

    //=============================================
}

module.exports = Likelib;