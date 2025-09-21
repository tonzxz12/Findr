import { db, projects, clients } from '../lib/db/index.js';
import { sql } from 'drizzle-orm';

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
const categories = [
  'Goods',
  'Services',
  'Infrastructure',
  'Consulting',
  'IT',
  'Construction',
  'Maintenance',
  'Training',
  'Research',
  'Equipment'
];

// Procurement Modes
const procurementModes = [
  'Competitive Bidding',
  'Limited Source Bidding',
  'Direct Contracting',
  'Repeat Order',
  'Shopping',
  'Small Value Procurement',
  'Negotiated Procurement',
  'Emergency Cases'
];

// Project Title Templates
const titleTemplates = [
  'Procurement of {item} for {purpose}',
  'Supply and Delivery of {item}',
  'Construction of {item}',
  'Maintenance Services for {item}',
  'IT Solutions for {item}',
  'Consultancy Services for {item}',
  'Training Program on {item}',
  'Research and Development of {item}',
  'Equipment Procurement for {item}',
  'Facility Improvement for {item}'
];

const items = [
  'Office Supplies and Equipment',
  'Medical Equipment and Supplies',
  'Construction Materials',
  'IT Hardware and Software',
  'Vehicles and Transportation Equipment',
  'Laboratory Equipment',
  'Educational Materials',
  'Security Systems',
  'Communication Equipment',
  'Furniture and Fixtures',
  'Cleaning and Maintenance Supplies',
  'Agricultural Equipment',
  'Environmental Monitoring Tools',
  'Training Materials and Resources',
  'Research Equipment',
  'Emergency Response Equipment',
  'Public Address Systems',
  'Solar Power Systems',
  'Water Treatment Facilities',
  'Road Construction Equipment',
  'School Buildings and Facilities',
  'Hospital Equipment',
  'Police Equipment and Vehicles',
  'Firefighting Equipment',
  'Jail Management Systems',
  'Courtroom Equipment',
  'Library Books and Materials',
  'Sports Equipment and Facilities',
  'Waste Management Systems',
  'Disaster Response Equipment'
];

const purposes = [
  'Government Operations',
  'Public Service Delivery',
  'Infrastructure Development',
  'Capacity Building',
  'Emergency Response',
  'Public Safety',
  'Education Enhancement',
  'Healthcare Improvement',
  'Environmental Protection',
  'Economic Development',
  'Digital Transformation',
  'Administrative Efficiency',
  'Community Development',
  'Disaster Preparedness',
  'Research and Innovation'
];

// Generate random date within last 2 years
function getRandomDate(startDate: Date, endDate: Date): Date {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return new Date(start + Math.random() * (end - start));
}

// Generate random ABC (Approved Budget Contract) values
function getRandomABC(): number {
  // Random values between 50,000 PHP to 500,000,000 PHP
  return Math.floor(Math.random() * 499950000) + 50000;
}

// Generate random closing date (30-180 days from creation)
function getRandomClosingDate(createdDate: Date): Date {
  const daysToAdd = Math.floor(Math.random() * 150) + 30; // 30-180 days
  const closingDate = new Date(createdDate);
  closingDate.setDate(closingDate.getDate() + daysToAdd);
  return closingDate;
}

// Generate project title
function generateTitle(): string {
  const template = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
  const item = items[Math.floor(Math.random() * items.length)];
  const purpose = purposes[Math.floor(Math.random() * purposes.length)];

  return template
    .replace('{item}', item)
    .replace('{purpose}', purpose);
}

// Main seeding function
async function seedProjects() {
  try {
    console.log('Starting project seeding...');

    // Get existing clients
    const existingClients = await db.select({ id: clients.id }).from(clients);
    if (existingClients.length === 0) {
      console.log('No clients found. Please create clients first.');
      return;
    }

    console.log(`Found ${existingClients.length} clients`);

    const projectsToInsert = [];
    const startDate = new Date('2023-01-01');
    const endDate = new Date();

    // Generate 500 projects
    for (let i = 0; i < 500; i++) {
      const clientId = existingClients[Math.floor(Math.random() * existingClients.length)].id;
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
        // Optional fields with some randomization
        referenceNumber: `REF-${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`,
        solicitationNumber: `SOL-${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`,
        areaOfDelivery: ['Luzon', 'Visayas', 'Mindanao', 'National Capital Region'][Math.floor(Math.random() * 4)],
        description: `This project involves the procurement of essential goods and services to support ${purposes[Math.floor(Math.random() * purposes.length)].toLowerCase()}. The approved budget contract is ${getRandomABC().toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}.`,
      };

      projectsToInsert.push(project);
    }

    console.log(`Generated ${projectsToInsert.length} projects`);

    // Insert in batches to avoid memory issues
    const batchSize = 50;
    for (let i = 0; i < projectsToInsert.length; i += batchSize) {
      const batch = projectsToInsert.slice(i, i + batchSize);
      await db.insert(projects).values(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(projectsToInsert.length / batchSize)}`);
    }

    console.log('Project seeding completed successfully!');

    // Verify the insertion
    const totalProjects = await db.select({ count: sql<number>`count(*)` }).from(projects);
    console.log(`Total projects in database: ${totalProjects[0].count}`);

  } catch (error) {
    console.error('Error seeding projects:', error);
  }
}

// Run the seeding
seedProjects().catch(console.error);