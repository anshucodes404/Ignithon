import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Set default port
process.env.PORT = process.env.PORT || 3000;

console.log(`✅ Backend will run on port: ${process.env.PORT}`);
console.log(`✅ No database required - using simple mock data`);