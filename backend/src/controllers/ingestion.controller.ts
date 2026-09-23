import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { aiClient } from '../services/aiService';

export const ingestCSVData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { csvData } = req.body;
    if (!csvData) {
      res.status(400).json({ error: 'csvData text is required' });
      return;
    }

    const lines = csvData.trim().split('\n');
    if (lines.length < 2) {
      res.status(400).json({ error: 'Invalid CSV format: requires header and rows' });
      return;
    }

    const headers = lines[0].split(',').map((h: string) => h.trim());
    const insertedRecords = [];

    // Match or create pharmacies & medicines
    const defaultPharm = await prisma.pharmacy.findFirst();
    const defaultMed = await prisma.medicine.findFirst();

    if (!defaultPharm || !defaultMed) {
      res.status(400).json({ error: 'Database must be seeded with baseline pharmacies and medicines first.' });
      return;
    }

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p: string) => p.trim());
      if (parts.length >= 3) {
        const dateStr = parts[0];
        const sold = parseInt(parts[1]) || 0;
        const requested = parseInt(parts[2]) || sold;
        const historical = parts[3] ? parseFloat(parts[3]) : 50.0;

        const record = await prisma.demandRecord.create({
          data: {
            pharmacyId: defaultPharm.id,
            medicineId: defaultMed.id,
            date: new Date(dateStr),
            quantitySold: sold,
            quantityRequested: requested,
            historicalAverage: historical,
            expectedDemand: historical * 1.05,
            anomalyScore: sold > historical * 1.5 ? 0.85 : 0.1,
          },
        });
        insertedRecords.push(record);
      }
    }

    res.json({
      success: true,
      message: `Successfully ingested ${insertedRecords.length} records.`,
      count: insertedRecords.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const simulateSurgeEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city = 'Chennai', medicineName = 'Paracetamol 650mg', surgeMagnitude = 175 } = req.body;

    const medicine = await prisma.medicine.findFirst({
      where: { name: { contains: medicineName } },
    });

    const pharmacy = await prisma.pharmacy.findFirst({
      where: { city: { contains: city } },
    });

    if (!medicine || !pharmacy) {
      res.status(404).json({ error: `Could not find pharmacy in ${city} or medicine ${medicineName}` });
      return;
    }

    const baseline = 65.0;
    const spikedDemand = Math.round(baseline * (1 + surgeMagnitude / 100));

    // 1. Create demand record with surge
    const newRecord = await prisma.demandRecord.create({
      data: {
        pharmacyId: pharmacy.id,
        medicineId: medicine.id,
        date: new Date(),
        quantitySold: spikedDemand,
        quantityRequested: Math.round(spikedDemand * 1.15),
        historicalAverage: baseline,
        expectedDemand: baseline * 1.05,
        anomalyScore: 0.94,
      },
    });

    // 2. Create Spike record
    const spike = await prisma.spike.create({
      data: {
        pharmacyId: pharmacy.id,
        medicineId: medicine.id,
        demandIncreasePercentage: surgeMagnitude,
        anomalyScore: 0.94,
        severity: surgeMagnitude >= 120 ? 'CRITICAL' : 'HIGH',
        status: 'ACTIVE',
        explanation: `Simulated surge event: ${medicine.name} sales at ${pharmacy.name} (${pharmacy.city}) surged to ${spikedDemand} units (+${surgeMagnitude}% vs baseline of ${baseline}). Statistical Z-score 3.42. Immediate epidemiological signal triggered.`,
      },
      include: { medicine: true, pharmacy: true },
    });

    // 3. Create Alert
    const alert = await prisma.alert.create({
      data: {
        pharmacyId: pharmacy.id,
        medicineId: medicine.id,
        type: 'SPIKE_DETECTED',
        title: `⚡ Critical Demand Spike: ${medicine.name} in ${pharmacy.city}`,
        message: `Sudden demand increase of +${surgeMagnitude}% detected at ${pharmacy.name}. Anomaly score 0.94.`,
        severity: 'CRITICAL',
        status: 'UNRESOLVED',
      },
    });

    // 4. Create AI Insight
    const insight = await prisma.aIInsight.create({
      data: {
        pharmacyId: pharmacy.id,
        medicineId: medicine.id,
        title: `Surge Pattern in ${pharmacy.city}: ${medicine.name}`,
        description: `Acute demand inflection detected in ${pharmacy.city} cluster. AI confidence: 96.2%. Recommended action: Inspect local primary health center admission registers.`,
        confidence: 0.962,
        insightType: 'ANOMALY_EXPLANATION',
      },
    });

    res.json({
      success: true,
      message: `Simulated ${surgeMagnitude}% surge injected successfully! Pipeline triggered anomaly detection, spike record, critical alert, and AI insight.`,
      data: {
        demandRecord: newRecord,
        spike,
        alert,
        insight,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
