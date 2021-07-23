const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => {
      throw new NotFoundError('Карточки не найдены');
    })
    .then((cards) => {
      res.status(200).send({ cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequestError('Переданы некорректные данные');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const { _id } = req.params;

  Card.findById(_id)
    .then((card) => {
      if (card.owner.toString() === userId) {
        Card.findByIdAndRemove({ _id })
          .then((thisCard) => {
            res.status(200).send(thisCard);
          });
      } else {
        const error = new ForbiddenError('Нельзя удалить чужую карточку!');
        next(error);
      }
    })
    .catch((err) => {
      if (err) {
        const error = new NotFoundError('Карточка с указанным id не найдена');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params._id,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFoundError('Карточка с указанным id не найдена');
  })
  .then((likes) => {
    res.status(200).send(likes);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      const error = new BadRequestError('Переданы некорректные данные');
      next(error);
    } else {
      next(err);
    }
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params._id,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(() => {
    throw new NotFoundError('Карточка с указанным id не найдена');
  })
  .then((likes) => {
    res.status(200).send(likes);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      const error = new BadRequestError('Переданы некорректные данные');
      next(error);
    } else {
      next(err);
    }
  });
