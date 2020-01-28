const {Schema,model} = require('mongoose');

const ConventionsSchema = new Schema ({
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    start:{
        type:Date,
        required:true
    },
    end:{
        type:Date,
        required:true
    },
    description:{
        type:String
    },
    lecturerProfile:{
        firstName:String,
        lastName:String,
        company:String,
        headline:String,
    },
    location:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        default:0
    },
    //users array - String for email
    attendance:[{
        type:String,
        unique:true
    }],
    conventionCreator:{
        type:String,
        required:true
    }
});

//check if a convention is already exists in this Date and Location
ConventionsSchema.statics.conventionExist = async function(start,end,location) {
    return await this.find({ start:start,end:end,location:location }, (err) => {
      if (err) { throw new Error(err); }
    });
  };

const Convention = model('Convention',ConventionsSchema);

module.exports = Convention;
