import express from "express";
import * as dotenv from "dotenv";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { createConnection } from "typeorm";
import { register, login, logout } from "./repo/UserRepo";
import {
  createThread,
  getThreadsByCategoryId,
  getThreadById,
} from "./repo/ThreadRepo";

dotenv.config({ path: `${__dirname}/config.env` });

console.log(process.env.NODE_ENV);

declare module "express-session" {
  export interface SessionData {
    userId: any;
    loadedCount: number;
  }
}

const main = async () => {
  const app = express();
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
  app.use(express.json({ limit: "10kb" }));

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

  // Register
  router.post("/register", async (req, res, next) => {
    try {
      console.log("params:", req.body);
      const userResult = await register(
        req.body.email,
        req.body.userName,
        req.body.password
      );
      if (userResult && userResult.user) {
        res.send(`new user created, userId: ${userResult.user.id}`);
      } else if (userResult && userResult.messages) {
        res.send(userResult.messages[0]);
      } else {
        next();
      }
    } catch (ex) {
      res.send(ex.message);
    }
  });

  // Login
  router.post("/login", async (req, res, next) => {
    try {
      console.log("params", req.body);
      const userResult = await login(req.body.userName, req.body.password);

      if (userResult && userResult.user) {
        req.session!.userId = userResult.user?.id;
        res.send(`user logged in, userId: ${req.session!.userId}`);
      } else if (userResult && userResult.messages) {
        res.send(userResult.messages[0]);
      } else {
        next();
      }
    } catch (ex) {
      res.send(ex.message);
    }
  });

  // Logout
  router.post("/logout", async (req, res, next) => {
    try {
      console.log("params:", req.body);

      const msg = await logout(req.body.userName);

      if (msg) {
        req.session!.userId = null;
        res.send(msg);
      }

      next();
    } catch (ex) {
      console.log(ex.message);
      res.send(ex.message);
    }
  });

  // Create Thread
  router.post("/createthread", async (req, res, next) => {
    try {
      console.log("userId:", req.session);
      console.log("body:", req.body);

      const msg = await createThread(
        req.session!.userId,
        req.body.categoryId,
        req.body.title,
        req.body.body
      );
      res.send(msg);
    } catch (ex) {
      console.log(ex.message);
      res.send(ex.message);
    }
  });

  // Get Thread by id
  router.post("/thread", async (req, res, next) => {
    try {
      const threadResult = await getThreadById(req.body.id);

      if (threadResult && threadResult.entity) {
        res.send(threadResult.entity.title);
      } else if (threadResult && threadResult.messages) {
        res.send(threadResult.messages[0]);
      }
    } catch (ex) {
      console.log(ex);
      res.send(ex.message);
    }
  });

  // Get Thread by categoryId
  router.post("/threadsbycategory", async (req, res, next) => {
    try {
      const threadResult = await getThreadsByCategoryId(req.body.categoryId);

      if (threadResult && threadResult.entities) {
        let items = "";

        threadResult.entities.forEach((th) => {
          items += th.title + ", ";
        });

        res.send(items);
      } else if (threadResult && threadResult.messages) {
        res.send(threadResult.messages[0]);
      }
    } catch (ex) {
      console.log(ex);
      res.send(ex.message);
    }
  });

  // test route
  router.get("/", (req, res, next) => {
    if (!req.session!.userId) {
      req.session!.userId = req.query.userId;
      console.log("userId is set");
      req.session!.loadedCount = 0;
    } else {
      req.session!.loadedCount = Number(req.session!.loadedCount) + 1;
    }

    res.send(
      `userId: ${req.session!.userId}, loadedCount:: ${
        req.session!.loadedCount
      }`
    );
  });

  app.listen({ port: process.env.SERVER_PORT }, () => {
    console.log(`Server ready on port ${process.env.SERVER_PORT}`);
  });
};

main();
