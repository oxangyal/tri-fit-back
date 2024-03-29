const express = require("express");
const app = express();

require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// app.use(
//     cors({
//         origin: "http://localhost:3000",
//         methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//         credentials: true,
//     })
// );
app.get("/", (req, res) => {
    res.send("<h1>Tri Fit</h1>");
});

app.use(express.static("public"));
// //Swagger
// const swaggerUI = require("swagger-ui-express");
// const YAML = require("yamljs");
// const swaggerDocument = YAML.load("./swagger.yaml");

// const express = require("express");
// const app = express();

//connectDB
const connectDB = require("./db/connect");

//router

const authRouter = require("./routes/auth");
const workoutsRouter = require("./routes/workouts");
const racesRouter = require("./routes/races");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
if (!process.env.NODE_ENV === "development") {
    app.use(
        rateLimiter({
            windowMs: 15 * 60 * 1000, //15 min
            max: 100, //limit each IP to 100 requests per windowMs
        })
    );
}

app.use(helmet());
app.use(xss());

app.use(express.json());
app.use(
    cors({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
);
//routes

app.use("/api/v1/auth", authRouter);
const authenticateUser = require("./middleware/authentication");
app.use("/api/v1/workouts", authenticateUser, workoutsRouter);
app.use("/api/v1/races", authenticateUser, racesRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
