import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { companyOperations, userOperations } from '@/lib/db/queries';
import { RegisterSchema } from '@/lib/db/validations';
import { getTenantSchemaName } from '@/lib/db/unified-schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = RegisterSchema.parse(body);
    const { email, password, companyName } = validatedData;

    // Check if user already exists
    const existingUser = await userOperations.getByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Check if company name already exists
    const existingCompany = await companyOperations.getByName(companyName);
    if (existingCompany) {
      return NextResponse.json(
        { success: false, error: 'Company name already taken' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate schema name for the tenant
    const dbSchema = getTenantSchemaName(companyName);

    // Create company
    const company = await companyOperations.create({
      name: companyName,
      dbSchema: dbSchema,
      projectUrl: process.env.DATABASE_URL || 'localhost',
      anonKey: 'placeholder-key', // This can be updated later
    });

    // Create user (as admin)
    const user = await userOperations.create({
      email: email,
      passwordHash: passwordHash,
      companyId: company.id,
      role: 'admin',
      isActive: 'true',
    });

    // TODO: Create tenant schema in database
    // This would require running: SELECT create_tenant_schema($1) with dbSchema parameter
    // For now, we'll assume the schema creation is handled separately

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: userWithoutPassword,
        company: company,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
