import "./config/envConfig.js"
import dbConnect from "./db/dbConnect.js"
import app from "./app.js";

const PORT = process.env.PORT;
dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is being listened on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed: ", error);
  });
