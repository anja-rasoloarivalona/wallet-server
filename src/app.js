import express from "express"
import bodyParser from "body-parser"
import http from 'http';
import routes from './routes/index.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const server = http.createServer(app);
const port = process.env.PORT || 3001;
const host = process.env.HOST || 'localhost';

app.use(bodyParser.json())
app.use('/', routes)

server.listen(port, host, console.log(`Server running on http://${host}:${port}.`));
