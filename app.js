require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// const path = require('path');

const cors = require('cors');
const router = require('./routes');
const errorHandler = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://api.yamovies.nomoredomainsicu.ru', 'https://api.yamovies.nomoredomainsicu.ru'],
  credentials: true,
  maxAge: 30,
}));

// Ограничение на 100 запросов с одного IP-адреса в течение 15 минут
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов за 15 минут
});

app.use(limiter);

app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Успешное подключение к базе данных');
  app.listen(PORT, () => {
    console.log(`Слушаю порт ${PORT}`);
  });
}).catch((error) => {
  console.error('Ошибка подключения к базе данных:', error);
});
