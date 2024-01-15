import { mongoose }  from 'mongoose'
const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    // email:{
    //     type:String
    // },
    // password:{
    //     type:String
    // }
})
const UserModel = mongoose.model('Users',userSchema)
export default UserModel