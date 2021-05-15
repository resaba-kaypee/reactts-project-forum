import { updateThreadItemPoint } from "./../repo/ThreadItemPointRepo";
import { ThreadCategory } from "./../repo/ThreadCategory";
import { updateThreadPoint } from "./../repo/ThreadPointRepo";
import { createThread } from "./../repo/ThreadRepo";
import { Thread } from "./../repo/Thread";
import { IResolvers } from "apollo-server-express";
import { QueryOneResult, QueryArrayResult } from "../repo/QueryArrayResult";
import {
  getThreadById,
  getThreadsByCategoryId,
  getThreadsLatest,
} from "../repo/ThreadRepo";
import { GqlContext } from "./GqlContext";
import { getThreadItemsByThreadId } from "../repo/ThreadItemRepos";
import { ThreadItem } from "../repo/ThreadItem";
import { getAllCategories } from "../repo/ThreadCategoryRepos";
import CategoryThread from "../repo/CategoryThread";
import { getTopCategories } from "../repo/CategoryThreadRepo";
import {
  changePassword,
  login,
  logout,
  me,
  register,
  UserResult,
} from "../repo/UserRepo";
import { User } from "../repo/User";

const STANDARD_ERROR = "An error has occured";

interface EntityResult {
  messages: Array<string>;
}

