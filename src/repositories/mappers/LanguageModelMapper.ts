import { LanguageModel } from "../../entities/LanguageModel.js";

export class LanguageModelMapper {
  static toDomain(raw: any): LanguageModel {
    return new LanguageModel(
        raw.name,
        raw.providerId
    );
  }

  static toDatabase(model: LanguageModel) : any {
    return {
        name: model.name.value,
        providerId: model.provider
    };
  }

  static toCache(raw : any) : any {
    return {
        name: raw.name,
    }
  }
}
