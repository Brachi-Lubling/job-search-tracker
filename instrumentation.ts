export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { prisma } = await import("@/server/prisma");
    await prisma.$connect();
  }
}