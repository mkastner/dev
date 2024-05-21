/* eslint-disable no-undef */
import cors from "cors";
import helmet from "helmet";
import express from "express";
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import router from "./routes.mjs";
import "dotenv/config";

//instanciate express as server
const server = express();
//set CLIENTURL in .env file
const corsOptions = {
    origin: `${process.env.CLIENTURL}`,
    optionsSuccessStatus: 200
};
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

//Middlewares
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(router);
server.use(cors(corsOptions));
server.use(helmet())
server.use(limiter);
server.set('trust proxy', 1);
server.use(morgan('combined'));

//custom middleware for handling wrong JSON Syntax
server.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON:', err);
        return res.status(400).json({ error: 'Invalid JSON' }); // Bad JSON
    }
    next();
});

// config is done in .env or Docker Env mapping
const serverport = process.env.SERVERPORT || 4000;
// Start the server
server.listen(serverport, () => {
	console.log(`Server is running on port ${serverport}`)
	console.log(`Cors is set to: ${process.env.CLIENTURL}`)
})