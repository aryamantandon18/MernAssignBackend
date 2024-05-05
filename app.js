import express from 'express'
import session from 'express-session';
import cors from 'cors'
import bodyParser from 'body-parser'
import {config} from 'dotenv'
import ConnectMongoDBSession from 'connect-mongodb-session';
import userRoutes from './routes/user.js'

export const app = express();

config({          // to use .env file variables
    path:"./data/config.env"
})
const mongodbStore = ConnectMongoDBSession(session);
const store = new mongodbStore({
    uri: process.env.MONGO_URI,
    collection: 'mySessions'
});
store.on('error', function(error) {
    console.error('Session store error:', error);
});

app.use(express.json());               // { limit: '30mb' }
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true , limit: '50mb'}));

app.use(session({
    secret: 'your_secret_key', // Use a secure secret for session encryption
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // Session expiry (1 day)
        secure: true, // Set to true in production (HTTPS)
        sameSite: 'lax' // CSRF protection
    },
    store:store
}));
// CORS configuration
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
}));

app.use('/users',userRoutes);

app.get('/',(req,res)=>{
    req.session.isAuth = true;
    console.log(session);
    res.send("Hello Guys Welcome");
})


