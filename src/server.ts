import 'dotenv/config';
import prisma from '../prisma/prisma';
import app from './app';
import config from './config';

prisma
  .$connect()
  .then(() => {
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
