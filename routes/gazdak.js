import pool from "../data/db.js";
import {Router} from "express";

const router = Router();

router.get("/", async(req,res)=>{
    let sql = 'SELECT g.id, g.nev, g.varos, COUNT(a.id) AS allatDb FROM gazdak g LEFT JOIN allatok a on a.gazda_id = g.id GROUP BY g.id, g.nev, g.varos ORDER BY g.nev ASC';

    const [eredmeny] = await pool.query(sql);
    
    res.json(eredmeny);
})

export default router;