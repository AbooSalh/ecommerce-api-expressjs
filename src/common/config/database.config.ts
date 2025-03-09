import mongoose from "mongoose";

const dbConnection = {
  connect: () => {
    mongoose
      .connect(process.env.DB_URL as string, { dbName: process.env.DB_NAME })
      .then((conn) => {
        console.log(`Database Connected: ${conn.connection.host}`);
      })
      .catch((err) => {
        console.error(`Database Connection Error: ${err.message}`);
      });
  },
  close: () => {
    mongoose.connection.close().then(() => {
      console.log("Database Disconnected");
    });
  },
};

export default dbConnection;
