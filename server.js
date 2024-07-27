
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
require('dotenv').config();
const db = require('./models');


const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const { City, Meal, Transportation } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

// Setup Handlebars.js as template engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
}));

// Routes
app.use('/api', require('./controllers/apiRoutes'));
app.use('/', require('./controllers/viewRoutes'));

// Sync database and start server
const syncDatabase = async () => {
  try {
    // Sync the City table first
    await City.sync({ force: false });
    // Then sync the Meal and Transportation tables
    await Meal.sync({ force: false });
    await Transportation.sync({ force: false });

    app.listen(PORT, () => console.log(`Now listening on PORT ${PORT}`));
  } catch (error) {
    console.error('Failed to sync database:', error);
  }
};

syncDatabase();