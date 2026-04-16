import { AIProvider } from "../../entities/AIProvider.js";

export class AIProviderMapper {
  static toDomain(raw: any): AIProvider {
    return new AIProvider(
      raw.name,
      raw.baseURL,
      raw.apiKey,
      raw?.status
    );
  }

  static toDatabase(provider: AIProvider) : any {
    return {
        name: provider.name.value,
        baseURL: provider.baseURL,
        apiKey: provider.apiKey,
        status: provider.status
    };
  }

  static toCache(raw : any) : any {
    return {
        name: raw.name,
        baseURL: raw.baseURL,
        apiKey: raw.apiKey,
        status: raw.status
    }
  }
}
