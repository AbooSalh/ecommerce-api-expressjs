import mongoose from "mongoose";

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URL as string, { dbName: process.env.DB_NAME })
    .then((conn) => {
      console.log(`Database Connected: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.error(`Database Error: ${err}`);
      process.exit(1);
    });
};
export default dbConnection;