import { PrismaClient } from '@prisma/client';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'SQL> '
});

console.log("--- Interactive SQL Command Prompt ---");
console.log("Type your SQL commands (e.g. SELECT * FROM User;)");
console.log("Type 'exit' or 'quit' to close the prompt.");
console.log("----------------------------------------");
rl.prompt();

rl.on('line', async (line) => {
  const query = line.trim();
  if (query.toLowerCase() === 'exit' || query.toLowerCase() === 'quit') {
    await prisma.$disconnect();
    process.exit(0);
  }
  if (!query) {
    rl.prompt();
    return;
  }
  try {
    const result = await prisma.$queryRawUnsafe(query);
    if (Array.isArray(result) && result.length > 0) {
      console.table(result);
    } else if (Array.isArray(result)) {
      console.log("(0 rows returned)");
    } else {
      console.log(result);
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
  rl.prompt();
}).on('close', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
