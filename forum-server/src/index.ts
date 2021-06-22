import express, {Express, RequestHandler} from "express";
import * as dotenv from "dotenv";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { createConnection } from "typeorm";
import cors from "cors";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import typeDefs from "./gql/typeDefs";
import resolvers from "./gql/resolvers";

dotenv.config({ path: `${__dirname}/config.env` });

console.log(process.env.NODE_ENV);

declare module "express-session" {
  export interface SessionData {
    userId?: any;
  }
}

const main = async () => {
  const app: Express = express();

  console.log(`client url: ${process.env.CLIENT_URL}`);
  app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

  const router = express.Router();

  await createConnection();
  const redis = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
  });

  const RedisStore = connectRedis(session);
  const redisStore = new RedisStore({ client: redis });

  // body parser
  app.use(express.json({ limit: "10kb" }) as RequestHandler);

  app.use(
    session({
      store: redisStore,
      name: process.env.COOKIE_NAME,
      sameSite: "Strict",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
      },
    } as any)
  );

  // router
  app.use(router);

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const apolloServer = new ApolloServer({
    schema,
    playground: {
      // for offline use online
      cdnUrl: `http://localhost:5678`,
      version: "1.0.0",
    },
    context: ({ req, res }: any) => ({ req, res }),
  });
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen({ port: process.env.SERVER_PORT }, () => {
    console.log(
      `Server ready at http://localhost:${process.env.SERVER_PORT}${apolloServer.graphqlPath}`
    );
  });
};

main();
