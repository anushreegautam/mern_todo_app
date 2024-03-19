"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbo = exports.connectToDatabase = exports.client = void 0;
const mongodb_1 = require("mongodb");
const DbUri = process.env.ATLAS_URI;
exports.client = new mongodb_1.MongoClient(DbUri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
var dbo;
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect the client to the server (optional starting in v4.7)
        const dboConnection = yield exports.client.connect();
        // Send a ping to confirm a successful connection
        yield exports.client.db('ToDoApp').command({ ping: 1 });
        dbo = dboConnection.db('ToDoApp');
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (e) {
        console.dir(e);
    }
    //   finally {
    //     // Ensures that the client will close when you finish/error
    //     await client.close();
    //   }
});
exports.connectToDatabase = connectToDatabase;
const getDbo = () => dbo;
exports.getDbo = getDbo;
//# sourceMappingURL=connection.js.map