import { Admin } from "./entities/Admin.js";
import { AIPlayer } from "./entities/AIPlayer.js";
import { AIProvider } from "./entities/AIProvider.js";
import { ChatSession } from "./entities/ChatSession.js";
import { LanguageModel } from "./entities/LanguageModel.js";
import { Message } from "./entities/Message.js";
import { User } from "./entities/User.js";
import { Password } from "./entities/value_object/Password.js";

const admin = new Admin("Enzo", "enzo@unifei.edu.br", await Password.createFromPlainText("thor616"));

const user1 = new User("Luiz Felipe", "luizfelipecp2016@gmail.com", await Password.createFromPlainText("hello123"));
const user2 = new User("Fernanda", "fernanda@gmail.com", await Password.createFromPlainText("babyyoda123"));
const user3 = new User("Felipe", "lfelipe@gmail.com", await Password.createFromPlainText("olha123"));

const ai_provider1 = new AIProvider("OpenAI", "chatgpt.com", "1234");

const ai_model1 = new LanguageModel("chatgpt1.0", ai_provider1);

const ai_player1= new AIPlayer(ai_model1);

const session1 = new ChatSession(user1, user2);
const session2 = new ChatSession(user3, ai_player1);

console.log(session1.getOpponentOf(user1))


console.log(new Message("Hello!", 150));
// console.log(ai_provider1);
// console.log(ai_model1);
// console.log(ai_player1);

// console.log(session1)
// console.log(session2)

