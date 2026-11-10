import express from "express";
import gazda from "./routes/gazdak.js";
import allatok from "./routes/allatok.js";
import kezelesek from "./routes/kezelesek.js";
import statisztika from "./routes/statisztika.js";


const app = express();
const port = 3000;

app.use(express.json());


app.use('/gazdak',gazda);
app.use('/allatok',allatok);
app.use('/kezelesek',kezelesek);
app.use('/statisztika',statisztika);


app.listen(port,()=>{
    console.log(`Server is running: http://localhost:${port}`);
})