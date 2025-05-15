const express=require("express")
const mongoose=require("mongoose")
const path=require("path")
const port=3019
const app=express();
app.use(express.static(__dirname))
app.use(express.urlencoded({extended:true}))
mongoose.connect("mongodb://127.0.0.1:27017/Government",{
    useNewUrlParser:true,
    useUnifiedTopology:true

})
.then(()=>console.log("MongoDb connection succesfull"))
.catch(err=>console.error("Mongodb connection error:",err));
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
const userscheme=new mongoose.Schema({
    APPLICATANTNAME:{
        type:String,
        required:true,
        trim:true,
    },
    FATHERNAME:{
        type:String,
        trim:true,
    },
    VILLAGE:{
        type:String,
    },
    MANDAL:{
        type:String,
    },
    DISTRIC:{
        type:String,
    },
    CASTE:{
        type:String,
    },
    DATEOFBIRTH:{
        type:Date,
    },
    /*Uname:String,
    Fname:String,
    vill:String,
    man:String,
    dis:String,
    caste:String,
    dob:String*/
});
const castecertificate=mongoose.model("castecertificate",userscheme);
module.exports=castecertificate;
const Users=mongoose.model("data",userscheme,"users");
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"form.html"));
});
app.post("/post",async (req,res)=>{
    try{
    const {Uname,Fname,vill,man,dis,caste,dob}=req.body;
    const user=new Users({
        Uname,
        Fname,
        vill,
        man,
        dis,
        caste,
        dob
    });
    await user.save();
    res.status(201).send("User data saved successfully");
}
catch(error){
    console.error("Error saving user:",error);
    res.status(500).send("Error saving user data");
}
});
app.get("/items/:id",async (req,res)=>{
    try{
        const itemId=req.params.id;
        const item=await Users.findById(itemId);
        if(!item){
            return res.status(404).send("item not found");
        }
        const itemObject=item.toObject();
        console.log(itemObject);
        res.json(itemObject);
    }catch(error){
        console.log(error);
        res.status(500).send("server Error");
    }
});
app.listen(port,()=>{
    console.log("server running on port ${port}");
});
