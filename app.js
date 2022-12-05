const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/signup", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(400);
  res.send("Gamed yala");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://sarhan:sarhan@cluster0.mxjd9bh.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
