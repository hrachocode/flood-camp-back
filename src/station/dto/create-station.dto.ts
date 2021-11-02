import { IsNotEmpty } from "class-validator";

export class CreateStationDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    placement: string;
    supportGovernment: string;
    exploitationStart: Date;
    countryId: number;
    regionId: number;

}