import { Prisma } from "@prisma/client";
import { prisma } from "@/server/prisma";
import type { CreateCompanyInput } from "@/domain/types";

export const companyRepository = {
  create(data: CreateCompanyInput) {
    return prisma.company.create({
      data: {
        name: data.name,
        website: data.website || null,
        industry: data.industry || null,
        notes: data.notes || null,
      },
    });
  },

  list() {
    return prisma.company.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { applications: true, recruiters: true } } },
    });
  },

  findById(id: string) {
    return prisma.company.findUnique({ where: { id } });
  },

  // Company + recruiters + linked jobs (detail page).
  findByIdWithDetail(id: string) {
    return prisma.company.findUnique({
      where: { id },
      include: {
        recruiters: { orderBy: { createdAt: "asc" } },
        applications: { orderBy: { createdAt: "desc" }, include: { company: true } },
      },
    });
  },

  update(id: string, data: Prisma.CompanyUpdateInput) {
    return prisma.company.update({ where: { id }, data });
  },

  applicationsCount(id: string) {
    return prisma.jobApplication.count({ where: { companyId: id } });
  },

  remove(id: string) {
    // Recruiters cascade; jobs are checked in the service first.
    return prisma.company.delete({ where: { id } });
  },
};
