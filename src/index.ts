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
import { PlayerRepository } from "./repositories/PlayerRepository.js";

const admin = await AdminRepository.create("enzo seraphim", "enzo@unifei.edu.br", "abcdef");
const user = await UserRepository.create("luiz felipe", "luizfelipecp2016@gmail.com", "abcdef");
const provider = await AIProviderRepository.create("open ai", "1234", "chatgpt.com");
const model = await AIModelRepository.create("chatgpt", provider.id, "/model", AIModelType.LANGUAGE_MODEL);
const category = await CategoryRepository.create("apple", "draw an apple");
const img = await ImageRepository.createFromAdmin("apple", category.id, admin.id);

const userPlayer = await PlayerRepository.create(user.id, HumanOrAIEnum.HUMAN);
const aiPlayer = await PlayerRepository.create(model.id, HumanOrAIEnum.AI);
const sessionId = await ChatSessionRepository.create(userPlayer, aiPlayer);
await MessageRepository.addMessage(sessionId, "aaaa", userPlayer, 1000);
await PlayerJudgmentRepository.addJudgment(0.2, user.id, sessionId, aiPlayer);
await ChatSessionRepository.endSession(sessionId);






