const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

//User Schema Model
const User = require('../../models/User');
//@route    POST api/users/
//@desc     Sign Up User
//@access   Public

router.post(
    '/',
    [
        check('name', 'Name is Required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check(
            'password',
            'please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // See if The user exists
            let user = await User.findOne({ email });
            if (user) {
                res.status(400).json({
                    errors: [{ msg: 'User Already Exist' }],
                });
            }

            // Get users Gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm',
            });

            user = new User({
                name,
                email,
                avatar,
                password,
            });

            // Encrypt the password using Bcrypt
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = { user: { id: user.id } };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );

            // Return Json Web Token
        } catch (err) {
            console.error(err.message);
            res.status(500).send('server Errorrrrrrr');
        }
    }
);

module.exports = router;
