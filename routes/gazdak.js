import pool from "../data/db.js";
import {Router} from "express";

const router = Router();

router.get("/", async(req,res)=>{
    const varos = req.query.varos;

    let sql = 'SELECT g.id, g.nev, g.varos, COUNT(a.id) AS allatDb FROM gazdak g LEFT JOIN allatok a on a.gazda_id = g.id ';

    if(varos){
        sql += ' WHERE g.varos = ?' 
    }


    sql += ' GROUP BY g.id, g.nev, g.varos ORDER BY g.nev ASC';

    const [eredmeny] = await pool.query(sql,[varos]);
    res.json(eredmeny);
})

router.get("/:id",async(req,res)=>{
    const id = req.params.id;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({
            error: "Hibás gazdaazonosító"
        });
    }

    let sql = 'SELECT g.id AS gazdaId, g.nev AS gazdaNev, g.telefon, g.varos, a.id AS allatId, a.nev AS allatNev, a.faj, DATE_FORMAT(a.szuletes, "%Y-%m-%d") AS szuletes FROM gazdak g LEFT JOIN allatok a on a.gazda_id = g.id WHERE g.id = ? ';


    const [eredmeny] = await pool.query(sql,[id]);


      if (eredmeny.length === 0) {
        return res.status(404).json({
            error: "Nem létezik ilyen gazda"
        });
    }
    

    const gazdak = {
        id : eredmeny[0].gazdaId,
        nev : eredmeny[0].gazdaNev,
        telefon : eredmeny[0].telefon,
        varos : eredmeny[0].varos,
        allatok : []
    }

    eredmeny.forEach(allat=>{
       if (allat.allatId !== null) {
            gazdak.allatok.push({
                id: allat.allatId,
                nev: allat.allatNev,
                faj: allat.faj,
                szuletes: allat.szuletes
            });
        }
    });

    
    res.json(gazdak);
})

export default router;