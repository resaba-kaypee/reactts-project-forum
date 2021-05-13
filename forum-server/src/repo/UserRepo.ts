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
  email: string,
  password: string
): Promise<UserResult> => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    return {
      messages: [userNotFound(email)],
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

export const logout = async (email: string): Promise<string> => {
  const user = await User.findOne({
    where: { email },
  });

  console.log(user);

  if (!user) return userNotFound(email);

  return `User logged off.`;
};

export const me = async (id: string): Promise<UserResult> => {
  const user = await User.findOne({
    where: { id },
    relations: [
      "threads",
      "threads.threadItems",
      "threadItems",
      "threadItems.thread",
    ],
  });

  if (!user) return { messages: ["User not found."] };

  if (!user.confirmed)
    return {
      messages: ["User has not confirmed their email registration yet."],
    };

  return { user };
};

function userNotFound(email: string) {
  return `User with email ${email} not found.`;
}
