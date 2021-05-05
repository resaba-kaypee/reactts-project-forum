import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar Date

  type EntityResult {
    messages: [String!]
  }

  type User {
    id: ID!
    email: String!
    userName: String!
    password: String!
    confirmed: Boolean!
    isDisabled: Boolean!
    threads: [Thread!]
    threadItems: [ThreadItem!]
    createdBy: String!
    createdOn: Date!
    lastModifiedBy: String!
    lastModifiedOn: Date!
  }

  union UserResult = User | EntityResult

  type Thread {
    id: ID!
    views: Int!
    points: Int!
    isDisabled: Boolean!
    title: String!
    body: String!
    user: User!
    threadItems: [ThreadItem!]
    category: ThreadCategory!
    createdBy: String!
    createdOn: Date!
    lastModifiedBy: String!
    lastModifiedOn: Date!
  }

  union ThreadResult = Thread | EntityResult

  type ThreadArray {
    threads: [Thread!]
  }

  union ThreadArrayResult = ThreadArray | EntityResult

  type ThreadItem {
    id: ID!
    views: Int!
    points: Int!
    isDisabled: Boolean!
    body: String!
    user: User!
    thread: Thread!
    createdBy: String!
    createdOn: Date!
    lastModifiedBy: String!
    lastModifiedOn: Date!
  }

  union ThreadItemResult = ThreadItem | EntityResult

  type ThreadItemArray {
    threadItems: [ThreadItem!]
  }

  union ThreadItemArrayResult = ThreadItemArray | EntityResult

  type ThreadCategory {
    id: ID!
    name: String!
    description: String
    threads: [Thread!]!
    createdBy: String!
    createdOn: Date!
    lastModifiedBy: String!
    lastModifiedOn: Date!
  }

  type ThreadPoint {
    id: ID!
    isDecrement: Boolean!
    user: User!
    thread: Thread!
    createdBy: String!
    createdOn: Date!
    lastModifiedBy: String!
    lastModifiedOn: Date!
  }

  type ThreadItemPoint {
    id: ID!
    isDecrement: Boolean!
    user: User!
    threadItem: ThreadItem!
    createdBy: String!
    createdOn: Date!
    lastModifiedBy: String!
    lastModifiedOn: Date!
  }

  type CategoryThread {
    threadId: ID!
    categoryId: ID!
    categoryName: String!
    title: String!
    titleCreatedOn: Date!
  }

  type Query {
    getThreadById(id: ID!): ThreadResult
    getThreadsByCategoryId(categoryId: ID!): ThreadArrayResult!
    getThreadsLatest: ThreadArrayResult!
    getThreadItemsByThreadId(threadId: ID!): ThreadItemArrayResult!
    getAllCategories: [ThreadCategory!]
    getTopCategories: [CategoryThread!]
  }

  type Mutation {
    createThread(
      userId: ID!
      categoryId: ID!
      title: String!
      body: String
    ): EntityResult
    # when authenticated no need to pass in userId
    # updateThreadPoint(threadId: ID!, increment: Boolean!): String!
    # updateThreadItemPoint(threadItemId: ID!, increment: Boolean!): String!
    # for testing need to pass userId
    updateThreadPoint(userId: ID!, threadId: ID!, increment: Boolean!): String!
    updateThreadItemPoint(
      userId: ID!
      threadItemId: ID!
      increment: Boolean!
    ): String!
  }
`;

export default typeDefs;
