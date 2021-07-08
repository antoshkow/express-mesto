const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send({ cards });
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { _id } = req.params;

  Card.findByIdAndRemove({ _id })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .then((likes) => {
    res.status(200).send(likes);
  })
  .catch((err) => console.log(err));

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .then((likes) => {
    res.status(200).send(likes);
  })
  .catch((err) => console.log(err));
