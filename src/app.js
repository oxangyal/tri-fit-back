const express = require("express");
const app = express();

require("dotenv").config();

const cors = require("cors");


app.use(express.static("public"));

app.use(express.json());
const port = process.env.PORT || 6000;

        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
