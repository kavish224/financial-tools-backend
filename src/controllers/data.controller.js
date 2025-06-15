import axios from "axios";
import prisma from "../db/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { logger } from "../utils/logger.js";

export const n50 = asyncHandler(async (req, res) => {
    const symbols = await prisma.stockSymbol.findMany({
        select: {
            symbol: true,
            companyName: true,
            industry: true,
        },
        orderBy: {
            symbol: 'asc'
        }
    });

    if (!symbols.length) {
        throw ApiError.notFound("No stock symbols found");
    }

    res.json(ApiResponse.success(symbols, "Symbols retrieved successfully", 200, {
        count: symbols.length
    }));
});

export const getAvailableSMADates = asyncHandler(async (req, res) => {
    const rawDates = await prisma.sMA_Results.findMany({
      orderBy: { date_generated: 'desc' },
      select: { date_generated: true },
    });
    if (!rawDates.length) {
        throw ApiError.notFound("No SMA results available");
    }
    const seen = new Set();
    const uniqueDates = [];
    for (const { date_generated } of rawDates) {
        const isoDate = new Date(date_generated).toISOString().split("T")[0];
        if (!seen.has(isoDate)) {
            seen.add(isoDate);
            uniqueDates.push(isoDate);
        }
        if (uniqueDates.length >= 7) break;
    }
    res.json(ApiResponse.success(uniqueDates, "SMA dates retrieved successfully", 200, {
        count: uniqueDates.length
    }));
});

export const getSMAByDate = asyncHandler(async (req, res) => {
    const { tp, date } = req.body;
    const threshold = 2;

    if (!tp || !date) {
        throw ApiError.badRequest("Missing required parameters: tp and date");
    }

    const timePeriod = Number(tp);
    if (isNaN(timePeriod) || timePeriod < 5 || timePeriod > 200) {
        throw ApiError.badRequest("Invalid time period. Must be between 5 and 200");
    }

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const results = await prisma.sMA_Results.findMany({
        where: {
            sma_period: timePeriod,
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
        },
        take: 100 // Limit results
    });

    if (!results.length) {
        throw ApiError.notFound(`No SMA results found for period ${timePeriod} on ${date}`);
    }

    res.json(ApiResponse.success(results, "SMA data retrieved successfully", 200, {
        count: results.length,
        period: timePeriod,
        date: date
    }));
});

export const sma = asyncHandler(async (req, res) => {
    const { tp } = req.body;
    const threshold = 2;

    if (!tp) {
        throw ApiError.badRequest("Missing required parameter: tp");
    }

    const timePeriod = Number(tp);
    if (isNaN(timePeriod) || timePeriod < 5 || timePeriod > 200) {
        throw ApiError.badRequest("Invalid time period. Must be between 5 and 200");
    }

    const latest = await prisma.sMA_Results.findFirst({
        orderBy: { date_generated: 'desc' },
        select: { date_generated: true }
    });

    if (!latest) {
        throw ApiError.notFound("No SMA results available");
    }

    const results = await prisma.sMA_Results.findMany({
        where: {
            sma_period: timePeriod,
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
        },
        take: 100 // Limit results
    });

    if (!results.length) {
        throw ApiError.notFound(`No SMA results found for period ${timePeriod}`);
    }

    res.json(ApiResponse.success(results, "Latest SMA data retrieved successfully", 200, {
        count: results.length,
        period: timePeriod,
        date: latest.date_generated
    }));
});

export const customsma = asyncHandler(async (req, res) => {
    const { sma_period = 100, threshold_pct = 1 } = req.body;

    if (sma_period < 5 || sma_period > 200) {
        throw ApiError.badRequest("SMA period must be between 5 and 200");
    }

    if (threshold_pct < 0.1 || threshold_pct > 10) {
        throw ApiError.badRequest("Threshold percentage must be between 0.1 and 10");
    }

    const flaskUrl = process.env.FLASK_URL;
    if (!flaskUrl) {
        throw ApiError.internal("Flask service URL not configured");
    }

    try {
        const response = await axios.post(
            `${flaskUrl}/analytics/sma-nearby`,
            { sma_period, threshold_pct },
            {
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Stock-API/1.0'
                }
            }
        );

        logger.info('Custom SMA data fetched from Flask service', {
            sma_period,
            threshold_pct,
            dataCount: response.data?.length || 0
        });

        res.json(ApiResponse.success(response.data, "Custom SMA data retrieved successfully", 200, {
            sma_period,
            threshold_pct
        }));

    } catch (error) {
        logger.error('Failed to fetch custom SMA data from Flask service', {
            error: error.message,
            sma_period,
            threshold_pct,
            flaskUrl
        });

        if (error.code === 'ECONNREFUSED') {
            throw ApiError.serviceUnavailable("Analytics service is currently unavailable");
        }

        if (error.code === 'ECONNABORTED') {
            throw ApiError.serviceUnavailable("Request timeout - analytics service is taking too long to respond");
        }

        throw ApiError.badGateway("Failed to fetch data from analytics service");
    }
});
