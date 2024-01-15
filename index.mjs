import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import './db.mjs'
import UserModel from './UserModel.mjs'
    
const typeDefs = `
  type User {
    name:String 
  }

  type Query {
    getAllUser:[User]
    getUser(id:ID!):[User]
  }

  type Mutation {
    addUser(name:String!):User
    updateUser(id:ID!,name:String!):User
    deleteUser(id:ID!):User
  }

`;

const resolvers = {
  Query: {
    getAllUser: async () => await UserModel.find(),
    getUser: async (_,{id}) => await UserModel.find({_id:id})
  },
  Mutation : {
    addUser : async (_,{name}) =>{
      const isInserted = await new UserModel({name}).save()
      console.log('isInserted__',isInserted)
      return isInserted
    },
    updateUser : async (_,{id,name}) =>{
      const isUpdate = await UserModel.updateOne({_id:id},{$set:{name}})
      console.log('isupdated__',isUpdate)
      return isUpdate
    },
    deleteUser : async (_,{id}) =>{
      const isDeleted = await UserModel.deleteOne({_id:id})
      console.log('isDeleted__',isDeleted)
      return isDeleted
    },
  }
};

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(
  cors(),
  bodyParser.json(),
  expressMiddleware(server),
);

httpServer.listen(4000,()=>{
  console.log(`🚀 Server ready at http://localhost:4000`);
})
