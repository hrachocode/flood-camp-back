import { EntityRepository, Repository } from "typeorm";
import { EACs } from "./dto/eacs.entity";


@EntityRepository(EACs)
export class EACsRepository extends Repository<EACs>{

} 