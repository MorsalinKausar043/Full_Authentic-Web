const mongoose = require('mongoose');

mongoose.connect(process.env.SECRET_MONGODB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log(`mongoose port is 27017!`))
    .catch((error) => console.log(error));