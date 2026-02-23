import app from "./app";
import prisma from "../prisma/prisma";

const {PORT} = process.env;

prisma.$connect()
  .then(() => {
    app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  }); 