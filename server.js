const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/connection');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers')
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
require('dotenv').config();

const app = express();

// Bodyparser
app.use(bodyParser.urlencoded({ extended: false }));

const hbs = exphbs.create({ helpers });
// Set up Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// app.set('views', path.join(__dirname, 'views'));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Routes
app.use('/api', require('./controllers/api'));

const PORT = process.env.PORT || 3001;

sequelize.sync({force: false}).then(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});