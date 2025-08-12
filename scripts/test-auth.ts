import { signIn } from 'next-auth/react'

// This would be used client-side for testing
async function testAuthentication() {
  try {
    console.log('Testing employer authentication...')
    
    const employerResult = await signIn('credentials', {
      email: 'employer@company.com',
      password: 'password123',
      userType: 'EMPLOYER',
      redirect: false,
    })

    if (employerResult?.ok) {
      console.log('✅ Employer authentication successful')
    } else {
      console.log('❌ Employer authentication failed:', employerResult?.error)
    }

    console.log('Testing employee authentication...')
    
    const employeeResult = await signIn('credentials', {
      email: 'employee@company.com',
      password: 'password123',
      userType: 'EMPLOYEE',
      redirect: false,
    })

    if (employeeResult?.ok) {
      console.log('✅ Employee authentication successful')
    } else {
      console.log('❌ Employee authentication failed:', employeeResult?.error)
    }

  } catch (error) {
    console.error('Error testing authentication:', error)
  }
}

// Export for use in components
export { testAuthentication }