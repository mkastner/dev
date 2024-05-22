import Router from 'express';
import { apiUsers, apiUserByUuid, apiCreateUsers, formSubmit, serveForm } from './logic.mjs';
import { uuidGen } from './util.mjs';


//Router for the API
const router = Router();

//routes 
router.get('/', (response) => response.send('Welcome to the MSC-API!'));
router.get('/ip', (request, response) => response.send(request.ip))
router.get('/api/uuid', uuidGen);
router.get('/api/users', apiUsers);
router.get('/api/users/:uuid', apiUserByUuid);
router.post('/api/users/', apiCreateUsers);
router.get('/api/form/', serveForm);  
router.post('/api/form/', formSubmit);

//default export
export default router;