const resolvers: IResolvers = {
  ThreadResult: {
    __resolveType(obj: any, context: GqlContext, info: any) {
      if (obj.messages) {
        return "EntityResult";
      }
      return "Thread";
    },
  },

  ThreadArrayResult: {
    __resolveType(obj: any, context: GqlContext, info: any) {
      if (obj.messages) {
        return "EntityResult";
      }
      return "ThreadArray";
    },
  },

  ThreadItemArrayResult: {
    __resolveType(obj: any, context: GqlContext, info: any) {
      if (obj.messages) {
        return "EntityResult";
      }
      return "ThreadItemArray";
    },
  },

  UserResult: {
    __resolveType(obj: any, context: GqlContext, info: any) {
      if (obj.messages) {
        return "EntityResult";
      }
      return "User";
    },
  },

  // :> Query
  Query: {
    getThreadById: async (
      obj: AudioNode,
      args: { id: string },
      ctx: GqlContext,
      info: any
    ): Promise<Thread | EntityResult> => {
      let thread: QueryOneResult<Thread>;

      try {
        thread = await getThreadById(args.id);

        if (thread.entity) return thread.entity;

        return {
          messages: thread.messages ? thread.messages : [STANDARD_ERROR],
        };
      } catch (ex) {
        console.log(ex.message);
        // TODOS log the issue so it can look up later
        throw ex;
      }
    },

    getThreadsByCategoryId: async (
      obj: any,
      args: { categoryId: string },
      ctx: GqlContext,
      info: any
    ): Promise<{ threads: Array<Thread> } | EntityResult> => {
      let threads: QueryArrayResult<Thread>;

      try {
        threads = await getThreadsByCategoryId(args.categoryId);

        if (threads.entities) return { threads: threads.entities };

        return {
          messages: threads.messages ? threads.messages : [STANDARD_ERROR],
        };
      } catch (ex) {
        throw ex;
      }
    },

    getThreadsLatest: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<{ threads: Array<Thread> } | EntityResult> => {
      let threads: QueryArrayResult<Thread>;
      try {
        threads = await getThreadsLatest();
        if (threads.entities) {
          return {
            threads: threads.entities,
          };
        }
        return {
          messages: threads.messages ? threads.messages : [STANDARD_ERROR],
        };
      } catch (ex) {
        throw ex;
      }
    },

    getThreadItemsByThreadId: async (
      obj: AnimationTimeline,
      args: { threadId: string },
      ctx: GqlContext,
      infor: any
    ): Promise<{ threadItems: Array<ThreadItem> } | EntityResult> => {
      let threadItems: QueryArrayResult<ThreadItem>;

      try {
        threadItems = await getThreadItemsByThreadId(args.threadId);
        if (threadItems.entities) {
          return {
            threadItems: threadItems.entities,
          };
        }
        return {
          messages: threadItems.messages
            ? threadItems.messages
            : [STANDARD_ERROR],
        };
      } catch (ex) {
        throw ex;
      }
    },

    getAllCategories: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<Array<ThreadCategory> | EntityResult> => {
      let categories: QueryArrayResult<ThreadCategory>;

      try {
        categories = await getAllCategories();

        if (categories.entities) {
          return categories.entities;
        }
        return {
          messages: categories.messages
            ? categories.messages
            : [STANDARD_ERROR],
        };
      } catch (ex) {
        throw ex;
      }
    },

    getTopCategories: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<Array<CategoryThread>> => {
      try {
        return await getTopCategories();
      } catch (ex) {
        console.log(ex);
        throw ex;
      }
    },

    me: async (
      obj: any,
      args: null,
      ctx: GqlContext,
      info: any
    ): Promise<User | EntityResult> => {
      let user: UserResult;

      try {
        if (!ctx.req.session?.userId)
          return { messages: ["User not logged in."] };

        user = await me(ctx.req.session.userId);

        if (user && user.user) return user.user;

        return { messages: user.messages ? user.messages : [STANDARD_ERROR] };
      } catch (ex) {
        throw ex;
      }
    },
  },

  // :> Mutations

  Mutation: {
    createThread: async (
      obj: any,
      args: { userId: string; categoryId: string; title: string; body: string },
      ctx: GqlContext,
      info: any
    ): Promise<EntityResult> => {
      let result: QueryOneResult<Thread>;

      try {
        result = await createThread(
          args.userId,
          args.categoryId,
          args.title,
          args.body
        );

        return {
          messages: result.messages ? result.messages : [STANDARD_ERROR],
        };
      } catch (ex) {
        console.log(ex);
        throw ex;
      }
    },

    updateThreadPoint: async (
      obj: any,
      args: { threadId: string; increment: boolean },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let result = "";
      try {
        if (!ctx.req.session || !ctx.req.session!.userId) {
          return "You must be logged in to set likes.";
        }
        result = await updateThreadPoint(
          ctx.req.session!.userId,
          args.threadId,
          args.increment
        );
        return result;
      } catch (ex) {
        throw ex;
      }
    },

    updateThreadItemPoint: async (
      obj: any,
      args: { threadItemId: string; increment: boolean },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let result = "";

      try {
        // TODOS remove the comment once the session is setup
        if (!ctx.req.session || !ctx.req.session?.userId) {
          return "You must be logged in to set likes.";
        }

        result = await updateThreadItemPoint(
          ctx.req.session!.userId,
          args.threadItemId,
          args.increment
        );
        return result;
      } catch (ex) {
        throw ex;
      }
    },

    register: async (
      obj: any,
      args: { email: string; userName: string; password: string },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let user: UserResult;

      try {
        user = await register(args.email, args.userName, args.password);

        if (user && user.user) {
          return "Registration successful.";
        }
        return user && user.messages ? user.messages[0] : STANDARD_ERROR;
      } catch (ex) {
        throw ex;
      }
    },

    login: async (
      obj: any,
      args: { email: string; password: string },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let user: UserResult;

      try {
        user = await login(args.email, args.password);

        if (user && user.user) {
          ctx.req.session!.userId = user.user.id;

          return `Log in successful for userId ${ctx.req.session!.userId}`;
        }
        return user && user.messages ? user.messages[0] : STANDARD_ERROR;
      } catch (ex) {
        console.log(ex);
        throw ex;
      }
    },

    logout: async (
      obj: any,
      args: { email: string },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      try {
        let result = await logout(args.email);

        if (ctx.req.session?.userId) {
          ctx.req.session?.destroy((err: any) => {
            if (err) {
              console.log("destroy session failed");
              return;
            }
            console.log("session destroyed");
          });
        } else {
          return "Your are not logged in.";
        }

        return result;
      } catch (ex) {
        throw ex;
      }
    },

    changePassword: async (
      obj: any,
      args: { newPassword: string },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      try {
        if (!ctx.req.session || !ctx.req.session!.userId) {
          return "You must be logged in to change password.";
        }

        let result = await changePassword(
          ctx.req.session!.userId,
          args.newPassword
        );

        return result;
      } catch (ex) {
        throw ex;
      }
    },
  },
};

export default resolvers;
