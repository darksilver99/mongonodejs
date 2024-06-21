const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors')
const multer = require('multer');
const multipart = multer();

const app = express();
const port = process.env.PORT || 3000;

const { connectToDatabase } = require('./db');

const custom = require('./lib');

app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello! Node.js");
});

app.listen(port, () => {
    console.log("Starting node.js at port " + port);
});

app.get('/test', async (req, res) => {
    const test = {
        "test": custom.messageDefault(),
        "test2": await custom.messageDefault2(),
    };
    res.json(test)
});

app.get('/users', async (req, res) => {

    const orderKey = req.query.order_key ?? 'create_date'; // Get 'order_key' query parameter
    const isDesc = req.query.is_desc === "1";
    const keyword = req.query.keyword ?? "";
    try {

        const sortDirection = isDesc ? -1 : 1;
        const sortObject = {};
        sortObject[orderKey] = sortDirection;


        const regexPattern = new RegExp(keyword, "i");
        let query = {};
        if (keyword != "") {
            query = {
                $or: [
                    { title: { $regex: regexPattern } },
                    { detail: { $regex: regexPattern } }
                ]
            }

        }
        const db = await connectToDatabase();
        const users = await db.collection('news_list').find(query).sort(sortObject).toArray();
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/insert_user', multipart.none(), async (req, res) => {
    const data = req.body;
    const current = new Date();
    current.setHours(current.getHours() + 7);
    try {
        const db = await connectToDatabase();
        await db.collection('news_list').insertOne({
            "title": data.title,
            "detail": data.detail,
            "class": messageDefault(),
            "create_date": current,
        });
        res.status(200).json({ status: 1 });
    } catch (err) {
        console.error("Error inserting user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

function messageDefault() {
    return "success";
}