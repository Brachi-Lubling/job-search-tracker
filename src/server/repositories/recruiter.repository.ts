import { Prisma } from "@prisma/client";
import { prisma } from "@/server/prisma";
import type { CreateRecruiterInput } from "@/domain/types";

export const recruiterRepository = {
  create(companyId: string, data: CreateRecruiterInput) {
    return prisma.recruiter.create({
      data: {
        companyId,
        name: data.name,
        role: data.role || null,
        email: data.email || null,
        phone: data.phone || null,
        notes: data.notes || null,
      },
    });
  },

  findById(id: string) {
    return prisma.recruiter.findUnique({ where: { id } });
  },

  update(id: string, data: Prisma.RecruiterUpdateInput) {
    return prisma.recruiter.update({ where: { id }, data });
  },

  remove(id: string) {
    return prisma.recruiter.delete({ where: { id } });
  },
};
