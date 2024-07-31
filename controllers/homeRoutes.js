const router = require('express').Router();
const { User, Trip } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        let trips = [];

        if (req.session.logged_in) {
            const tripData = await Trip.findAll({
                where: {
                    user_id: req.session.user_id, // Fetch trips only for the logged-in user
                },
                include: [
                    {
                        model: User,
                        attributes: ['name'],
                    },
                ],
            });

            trips = tripData.map((trip) => trip.get({ plain: true }));
        }

        res.render('homepage', {
            trips,
            logged_in: req.session.logged_in,
            user: req.session.user_id ? await User.findByPk(req.session.user_id) : null,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/register', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('register');
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });

        if (!userData) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.redirect('/'); // Redirect to homepage after successful login
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

router.get('/logout', (req, res) => { 
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.redirect('/'); // Redirect to homepage page after logout
        });
    } else {
        res.redirect('/login'); // Redirect to login page if not logged in
    }
});

router.post('/register', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.redirect('/'); // Redirect to homepage after successful registration
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

// Plan Trip route (GET)
router.get('/plan-trip', withAuth, async (req, res) => {
    res.render('plan_trip', {
        logged_in: req.session.logged_in,
        user: req.session.user_id ? await User.findByPk(req.session.user_id) : null,
    });
});

module.exports = router;
