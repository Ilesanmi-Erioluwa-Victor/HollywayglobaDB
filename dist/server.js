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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// import api from './services/v1Api';
// import uploadFile from './uploads/uploadFile';
// import { requestErrorTypings } from './typings/requestErrorTypings';
// import { pageNotFound } from './middleware/404';
const Database_1 = require("./database/Database");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// app.use(uploadFile);
app.use('/images', express_1.default.static('images'));
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
// set headers for all requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Methods', 'GET, POST, PUT, DELETE , PATCH');
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('content-type', 'application/json');
    next();
});
// version 1 api
// app.use('/api/', api);
// app.use(pageNotFound);
app.get('/', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, '/public'));
});
// error handling
// app.use(
//   (
//     // error: requestErrorTypings,
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     console.log(error.message);
//     const status = error.statusCode || 500;
//     const message = error.message;
//     res.status(status).json({ message });
//   }
// );
// connecting server
const startConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, Database_1.connectFunction)();
        app.listen(process.env.PORT || 5000, () => {
            console.log(`App running on port ${process.env.PORT || 8080}`);
        });
    }
    catch (error) {
        console.log(error.message);
    }
});
startConnection();
