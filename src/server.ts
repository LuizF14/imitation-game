import { buildApp } from "./app.js";

const app = await buildApp();

export const start = async () => {
    try {
        await app.listen({port: 3000});
        console.log("Server is running on https://localhost:3000");
    } catch (err : any) {
        app.log.error(err);
        process.exit(1);
    }
}

// import { Password } from "./domain/Password.js";
// import { AdminRepository } from "./repositories/AdminRepository.js";
// AdminRepository.create("luizfelipe", "luizfelipe@gmail.com", (await Password.createFromPlainText("hello123")).hash);

start();