const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
dotenv.config();

const environment = process.env.PORT || 'development';
const port = process.env.PORT || 8070;

if (environment === 'development') {
    const morgan = require('morgan');
    app.use(morgan('dev'));
}

  app.use(cors());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(express.json());
  app.use('/public', express.static(path.join(__dirname, 'public')));
  
  app.setMaxListeners(0);

app.listen(port, () => {
    console.log(
      `Le serveur est connecté au port ${port}`
    );
  });