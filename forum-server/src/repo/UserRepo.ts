import bcrypt from "bcryptjs";
import { User } from "./User";
import { isPasswordValid } from "../common/validator/PasswordValidator";
import { isEmailValid } from "../common/validator/EmailValidator";

const saltRounds = 10;

export class UserResult {
  constructor(public messages?: Array<string>, public user?: User) {}
}

export const register = async (
  email: string,
  userName: string,
  password: string
): Promise<UserResult> => {
  const result = isPasswordValid(password);
  if (!result.isValid) {
    return {
      messages: [
        "Passwords must contain a min length of 8, 1 or more uppercase character, 1 or more number, and 1 or more symbol",
      ],
    };
  }

  const trimmedEmail = email.trim().toLowerCase();
  const emailErrorMsg = isEmailValid(trimmedEmail);

  if (emailErrorMsg) {
    return {
      messages: [emailErrorMsg],
    };
  }

  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userEntity = await User.create({
    email: trimmedEmail,
    userName,
    password: hashedPassword,
  }).save();

  userEntity.password = "";
  return {
    user: userEntity,
  };
};

export const login = async (
  userName: string,
  password: string
): Promise<UserResult> => {
  const user = await User.findOne({
    where: { userName },
  });

  if (!user) {
    return {
      messages: [userNotFound(userName)],
    };
  }

  if (!user.confirmed) {
    return {
      messages: ["User has not confirmed their registration email yet."],
    };
  }

  const passwordMatch = await bcrypt.compare(password, user?.password);

  if (!passwordMatch) {
    return {
      messages: ["Password is invalid."],
    };
  }

  return {
    user,
  };
};

function userNotFound(userName: string) {
  return `User with userName ${userName} not found.`;
}