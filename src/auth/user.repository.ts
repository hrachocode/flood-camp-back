import { ConflictException, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { AuthCredentials } from "./dto/auth-credentilas.dto";
import { User } from "./user.entity";
const Web3 = require("web3");
//import * as Likelib from "./../../likelib_uton2/likelib-js/likelib.js"



@EntityRepository(User)
export class UserRepository extends Repository<User>{

    private logger = new Logger('UserReposisory');
    async signUp(authCredentialsDto: AuthCredentials): Promise<void> {

        const { username, password, balance } = authCredentialsDto;
        let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const data = web3.eth.accounts.create();

        const user = new User();
        user.username = username;
        user.balance = balance;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        user.privateKey = data?.privateKey;

        //console.log(user.privateKey.substring(2));

        try {
            await user.save()
        } catch (error) {

            if (error.code === '23505') {//duplicate username
                throw new ConflictException('Username alreday exists');
            }
            else {
                console.log(error);
                console.log(error.stack);

                throw new InternalServerErrorException("User don't save");
            }
        }

    }


    public async getUserById(id: number): Promise<User> {

        const found = await this.findOne(id);

        if (!found) {
            throw new NotFoundException(`User with ${id} not found `);
        }

        return found;

    }

    public async updateUserBalance(id: number, balance: number): Promise<User> {

        this.logger.verbose(`Updating  user   ${id} balance ${balance}`);

        const found = await this.getUserById(id);

        found.balance = (+found.balance) + balance;

        try {

            await found.save();

        } catch (error) {
            this.logger.error(`Failed to update  user balance`, error.stack)
            throw new InternalServerErrorException();
        }


        return found;
    }

    async validateUserPassword(authCredentialsDto: AuthCredentials): Promise<string> {

        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username })

        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }


    public async getUserBalanceById(id: number): Promise<number> {

        this.logger.verbose(`get  user   ${id} balance `);

        const found = await this.getUserById(id);

        return found?.balance;
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}