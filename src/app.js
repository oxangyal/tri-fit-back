const express = require("express");
const app = express();

require("dotenv").config();


const cors = require("cors");


app.use(express.static("public"));


// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");



app.use(express.json());


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 6000;

        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );

