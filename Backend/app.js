import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

// trust proxy for secure cookies behind reverse proxies (Render/Railway)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());
const allowAllInDev = process.env.CORS_ALLOW_ALL === 'true' || process.env.NODE_ENV !== 'production';

app.use(
    cors({
        origin: allowAllInDev
            ? true // reflect request origin in dev
            : (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }
                return callback(new Error('Not allowed by CORS'));
            },
        credentials:true
    })
)

//common middleware//




app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(cookieParser());

app.use(express.static("public"));

export default app;