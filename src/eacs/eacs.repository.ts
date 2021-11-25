import { EntityRepository, Repository } from "typeorm";
import { Ask } from "./dto/ask.entity";
import { EACs } from "./dto/eacs.entity";


@EntityRepository(EACs)
export class EACsRepository extends Repository<EACs>{

} 

@EntityRepository(Ask)
export class AskRepository extends Repository<Ask>{

} 