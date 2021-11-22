import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { EACs } from './dto/eacs.entity';
import { EACsRepository } from './eacs.repository';
import * as Likelib from "./../../likelib_uton2/likelib-js/likelib.js"
const NFTArtifact = require("./../../likelib_uton2/uton2/truffle/build/contracts/NFT.json");

@Injectable()
export class EACsService {

    private logger = new Logger('EACsService');

    constructor(@InjectRepository(EACsRepository)
    private eacsRepository: EACsRepository) { }

    public async getAllEACs(user: User): Promise<EACs[]> {


        const query = this.eacsRepository.createQueryBuilder('eacs');
        query.where('eacs.userId = :userId', { userId: user.id })

        const eacs = await query.getMany();

        return eacs;
    }

    public async getEACsById(id: number, user: User): Promise<EACs> {

        const found = await this.eacsRepository.findOne({ where: { id, userId: user.id } });

        if (!found) {
            throw new NotFoundException(`EACs with ${id} not found `);
        }

        return found;

    }

    public async createEACs(eacsInput: EACs, user: User): Promise<EACs> {

        let eacs = this.eacsRepository.create(eacsInput);
        eacs.user = user;

        let account = new Likelib.Account("2aef91bc6d2df7c41bd605caa267e8d357e18b741c4a785e06650d649d650409");//(user.privateKey.substring(2));
        let lk = new Likelib("ws://91.229.218.238:50054");

        const recipient = new Likelib.Account("c4233ff3dbdea94a8c9c076be53e71f36f0c788e4feaac288e53b2f65ef99c85");

        eacs.fromAddress = account.getAddress();
        eacs.toAddress = recipient.getAddress();

        const tx = new Likelib.Tx({
            from: account.getAddress(),
            to: recipient.getAddress(),
            amount: eacsInput.energyAmount,
            fee: 10000,
            data: "".toString()
        });

        account.sign(tx);

        const accountTrasaction: any = () => {
            return new Promise((res, rej) => {
                lk.pushTransaction(tx, function (err, reply) {
                    if (err) {
                        console.log(err);
                        rej(err)
                    }
                    else if (reply.status_code == Likelib.Tx.Status.Pending) {
                        return;
                    }
                    else if (reply.status_code != Likelib.Tx.Status.Success) {
                        console.log(reply);
                        console.log("Transfer failed with status code " + reply.status_code);
                    }
                    else {
                        res(reply.fee_left)
                        console.log("Fee left ", reply.fee_left);
                    }
                })
            }
            );
        };
        await accountTrasaction();

        const abi = NFTArtifact.abi;
        const compiled = NFTArtifact.bytecode.slice(2);


        let contract = Likelib.Contract.nondeployed(lk, account, abi, compiled);

        const contractDeploy: any = () => {
            return new Promise((res, rej) => {

                setInterval(() => {
                    return new NotFoundException("During Contract deploy server doesn't response long time , Please run again")
                }, 7200 * 1000)


                contract.deploy(10, 1636539480, 1636971480, 0, 1000000, function (err, fee_left) {
                    if (err) {
                        console.log("Error during deployment: " + err);
                        rej(err)
                    }
                    else {
                        res(contract._address)
                        console.log("Contract was successfully deployed fee_left: " + fee_left);
                        console.log("Contract address: " + contract._address + " Set it address in contract call");

                    }
                });
            });
        };

        eacs.contractAddress = await contractDeploy();
        await eacs.save();
        delete eacs.user;
        return eacs;

    }


    public async deleteEACs(id: number, user: User): Promise<void> {

        const result = await this.eacsRepository.delete({ id, userId: user.id });

        if (result.affected === 0) {
            throw new NotFoundException(`EACs with ID "${id}" not found`)
        }

    }
}
