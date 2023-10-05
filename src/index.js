const dotenv = require("dotenv");
const connectToDatabase = require("./database/connect");

dotenv.config();

connectToDatabase();

require("./modules/express");
