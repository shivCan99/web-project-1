require('dotenv').config();
module.exports = {
    //mongoDBUrl: 'mongodb+srv://balrajhumber:h6ojEE9e4b6eOx3u@cluster0.6xykjaq.mongodb.net/Week10A?retryWrites=true&w=majority',
    mongoDBUrl: process.env.MONGO_URL,
    secret: process.env.Secret_Key
}