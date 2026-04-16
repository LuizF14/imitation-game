import { User } from "../../entities/User.js";
import { Password } from "../../entities/value_object/Password.js";

export class UserMapper {
  static toDomain(raw: any): User {
    return new User(
      raw.username,
      raw.email,
      Password.createFromHash(raw.password),
      raw.score
    );
  }

  static toDatabase(user: User) : any {
    return {
      username: user.username.value,
      email: user.email.value,
      password: user.password.hash,
      score: user.score.value
    };
  }

  static toCache(raw : any) : any {
    return {
      username: raw.username,
      email: raw.email,
      password: raw.password,
      score: raw.score
    }
  }
}
