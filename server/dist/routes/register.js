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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const connection_1 = require("../db/connection");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        console.log('req.body ', req.body);
        const isEmailAlreadyRegistered = (0, connection_1.getDbo)().collection('users').find({ "email": email }).id;
        console.log('isEmailAlreadyRegistered ', isEmailAlreadyRegistered);
        if (isEmailAlreadyRegistered) {
            res.status(401).json({ error: 'This email is already registered!' });
        }
        // Hash the password before saving it
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield (0, connection_1.getDbo)().collection('users').insertOne({ "name": name, "email": email, "password": hashedPassword });
        console.log('register ', user);
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.register = register;
// export const resetPassword = async (req: Request, res: Response) => {
// }
//# sourceMappingURL=register.js.map