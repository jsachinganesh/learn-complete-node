const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const mongoose = require('mongoose');
const Tour = require('../../models/tourModal');



const DB = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);


const importData = async () => {
    try {
        await Tour.create(tours);
        console.log("Data Loaded");
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData();
}



