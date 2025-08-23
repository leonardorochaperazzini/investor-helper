import express from 'express';
import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { PrismaClient } from '@prisma/client';
import { PrismaFinancialAssetRepository } from './adapters/repositories/PrismaFinancialAssetRepository';
import { PrismaFinancialAssetTypeRepository } from './adapters/repositories/PrismaFinancialAssetTypeRepository';
import { SyncAssetsByTypeService } from './application/services/SyncAssetsByTypeService';
import { PriceProviderRegistry } from './adapters/resolvers/PriceProviderRegistry';
import { EtfBrPriceService } from './adapters/external_services/price/EtfBrPriceService';
import { FiiBrPriceService } from './adapters/external_services/price/FiiBrPriceService';
import { EtfCriptoBrPriceService } from './adapters/external_services/price/EtfCriptoBrPriceService';
import { StockUsPriceService } from './adapters/external_services/price/StockUsPriceService';
import { ReitUsPriceService } from './adapters/external_services/price/ReitUsPriceService';
import { AssetType } from './domain/value_objects/AssetType';
import { ApiController } from './adapters/controllers/ApiController';
import { AssetController } from './adapters/controllers/AssetController';
import { SyncController } from './adapters/controllers/SyncController';
import { CurrencyController } from './adapters/controllers/CurrencyController';
import { GroupController } from './adapters/controllers/GroupController';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Prisma
const prisma = new PrismaClient();

// Swagger Options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Investment Management API',
      version: '1.0.0',
      description: 'API for managing and tracking investments',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/adapters/controllers/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize repositories
const assetRepository = new PrismaFinancialAssetRepository(prisma);
const typeRepository = new PrismaFinancialAssetTypeRepository(prisma);

// Initialize price providers
const registry = new PriceProviderRegistry();
registry.register(AssetType.EtfBr, new EtfBrPriceService());
registry.register(AssetType.RealEstateFundsBr, new FiiBrPriceService());
registry.register(AssetType.EtfCriptoBr, new EtfCriptoBrPriceService());
registry.register(AssetType.StockUs, new StockUsPriceService());
registry.register(AssetType.ReitUs, new ReitUsPriceService());

// Initialize services and controllers
const syncService = new SyncAssetsByTypeService(assetRepository, registry, typeRepository);
const syncController = new SyncController(syncService, prisma);
const assetController = new AssetController(assetRepository, prisma);
const currencyController = new CurrencyController(prisma);
const groupController = new GroupController(prisma);
const apiController = new ApiController(syncController, assetController, currencyController, groupController);

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', apiController.getRouter());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Process terminated');
  });
});
