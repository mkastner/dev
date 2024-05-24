import Router from 'express';
import { formSubmit, serveForm } from './logic.js';
import { uuidGen } from './util.js';


//Router for the API
const router = Router();

//routes 
router.get('/ip', (request, response) => response.send(request.ip));
router.get('/api/uuid', uuidGen);
router.get('/api/form/', serveForm);  
router.post('/api/form/', formSubmit);

//default export
export default router;
