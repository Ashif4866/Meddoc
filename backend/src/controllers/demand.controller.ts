import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getDemandRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pharmacyId, medicineId, timeframe = '30d', category, city } = req.query;

    const days = timeframe === '7d' ? 7 : timeframe === '90d' ? 90 : timeframe === '1y' ? 365 : 30;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const where: any = {
      date: { gte: sinceDate },
    };

    if (pharmacyId && pharmacyId !== 'ALL') {
      where.pharmacyId = pharmacyId as string;
    }
    if (medicineId && medicineId !== 'ALL') {
      where.medicineId = medicineId as string;
    }
    if (category && category !== 'ALL') {
      where.medicine = { category: category as string };
    }
    if (city && city !== 'ALL') {
      where.pharmacy = { city: city as string };
    }

    const records = await prisma.demandRecord.findMany({
      where,
      orderBy: { date: 'asc' },
      include: {
        medicine: true,
        pharmacy: true,
      },
    });

    // Aggregate by date for plotting
    const aggregatedByDate: { [date: string]: { actual: number; baseline: number; expected: number; count: number; date: string } } = {};

    records.forEach(r => {
      const d = r.date.toISOString().split('T')[0];
      if (!aggregatedByDate[d]) {
        aggregatedByDate[d] = { date: d, actual: 0, baseline: 0, expected: 0, count: 0 };
      }
      aggregatedByDate[d].actual += r.quantitySold;
      aggregatedByDate[d].baseline += r.historicalAverage;
      aggregatedByDate[d].expected += r.expectedDemand;
      aggregatedByDate[d].count += 1;
    });

    const timeSeries = Object.values(aggregatedByDate).sort((a, b) => a.date.localeCompare(b.date));

    res.json({
      success: true,
      timeframe,
      totalRecords: records.length,
      timeSeries,
      rawRecords: records.slice(-100), // latest 100
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getDemandComparison = async (req: Request, res: Response): Promise<void> => {
  try {
    const { medicineIds } = req.query;
    const ids = typeof medicineIds === 'string' ? medicineIds.split(',') : [];

    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 30);

    const records = await prisma.demandRecord.findMany({
      where: {
        medicineId: { in: ids.length ? ids : undefined },
        date: { gte: sinceDate },
      },
      orderBy: { date: 'asc' },
      include: { medicine: true },
    });

    // Pivot by date and medicine name
    const comparisonMap: { [date: string]: any } = {};

    records.forEach(r => {
      const d = r.date.toISOString().split('T')[0];
      if (!comparisonMap[d]) {
        comparisonMap[d] = { date: d };
      }
      const medKey = r.medicine.name;
      comparisonMap[d][medKey] = (comparisonMap[d][medKey] || 0) + r.quantitySold;
    });

    res.json({
      success: true,
      comparisonSeries: Object.values(comparisonMap).sort((a, b) => a.date.localeCompare(b.date)),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
