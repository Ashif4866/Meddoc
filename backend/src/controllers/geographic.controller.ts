import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getGeographicData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { medicineId, severity } = req.query;

    const pharmacies = await prisma.pharmacy.findMany({
      include: {
        spikes: {
          where: { status: { in: ['ACTIVE', 'INVESTIGATING'] } },
          include: { medicine: true },
        },
        inventories: {
          include: { medicine: true },
        },
      },
    });

    // Aggregate by city
    const cityMap: { [city: string]: any } = {};

    pharmacies.forEach(p => {
      if (!cityMap[p.city]) {
        cityMap[p.city] = {
          city: p.city,
          state: p.state,
          latitude: p.latitude,
          longitude: p.longitude,
          pharmacyCount: 0,
          activeSpikes: 0,
          criticalSpikes: 0,
          shortages: 0,
          spikes: [],
          status: 'NORMAL',
        };
      }

      cityMap[p.city].pharmacyCount += 1;
      cityMap[p.city].activeSpikes += p.spikes.length;
      cityMap[p.city].criticalSpikes += p.spikes.filter(s => s.severity === 'CRITICAL').length;
      cityMap[p.city].spikes.push(...p.spikes);

      const lowStock = p.inventories.filter(i => i.status === 'LOW_STOCK' || i.status === 'CRITICAL').length;
      cityMap[p.city].shortages += lowStock;

      if (cityMap[p.city].criticalSpikes > 0) {
        cityMap[p.city].status = 'CRITICAL';
      } else if (cityMap[p.city].activeSpikes > 0) {
        cityMap[p.city].status = 'HIGH';
      } else if (cityMap[p.city].shortages > 0) {
        cityMap[p.city].status = 'WARNING';
      }
    });

    const citySummary = Object.values(cityMap).sort((a, b) => b.activeSpikes - a.activeSpikes);

    // Format pharmacy pins for interactive map
    const mapPins = pharmacies.map(p => {
      const activeSpikes = p.spikes.length;
      const hasCritical = p.spikes.some(s => s.severity === 'CRITICAL');
      const hasHigh = p.spikes.some(s => s.severity === 'HIGH');
      const lowStockCount = p.inventories.filter(i => i.currentStock <= i.reorderLevel).length;

      let mapStatus = 'NORMAL';
      if (hasCritical) mapStatus = 'CRITICAL';
      else if (hasHigh) mapStatus = 'HIGH';
      else if (activeSpikes > 0 || lowStockCount > 0) mapStatus = 'WARNING';

      return {
        id: p.id,
        name: p.name,
        registrationNumber: p.registrationNumber,
        address: p.address,
        city: p.city,
        district: p.district,
        state: p.state,
        latitude: p.latitude,
        longitude: p.longitude,
        status: mapStatus,
        activeSpikesCount: activeSpikes,
        criticalSpikesCount: p.spikes.filter(s => s.severity === 'CRITICAL').length,
        shortageCount: lowStockCount,
        contactNumber: p.contactNumber,
        spikes: p.spikes.map(s => ({
          id: s.id,
          medicine: s.medicine.name,
          increasePct: s.demandIncreasePercentage,
          severity: s.severity,
          explanation: s.explanation,
        })),
      };
    });

    res.json({
      success: true,
      totalPharmacies: pharmacies.length,
      citySummary,
      mapPins,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
