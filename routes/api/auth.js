const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

//@route    GET api/auth/
//@desc     Get Details of authenticated User
//@access   Public

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    POST api/auth/
//@desc     Authenticate user and get token
//@access   Public

router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // See if The user exists
            let user = await User.findOne({ email });
            if (!user) {
                res.status(400).json({
                    errors: [{ msg: 'Invalid Credentials' }],
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                res.status(400).json({
                    errors: [{ msg: 'Invalid Credentials' }],
                });
            }

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
