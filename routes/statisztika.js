import pool from "../data/db.js";
import { Router } from "express";

const router = Router();

router.get('/fajok', async (req, res) => {

    let sql = 'SELECT a.faj, COUNT(DISTINCT a.id) AS allatDb, COUNT(k.id) AS kezelesDb, SUM(k.dij) AS bevetel FROM allatok a LEFT JOIN kezelesek k ON a.id = k.allat_id GROUP BY a.faj'

    const [eredmeny] = await pool.query(sql);
    res.json(eredmeny);

})

router.get('/havi', async (req,res)=>{

    //bevetelen kell javitani minden mas jo
    
    let sql = 'SELECT DATE_FORMAT(k.datum, "%Y-%m") AS honap, COUNT(k.id) AS kezelesDb, SUM(k.dij) AS bevetel FROM kezelesek k LEFT JOIN allatok a ON k.id = a.gazda_id GROUP BY k.datum'

    const [eredmeny] = await pool.query(sql);
    res.json(eredmeny)
})

export default router;