const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection');
const homeRoutes = require('./controllers/homeRoutes');
const tripRoutes = require('./controllers/api/tripRoutes');
require('./helpers/handlebarsHelpers'); // Register Handlebars helpers

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: require('./helpers/handlebarsHelpers') // Ensure helpers are registered
});

const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    }),
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRoutes);
app.use('/api/trips', tripRoutes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening on PORT', PORT));
});
