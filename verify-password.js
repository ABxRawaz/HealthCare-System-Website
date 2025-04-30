const { prisma, bcrypt } = require('./src/lib/auth.cjs');

(async () => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email: 'admin@example.com' }
    });
    
    console.log('Stored hash:', admin.password);
    const match = await bcrypt.compare('admin123', admin.password);
    console.log('Password matches:', match);
    
    if (!match) {
      console.log('Regenerating hash...');
      const newHash = bcrypt.hashSync('admin123', 12);
      await prisma.admin.update({
        where: { email: 'admin@example.com' },
        data: { password: newHash }
      });
      console.log('New hash stored:', newHash);
    }
  } catch (err) {
    console.error('Verification failed:', err);
  } finally {
    await prisma.$disconnect();
  }
})();