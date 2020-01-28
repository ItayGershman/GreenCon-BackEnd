const express = require('express');
const app = express();
const logger = require('morgan');

const port = process.env.PORT || 3030;
const {userRouter, userCreatorRouter} = require('./router/routes');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(logger('dev'));

app.use('/user',userRouter);
app.use('/creator',userCreatorRouter);

app.get('/',(req,res)=>{
    res.status(200).send(`Welcome to GreenCon`);
})

app.get('*', (req, res) =>{
    res.status(404).send(`Page Not Found`);
});

app.use((err,res) => {
    res.status(500).send(err);
});



app.listen(port,()=>{
    console.log('Express server is running on port ', port);
});
