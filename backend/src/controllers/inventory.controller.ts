import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pharmacyId, status, category, search } = req.query;

    const where: any = {};
    if (pharmacyId && pharmacyId !== 'ALL') where.pharmacyId = pharmacyId as string;
    if (status && status !== 'ALL') where.status = status as string;
    if (category && category !== 'ALL') where.medicine = { category: category as string };

    let items = await prisma.inventory.findMany({
      where,
      include: {
        medicine: true,
        pharmacy: true,
      },
      orderBy: { currentStock: 'asc' },
    });

    if (search) {
      const term = (search as string).toLowerCase();
      items = items.filter(
        i =>
          i.medicine.name.toLowerCase().includes(term) ||
          i.pharmacy.name.toLowerCase().includes(term) ||
          i.pharmacy.city.toLowerCase().includes(term)
      );
    }

    // Calculate days of supply
    const enriched = items.map(item => {
      const daily = item.dailyAverageDemand > 0 ? item.dailyAverageDemand : 1;
      const daysOfSupply = Math.round((item.currentStock / daily) * 10) / 10;
      return {
        ...item,
        daysOfSupply,
      };
    });

    res.json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { currentStock, reorderLevel } = req.body;

    const existing = await prisma.inventory.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Inventory record not found' });
      return;
    }

    const newStock = currentStock !== undefined ? Number(currentStock) : existing.currentStock;
    const newReorder = reorderLevel !== undefined ? Number(reorderLevel) : existing.reorderLevel;

    let status = 'OPTIMAL';
    if (newStock <= 0) status = 'CRITICAL';
    else if (newStock <= newReorder) status = 'LOW_STOCK';
    else if (newStock > newReorder * 4) status = 'OVERSTOCKED';

    const updated = await prisma.inventory.update({
      where: { id },
      data: {
        currentStock: newStock,
        reorderLevel: newReorder,
        status,
        lastUpdated: new Date(),
      },
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

export const getTransferRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find critical / low stock items
    const shortages = await prisma.inventory.findMany({
      where: { status: { in: ['LOW_STOCK', 'CRITICAL'] } },
      include: { medicine: true, pharmacy: true },
    });

    // Find overstocked items for matching medicines
    const transfers = [];

    for (const shortage of shortages) {
      const donor = await prisma.inventory.findFirst({
        where: {
          medicineId: shortage.medicineId,
          pharmacyId: { not: shortage.pharmacyId },
          currentStock: { gt: shortage.reorderLevel * 2 },
        },
        include: { pharmacy: true },
      });

      if (donor) {
        const transferQty = Math.min(
          Math.floor((donor.currentStock - donor.reorderLevel) / 2),
          Math.max(shortage.reorderLevel * 2 - shortage.currentStock, 50)
        );

        if (transferQty > 0) {
          transfers.push({
            id: `TRF-${shortage.id.slice(0, 6)}`,
            medicineId: shortage.medicineId,
            medicineName: shortage.medicine.name,
            fromPharmacy: donor.pharmacy.name,
            fromCity: donor.pharmacy.city,
            toPharmacy: shortage.pharmacy.name,
            toCity: shortage.pharmacy.city,
            donorStockBefore: donor.currentStock,
            recipientStockBefore: shortage.currentStock,
            recommendedQuantity: transferQty,
            estimatedDistanceKm: donor.pharmacy.city === shortage.pharmacy.city ? 8.5 : 120.0,
            priority: shortage.currentStock <= 0 ? 'CRITICAL' : 'HIGH',
            status: 'RECOMMENDED',
          });
        }
      }
    }

    res.json({
      success: true,
      count: transfers.length,
      recommendations: transfers,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
