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
exports.authenticate = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connection_1 = require("../db/connection");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield (0, connection_1.getDbo)().collection('users').findOne({ "email": email });
        if (!user) {
            return res.status(401).json({ error: 'This email doesn\'t exist' });
        }
        //const passwordMatch = await bcrypt.compare(password, hashedPassword)
        //     console.log('userAuthentication hashedPassword ', `____${hashedPassword}____`)
        // console.log('passwordMatch ', passwordMatch)
        //     if (!passwordMatch) {
        //       return res.status(422).json({ error: 'Please enter the correct password' })
        //     }
        // Create a JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.PRIVATE_RSA_KEY, {
            algorithm: 'RS256',
            expiresIn: '1h'
        });
        //res.cookie('token', token,  { httpOnly: true, maxAge: 3600000, path: '/', expires: new Date(Date.now() + 3600000) })
        res.status(200).json({ id: user._id, name: user.name, token });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.login = login;
const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        //console.log('token', token)
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.PUBLIC_RSA_KEY, {
            algorithms: ['RS256']
        });
        //console.log('decodedToken ', decodedToken)
        req.params = Object.assign(Object.assign({}, req.params), { userId: decodedToken.id, email: decodedToken.email });
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=login.js.map