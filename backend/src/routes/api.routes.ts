import { Router } from 'express';
import { register, login, demoLogin, getProfile } from '../controllers/auth.controller';
import { getDashboardOverview } from '../controllers/dashboard.controller';
import { getSpikes, getSpikeById, updateSpikeStatus, runSpikeAnalysis } from '../controllers/spikes.controller';
import { getDemandRecords, getDemandComparison } from '../controllers/demand.controller';
import { getForecasts } from '../controllers/forecasting.controller';
import { getGeographicData } from '../controllers/geographic.controller';
import { getInventory, updateStock, getTransferRecommendations } from '../controllers/inventory.controller';
import { getAIInsights, getCorrelations, queryAICopilot } from '../controllers/insights.controller';
import { getPharmacies, getPharmacyById } from '../controllers/pharmacies.controller';
import { getMedicines } from '../controllers/medicines.controller';
import { getReports, generateReport } from '../controllers/reports.controller';
import { ingestCSVData, simulateSurgeEvent } from '../controllers/ingestion.controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/demo-login', demoLogin);
router.get('/auth/me', authenticateJWT, getProfile);

// Dashboard routes
router.get('/dashboard/overview', getDashboardOverview);

// Spikes & Anomaly routes
router.get('/spikes', getSpikes);
router.get('/spikes/analyze', runSpikeAnalysis);
router.get('/spikes/:id', getSpikeById);
router.patch('/spikes/:id/status', updateSpikeStatus);

// Demand Analytics routes
router.get('/demand', getDemandRecords);
router.get('/demand/compare', getDemandComparison);

// Forecasting routes
router.get('/forecasting', getForecasts);

// Geographic Intelligence routes
router.get('/geographic', getGeographicData);

// Inventory routes
router.get('/inventory', getInventory);
router.patch('/inventory/:id', updateStock);
router.get('/inventory/transfers', getTransferRecommendations);

// AI Insights & Copilot routes
router.get('/insights', getAIInsights);
router.get('/insights/correlations', getCorrelations);
router.post('/insights/copilot', queryAICopilot);

// Pharmacies & Medicines
router.get('/pharmacies', getPharmacies);
router.get('/pharmacies/:id', getPharmacyById);
router.get('/medicines', getMedicines);

// Reports
router.get('/reports', authenticateJWT, getReports);
router.post('/reports/generate', authenticateJWT, generateReport);

// Ingestion & Simulator
router.post('/ingest/csv', ingestCSVData);
router.post('/ingest/simulate-surge', simulateSurgeEvent);

export default router;
