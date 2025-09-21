import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { companyOperations, userOperations } from '@/lib/db/queries';
import { LoginSchema } from '@/lib/db/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = LoginSchema.parse(body);
    const { email, password, company: companyName } = validatedData;

    // Find company by name first
    const companyRecord = await companyOperations.getByName(companyName);
    if (!companyRecord) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 401 }
      );
    }

    // Find user by email within the company
    const user = await userOperations.getByEmailAndCompany(email, companyRecord.id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    if (!user.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Account is disabled' },
        { status: 401 }
      );
    }

    // Update last login
    await userOperations.updateLastLogin(user.id);

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        company: companyRecord,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    
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
