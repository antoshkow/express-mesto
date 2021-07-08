const express = require('express');
const mongoose = require('mongoose');

const app = express();

const { PORT = 3000 } = process.env;

const router = require('./routes/router');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '60e7574b657a2d1b10c7f4a3',
  };

  next();
});

app.use('/', router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
