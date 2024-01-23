const express = require('express');
const { index, detail, login, register, addUser, loginUser } = require('../controllers/front.controller');

const router = express.Router();

router.get('/', index) 
router.get('/details', detail)

router.get('/login' , login)
router.post('/login' , loginUser)

router.get('/register', register)
router.post('/register', addUser)
module.exports = router;



