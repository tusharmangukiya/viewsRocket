module.exports = {
    mongooseUri:
        process.env.NODE_ENV == "development"
            ? "mongodb://127.0.0.1:27017/viewsRocket"
            : process.env.MONGOOSE_URI,
    bcrypt: {
        salt: {
            rounds: 10,
        },
    }
};
