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
      // TODOS remove userId when authentication is implemented
      args: { userId: string; threadId: string; increment: boolean },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let result = "";
      try {
        // TODOS remove the comment once the session is setup
        // if (!ctx.req.session || !ctx.req.session!.userId) {
        //   return "You must be logged in to set likes.";
        // }
        result = await updateThreadPoint(
          // ctx.req.session!.userId,
          args.userId,
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
      // TODOS remove userId when authentication is implemented
      args: { userId: string; threadItemId: string; increment: boolean },
      ctx: GqlContext,
      info: any
    ): Promise<string> => {
      let result = "";

      try {
        // TODOS remove the comment once the session is setup
        // if(!ctx.req.session || !ctx.req.session?.userId){
        //   return 'You must be logged in to set likes.'
        // }

        result = await updateThreadItemPoint(
          // ctx.req.session!.userId,
          args.userId,
          args.threadItemId,
          args.increment
        );
        return result;
      } catch (ex) {
        throw ex;
      }
    },
  },
};

export default resolvers;
