import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting PharmaPulse Database Seeding...');

  // 1. Clean existing records
  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.aIInsight.deleteMany();
  await prisma.forecast.deleteMany();
  await prisma.spike.deleteMany();
  await prisma.demandRecord.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.pharmacy.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database entries.');

  // 2. Create Demo Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Dr. Arjun Venkatesh',
        email: 'arjun.venkatesh@pharmapulse.health',
        passwordHash,
        phone: '+91 98401 23456',
        organization: 'Integrated Disease Surveillance Programme (IDSP)',
        role: 'HEALTH_OFFICER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Priya Sundaram',
        email: 'priya.sundaram@pharmapulse.health',
        passwordHash,
        phone: '+91 98402 34567',
        organization: 'Apollo & MedPlus Pharmacy Network',
        role: 'PHARMACY_MANAGER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@pharmapulse.health',
        passwordHash,
        phone: '+91 98403 45678',
        organization: 'Tamil Nadu Medical Services Corporation (TNMSC)',
        role: 'SUPPLY_CHAIN_MANAGER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Admin System Control',
        email: 'admin@pharmapulse.health',
        passwordHash,
        phone: '+91 98400 00001',
        organization: 'PharmaPulse National Intelligence Core',
        role: 'ADMIN',
      },
    }),
  ]);

  console.log(`👤 Created ${users.length} demo users.`);

  // 3. Create Pharmacies across Indian cities
  const pharmacySeedData = [
    // Chennai
    { name: 'MedPulse Central T-Nagar', registrationNumber: 'TN-CHE-2024-001', address: '42 Usman Road, T. Nagar', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', latitude: 13.0418, longitude: 80.2341, contactNumber: '+91 44 2434 1101', status: 'ACTIVE' },
    { name: 'Apex Care Pharmacy Adyar', registrationNumber: 'TN-CHE-2024-002', address: '18 Gandhi Nagar 2nd Main, Adyar', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', latitude: 13.0012, longitude: 80.2565, contactNumber: '+91 44 2441 2202', status: 'ACTIVE' },
    { name: 'Metro Health Hub Anna Nagar', registrationNumber: 'TN-CHE-2024-003', address: '2nd Avenue, Anna Nagar West', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', latitude: 13.0850, longitude: 80.2101, contactNumber: '+91 44 2621 3303', status: 'WARNING' },
    { name: 'Velachery LifeLine Chemists', registrationNumber: 'TN-CHE-2024-004', address: '100 Feet Bypass Road, Velachery', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', latitude: 12.9815, longitude: 80.2180, contactNumber: '+91 44 2244 4404', status: 'ACTIVE' },
    { name: 'Tambaram Community Pharmacy', registrationNumber: 'TN-CHE-2024-005', address: 'GST Road, West Tambaram', city: 'Chennai', district: 'Chengalpattu', state: 'Tamil Nadu', latitude: 12.9249, longitude: 80.1000, contactNumber: '+91 44 2226 5505', status: 'ACTIVE' },
    
    // Madurai
    { name: 'Madurai Prime Druggists', registrationNumber: 'TN-MDU-2024-006', address: '88 West Veli Street', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', latitude: 9.9195, longitude: 78.1194, contactNumber: '+91 452 234 1234', status: 'SHORTAGE_ALERT' },
    { name: 'KK Nagar Health Dispensary', registrationNumber: 'TN-MDU-2024-007', address: '80 Feet Road, KK Nagar', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', latitude: 9.9320, longitude: 78.1450, contactNumber: '+91 452 258 5678', status: 'WARNING' },
    { name: 'Goripalayam Medicals', registrationNumber: 'TN-MDU-2024-008', address: 'Alagar Kovil Road, Goripalayam', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', latitude: 9.9280, longitude: 78.1310, contactNumber: '+91 452 260 9012', status: 'ACTIVE' },

    // Coimbatore
    { name: 'RS Puram Medical Trust', registrationNumber: 'TN-CBE-2024-009', address: 'DB Road, RS Puram', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', latitude: 11.0089, longitude: 76.9450, contactNumber: '+91 422 254 1122', status: 'ACTIVE' },
    { name: 'Gandhipuram Pulse Care', registrationNumber: 'TN-CBE-2024-010', address: 'Cross Cut Road, Gandhipuram', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', latitude: 11.0183, longitude: 76.9644, contactNumber: '+91 422 249 3344', status: 'ACTIVE' },
    { name: 'Peelamedu Express Pharmacy', registrationNumber: 'TN-CBE-2024-011', address: 'Avinashi Road, Peelamedu', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', latitude: 11.0280, longitude: 77.0110, contactNumber: '+91 422 257 7788', status: 'ACTIVE' },

    // Tiruchirappalli
    { name: 'Trichy Central Care Chemists', registrationNumber: 'TN-TRY-2024-012', address: 'Thillai Nagar Main Road', city: 'Tiruchirappalli', district: 'Tiruchirappalli', state: 'Tamil Nadu', latitude: 10.8250, longitude: 78.6860, contactNumber: '+91 431 276 1122', status: 'ACTIVE' },
    { name: 'Cantonment Health Point', registrationNumber: 'TN-TRY-2024-013', address: 'Collector Office Road, Cantonment', city: 'Tiruchirappalli', district: 'Tiruchirappalli', state: 'Tamil Nadu', latitude: 10.8030, longitude: 78.6890, contactNumber: '+91 431 241 4455', status: 'ACTIVE' },

    // Salem
    { name: 'Salem Fairlands Dispensary', registrationNumber: 'TN-SLM-2024-014', address: 'Brindavan Road, Fairlands', city: 'Salem', district: 'Salem', state: 'Tamil Nadu', latitude: 11.6780, longitude: 78.1460, contactNumber: '+91 427 244 5566', status: 'ACTIVE' },
    { name: 'Suramangalam Health Pharma', registrationNumber: 'TN-SLM-2024-015', address: 'Junction Main Road, Suramangalam', city: 'Salem', district: 'Salem', state: 'Tamil Nadu', latitude: 11.6850, longitude: 78.1180, contactNumber: '+91 427 238 9900', status: 'ACTIVE' },

    // Bengaluru
    { name: 'Indiranagar Care Diagnostics', registrationNumber: 'KA-BLR-2024-016', address: '100 Feet Road, Indiranagar', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', latitude: 12.9784, longitude: 77.6408, contactNumber: '+91 80 2521 8899', status: 'ACTIVE' },
    { name: 'Koramangala Pulse Dispensary', registrationNumber: 'KA-BLR-2024-017', address: '80 Feet Road, 4th Block, Koramangala', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', latitude: 12.9352, longitude: 77.6245, contactNumber: '+91 80 2553 4455', status: 'WARNING' },
    { name: 'Whitefield MedPlus Hub', registrationNumber: 'KA-BLR-2024-018', address: 'ITPL Main Road, Whitefield', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', latitude: 12.9698, longitude: 77.7500, contactNumber: '+91 80 2845 6677', status: 'ACTIVE' },

    // Hyderabad
    { name: 'Banjara Hills Wellness Pharmacy', registrationNumber: 'TS-HYD-2024-019', address: 'Road No. 12, Banjara Hills', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', latitude: 17.4156, longitude: 78.4357, contactNumber: '+91 40 2339 1122', status: 'ACTIVE' },
    { name: 'Madhapur Cyber Chemists', registrationNumber: 'TS-HYD-2024-020', address: 'Hitech City Main Road, Madhapur', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', latitude: 17.4483, longitude: 78.3915, contactNumber: '+91 40 2311 3344', status: 'ACTIVE' },

    // Mumbai
    { name: 'Bandra West Lifeline', registrationNumber: 'MH-MUM-2024-021', address: 'Hill Road, Bandra West', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', latitude: 19.0596, longitude: 72.8295, contactNumber: '+91 22 2640 5566', status: 'ACTIVE' },
    { name: 'Andheri Metro Drug Center', registrationNumber: 'MH-MUM-2024-022', address: 'SV Road, Andheri West', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', latitude: 19.1197, longitude: 72.8464, contactNumber: '+91 22 2628 7788', status: 'WARNING' },

    // Delhi
    { name: 'Connaught Place Premier Chemist', registrationNumber: 'DL-DEL-2024-023', address: 'Inner Circle, Connaught Place', city: 'Delhi', district: 'New Delhi', state: 'Delhi', latitude: 28.6315, longitude: 77.2167, contactNumber: '+91 11 2332 9900', status: 'ACTIVE' },
    { name: 'South Extension Care Pharmacy', registrationNumber: 'DL-DEL-2024-024', address: 'South Extension Part 2', city: 'Delhi', district: 'South Delhi', state: 'Delhi', latitude: 28.5684, longitude: 77.2215, contactNumber: '+91 11 2625 1133', status: 'ACTIVE' },

    // Kolkata
    { name: 'Park Street Essential Medicines', registrationNumber: 'WB-KOL-2024-025', address: 'Park Street Crossing', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', latitude: 22.5535, longitude: 88.3512, contactNumber: '+91 33 2229 4455', status: 'ACTIVE' },
    { name: 'Salt Lake Sector V Medicals', registrationNumber: 'WB-KOL-2024-026', address: 'Salt Lake Electronics Complex', city: 'Kolkata', district: 'North 24 Parganas', state: 'West Bengal', latitude: 22.5804, longitude: 88.4378, contactNumber: '+91 33 2357 8899', status: 'ACTIVE' },
  ];

  const pharmacies = await Promise.all(
    pharmacySeedData.map(p => prisma.pharmacy.create({ data: p }))
  );
  console.log(`🏥 Created ${pharmacies.length} pharmacies across India.`);

  // 4. Create Medicines
  const medicineSeedData = [
    { name: 'Paracetamol 650mg', genericName: 'Acetaminophen', category: 'Antipyretic', manufacturer: 'Micro Labs (Dolo)', unit: 'Tablets' },
    { name: 'ORS Electrolyte Sachets', genericName: 'Oral Rehydration Salts', category: 'Rehydration', manufacturer: 'FDC Limited (Electral)', unit: 'Sachets' },
    { name: 'Cetirizine 10mg', genericName: 'Cetirizine Dihydrochloride', category: 'Antihistamine', manufacturer: 'Dr. Reddy\'s', unit: 'Tablets' },
    { name: 'Amoxicillin 500mg', genericName: 'Amoxicillin Trihydrate', category: 'Antibiotic', manufacturer: 'Cipla Ltd', unit: 'Capsules' },
    { name: 'Azithromycin 500mg', genericName: 'Azithromycin', category: 'Antibiotic', manufacturer: 'Alembic (Azithral)', unit: 'Tablets' },
    { name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'Analgesic', manufacturer: 'Abbott Healthcare', unit: 'Tablets' },
    { name: 'Pantoprazole 40mg', genericName: 'Pantoprazole Sodium', category: 'Gastrointestinal', manufacturer: 'Sun Pharma (Pan 40)', unit: 'Tablets' },
    { name: 'Metformin 500mg', genericName: 'Metformin Hydrochloride', category: 'Antidiabetic', manufacturer: 'USV (Glycomet)', unit: 'Tablets' },
    { name: 'Insulin Glargine 100IU/ml', genericName: 'Insulin Glargine', category: 'Antidiabetic', manufacturer: 'Sanofi (Lantus)', unit: 'Vials' },
    { name: 'Cough Syrup (Dextromethorphan)', genericName: 'Dextromethorphan HBr', category: 'Respiratory', manufacturer: 'Pfizer (Corex-DX)', unit: 'Bottles' },
    { name: 'Oseltamivir 75mg', genericName: 'Oseltamivir Phosphate', category: 'Antiviral', manufacturer: 'Hetero (FluVir)', unit: 'Capsules' },
    { name: 'Doxycycline 100mg', genericName: 'Doxycycline Hyclate', category: 'Antibiotic', manufacturer: 'Torrent Pharma', unit: 'Capsules' },
    { name: 'Montelukast 10mg + Levocetirizine', genericName: 'Montelukast + Levocetirizine', category: 'Respiratory', manufacturer: 'Mankind (Montair-LC)', unit: 'Tablets' },
    { name: 'Salbutamol Inhaler 100mcg', genericName: 'Salbutamol Sulfate', category: 'Respiratory', manufacturer: 'Cipla (Asthalin)', unit: 'Inhalers' },
    { name: 'Zinc Sulfate 20mg Dispersible', genericName: 'Zinc Sulfate', category: 'Rehydration', manufacturer: 'Zydus Cadila', unit: 'Tablets' },
    { name: 'Domperidone 10mg', genericName: 'Domperidone', category: 'Gastrointestinal', manufacturer: 'Torrent Pharma', unit: 'Tablets' },
    { name: 'Ciprofloxacin 500mg', genericName: 'Ciprofloxacin Hydrochloride', category: 'Antibiotic', manufacturer: 'Ranbaxy / Sun Pharma', unit: 'Tablets' },
    { name: 'Telmisartan 40mg', genericName: 'Telmisartan', category: 'Cardiovascular', manufacturer: 'Glenmark (Telma 40)', unit: 'Tablets' },
  ];

  const medicines = await Promise.all(
    medicineSeedData.map(m => prisma.medicine.create({ data: m }))
  );
  console.log(`💊 Created ${medicines.length} medicines catalog.`);

  // 5. Generate Inventory Records
  console.log('📦 Generating inventory records...');
  for (const p of pharmacies) {
    for (const m of medicines) {
      let baseStock = 250;
      let reorder = 60;
      let status = 'OPTIMAL';

      // Specific simulated shortages in key cities
      if (p.city === 'Madurai' && (m.name.includes('ORS') || m.name.includes('Zinc'))) {
        baseStock = 18;
        reorder = 80;
        status = 'CRITICAL';
      } else if (p.city === 'Chennai' && (m.name.includes('Paracetamol') || m.name.includes('Azithromycin'))) {
        baseStock = 45;
        reorder = 100;
        status = 'LOW_STOCK';
      } else if (p.city === 'Bengaluru' && m.name.includes('Oseltamivir')) {
        baseStock = 12;
        reorder = 40;
        status = 'LOW_STOCK';
      }

      await prisma.inventory.create({
        data: {
          pharmacyId: p.id,
          medicineId: m.id,
          currentStock: baseStock,
          reorderLevel: reorder,
          dailyAverageDemand: 25.0 + Math.floor(Math.random() * 30),
          status,
        },
      });
    }
  }

  // 6. Generate 60 days of Demand Records (~1500+ records)
  console.log('📊 Generating 60-day historical time-series demand records...');
  const demandRecordsToInsert = [];
  const today = new Date();

  // Pick primary medicines for dense time series
  const trackedMeds = medicines.slice(0, 10);
  const trackedPharmacies = pharmacies.slice(0, 8); // Top 8 pharmacies

  for (let dayOffset = 59; dayOffset >= 0; dayOffset--) {
    const recordDate = new Date(today);
    recordDate.setDate(today.getDate() - dayOffset);
    const dayOfWeek = recordDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    for (const pharm of trackedPharmacies) {
      for (const med of trackedMeds) {
        let baseline = 35.0;
        if (med.name.includes('Paracetamol')) baseline = 75.0;
        if (med.name.includes('ORS')) baseline = 50.0;
        if (med.name.includes('Cetirizine')) baseline = 40.0;
        if (med.name.includes('Amoxicillin')) baseline = 30.0;

        // Add standard random noise (-15% to +15%)
        let noise = (Math.random() * 0.3 - 0.15) * baseline;
        let quantity = baseline + noise;

        // Weekend slight bump
        if (isWeekend) quantity *= 1.12;

        // Inject intentional realistic outbreak spike signals in recent 7 days
        let isSpikeDay = false;
        let anomalyScore = 0.05;

        // Chennai viral fever surge (Paracetamol + Azithromycin + Cough Syrup)
        if (pharm.city === 'Chennai' && dayOffset <= 6) {
          if (med.name.includes('Paracetamol') || med.name.includes('Azithromycin') || med.name.includes('Cough Syrup')) {
            const surgeMultiplier = 1.6 + (6 - dayOffset) * 0.15; // +60% to +150% surge
            quantity *= surgeMultiplier;
            anomalyScore = 0.88;
            isSpikeDay = true;
          }
        }

        // Madurai acute gastroenteritis surge (ORS + Zinc + Domperidone)
        if (pharm.city === 'Madurai' && dayOffset <= 5) {
          if (med.name.includes('ORS') || med.name.includes('Zinc') || med.name.includes('Domperidone')) {
            const surgeMultiplier = 1.8 + (5 - dayOffset) * 0.18; // +80% to +170% surge
            quantity *= surgeMultiplier;
            anomalyScore = 0.94;
            isSpikeDay = true;
          }
        }

        const quantitySold = Math.round(quantity);
        const quantityRequested = Math.round(quantitySold * (isSpikeDay ? 1.2 : 1.02));

        demandRecordsToInsert.push({
          pharmacyId: pharm.id,
          medicineId: med.id,
          date: recordDate,
          quantitySold,
          quantityRequested,
          historicalAverage: Math.round(baseline * 10) / 10,
          expectedDemand: Math.round(baseline * 1.05 * 10) / 10,
          anomalyScore: Math.round(anomalyScore * 100) / 100,
        });
      }
    }
  }

  // Batch insert demand records
  for (let i = 0; i < demandRecordsToInsert.length; i += 200) {
    const batch = demandRecordsToInsert.slice(i, i + 200);
    await prisma.demandRecord.createMany({ data: batch });
  }
  console.log(`📈 Inserted ${demandRecordsToInsert.length} demand records.`);

  // 7. Create Active Spikes
  console.log('⚡ Generating active spikes...');
  const paracetamol = medicines.find(m => m.name.includes('Paracetamol'))!;
  const ors = medicines.find(m => m.name.includes('ORS'))!;
  const azithro = medicines.find(m => m.name.includes('Azithromycin'))!;
  const cough = medicines.find(m => m.name.includes('Cough'))!;
  const oseltamivir = medicines.find(m => m.name.includes('Oseltamivir'))!;

  const chennaiPharm1 = pharmacies.find(p => p.name.includes('T-Nagar'))!;
  const chennaiPharm2 = pharmacies.find(p => p.name.includes('Anna Nagar'))!;
  const maduraiPharm1 = pharmacies.find(p => p.name.includes('Prime Druggists'))!;
  const blrPharm1 = pharmacies.find(p => p.name.includes('Koramangala'))!;
  const coimbatorePharm1 = pharmacies.find(p => p.name.includes('RS Puram'))!;

  const spikes = await Promise.all([
    prisma.spike.create({
      data: {
        pharmacyId: chennaiPharm1.id,
        medicineId: paracetamol.id,
        demandIncreasePercentage: 142.5,
        anomalyScore: 0.945,
        severity: 'CRITICAL',
        status: 'ACTIVE',
        explanation: 'Elevated demand activity detected: Paracetamol 650mg sales reached 182 units (+142.5% above 30-day baseline of 75.0). Statistical Z-score is 3.12 with an AI anomaly confidence of 94.5%. Unusual demand pattern requires verification with local health monitoring.',
      },
    }),
    prisma.spike.create({
      data: {
        pharmacyId: maduraiPharm1.id,
        medicineId: ors.id,
        demandIncreasePercentage: 168.0,
        anomalyScore: 0.962,
        severity: 'CRITICAL',
        status: 'ACTIVE',
        explanation: 'Unusual demand pattern: ORS Electrolyte Sachets registered 134 units dispensed (+168.0% above 30-day baseline of 50.0). High Z-score of 3.48 indicates a significant analytical signal across Madurai urban clusters.',
      },
    }),
    prisma.spike.create({
      data: {
        pharmacyId: chennaiPharm2.id,
        medicineId: azithro.id,
        demandIncreasePercentage: 88.4,
        anomalyScore: 0.785,
        severity: 'HIGH',
        status: 'INVESTIGATING',
        explanation: 'Potential signal detected: Azithromycin 500mg demand increased by +88.4% (56 units vs historical average of 29.7). Z-score: 2.15. Elevated consumption pattern identified for supply chain review.',
      },
    }),
    prisma.spike.create({
      data: {
        pharmacyId: chennaiPharm1.id,
        medicineId: cough.id,
        demandIncreasePercentage: 74.2,
        anomalyScore: 0.720,
        severity: 'HIGH',
        status: 'ACTIVE',
        explanation: 'Elevated demand activity detected: Cough Syrup demand up +74.2% across Central Chennai dispensing nodes. Strong co-surge correlation observed with antipyretic formulations.',
      },
    }),
    prisma.spike.create({
      data: {
        pharmacyId: blrPharm1.id,
        medicineId: oseltamivir.id,
        demandIncreasePercentage: 54.0,
        anomalyScore: 0.580,
        severity: 'WARNING',
        status: 'ACTIVE',
        explanation: 'Mild demand surge observed: Oseltamivir 75mg registered 22 units (+54.0% above baseline). Inventory buffer depletion rate accelerated.',
      },
    }),
    prisma.spike.create({
      data: {
        pharmacyId: coimbatorePharm1.id,
        medicineId: paracetamol.id,
        demandIncreasePercentage: 42.0,
        anomalyScore: 0.460,
        severity: 'WARNING',
        status: 'ACKNOWLEDGED',
        explanation: 'Demand variation slightly exceeding typical bounds (+42.0% above baseline). Stock levels remain adequate for 12 days.',
      },
    }),
  ]);
  console.log(`🚨 Created ${spikes.length} active spike records.`);

  // 8. Create Critical Alerts
  console.log('🔔 Generating smart alerts...');
  const alerts = await Promise.all([
    prisma.alert.create({
      data: {
        pharmacyId: chennaiPharm1.id,
        medicineId: paracetamol.id,
        type: 'SPIKE_DETECTED',
        title: '⚡ Critical Surge: Paracetamol 650mg in Chennai T-Nagar',
        message: 'Sudden +142.5% demand increase detected. Statistical Z-score is 3.12 (Confidence 94.5%). Potential syndromic viral fever cluster signal.',
        severity: 'CRITICAL',
        status: 'UNRESOLVED',
      },
    }),
    prisma.alert.create({
      data: {
        pharmacyId: maduraiPharm1.id,
        medicineId: ors.id,
        type: 'SHORTAGE_PREDICTED',
        title: '⚠️ Stockout Risk: ORS Electrolyte in Madurai Central',
        message: 'Current inventory (18 sachets) will deplete in less than 24 hours under prevailing +168% demand surge. Safety stock deficit: 62 units.',
        severity: 'CRITICAL',
        status: 'UNRESOLVED',
      },
    }),
    prisma.alert.create({
      data: {
        pharmacyId: chennaiPharm2.id,
        medicineId: azithro.id,
        type: 'SYNDROMIC_CLUSTER',
        title: '🧬 Syndromic Co-Surge: Azithromycin + Paracetamol',
        message: 'Synchronized spike detected across 4 pharmacies in Central Chennai district. Cross-correlation index r = 0.84.',
        severity: 'HIGH',
        status: 'UNRESOLVED',
      },
    }),
    prisma.alert.create({
      data: {
        pharmacyId: blrPharm1.id,
        medicineId: oseltamivir.id,
        type: 'INVENTORY_CRITICAL',
        title: '📦 Low Stock Alert: Oseltamivir 75mg in Bengaluru',
        message: 'Inventory has fallen below the minimum reorder threshold (12 units remaining vs 40 reorder level).',
        severity: 'WARNING',
        status: 'UNRESOLVED',
      },
    }),
  ]);

  // 9. Create AI Insights
  console.log('🧠 Generating AI Insights...');
  await Promise.all([
    prisma.aIInsight.create({
      data: {
        title: 'Syndromic Cluster Signal: Acute Enteric Pattern in Madurai',
        description: 'Synchronized surge observed between ORS Electrolyte (+168%) and Zinc Sulfate (+94%) in Madurai district. Statistical correlation r = 0.86. Analytical demand pattern matches seasonal acute gastroenteritis clusters.',
        medicineId: ors.id,
        pharmacyId: maduraiPharm1.id,
        confidence: 0.962,
        insightType: 'SYNDROMIC_CORRELATION',
      },
    }),
    prisma.aIInsight.create({
      data: {
        title: 'Monsoon Antipyretic Surge Profile in Chennai Hub',
        description: 'Demand for Paracetamol 650mg is trending 2.4x above the 60-day baseline across 5 reporting pharmacies in Chennai. Peak velocity is concentrated in T. Nagar and Anna Nagar zones.',
        medicineId: paracetamol.id,
        pharmacyId: chennaiPharm1.id,
        confidence: 0.945,
        insightType: 'ANOMALY_EXPLANATION',
      },
    }),
    prisma.aIInsight.create({
      data: {
        title: 'Proactive Stock Redistribution Opportunity',
        description: 'Madurai Prime Druggists is projected to stock out of ORS in 18 hours. Coimbatore RS Puram holds 340 surplus sachets. An inter-city transfer of 100 units is recommended to mitigate local deficit.',
        medicineId: ors.id,
        pharmacyId: maduraiPharm1.id,
        confidence: 0.910,
        insightType: 'SHORTAGE_RISK',
      },
    }),
    prisma.aIInsight.create({
      data: {
        title: 'Respiratory Anti-infective Co-dispensing Trend',
        description: 'Amoxicillin and Azithromycin dispense rates are co-elevated by +76% in industrial zones of Coimbatore and Salem. Supply chain buffer multiplier should be raised from 1.0x to 1.35x.',
        medicineId: azithro.id,
        pharmacyId: chennaiPharm2.id,
        confidence: 0.880,
        insightType: 'GEOGRAPHIC_CLUSTER',
      },
    }),
  ]);

  console.log('✅ Database Seeding Completed Successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
