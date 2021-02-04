const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

const app = require('./app');


const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(process.env.NODE_ENV);
    console.log(`Server Started on ${port}`);
});