import {Router} from "express";
import db from "../data/db.js"

const router = Router();

router.post("/", async(req,res)=>{

    const {allatId, leiras, dij, datum} = req.body

    const kezelesDatum = datum || new Date().toISOString().slice(0, 10);

    const sql = 'INSERT INTO kezelesek (allat_id, datum, leiras, dij) VALUES (?, ?, ?, ?)'


    const [eredmeny] = await db.execute(sql,[
        allatId,
        kezelesDatum,
        leiras,
        dij
    ])


    res.status(201).json({
        id: eredmeny.insertId,
        datum : kezelesDatum,
        allatId,
        leiras,
        dij   
    })
})

export default router