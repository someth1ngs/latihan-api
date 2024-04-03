const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors")

app.use(express.json());
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.use(cors())

const v1Router = require('./routes/v1/index.js')
app.use('/v1', v1Router)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});