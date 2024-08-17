const mongoose = require('mongoose')

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CNN)
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = dbConnection //Export function dbconnection