import pool from "../data/db.js";
import { Router } from "express";

const router = Router();

router.get('/fajok', async (req, res) => {

    let sql = 'SELECT a.faj, COUNT(DISTINCT a.id) AS allatDb, COUNT(k.id) AS kezelesDb, SUM(k.dij) AS bevetel FROM allatok a LEFT JOIN kezelesek k ON a.id = k.allat_id GROUP BY a.faj'

    const [eredmeny] = await pool.query(sql);
    res.json(eredmeny);

})

router.get('/havi', async (req,res)=>{

    //AI segítségével készült az sql
    let sql = 'SELECT DATE_FORMAT(k.datum, "%Y-%m") AS honap, COUNT(k.id) AS kezelesDb, SUM(k.dij) AS bevetel FROM kezelesek k INNER JOIN allatok a ON  k.allat_id = a.id INNER JOIN gazdak g ON a.gazda_id = g.id GROUP BY DATE_FORMAT(k.datum, "%Y-%m") ORDER BY k.datum ASC'

    const [eredmeny] = await pool.query(sql);
    res.json(eredmeny)
})


router.get('/gazdak', async (req,res)=>{
    
    let sql = 'SELECT g.nev AS gazda, COUNT(DISTINCT a.id) AS allatDb, SUM(k.dij) AS osszKoltes FROM gazdak g LEFT JOIN allatok a ON a.gazda_id = g.id  LEFT JOIN kezelesek k ON k.allat_id = a.id GROUP BY g.nev, g.id ORDER BY k.dij DESC'

    const [eredmeny] = await pool.query(sql)
    res.json(eredmeny)


})

export default router;