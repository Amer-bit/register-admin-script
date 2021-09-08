import * as  mongoose from 'mongoose'
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
import { determineOperation } from './src/app';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `${__dirname}/../.env`
})

const mongooseUri = process.env.MONGODB_URI;
const mongoDbOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
const db = mongoose.connection;
mongoose.connect(mongooseUri, mongoDbOptions);

db.once("open", () => {
  console.log('DB is connected');
  const argv = yargs(hideBin(process.argv)).array('emails').argv;  
  determineOperation(argv);
});