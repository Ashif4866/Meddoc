import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getDashboardOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      pharmacyCount,
      medicineCount,
      activeSpikesCount,
      criticalAlertsCount,
      shortagesCount,
      recentSpikes,
      recentAlerts,
      recentInsights,
    ] = await Promise.all([
      prisma.pharmacy.count(),
      prisma.medicine.count(),
      prisma.spike.count({ where: { status: { in: ['ACTIVE', 'INVESTIGATING'] } } }),
      prisma.alert.count({ where: { severity: 'CRITICAL', status: 'UNRESOLVED' } }),
      prisma.inventory.count({ where: { status: { in: ['LOW_STOCK', 'CRITICAL'] } } }),
      prisma.spike.findMany({
        take: 5,
        orderBy: { detectedAt: 'desc' },
        include: {
          medicine: true,
          pharmacy: true,
        },
      }),
      prisma.alert.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          pharmacy: true,
          medicine: true,
        },
      }),
      prisma.aIInsight.findMany({
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: {
          medicine: true,
          pharmacy: true,
        },
      }),
    ]);

    // Trend series for 7 days
    const sparklines = {
      pharmacies: [2410, 2435, 2460, 2490, 2515, 2530, 2548],
      medicines: [17800, 17950, 18100, 18200, 18300, 18380, 18426],
      spikes: [12, 14, 11, 15, 19, 14, 17],
      alerts: [6, 5, 8, 4, 7, 5, 4],
      shortages: [11, 9, 10, 8, 7, 9, 8],
      confidence: [93.8, 94.1, 94.5, 94.2, 94.8, 94.6, 94.7],
    };

    // 14-day aggregated demand trend vs historical baseline
    const demandTrend = [
      { date: 'Day -13', actual: 4120, baseline: 3950, upperLimit: 4500, lowerLimit: 3400 },
      { date: 'Day -12', actual: 4250, baseline: 4000, upperLimit: 4550, lowerLimit: 3450 },
      { date: 'Day -11', actual: 4180, baseline: 3980, upperLimit: 4520, lowerLimit: 3440 },
      { date: 'Day -10', actual: 4310, baseline: 4050, upperLimit: 4600, lowerLimit: 3500 },
      { date: 'Day -9', actual: 4480, baseline: 4100, upperLimit: 4650, lowerLimit: 3550 },
      { date: 'Day -8', actual: 4600, baseline: 4120, upperLimit: 4680, lowerLimit: 3560 },
      { date: 'Day -7', actual: 4920, baseline: 4150, upperLimit: 4720, lowerLimit: 3580 },
      { date: 'Day -6', actual: 5410, baseline: 4180, upperLimit: 4750, lowerLimit: 3610 },
      { date: 'Day -5', actual: 5890, baseline: 4200, upperLimit: 4780, lowerLimit: 3620 },
      { date: 'Day -4', actual: 6340, baseline: 4220, upperLimit: 4800, lowerLimit: 3640 },
      { date: 'Day -3', actual: 6780, baseline: 4250, upperLimit: 4830, lowerLimit: 3670 },
      { date: 'Day -2', actual: 7120, baseline: 4270, upperLimit: 4850, lowerLimit: 3690 },
      { date: 'Yesterday', actual: 7540, baseline: 4300, upperLimit: 4880, lowerLimit: 3720 },
      { date: 'Today', actual: 7920, baseline: 4320, upperLimit: 4900, lowerLimit: 3740 },
    ];

    // City distribution summary
    const citySummary = [
      { city: 'Chennai', activeSpikes: 5, riskLevel: 'HIGH', monitoredPharmacies: 640 },
      { city: 'Madurai', activeSpikes: 4, riskLevel: 'HIGH', monitoredPharmacies: 320 },
      { city: 'Coimbatore', activeSpikes: 2, riskLevel: 'WARNING', monitoredPharmacies: 410 },
      { city: 'Tiruchirappalli', activeSpikes: 2, riskLevel: 'WARNING', monitoredPharmacies: 230 },
      { city: 'Salem', activeSpikes: 1, riskLevel: 'NORMAL', monitoredPharmacies: 190 },
      { city: 'Bengaluru', activeSpikes: 2, riskLevel: 'WARNING', monitoredPharmacies: 750 },
    ];

    res.json({
      success: true,
      data: {
        kpis: {
          pharmaciesMonitored: {
            value: pharmacyCount > 0 ? (2500 + pharmacyCount) : 2548,
            change: '+8.4%',
            trend: 'up',
            sparkline: sparklines.pharmacies,
          },
          medicinesMonitored: {
            value: medicineCount > 0 ? (18400 + medicineCount) : 18426,
            change: '+5.2%',
            trend: 'up',
            sparkline: sparklines.medicines,
          },
          activeSpikes: {
            value: activeSpikesCount || 17,
            change: '+3 today',
            trend: 'up',
            severity: 'CRITICAL',
            sparkline: sparklines.spikes,
          },
          criticalAlerts: {
            value: criticalAlertsCount || 4,
            change: 'Requires attention',
            trend: 'neutral',
            severity: 'CRITICAL',
            sparkline: sparklines.alerts,
          },
          predictedShortages: {
            value: shortagesCount || 8,
            change: 'Next 7 days',
            trend: 'down',
            severity: 'HIGH',
            sparkline: sparklines.shortages,
          },
          aiConfidence: {
            value: '94.7%',
            change: '+0.6% this week',
            trend: 'up',
            sparkline: sparklines.confidence,
          },
        },
        demandTrend,
        citySummary,
        recentSpikes,
        recentAlerts,
        recentInsights,
        systemStatus: {
          aiEngine: 'ONLINE',
          anomalyContaminationRate: '5.0%',
          lastSync: new Date().toISOString(),
          environment: 'SIH Demo Environment (Simulated Data)',
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
