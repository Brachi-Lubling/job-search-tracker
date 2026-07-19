import type { Prisma } from "@prisma/client";
import { recruiterRepository } from "@/server/repositories/recruiter.repository";
import { companyRepository } from "@/server/repositories/company.repository";
import { NotFoundError } from "@/server/http";
import { toRecruiterDTO } from "@/server/mappers";
import type { CreateRecruiterInput, UpdateRecruiterInput } from "@/domain/types";

export const recruiterService = {
  async create(companyId: string, input: CreateRecruiterInput) {
    const company = await companyRepository.findById(companyId);
    if (!company) throw new NotFoundError("החברה לא נמצאה");
    const recruiter = await recruiterRepository.create(companyId, input);
    return toRecruiterDTO(recruiter);
  },

  async update(id: string, input: UpdateRecruiterInput) {
    const exists = await recruiterRepository.findById(id);
    if (!exists) throw new NotFoundError("איש הקשר לא נמצא");

    const data: Prisma.RecruiterUpdateInput = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.role !== undefined) data.role = input.role || null;
    if (input.email !== undefined) data.email = input.email || null;
    if (input.phone !== undefined) data.phone = input.phone || null;
    if (input.notes !== undefined) data.notes = input.notes || null;

    const recruiter = await recruiterRepository.update(id, data);
    return toRecruiterDTO(recruiter);
  },

  async remove(id: string) {
    const exists = await recruiterRepository.findById(id);
    if (!exists) throw new NotFoundError("איש הקשר לא נמצא");
    await recruiterRepository.remove(id);
    return { id };
  },
};
