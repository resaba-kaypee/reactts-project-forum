import {
  isThreadTitleValid,
  isThreadBodyValid,
} from "./../common/validator/ThreadValidators";
import { QueryArrayResult } from "./QueryArrayResult";
import { Thread } from "./Thread";
import { User } from "./User";
import { ThreadCategory } from "./ThreadCategory";

export const createThread = async (
  userId: string,
  categoryId: string,
  title: string,
  body: string
): Promise<QueryArrayResult<Thread>> => {
  const titleMsg = isThreadTitleValid(title);
  if (titleMsg) return { messages: [titleMsg] };

  const bodyMsg = isThreadBodyValid(body);
  if (bodyMsg) return { messages: [bodyMsg] };

  const user = await User.findOne({ id: userId });
  if (!user) return { messages: ["User not logged in."] };

  const category = await ThreadCategory.findOne({ id: categoryId });
  if (!category) return { messages: ["Category not found."] };

  const thread = await Thread.create({ title, body, user, category }).save();
  if (!thread) return { messages: ["Failed to create thread."] };

  return { messages: ["Thread created successfully."] };
};
