const bcrypt = require('bcrypt');
const userModel = require("../models/user.model")

const index = (req, res) => {
    let isUserAuthenticated = req.session.user ? true : false;

    console.log(isUserAuthenticated);
    res.render('front/index', {isUserAuthenticated})
}

const detail = (req, res) => {
    res.render('front/detail')
}

const login = (req, res) => {
    res.render('front/login')
}

const loginUser = async (req, res) => {
    let user = await userModel.findOne({
        email: req.body.email
    });

    if (user) {
        let authenticated = await bcrypt.compare(req.body.password, user.password);

        if (authenticated) {
            req.session.user = user;
            res.redirect('/admin');
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
}

const register = (req, res) => {
    res.render('front/register')
}

const addUser = async (req, res) => {

    let hashPassword = await bcrypt.hash(req.body.password, 10);

    try {
        await userModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            status: true
        })

        res.redirect('/login');
    } catch (err) {

    }

}

module.exports = {
    index,
    detail,
    login,
    register,
    addUser,
    loginUser
}