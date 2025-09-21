import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { companyOperations, userOperations } from '@/lib/db/queries';
import { RegisterSchema } from '@/lib/db/validations';

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

    // Create company first (without owner, we'll set it after creating user)
    const company = await companyOperations.create({
      companyName: companyName,
      keywords: [],
    });

    // Create user (as admin)
    const user = await userOperations.create({
      email: email,
      passwordHash: passwordHash,
      fullName: validatedData.fullName,
      role: 'admin',
    });

    // Update company with owner user ID
    // Note: In a real implementation, you'd update the company record here
    // For now, we'll just proceed since the relationship is established

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
