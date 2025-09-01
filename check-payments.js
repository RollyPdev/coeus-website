const { PrismaClient } = require('@prisma/client');

async function checkPayments() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking existing payments...');
    
    const payments = await prisma.payment.findMany({
      select: {
        id: true,
        transactionId: true,
        receiptNumber: true,
        amount: true,
        status: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`📋 Found ${payments.length} payments:`);
    payments.forEach(payment => {
      console.log({
        id: payment.id,
        transactionId: payment.transactionId,
        receiptNumber: payment.receiptNumber,
        amount: payment.amount,
        status: payment.status,
        createdAt: payment.createdAt
      });
    });
    
  } catch (error) {
    console.error('❌ Error checking payments:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPayments();