import {
  isThreadTitleValid,
  isThreadBodyValid,
} from "./../common/validator/ThreadValidators";
import { QueryArrayResult, QueryOneResult } from "./QueryArrayResult";
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

export const getThreadById = async (
  id: string
): Promise<QueryOneResult<Thread>> => {
  const thread = await Thread.findOne({ id });

  if (!thread) return { messages: ["Thread not found."] };

  return { entity: thread };
};

export const getThreadsByCategoryId = async (
  categoryId: string
): Promise<QueryArrayResult<Thread>> => {
  const threads = await Thread.createQueryBuilder("thread")
    .where(`thread."categoryId" = :categoryId`, { categoryId })
    .leftJoinAndSelect("thread.category", "category")
    .orderBy("thread.createdOn", "DESC")
    .getMany();

  if (!threads) return { messages: ["Threads of category not foud."] };

  console.log(threads);

  return { entities: threads };
};
