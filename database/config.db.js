import { connect } from 'mongoose';
export default async function  dbConnection  (){
    try {
        await connect(process.env.MONGO_CNN)
        console.log('Connected to mongo DB')
    }catch(error){
        console.log(error)
    }
}

