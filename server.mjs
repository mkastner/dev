/* eslint-disable no-undef */
import cors from "cors";
import helmet from "helmet";
import express from "express";
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import favicon from 'serve-favicon';
import cookieParser from "cookie-parser";
import router from "./routes.mjs";
import "dotenv/config";
import path from "path"
import { uuidGen } from "./util.mjs";


//instanciate express as server
const server = express();


const corsOptions = {
    origin: `${process.env.CLIENTURL}`,
    optionsSuccessStatus: 200
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});


//Middlewares
server.use(express.static("public"))
server.use(favicon(path.join(process.cwd(), "public", "favicon.ico")))
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"], // Erlaubt alles von der eigenen Domain
				connectSrc: [
					"'self'",
					"https://msc-connect.xyz",
					"https://api.msc-connect.xyz",
					"https://api.msc-connect.xyz/api/form",
				], // Erlaubt Verbindungen zu diesen URLs
				// Füge weitere Direktiven hier hinzu
			},
		},
	}),
)   
server.use(cors(corsOptions))
server.use(limiter);
server.set('trust proxy', 1);
server.use(router);
server.use(morgan('combined'));


//custom middleware for handling wrong JSON Syntax
server.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON:', err);
        return res.status(400).json({ error: 'Invalid JSON' }); // Bad JSON
    }
    next();
});

//cookie middleware
server.use((req, res, next) => {
 
  res.cookie('user', `${uuidGen}`, { maxAge: 900000, httpOnly: true });
  console.log('Cookie gesetzt', "user", `${uuidGen}`);
  next();
});

//custom middleare for handling cors

server.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*") // oder eine spezifische URL
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept",
	)
	next()
})

// config is done in .env or Docker Env mapping
const serverport = process.env.SERVERPORT || 4000;
// Start the server
server.listen(serverport, () => {
	console.log(`Server is running on Port: ${serverport}`)
	console.log(`Cors is set to: ${process.env.CLIENTURL}`)
})