import pool from "../data/db.js";
import { Router } from "express";

const router = Router();

router.get('/fajok', async (req, res) => {

    let sql = 'SELECT a.faj, COUNT(DISTINCT a.id) AS allatDb, COUNT(k.id) AS kezelesDb, SUM(k.dij) AS bevetel FROM allatok a LEFT JOIN kezelesek k ON a.id = k.allat_id GROUP BY a.faj'

    const [eredmeny] = await pool.query(sql);
    res.json(eredmeny);

})

export default router;