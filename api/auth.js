// api/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../common');

const SALT_ROUNDS = 10; 


router.post('/register', async (req, res, next) => {
    
    
    
    try {
        const { username, password } = req.body;
        // Basic validation
        if (!username || !password) {
            return res.status(400).send({ message: 'Username and password are required.' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username: username }
        });

        if (existingUser) {
            return res.status(409).send({ message: 'Username already taken.' }); // 409 Conflict
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create the user
        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword
            }
        });

        // Generate a JWT token
        const token = jwt.sign(
            { userId: newUser.id, username: newUser.username }, 
            process.env.JWT_SECRET,                             
            { expiresIn: '1h' }                                 
        );

        // Send the token back to the client
        res.status(201).send({ token }); // 201 Created

    } catch (error) {
        next(error); 
    }
});



module.exports = router;
