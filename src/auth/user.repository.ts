import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { AuthCredentials } from "./dto/auth-credentilas.dto";
import { User } from "./user.entity";
const Web3 = require("web3");
//import * as Likelib from "./../../likelib_uton2/likelib-js/likelib.js"



@EntityRepository(User)
export class UserRepository extends Repository<User>{


    async signUp(authCredentialsDto: AuthCredentials): Promise<void> {

        const { username, password } = authCredentialsDto;
        let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const data = web3.eth.accounts.create();

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        // user.address = data?.address;
        user.privateKey = data?.privateKey;

        console.log(user.privateKey.substring(2));
        // let account = new  Likelib.Account(user.privateKey.substring(2));
        // console.log(account);
        // console.log( user.address);

        try {
            await user.save()
        } catch (error) {

            if (error.code === '23505') {//duplicate username
                throw new ConflictException('Username alreday exists');
            }
            else {
                throw new InternalServerErrorException("User don't save");
            }
        }

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

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}