require("dotenv").config();

const next = require("next");

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const { ApolloServer } = require("apollo-server-express");
const routes = require("./routes");
const passport = require("./server/passport");
const { resolvers, typeDefs } = require("./apollo");

const playgroundSettings = {
    "schema.polling.enable": false,
};

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: playgroundSettings,
    debug: false,
});

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use(express.static("public"));
    server.use(cors());
    server.use(morgan("dev"));
    server.use(cookieParser());
    server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
    server.use(bodyParser.json({ limit: "50mb" }));

    server.use(passport.initialize());

    apolloServer.applyMiddleware({ app: server });
    server.use(process.env.EXPRESS_ENDPOINT, routes);

    server.all("*", (req, res) => {
        return handle(req, res);
    });

    server.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Credentials", "true");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});
