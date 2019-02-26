var mongoose = require('mongoose');
// console.log(mongoose);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Jobify',  { useNewUrlParser: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = {
    mongoose
};
