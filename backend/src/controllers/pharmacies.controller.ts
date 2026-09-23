import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getPharmacies = async (req: Request, res: Response): Promise<void> => {
  try {
    const { city, state, status, search } = req.query;

    const where: any = {};
    if (city && city !== 'ALL') where.city = city as string;
    if (state && state !== 'ALL') where.state = state as string;
    if (status && status !== 'ALL') where.status = status as string;

    let pharmacies = await prisma.pharmacy.findMany({
      where,
      include: {
        _count: {
          select: {
            inventories: true,
            spikes: true,
            alerts: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    if (search) {
      const term = (search as string).toLowerCase();
      pharmacies = pharmacies.filter(
        p =>
          p.name.toLowerCase().includes(term) ||
          p.city.toLowerCase().includes(term) ||
          p.district.toLowerCase().includes(term) ||
          p.registrationNumber.toLowerCase().includes(term)
      );
    }

    res.json({
      success: true,
      count: pharmacies.length,
      data: pharmacies,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPharmacyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pharmacy = await prisma.pharmacy.findUnique({
      where: { id },
      include: {
        inventories: {
          include: { medicine: true },
        },
        spikes: {
          where: { status: { in: ['ACTIVE', 'INVESTIGATING'] } },
          include: { medicine: true },
        },
        alerts: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { medicine: true },
        },
      },
    });

    if (!pharmacy) {
      res.status(404).json({ error: 'Pharmacy not found' });
      return;
    }

    res.json({ success: true, data: pharmacy });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
