import { AdminRepository } from "./repositories/AdminRepository.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { AIProviderRepository } from "./repositories/AIProviderRepository.js";
import { AIModelRepository } from "./repositories/AIModelRepository.js";
import { CategoryRepository } from "./repositories/CategoryRepository.js";
import { ImageRepository } from "./repositories/ImageRepository.js";
import { AIModelType, HumanOrAIEnum } from "../generated/prisma/enums.js";

import { ChatSessionRepository } from "./repositories/ChatSessionRepository.js";
import { PlayerJudgmentRepository } from "./repositories/PlayerJudgmentRepository.js";
import { MessageRepository } from "./repositories/MessageRepository.js";
import { ImageClassificationRoundRepository } from "./repositories/ImageClassificationRoundRepository.js";
import { AIPlayerRepository } from "./repositories/AIPlayerRepository.js";

const id = await AIPlayerRepository.create("bc82f8b0-bd41-44af-9988-3ae2ea820f67");
await ChatSessionRepository.create("b8d83ea2-39e6-4514-8cfa-e06bb10d2cbf", id, HumanOrAIEnum.AI);
await
console.log();

// const admin = await AdminRepository.create("enzo seraphim", "enzo@unifei.edu.br", "abcdef");
// await UserRepository.create("luiz felipe", "luizfelipecp2016@gmail.com", "abcdef");
// const provider = await AIProviderRepository.create("open ai", "1234", "chatgpt.com");
// await AIModelRepository.create("chatgpt", provider.id, "/model", AIModelType.LANGUAGE_MODEL);
// const category = await CategoryRepository.create("apple", "draw an apple");
// await ImageRepository.createFromAdmin("apple", category.id, admin.id);



