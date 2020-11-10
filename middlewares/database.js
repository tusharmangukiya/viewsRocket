const mongoose = require("mongoose");

const connect = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
        useFindAndModify: false,
        useCreateIndex: true,
    };

    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/viewsRocket", options);
        console.log("\x1b[32m%s\x1b[0m", "Database connected...");
    } catch (err) {
        console.error("Error while connecting database\n", err);
    }
};

module.exports = {
    connect
}