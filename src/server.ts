import { buildApp } from "./app.js";

const app = buildApp();

export const start = async () => {
    try {
        await app.listen({port: 3000});
        console.log("Server is running on https://localhost:3000");
    } catch (err : any) {
        app.log.error(err);
        process.exit(1);
    }
}

start();