import "./config/envConfig.js"
import app from "./app.js";

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Food Waste Map Backend running on port: ${PORT}`);
  console.log(`📍 API available at: http://localhost:${PORT}/api/food-waste`);
});
