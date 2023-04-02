const express = require('express')
const loginRouter = express.Router()
let userModel = require('../models/user.js')
const cors = require('cors')
const jwt = require('jsonwebtoken')

loginRouter.use(express.json())
loginRouter.use(cors())

// user login
loginRouter.post('/login', cors(), (req, res) => {
    let { email, password } = req.body

    // validation of user input
    if (email === '' || password === '') {
        res.end("Email and password can not be empty")
    } else {
        loginUser()
    }

    // fetch data from database
    async function loginUser() {
        let token = jwt.sign(password, 'group9')
        let userData = await userModel.findOne({
            email: email,
            password: token
        })

        if (userData === null) {
            res.end('Incorrect email or password')
        } else {
            res.end(JSON.stringify({
                'user_data': 'ok',
                'userId': userData['_id']
            }))
        }

    }
})

// register new user
loginRouter.post('/register', cors(), (req, res) => {
    let { username, email, phone, profession, password } = req.body

    // validation of user input
    let emailCharacters = email.split('')
    if (username === '' || email === '' || password === '' || phone === ''
        || profession === '' || password === '') {
        res.end('All fields are mandatory')
    } else if (password.length < 8) {
        res.end("Password must have minimum 8 characters")
    } else if (phone.length !== 10) {
        res.end("Phone number must have 10 digits")
    } else if (!emailCharacters.includes('@') || !emailCharacters.includes('.')) {
        res.end("Invalid Email")
    } else {
        // check if email already exists
        async function checkEmailExists() {
            let result = await userModel.findOne({ email: email })
            if (result === null) {
                addUser()
            } else {
                res.end('email already exists')
            }
        }
        checkEmailExists()
    }

    // add user data to database
    async function addUser() {
        let token = jwt.sign(password, 'group9')
        let newUser = new userModel({
            username: username,
            email: email,
            phone: phone,
            profession: profession,
            password: token
        })
        await newUser.save()
        res.end('ok')
    }
})

module.exports = loginRouter