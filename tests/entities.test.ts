import { Admin } from "../src/entities/Admin.js";
import { AIPlayer } from "../src/entities/AIPlayer.js";
import { AIProvider } from "../src/entities/AIProvider.js";
import { ChatSession } from "../src/entities/ChatSession.js";
import { GenContentCategory } from "../src/entities/GenContentCategory.js";
import { ImageGenerationModel } from "../src/entities/ImageGenerationModel.js";
import { LanguageModel } from "../src/entities/LanguageModel.js";
import { Message } from "../src/entities/Message.js";
import { User } from "../src/entities/User.js";
import { Password } from "../src/entities/value_object/Password.js";
import { Image } from "../src/entities/Image.js";
import { PlayerJudgment } from "../src/entities/PlayerJudgment.js";
import { ImageClassificationRound } from "../src/entities/ImageClassificationRound.js";
import { HumanOrAIEnum } from "../generated/prisma/enums.js";

async function makeUser(n = 1) {
    return new User(`User${n}`, `user${n}@test.com`, await Password.createFromPlainText("test123"));
}
 
function makeProvider() {
    return new AIProvider("OpenAI", "chatgpt.com", "api-key-1234");
}
 
function makeLanguageModel(provider?: AIProvider) {
    return new LanguageModel("gpt-4", provider ?? makeProvider());
}
 
function makeImageModel(provider?: AIProvider) {
    return new ImageGenerationModel("dall-e-3", provider ?? makeProvider());
}
 
function makeCategory() {
    return new GenContentCategory("Animals", "Generate a photo of an animal");
}

