import "dotenv/config";
import { NODE_ENV, PORT } from "./constants/env";
import app from "./app";
import connectDB from "./utils/db";

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
  });
});
