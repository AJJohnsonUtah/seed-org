const mongoose = require("mongoose");
const mongoDbConnectionString = "mongodb://127.0.0.1:27017/seed-org";

main().catch(console.error);
async function main() {
  await mongoose.connect(mongoDbConnectionString);
  console.log("Connected to DB successfully.");
}
