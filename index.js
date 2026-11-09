import express from "express";
import gazda from "./routes/gazdak.js";

const app = express();
const port = 3000;


app.use('/gazdak',gazda);

app.listen(port,()=>{
    console.log(`Server is running: http://localhost:${port}`);
})