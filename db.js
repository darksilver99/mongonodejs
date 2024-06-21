const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let _db; // Variable to store the database instance

async function connectToDatabase() {
    try {
        if (!_db) {
            await client.connect();
            _db = client.db('TestData');
            console.log("Connected to MongoDB");
        }
        return _db;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err;
    }
}

module.exports = {
    connectToDatabase
};

