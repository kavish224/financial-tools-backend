import prisma from "../db/prisma.js";

export const n50 = async (req, res) => {
  const symbols = await prisma.StockSymbol.findMany({
    select: {
      symbol: true,
      companyName: true,
      industry: true,
    }
  });
  res.json(symbols);
};

export const getAvailableSMADates = async (req, res) => {
  try {
    const dates = await prisma.sMA_Results.findMany({
      distinct: ['date_generated'],
      orderBy: { date_generated: 'desc' },
      take: 7,
      select: { date_generated: true },
    });

    res.json(dates.map(d => d.date_generated));
  } catch (error) {
    console.error("Error fetching SMA dates:", error);
    res.status(500).json({ error: "Failed to fetch SMA dates" });
  }
};

export const getSMAByDate = async (req, res) => {
  try {
    const { tp, date } = req.body;
    const threshold = 2;

    if (!tp || !date) {
      return res.status(400).json({ error: "Missing tp or date" });
    }

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const results = await prisma.sMA_Results.findMany({
      where: {
        sma_period: Number(tp),
        threshold_pct: threshold,
        date_generated: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { deviation_pct: 'asc' },
      select: {
        symbol: true,
        close_price: true,
        sma_value: true,
        deviation_pct: true,
        date_generated: true,
      }
    });

    res.json(results);
  } catch (error) {
    console.error("Error fetching SMA data by date:", error);
    res.status(500).json({ error: "Failed to fetch SMA data by date" });
  }
};

export const sma = async (req, res) => {
  try {
    const { tp } = req.body;
    const threshold = 2;

    const latest = await prisma.sMA_Results.findFirst({
      orderBy: { date_generated: 'desc' },
      select: { date_generated: true }
    });

    if (!latest) {
      return res.status(404).json({ error: "No SMA results available" });
    }

    const results = await prisma.sMA_Results.findMany({
      where: {
        sma_period: Number(tp),
        threshold_pct: threshold,
        date_generated: latest.date_generated
      },
      orderBy: { deviation_pct: 'asc' },
      select: {
        symbol: true,
        close_price: true,
        sma_value: true,
        deviation_pct: true,
        date_generated: true,
      }
    });

    res.json(results);
  } catch (error) {
    console.error("Error fetching SMA data from DB:", error);
    res.status(500).json({ error: "Failed to fetch SMA data from DB" });
  }
};
