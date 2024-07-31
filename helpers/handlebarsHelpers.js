const Handlebars = require('handlebars');
const formatDate = require('../utils/formatDate');

Handlebars.registerHelper('formatDate', formatDate);
