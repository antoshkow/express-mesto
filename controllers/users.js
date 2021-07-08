const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.getUser = (req, res) => {
  const { _id } = req.params;

  User.findById({ _id })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }

      return res.status(200).send(user);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => console.log(err));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => console.log(err));
};
