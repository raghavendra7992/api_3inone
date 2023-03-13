const mongoose=require('mongoose')
const db = ()=>{
    try {
        const con=mongoose.connect(process.env.mongodb_url)
        console.log('mongodb connected')
    } catch (error) {
        console.log(error)
    }    
    }
module.exports=db