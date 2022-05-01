const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter");
const production = require("./production");
const PORT = process.env.PORT || 5000;

const app = express();

production(app);

app.use(express.json());

app.use("/auth", authRouter);

const start = async () => {
  try {
    const db = await mongoose.connect(
      "mongodb+srv://admin:admin@cluster0.8ny9p.mongodb.net/auth-app-by?retryWrites=true&w=majority"
    );

    if (db) console.log("db connection established");

    app.listen(PORT, () => {
      console.log(`server started on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
