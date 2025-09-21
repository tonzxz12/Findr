import { db, clients, projects } from '../lib/db/index.js';

// Sample clients data
const sampleClients = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    companyName: 'ABC Construction Corp',
    keywords: ['construction', 'infrastructure', 'building'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    companyName: 'TechSolutions Inc',
    keywords: ['technology', 'software', 'IT'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    companyName: 'MedSupply Philippines',
    keywords: ['medical', 'healthcare', 'supplies'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    companyName: 'EduMaterials Co',
    keywords: ['education', 'learning', 'materials'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    companyName: 'AgriTech Solutions',
    keywords: ['agriculture', 'farming', 'technology'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Philippine Government Agencies
const procuringEntities = [
  'Department of Education (DepEd)',
  'Department of Health (DOH)',
  'Department of Public Works and Highways (DPWH)',
  'Department of Transportation (DOTr)',
  'Department of Interior and Local Government (DILG)',
  'Department of Social Welfare and Development (DSWD)',
  'Department of Agriculture (DA)',
  'Department of Environment and Natural Resources (DENR)',
  'Department of Trade and Industry (DTI)',
  'Department of Labor and Employment (DOLE)',
  'Department of National Defense (DND)',
  'Department of Justice (DOJ)',
  'Department of Finance (DOF)',
  'Department of Budget and Management (DBM)',
  'Philippine National Police (PNP)',
  'Bureau of Fire Protection (BFP)',
  'Bureau of Jail Management and Penology (BJMP)',
  'Local Government Unit - Manila',
  'Local Government Unit - Quezon City',
  'Local Government Unit - Cebu City',
  'Local Government Unit - Davao City',
  'Local Government Unit - Makati City',
  'Local Government Unit - Pasig City',
  'Local Government Unit - Taguig City',
  'Local Government Unit - Bacolod City',
  'Local Government Unit - Iloilo City',
  'Local Government Unit - Cagayan de Oro City',
  'Local Government Unit - Zamboanga City',
  'Local Government Unit - Baguio City',
  'Local Government Unit - Angeles City'
];

// Project Categories
const categories = ['Goods', 'Services', 'Infrastructure', 'Consulting', 'IT'];

// Procurement Modes
const procurementModes = [
  'Competitive Bidding',
  'Limited Source Bidding',
  'Direct Contracting',
  'Repeat Order',
  'Shopping',
  'Small Value Procurement'
];

// Generate random date within last 2 years
function getRandomDate(startDate: Date, endDate: Date): Date {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return new Date(start + Math.random() * (end - start));
}

// Generate random ABC values (50K to 500M PHP)
function getRandomABC(): number {
  return Math.floor(Math.random() * 499950000) + 50000;
}

// Generate random closing date (30-180 days from creation)
function getRandomClosingDate(createdDate: Date): Date {
  const daysToAdd = Math.floor(Math.random() * 150) + 30;
  const closingDate = new Date(createdDate);
  closingDate.setDate(closingDate.getDate() + daysToAdd);
  return closingDate;
}

// Generate project title
function generateTitle(): string {
  const prefixes = ['Procurement of', 'Supply and Delivery of', 'Construction of', 'Maintenance of', 'IT Solutions for'];
  const items = ['Office Equipment', 'Medical Supplies', 'Construction Materials', 'IT Hardware', 'Vehicles', 'Laboratory Equipment', 'Educational Materials', 'Security Systems', 'Communication Equipment', 'Furniture'];
  const suffixes = ['for Government Operations', 'for Public Service', 'for Infrastructure Development', 'for Capacity Building', 'for Emergency Response'];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const item = items[Math.floor(Math.random() * items.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  return `${prefix} ${item} ${suffix}`;
}

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Insert sample clients
    console.log('Inserting clients...');
    await db.insert(clients).values(sampleClients).onConflictDoNothing();
    console.log('Clients inserted successfully');

    // Get client IDs
    const clientRecords = await db.select({ id: clients.id }).from(clients);
    const clientIds = clientRecords.map(c => c.id);

    if (clientIds.length === 0) {
      throw new Error('No clients found');
    }

    console.log(`Found ${clientIds.length} clients`);

    // Generate 300 projects
    const projectsToInsert = [];
    const startDate = new Date('2023-01-01');
    const endDate = new Date();

    for (let i = 0; i < 300; i++) {
      const clientId = clientIds[Math.floor(Math.random() * clientIds.length)];
      const createdAt = getRandomDate(startDate, endDate);
      const parsedClosingAt = getRandomClosingDate(createdAt);

      const project = {
        id: crypto.randomUUID(),
        clientId,
        title: generateTitle(),
        procuringEntity: procuringEntities[Math.floor(Math.random() * procuringEntities.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        procurementMode: procurementModes[Math.floor(Math.random() * procurementModes.length)],
        abc: getRandomABC().toString(),
        parsedClosingAt: parsedClosingAt.toISOString(),
        createdAt: createdAt.toISOString(),
        updatedAt: new Date().toISOString(),
        referenceNumber: `REF-${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`,
        solicitationNumber: `SOL-${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`,
        areaOfDelivery: ['Luzon', 'Visayas', 'Mindanao', 'NCR'][Math.floor(Math.random() * 4)],
      };

      projectsToInsert.push(project);
    }

    console.log(`Generated ${projectsToInsert.length} projects`);

    // Insert projects in batches
    const batchSize = 50;
    for (let i = 0; i < projectsToInsert.length; i += batchSize) {
      const batch = projectsToInsert.slice(i, i + batchSize);
      await db.insert(projects).values(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(projectsToInsert.length / batchSize)}`);
    }

    console.log('Database seeding completed successfully!');

    // Show summary
    const totalProjects = await db.select().from(projects);
    const totalClients = await db.select().from(clients);

    console.log(`\nSummary:`);
    console.log(`- Total clients: ${totalClients.length}`);
    console.log(`- Total projects: ${totalProjects.length}`);

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase().catch(console.error);