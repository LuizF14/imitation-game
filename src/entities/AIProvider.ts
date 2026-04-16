import type { AIModel } from "./AIModel.js";
import { ProviderStatusEnum } from "./enums/ProviderStatusEnum.js";
import { Text } from "./value_object/Text.js";

export class AIProvider {
    public name : Text;
    public baseURL : string;
    public apiKey : string;
    public status : ProviderStatusEnum = ProviderStatusEnum.PENDING;
    public models : AIModel[] = [];

    constructor(name : string, baseURL : string, apiKey : string, status? : ProviderStatusEnum) {
        this.name = new Text(name, 60);
        this.apiKey = apiKey;
        this.baseURL = baseURL;
        this.status = ProviderStatusEnum.PENDING ?? status;
    }
}