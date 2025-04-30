const axios = require('axios');
const { prisma, verifyToken } = require('./src/lib/auth.cjs');

(async () => {
  try {
    console.log('=== Starting Authentication Test ===');
    
    // 1. Verify admin exists
    const admin = await prisma.admin.findUnique({
      where: { email: 'admin@example.com' },
      select: { id: true, email: true }
    });
    
    console.log(admin ? '✓ Admin exists' : '✗ Admin missing');
    if (!admin) process.exit(1);

    // 2. Test login endpoint
    console.log('\nTesting login...');
    const response = await axios.post('http://localhost:3000/api/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });

    console.log('✓ Login successful');
    console.log('Received token:', response.data.token ? 'Valid' : 'Invalid');
    if (!response.data.token) process.exit(1);

    // 3. Verify token
    const decoded = verifyToken(response.data.token);
    console.log('\nToken contents:', decoded);
    
    // 4. Verify admin dashboard access
    console.log('\nTesting dashboard access...');
    const dashboard = await axios.get('http://localhost:3000/admin/dashboard', {
      headers: { Authorization: `Bearer ${response.data.token}` }
    });
    
    console.log('✓ Dashboard access:', dashboard.status);
    
  } catch (error) {
    console.error('\n✗ Test failed:', {
      message: error.message,
      stack: error.stack,
      response: {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      }
    });
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n=== Test completed ===');
  }
})();