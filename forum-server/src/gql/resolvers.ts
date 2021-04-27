import { createThread } from "./../repo/ThreadRepo";
import { Thread } from "./../repo/Thread";
import { IResolvers } from "apollo-server-express";
import { QueryOneResult, QueryArrayResult } from "../repo/QueryArrayResult";
import { getThreadById, getThreadsByCategoryId } from "../repo/ThreadRepo";
import { GqlContext } from "./GqlContext";

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
  },
};

export default resolvers;
