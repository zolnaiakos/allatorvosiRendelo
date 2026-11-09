import pool from "../data/db.js";
import { Router } from "express";

const router = Router();

router.get('/', async (req, res) =>{
    let {tol, ig, }  = req.query;

    const faj = req.query.faj;

    let sql = 'SELECT k.id, DATE_FORMAT(k.datum, "%Y-%m-%d") AS datum , a.nev AS allat , a.faj, g.nev AS gazda, k.leiras, k.dij FROM kezelesek k LEFT JOIN allatok a  ON k.allat_id = a.id LEFT JOIN gazdak g ON a.gazda_id = g.id ORDER BY k.datum ASC'

    let params = [];
    let feltetel = [];

    if(faj){
        feltetel.push('a.faj = ?');
        params.push(faj);
    }

    if(tol && ig && (tol) > (ig)){
        [tol, ig] = [ig, tol];
    }

    if(tol){
        params.push(tol);
        feltetel.push('k.datum >= ?');
    }

    if(ig){
        params.push(ig);
        feltetel.push('k.datum <= ?');
    }

    //hibakezelés kell
    
    

    const [eredmeny] = await pool.query(sql,params);
    res.json(eredmeny);

})

export default router;