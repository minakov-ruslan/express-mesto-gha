const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const cards = require('./routes/cards');
const user = require('./routes/users');
const { getUnloggedUserValidation } = require('./middlewares/validation');
const error = require('./middlewares/error');
const NotFoundError = require('./utils/errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', getUnloggedUserValidation, login);
app.post('/signup', getUnloggedUserValidation, createUser);

app.use('/', auth, user);
app.use('/', auth, cards);
app.use('/*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
