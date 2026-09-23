import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { aiClient } from '../services/aiService';

export const getForecasts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { medicineId, pharmacyId, daysAhead = '14' } = req.query;

    const days = parseInt(daysAhead as string) || 14;

    // Fetch historical 30 days of data for the specified medicine/pharmacy
    const where: any = {};
    if (medicineId && medicineId !== 'ALL') where.medicineId = medicineId as string;
    if (pharmacyId && pharmacyId !== 'ALL') where.pharmacyId = pharmacyId as string;

    const history = await prisma.demandRecord.findMany({
      where,
      orderBy: { date: 'asc' },
      take: 60,
      include: {
        medicine: true,
        pharmacy: true,
      },
    });

    const formattedHistory = history.map(h => ({
      id: h.id,
      pharmacyId: h.pharmacyId,
      medicineId: h.medicineId,
      medicineName: h.medicine.name,
      date: h.date.toISOString(),
      quantitySold: h.quantitySold,
      historicalAverage: h.historicalAverage,
    }));

    const forecast = await aiClient.generateForecast(formattedHistory, days, 0.95);

    // Also fetch inventory to calculate Days of Supply (DoS)
    const inventories = await prisma.inventory.findMany({
      where,
      include: {
        medicine: true,
        pharmacy: true,
      },
    });

    const inventoryRisks = await aiClient.assessShortages(
      inventories.map(inv => ({
        pharmacyId: inv.pharmacyId,
        pharmacyName: inv.pharmacy.name,
        medicineId: inv.medicineId,
        medicineName: inv.medicine.name,
        currentStock: inv.currentStock,
        reorderLevel: inv.reorderLevel,
        dailyAverageDemand: inv.dailyAverageDemand,
      }))
    );

    res.json({
      success: true,
      daysAhead: days,
      confidenceLevel: 0.95,
      historicalCount: history.length,
      forecast,
      shortageRisks: inventoryRisks.slice(0, 10),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
