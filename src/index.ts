import { User } from "./entities/User.js";
import { Password } from "./entities/value_object/Password.js";
import { UserRepository } from "./repositories/UserRepository.js";

await UserRepository.create(
    new User("Luiz Felipe", "luizfelipecp2016@gmail.com", 
    await Password.createFromPlainText("hello123"))
);
const user = await UserRepository.findById("f0589e80-91a9-4d6f-924b-e756f8417090");
console.log(user)
