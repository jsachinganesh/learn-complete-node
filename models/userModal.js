const mongoose = require("mongoose");
const { default: validator } = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'A user must have a name'],
            trim:true
        },
        email:{
            type:String,
            required:[true,'A user must have a email'],
            unique:true,
            lowercase:true,
            validotor:[validator.isEmail,'Incorrect Email']
        },
        password:{
            type:String,
            required:[true,'A user must have a password'],
            minlength:4,
            select:false
        },
        photo:{
            type:String,
            default:'default.jpg'
        },
        passwordConfirm:{
            type:String,
            required:[true,'A user must password confirm'],
            validate:{
                // validator works on create and save only
                validator: function(val){
                    return this.password === val;
                },
                message:"Password Confirm can't match"
            }
        },
        role:{
            type:String,
            enum:['user','guide','lead-guide','admin'],
            default:'user'
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        active:{
            type:Boolean,
            default:true,
            select:false
        }
    }
);

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password,12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save',function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 5000;
    next();

});

userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}});
    next();
});
  
userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;

};

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);;
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
};
  

const User = mongoose.model('User',userSchema);

module.exports = User;