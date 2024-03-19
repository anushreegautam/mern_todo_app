"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./config.env" });
const connection_1 = require("./db/connection");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)({ credentials: true, origin: 'http://localhost:9000', "methods": ['GET', 'PATCH', 'POST', 'DELETE'] }));
// app.set('trust proxy', 1)
// app.use(session({
//   secret: 's3Cur3',
//   name: 'sessionId',
//   resave: false,
//   saveUninitialized: true,
//  // cookie: { secure: true, httpOnly: true, maxAge: 3600000, domain: 'localhost:9000', path: '/', sameSite: 'none', expires: new Date(Date.now() + 3600000) }
// }))
app.use(express_1.default.json());
app.use(routes_1.default);
app.listen(port, () => {
    // perform a database connection when server starts
    (0, connection_1.connectToDatabase)();
    console.log(`Server is running on port: ${port}`);
});
//# sourceMappingURL=index.js.map