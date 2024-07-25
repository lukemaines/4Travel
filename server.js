require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { sequelize } = require('./models');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new SequelizeStore({
    db: sequelize
  }),
  resave: false,
  saveUninitialized: false
}));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});