import pool from "../data/db.js";
import { Router } from "express";
import db from "../data/db.js";

const router = Router();

router.get('/', async (req, res) =>{
    const { tol, ig } = req.query;


    //hibakezeléshez AI segítségét kértem
    if (tol) {
        const [ev, honap, nap] = tol.split("-").map(Number);
        const d = new Date(Date.UTC(ev, honap - 1, nap));

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(tol) ||
            d.getUTCFullYear() !== ev ||
            d.getUTCMonth() !== honap - 1 ||
            d.getUTCDate() !== nap
        ) {
            return res.status(400).json({ error: "Hibás kezdődátum" });
        }
    }

    if (ig) {
        const [ev, honap, nap] = ig.split("-").map(Number);
        const d = new Date(Date.UTC(ev, honap - 1, nap));

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(ig) ||
            d.getUTCFullYear() !== ev ||
            d.getUTCMonth() !== honap - 1 ||
            d.getUTCDate() !== nap
        ) {
            return res.status(400).json({ error: "Hibás záródátum" });
        }
    }
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

    
    
    

    const [eredmeny] = await pool.query(sql,params);
    res.json(eredmeny);

})


router.post("/", async(req,res)=>{


    const {allatId, leiras, dij, datum} = req.body

    const hibasadatok = [];

    //hibakezelésekhez AI segítségét használtam
    if (!allatId || !Number.isInteger(Number(allatId)) || Number(allatId) <= 0) {
    hibasadatok.push("Hiányzó vagy hibás allatId");
    }

    if (!leiras || leiras.trim() === "") {
    hibasadatok.push("A leírás nem lehet üres");
    }

    if (dij === undefined || dij === null || dij === "" || !Number.isFinite(Number(dij)) || Number(dij) <= 0) {
    hibasadatok.push("A díjnak pozitív számnak kell lennie");
    }

    if (datum) {
    const helyesDatum = /^\d{4}-\d{2}-\d{2}$/.test(datum);
    const d = new Date(datum);

    if (!helyesDatum || isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== datum) {
        hibasadatok.push("A dátum érvénytelen");
    }
}

    if (hibasadatok.length > 0) {
    return res.status(400).json({ hibasadatok });
    }


    const kezelesDatum = datum || new Date().toISOString().slice(0, 10);

    const[allat] = await db.execute('SELECT id FROM allatok WHERE id = ?', [allatId]);

    if(allat.length === 0){
        return res.status(404).json({error: 'nem létezik ilyen id-jű állat'})
    }

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

export default router;