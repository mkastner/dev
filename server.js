/* eslint-disable no-undef */
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import router from './app/routes.js';
import 'dotenv/config';
import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import fetchTemplate from './app/fetch-template.js';
// There's no __dirname when using ES6 modules,
// so we need to use the following workaround

const templateUrl = 'https://www.fmh.de/api/templates/contact'; 
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//instanciate express as server
const server = express();

const corsOptions = {
  origin: `${process.env.CLIENTURL}`,
  optionsSuccessStatus: 200,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

server.set('view engine', 'hbs');
// location of handelbars views i.e. html templates
server.set('views', path.resolve(__dirname, './app/views'));

// Set up Handlebars
server.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
      foo() {
        return 'foo';
      },
    },
    // default partials dir is `views/partials`
  }),
);

//static configuration
server.use(express.static('public'));
//server.use(favicon(path.join(process.cwd(), 'public', 'favicon.ico')))
//Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['\'self\''], // Erlaubt alles von der eigenen Domain
        connectSrc: [
          '\'self\'',
          `${process.env.CLIENTURL}`,
          `${process.env.CLIENTURL}/api/form`,
        ], // Erlaubt Verbindungen zu diesen URLs
        // Füge weitere Direktiven hier hinzu
      },
    },
  }),
);

server.use(cors(corsOptions));
server.use(limiter);
server.set('trust proxy', 2);
const fetchedTemplate = await fetchTemplate(templateUrl);
server.use(fetchedTemplate); 
server.use(router);
server.use(morgan('combined'));
server.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});

//custom middleware for handling wrong JSON Syntax
server.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON:', err);
    return res.status(400).json({ error: 'Invalid JSON' }); // Bad JSON
  }
  next();
});

//custom middleare for handling cors

server.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', `${process.env.CLIENTURL}`); // oder eine spezifische URL
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

// config is done in .env or Docker Env mapping
const serverport = process.env.SERVERPORT || 4000;
// Start the server
server.listen(serverport, () => {
  console.log(`Server is running on Port: ${serverport}`);
  console.log(`Cors is set to: ${process.env.CLIENTURL}`);
});
