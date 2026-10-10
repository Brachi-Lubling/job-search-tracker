import { spawn } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let connected = false;

for (let attempt = 1; attempt <= 30; attempt += 1) {
  try {
    await prisma.$connect();
    connected = true;
    break;
  } catch {
    if (attempt === 30) break;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

await prisma.$disconnect();

if (!connected) {
  console.error("PostgreSQL did not become ready within 30 seconds.");
  process.exit(1);
}

const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start"], {
  stdio: "inherit",
  env: process.env,
});

next.on("error", (error) => {
  console.error("Could not start the Next.js production server:", error);
  process.exitCode = 1;
});

next.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});