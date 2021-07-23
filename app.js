const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Joi, celebrate, errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const router = require('./routes/router');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Роуты, не требующие авторизации
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(5),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(5),
    }),
  }),
  createUser,
);

// Роуты, требующие авторизация
app.use('/cards', auth, require('./routes/cards'));
app.use('/users', auth, require('./routes/users'));

app.use(errors());

app.use('/', router);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const { message } = err;

  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
