import axios from "axios";
import prisma from "../db/prisma.js"

export const n50 = async(req, res) => {
    const symbols = await prisma.StockSymbol.findMany();
    res.json(symbols);
}
export const sma = async(req, res) => {
    const tp = req.body.tp;
    const sma = await axios.post(`${process.env.FLASK}/analytics/sma-nearby`,{"sma_period":`${tp}`, "threshold_pct":"2"});
    res.json(sma.data);
}