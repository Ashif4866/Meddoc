import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getMedicines = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;

    const where: any = {};
    if (category && category !== 'ALL') {
      where.category = category as string;
    }

    let medicines = await prisma.medicine.findMany({
      where,
      include: {
        _count: {
          select: {
            inventories: true,
            spikes: true,
            demandRecords: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    if (search) {
      const term = (search as string).toLowerCase();
      medicines = medicines.filter(
        m =>
          m.name.toLowerCase().includes(term) ||
          m.genericName.toLowerCase().includes(term) ||
          m.category.toLowerCase().includes(term) ||
          m.manufacturer.toLowerCase().includes(term)
      );
    }

    res.json({
      success: true,
      count: medicines.length,
      data: medicines,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
