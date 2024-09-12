const express = require('express');
const app = express()
const mongoose = require('mongoose');
const{MongoClient,ObjectId} = require('mongodb')
const dotenv = require('dotenv');
dotenv.config()

app.use(express.static('../client'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

async function mongoConnect(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('database connection established....')
    }
    catch(error){
        console.error(error,"database connection failed");
        
    }
}

mongoConnect()

let userschema = new mongoose.Schema({
    title : String,
    description : String,
    categories : String,
    price : Number,
    img_url:String,
})
let product = mongoose.model('product',userschema);
app.post('/items', async (req, res) => {
    let body = req.body;

    // Save to database
    try {
        let new_user = await product.create(body);
        if (new_user) {
            res.status(200).json({ message: 'User created successfully' });
        } else {
            res.status(404).json({ message: 'User creation failed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
app.get('/getproducts', async (req, res) => {
    try {
        let collection = await product.find();
        console.log('collection', collection);

        if (collection) {
            res.status(200).json(collection); // Send the collection as JSON
        } else {
            res.status(404).send("No data found");
        }
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

app.get('/single',
    async (req,res)=>{
        
        let id = req.query.id;
        console.log("id from single",id);

        let user_data = await product.findOne({_id:id})
        console.log('user_data',user_data);

        let stringify_data = JSON.stringify(user_data);
        console.log('stringify_data',stringify_data);

        if(stringify_data){
            res.status(200).send(stringify_data)
        }else{
            res.status(400).send('stringify_data fetching fail');
        }


    }
)


app.delete('/delete',
    async (req,res) =>{
      try {
        let deleteid =req.query.id;
        console.log('deleteid',deleteid);

        let _id = new ObjectId(deleteid)


        let deletedata = await product.deleteOne({_id : deleteid})
        console.log('deletedata',deletedata);

        res.status(200).send(deletedata);

      } catch (error) {
        console.log('error',error);
      }  
    }
)
app.listen(process.env.PORT,()=>{
    console.log(`server is running at http://localhost:${process.env.PORT}`)
})
