import pool from "../data/db.js";
import {Router} from "express";

const router = Router();

router.get("/", async(req,res)=>{
    const faj = req.query.faj;

    let sql = 'SELECT a.id, a.nev, a.faj, DATE_FORMAT(a.szuletes,"%Y-%m-%d") AS szuletes, g.nev AS gazda FROM allatok a LEFT JOIN gazdak g on a.gazda_id = g.id WHERE a.faj = ?';

    const [eredmeny] = await pool.query(sql,[faj]);
    res.json(eredmeny);
})

router.get("/kezeles-nelkul", async(req,res)=>{
    let sql = 'SELECT a.id, a.nev, a.faj, g.nev AS gazda  FROM allatok a LEFT JOIN gazdak g on a.gazda_id = g.id LEFT JOIN kezelesek k on a.id = k.allat_id  WHERE k.id IS NULL'

    const [eredmeny] = await pool.query(sql);
    res.json(eredmeny);
})

router.get("/:id",async(req,res)=>{
    const id = req.params.id;

    let sql = 'SELECT a.id AS allatId, a.nev AS allatNev, a.faj, DATE_FORMAT(a.szuletes, "%Y-%m-%d") AS szuletes, g.id AS gazdaId, g.nev AS gazdaNev, g.telefon, k.id AS kezelesId, DATE_FORMAT(k.datum, "%Y-%m-%d") AS datum, k.leiras, k.dij FROM allatok a LEFT JOIN gazdak g on a.gazda_id = g.id LEFT JOIN kezelesek k on a.id = k.allat_id WHERE a.id = ? ORDER BY k.datum ASC';


    const [eredmeny] = await pool.query(sql,[id]);


    const allatok = {
        id : eredmeny[0].allatId,
        nev : eredmeny[0].allatNev,
        faj : eredmeny[0].faj,
        szuletes : eredmeny[0].szuletes,
        gazda: {
            id : eredmeny[0].gazdaId,
            nev : eredmeny[0].gazdaNev,
            telefon : eredmeny[0].telefon
        },
        kezelesek: []
    }

    eredmeny.forEach(kezeles => {
        allatok.kezelesek.push({
            id : kezeles.kezelesId,
            datum : kezeles.datum,
            leiras : kezeles.leiras,
            dij : kezeles.dij
        })
    })   


    //.reduce használátaról megkérdeztem ait
    allatok.osszesDij = allatok.kezelesek.reduce((osszeg,kezeles)=>{
        return osszeg + Number(kezeles.dij);
    }, 0);

    //hibakezelés kell

    res.json(allatok);
    
})

export default router;