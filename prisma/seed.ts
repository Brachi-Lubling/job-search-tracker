import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper: N days ago (distinct dates so "latest stage" is well-defined).
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

async function main() {
  // Clean slate (dev only)
  await prisma.postMortem.deleteMany();
  await prisma.processStage.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.resumeVersion.deleteMany();
  await prisma.recruiter.deleteMany();
  await prisma.company.deleteMany();

  const [acme, globex] = await Promise.all([
    prisma.company.create({
      data: {
        name: "Acme Tech",
        website: "https://acme.example",
        industry: "SaaS",
        recruiters: {
          create: [
            { name: "דנה כהן", role: "HR Manager", email: "dana@acme.example", phone: "050-1234567" },
            { name: "יוסי לוי", role: "Tech Lead", email: "yossi@acme.example" },
          ],
        },
      },
    }),
    prisma.company.create({
      data: {
        name: "Globex",
        website: "https://globex.example",
        industry: "Fintech",
        recruiters: {
          create: [{ name: "מיטל ברק", role: "Recruiter", phone: "052-7654321" }],
        },
      },
    }),
  ]);

  const resume = await prisma.resumeVersion.create({
    data: {
      versionTag: "Full-Stack-Hebrew",
      fileUrl: "/uploads/sample-resume.pdf",
      language: "עברית",
      tags: ["FE", "BE", "React", "Node"],
      notes: "גרסה עם דגש על React + Node. מותאמת למשרות פולסטאק בעברית.",
    },
  });

  const job1 = await prisma.jobApplication.create({
    data: {
      companyId: acme.id,
      title: "Full-Stack Developer",
      jobUrl: "https://acme.example/jobs/fs",
      resumeId: resume.id,
      status: "active",
      pipeline: "interviewing",
      tags: ["FE", "BE"],
      location: "hybrid",
      salary: "₪30,000-35,000",
      source: "LinkedIn",
      contact: "דנה כהן",
      stages: {
        create: [
          { stageName: "שליחת קורות חיים", status: "completed", date: daysAgo(14) },
          { stageName: "שיחת HR", status: "completed", notes: "שיחה טובה, המשך לשלב טכני", date: daysAgo(7) },
          { stageName: "מבחן טכני", status: "pending", date: daysAgo(1) },
        ],
      },
    },
  });

  await prisma.jobApplication.create({
    data: {
      companyId: globex.id,
      title: "Backend Engineer",
      resumeId: resume.id,
      status: "closed",
      pipeline: "rejected",
      stages: {
        create: [
          { stageName: "שליחת קורות חיים", status: "completed", date: daysAgo(30) },
          { stageName: "ראיון טכני", status: "failed", notes: "נפלתי על שאלת מערכות", date: daysAgo(20) },
        ],
      },
      postMortem: {
        create: {
          rejectionReason: "חוסר בניסיון במערכות מבוזרות",
          improvementTips: "לחזור על נושאי scaling וקאשינג",
          selfScore: 3,
        },
      },
    },
  });

  // Extra jobs spread across pipeline stages (for kanban/dashboard demo).
  await prisma.jobApplication.createMany({
    data: [
      { companyId: acme.id, title: "DevOps Engineer", resumeId: resume.id, status: "active", pipeline: "wishlist", tags: ["DevOps"], location: "remote", source: "אתר החברה" },
      { companyId: globex.id, title: "Frontend Developer", resumeId: resume.id, status: "active", pipeline: "applied", tags: ["FE", "React"], location: "onsite", source: "המלצה" },
      { companyId: acme.id, title: "Team Lead", resumeId: resume.id, status: "offered", pipeline: "offer", tags: ["Management"], location: "hybrid" },
    ],
  });

  console.log(`Seeded: 2 companies (+recruiters), 1 resume, 5 jobs (active job=${job1.id}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