describe("Entities", () => {
    describe("Admin", () => {
        it("should create an admin", async () => {
            const hashedPassword = await Password.createFromPlainText("test123");
            const admin = new Admin("Test", "test@test.com", hashedPassword);
            expect(admin).toBeDefined();
        });
    });

    describe("User", () => {
        it("should create an user", async () => {
            const hashedPassword = await Password.createFromPlainText("test123");
            const user = new User("Test", "test@test.com", hashedPassword);
            expect(user).toBeDefined();
        });
    });
    
    describe("AI Provider", () => {
        it("should create an AI provider", async () => {
            const provider = new AIProvider("OpenAI", "chatgpt.com", "1234");
            expect(provider).toBeDefined();
        });
    });

    describe("Language Model", () => {
        it("should create a language model", async () => {
            const provider = new AIProvider("OpenAI", "chatgpt.com", "1234");
            const model = new LanguageModel("chatgpt1.0", provider);
            expect(model).toBeDefined();
        });
    });
    
    describe("AI Player", () => {
        it("should create an AI player from scratch", async () => {
            const provider = new AIProvider("OpenAI", "chatgpt.com", "1234");
            const model = new LanguageModel("chatgpt1.0", provider);
            const player = new AIPlayer(model);
            expect(player).toBeDefined();
        });

        it("should create an AI player with an existing ID", async () => {
            const instanceID = "acde070d-8c4c-4f0d-9d8a-162843c10333";
            const provider = new AIProvider("OpenAI", "chatgpt.com", "1234");
            const model = new LanguageModel("chatgpt1.0", provider);
            const player = new AIPlayer(model, instanceID);
            expect(player).toBeDefined();
            expect(player.instanceID).toBe(instanceID);
        });
    });

    describe("Chat Session", () => {
        it("should create a chat session with two humans", async () => {
            const user1 = new User("Test1", "test1@gmail.com", await Password.createFromPlainText("test123"));
            const user2 = new User("Test2", "test2@gmail.com", await Password.createFromPlainText("test345"));
            const session = new ChatSession(user1, user2);
            expect(session).toBeDefined();
        });

        it("should create a chat session with one human and one AI", async () => {
            const user1 = new User("Test1", "test1@gmail.com", await Password.createFromPlainText("test123"));
            const provider = new AIProvider("OpenAI", "chatgpt.com", "1234");
            const model = new LanguageModel("chatgpt1.0", provider);
            const player = new AIPlayer(model);
            const session = new ChatSession(user1, player);
            expect(session).toBeDefined();
        });

        it("should not create a chat session with two AIs", async () => {
            const provider = new AIProvider("OpenAI", "chatgpt.com", "1234");
            const model = new LanguageModel("chatgpt1.0", provider);
            const player1 = new AIPlayer(model);
            const player2 = new AIPlayer(model);
            expect(() => new ChatSession(player1, player2)).toThrow("Two AIs cannot chat with each other");
        });

        it("should return the oponent", async () => {
            const user1 = new User("Test1", "test1@gmail.com", await Password.createFromPlainText("test123"));
            const user2 = new User("Test2", "test2@gmail.com", await Password.createFromPlainText("test345"));
            const session = new ChatSession(user1, user2);
            expect(session.getOpponentOf(user1)).toBe(user2);
            expect(session.getOpponentOf(user2)).toBe(user1);
        });

        it("should warn when user is not at the session", async () => {
            const user1 = new User("Test1", "test1@gmail.com", await Password.createFromPlainText("test123"));
            const user2 = new User("Test2", "test2@gmail.com", await Password.createFromPlainText("test345"));
            const user3 = new User("Test3", "test3@gmail.com", await Password.createFromPlainText("test789"));
            const session = new ChatSession(user1, user2);
            expect(() => session.getOpponentOf(user3)).toThrow("Player not found in this session.");
        });
    });

    describe("Message", () => {
        it("should create a message", () => {
            const msg = new Message("Hello!", 150);
            expect(msg).toBeDefined();
            expect(msg.createdAt).toBeDefined();
            expect(msg.creationDurationMs).toBe(150);
        });
 
        it("should throw when creationDurationMs is negative", () => {
            expect(() => new Message("Hello!", -1))
                .toThrow("Creation duration cannot be negative");
        });
    });

    describe("Gen Content Category", () => {
        it("should create a category", () => {
            const category = new GenContentCategory("test", "test");
            expect(category).toBeDefined();
        });
    });

    describe("Image", () => {
        it("should create an image generated by an AI model", () => {
            const provider = new AIProvider("OpenAI", "chatgpt.com", "1234");
            const model = new ImageGenerationModel("sova", provider);
            const category = new GenContentCategory("test", "test");
            const image = new Image("https://example.com/img.png", category, model);
            expect(image).toBeDefined();
        });
 
        it("should create an image uploaded by an admin", async () => {
            const admin = new Admin("Admin", "admin@test.com", await Password.createFromPlainText("admin123"));
            const category = new GenContentCategory("test", "test");
            const image = new Image("https://example.com/img.png", category, admin);
            expect(image.from).toBe(admin);
        });
    });

    describe("Player Judgment", () => {
        it("should create a judgment with a valid turing rate", async () => {
            const judge = await makeUser(1);
            const judged = await makeUser(2);
            const judgment = new PlayerJudgment(0.8, judge, judged, new Date());
            expect(judgment).toBeDefined();
            expect(judgment.turingRate).toBe(0.8);
        });
 
        it("should throw when turing rate is above 1", async () => {
            const judge = await makeUser(1);
            const judged = await makeUser(2);
            expect(() => new PlayerJudgment(1.5, judge, judged, new Date()))
                .toThrow("Invalid turing rate.");
        });
 
        it("should throw when turing rate is below 0", async () => {
            const judge = await makeUser(1);
            const judged = await makeUser(2);
            expect(() => new PlayerJudgment(-0.1, judge, judged, new Date()))
                .toThrow("Invalid turing rate.");
        });
 
        it("should accept boundary values 0 and 1", async () => {
            const judge = await makeUser(1);
            const judged = await makeUser(2);
            expect(new PlayerJudgment(0, judge, judged, new Date()).turingRate).toBe(0);
            expect(new PlayerJudgment(1, judge, judged, new Date()).turingRate).toBe(1);
        });
 
        it("should calculate a positive player score when opponent is human", async () => {
            const judge = await makeUser(1);
            const judged = await makeUser(2);
            const sessionStart = new Date(Date.now() - 10_000);
            const judgment = new PlayerJudgment(0.9, judge, judged, new Date());
            const score = judgment.calculatePlayerScore(sessionStart, true);
            expect(score).toBeGreaterThan(0);
        });
 
        it("should calculate a positive player score when opponent is AI", async () => {
            const judge = await makeUser(1);
            const aiPlayer = new AIPlayer(makeLanguageModel());
            const sessionStart = new Date(Date.now() - 10_000);
            const judgment = new PlayerJudgment(0.1, judge, aiPlayer, new Date());
            const score = judgment.calculatePlayerScore(sessionStart, false, 500);
            expect(score).toBeGreaterThan(0);
        });
 
        it("should calculate AI score as the turing rate", async () => {
            const judge = await makeUser(1);
            const judged = await makeUser(2);
            const judgment = new PlayerJudgment(0.7, judge, judged, new Date());
            expect(judgment.calculateAIScore()).toBe(0.7);
        });
    });

    describe("Image Classification Round", () => {
        async function makeRound(isAI: HumanOrAIEnum) {
            const from = isAI === HumanOrAIEnum.AI
                ? makeImageModel()
                : new Admin("Admin", "admin@test.com", await Password.createFromPlainText("admin123"));
            const image = new Image("https://example.com/img.png", makeCategory(), from);
            return image;
        }
 
        it("should create a classification round", async () => {
            const image = await makeRound(HumanOrAIEnum.AI);
            const round = new ImageClassificationRound(image, await makeUser(1));
            expect(round).toBeDefined();
            expect(round.userAnswer).toBeUndefined();
        });

    });
});