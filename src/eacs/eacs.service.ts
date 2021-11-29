import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { EACs } from './dto/eacs.entity';
import { AskRepository, EACsRepository } from './eacs.repository';
import * as Likelib from "./../../likelib_uton2/likelib-js/likelib.js"
import { IsAskDto } from './dto/isAsk.dto';
import { Ask } from './dto/ask.entity';
import { BindsType } from './dto/bindsType.dto';
const NFTArtifact = require("./../../likelib_uton2/uton2/truffle/build/contracts/NFT.json");

@Injectable()
export class EACsService {

    private logger = new Logger('EACsService');

    constructor(@InjectRepository(EACsRepository)
    private eacsRepository: EACsRepository,
        @InjectRepository(AskRepository)
        private askRepository: AskRepository) { }

    public async getAllEACs(user: User): Promise<EACs[]> {


        const query = this.eacsRepository.createQueryBuilder('eacs');
        query.where('eacs.userId = :userId', { userId: user.id })

        const eacs = await query.orderBy('eacs.id').getMany();

        return eacs;
    }


    public async getAllAskEACs(user: User): Promise<EACs[]> {

        const query = this.eacsRepository.createQueryBuilder('eacs');
        query.where('eacs.userId != :userId AND eacs.isAsk  = :isAsk AND eacs.isArchive  = :isArchive', { userId: user.id, isAsk: true, isArchive: false })

        const eacs = await query.orderBy('eacs.id').getMany();

        return eacs;
    }

    public async getEACsById(id: number, user: User): Promise<EACs> {

        const found = await this.eacsRepository.findOne({ where: { id, userId: user.id } });

        if (!found) {
            throw new NotFoundException(`EACs with ${id} and user ${user.id}  not found `);
        }

        return found;

    }

    public async getBindEACsById(id: number, user: User): Promise<Ask[]> {

        const query = this.askRepository.createQueryBuilder('ask');
        query.where('ask.eacsId = :eacsId', { eacsId: id })

        const ask = await query.orderBy('ask.price', "DESC").getMany();

        return ask;

    }


    public async getAskByEACsUserId(eacsId: number, userId: number): Promise<Ask> {

        const found = await this.askRepository.findOne({ where: { eacsId: eacsId, userId: userId } });

        return found;

    }

    public async bindAskEACs(bindsType: BindsType, user: User): Promise<Ask> {

        const ask = await this.getAskByEACsUserId(bindsType.eacsId, user.id);


        if (ask) {

            ask.eacsId = bindsType.eacsId;
            ask.userId = user.id;
            ask.price = bindsType.price;
            ask.userName = user.username;
            await ask.save();
        }

        else {

            let ask = this.askRepository.create({ eacsId: bindsType.eacsId, userId: user.id, userName: user.username, price: bindsType.price });
            await ask.save();
        }

        return ask;

    }



    public async updateEACsAsk(id: number, isAskDto: IsAskDto, user: User): Promise<EACs> {

        const updatedEACs = await this.getEACsById(id, user);

        updatedEACs.isAsk = isAskDto?.isAsk;
        updatedEACs.price = isAskDto?.price;

        try {

            await updatedEACs.save();


        } catch (error) {
            this.logger.error(`Failed to update  isAsk and price`, error.stack)
            throw new InternalServerErrorException();
        }


        return updatedEACs;
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

    public async createAsk(askInput: Ask): Promise<Ask> {

        let ask = this.askRepository.create(askInput);

        try {

            await ask.save();

        } catch (error) {

            this.logger.error(`Failed to create a ask`, error.stack)
            throw new InternalServerErrorException();

        }

        return ask;

    }

    public async getAskById(id: number): Promise<Ask> {

        const found = await this.askRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Ask with ${id}   not found `);
        }

        return found;

    }

    public async confirmAskEACs(id: number, user: User): Promise<EACs> {


        const updatedBids = await this.getAskById(id);

        const updatedEACs = await this.getEACsById(updatedBids.eacsId, user);
        updatedEACs.isArchive = true;

        try {

            await updatedEACs.save();

        } catch (error) {
            this.logger.error(`Failed to update  Ask  archive`, error.stack)
            throw new InternalServerErrorException();
        }

        try {

            const query = this.askRepository.createQueryBuilder('ask');
            await query.update()
                .set({ isArchive: true })
                .where(`eacsId = :eacsId`, { eacsId: updatedBids.eacsId })
                .execute();

        } catch (error) {
            this.logger.error(`Failed to update  Ask  archive`, error.stack)
            throw new InternalServerErrorException();
        }

        return updatedEACs;
    }
}
