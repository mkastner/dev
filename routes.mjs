import Router from 'express';
import { apiUser, apiUserByUuid, apiCreateUsers, formSubmit } from './logic.mjs';
import { uuidGen } from './util.mjs';

//Router for the API
const router = Router();

//routes 
router.get('/', (request, response) => response.send('Welcome to the MSC-API!'));
router.get('/ip', (request, response) => response.send(request.ip))
router.get('/api/uuid', /*no callback else crash*/ uuidGen);
router.get('/api/user', /*no callback else crash*/ apiUser);
router.get('/api/user/:uuid', /*no callback else crash*/ apiUserByUuid);
router.post('/api/user', /*no callback else crash*/ apiCreateUsers);
router.post('/api/form/submit', formSubmit);

//default export
export default router;