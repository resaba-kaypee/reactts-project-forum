import { Thread } from "./../repo/Thread";
import { IResolvers } from "apollo-server-express";
import { QueryOneResult } from "../repo/QueryArrayResult";
import { getThreadById } from "../repo/ThreadRepo";
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

  // Query
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
  },
};

export default resolvers;
