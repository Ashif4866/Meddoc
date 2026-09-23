import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { aiClient } from '../services/aiService';

export const getSpikes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { severity, status, city, medicineId, search } = req.query;

    const where: any = {};
    if (severity && severity !== 'ALL') {
      where.severity = severity as string;
    }
    if (status && status !== 'ALL') {
      where.status = status as string;
    }
    if (medicineId) {
      where.medicineId = medicineId as string;
    }
    if (city && city !== 'ALL') {
      where.pharmacy = { city: city as string };
    }

    let spikes = await prisma.spike.findMany({
      where,
      orderBy: { detectedAt: 'desc' },
      include: {
        medicine: true,
        pharmacy: true,
      },
    });

    if (search) {
      const term = (search as string).toLowerCase();
      spikes = spikes.filter(
        s =>
          s.medicine.name.toLowerCase().includes(term) ||
          s.pharmacy.name.toLowerCase().includes(term) ||
          s.pharmacy.city.toLowerCase().includes(term) ||
          s.explanation.toLowerCase().includes(term)
      );
    }

    res.json({
      success: true,
      count: spikes.length,
      data: spikes,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSpikeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const spike = await prisma.spike.findUnique({
      where: { id },
      include: {
        medicine: true,
        pharmacy: true,
      },
    });

    if (!spike) {
      res.status(404).json({ error: 'Spike record not found' });
      return;
    }

    // Retrieve recent demand records for context
    const demandHistory = await prisma.demandRecord.findMany({
      where: {
        pharmacyId: spike.pharmacyId,
        medicineId: spike.medicineId,
      },
      orderBy: { date: 'asc' },
      take: 30,
    });

    res.json({
      success: true,
      data: {
        ...spike,
        demandHistory,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSpikeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // ACTIVE, INVESTIGATING, ACKNOWLEDGED, RESOLVED

    if (!['ACTIVE', 'INVESTIGATING', 'ACKNOWLEDGED', 'RESOLVED'].includes(status)) {
      res.status(400).json({ error: 'Invalid spike status' });
      return;
    }

    const updated = await prisma.spike.update({
      where: { id },
      data: { status },
      include: {
        medicine: true,
        pharmacy: true,
      },
    });

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const runSpikeAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch recent 14 days of demand records
    const recentRecords = await prisma.demandRecord.findMany({
      take: 200,
      orderBy: { date: 'desc' },
      include: {
        medicine: true,
        pharmacy: true,
      },
    });

    const formatted = recentRecords.map(r => ({
      id: r.id,
      pharmacyId: r.pharmacyId,
      pharmacyName: r.pharmacy.name,
      medicineId: r.medicineId,
      medicineName: r.medicine.name,
      date: r.date.toISOString(),
      quantitySold: r.quantitySold,
      historicalAverage: r.historicalAverage,
    }));

    const anomalies = await aiClient.detectAnomalies(formatted);

    // Filter discovered anomalies
    const newAnomalies = anomalies.filter(a => a.isAnomaly);

    res.json({
      success: true,
      analyzedRecords: formatted.length,
      anomaliesFound: newAnomalies.length,
      results: newAnomalies,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
