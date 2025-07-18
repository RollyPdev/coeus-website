import { PrismaClient } from '@prisma/client';

// Direct instantiation without global singleton pattern
const prisma = new PrismaClient();

export default prisma;