const {Router} = require('express');
const {userController} = require('../controller/userController');
const {userCreatorController} = require('../controller/userCreatorController');

userRouter = new Router();
userCreatorRouter = new Router();

/*
 * User controller
 */

//view specific convention - search by convention title
userRouter.get('/convention/:title',(req,res)=>{
   userController.getConvention(req,res);
});

 //View conventions - name is the user email
userRouter.get('/conventions/:name',(req,res)=>{
    userController.getMyConventions(req,res);
});

//Get Lecturer profile - :id is convention id
userRouter.get('/lecturerProfile/:id',(req,res)=>{
   userController.getLecturerProfile(req,res);
});

//Post tip to tips DB
userRouter.post('/tip',(req,res)=>{
   userController.postTip(req,res);
});

//Attend Convention - :id is convention ID
userRouter.post('/attend/:id',(req,res)=>{
   userController.attendConvention(req,res);
});

//remove convention from my conventions - :id is convention ID
userRouter.delete('/conventions/:id',(req,res)=>{
   userController.deleteConvention(req,res);
});

/*
 * Creator controller 
 */

//get convention by it's title
userCreatorRouter.get('/convention/:title',(req,res)=>{
   userCreatorController.getConvention(req,res);
});

//get convention by it's creator name
userCreatorRouter.get('/conventions/:name',(req,res)=>{
   userCreatorController.getConventions(req,res);
});

//Create new convention
userCreatorRouter.post('/convention',(req,res)=>{
   userCreatorController.createConvention(req,res);
});

//Edit a specific convention - :id is convention ID
userCreatorRouter.put('/convention/:id',(req,res)=>{
   userCreatorController.editConvention(req,res);
});

//Delete a specific convention - :id is convention ID
userCreatorRouter.delete('/convention/:id',(req,res)=>{
   userCreatorController.deleteConvention(req,res);
});

module.exports = {
   userRouter,
   userCreatorRouter
}