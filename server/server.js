import express from "express"
import cors from "cors"
import "dotenv/config"
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js"
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js"
import petRouter from './routes/petRoutes.js';


const app = express()
const port  = process.env.PORT || 4000

connectDB()

const allowedOrigins = ['http://localhost:3000']

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: allowedOrigins, credentials: true}))  // for sending cookies  in response

//Api endpoints
app.get('/', (req, res) => res.send("API working"));
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.use('/api/pets', petRouter);


app.listen(port, ()=> console.log(`Server started on port: ${port}`))
