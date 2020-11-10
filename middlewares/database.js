const mongoose = require("mongoose");
const { mongooseUri } = require("../config");

const connect = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
        useFindAndModify: false,
        useCreateIndex: true,
    };

    try {
        await mongoose.connect(mongooseUri, options);
        console.log("\x1b[32m%s\x1b[0m", "Database connected...");
    } catch (err) {
        console.error("Error while connecting database\n", error);
    }
};

module.exports = {
    connect
}