import type { Prisma } from "@prisma/client";
import { companyRepository } from "@/server/repositories/company.repository";
import { NotFoundError, ConflictError } from "@/server/http";
import { toCompanyDTO, toRecruiterDTO, toJobListItemDTO } from "@/server/mappers";
import type {
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyListItemDTO,
  CompanyDetailDTO,
} from "@/domain/types";

export const companyService = {
  async create(input: CreateCompanyInput) {
    const company = await companyRepository.create(input);
    return toCompanyDTO(company);
  },

  async list(): Promise<CompanyListItemDTO[]> {
    const companies = await companyRepository.list();
    return companies.map((c) => ({
      ...toCompanyDTO(c),
      jobCount: c._count.applications,
      recruiterCount: c._count.recruiters,
    }));
  },

  async getById(id: string): Promise<CompanyDetailDTO> {
    const company = await companyRepository.findByIdWithDetail(id);
    if (!company) throw new NotFoundError("החברה לא נמצאה");
    return {
      ...toCompanyDTO(company),
      recruiters: company.recruiters.map(toRecruiterDTO),
      jobs: company.applications.map(toJobListItemDTO),
    };
  },

  async update(id: string, input: UpdateCompanyInput) {
    const exists = await companyRepository.findById(id);
    if (!exists) throw new NotFoundError("החברה לא נמצאה");

    const data: Prisma.CompanyUpdateInput = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.website !== undefined) data.website = input.website || null;
    if (input.industry !== undefined) data.industry = input.industry || null;
    if (input.notes !== undefined) data.notes = input.notes || null;

    const company = await companyRepository.update(id, data);
    return toCompanyDTO(company);
  },

  async remove(id: string) {
    const exists = await companyRepository.findById(id);
    if (!exists) throw new NotFoundError("החברה לא נמצאה");
    // Block deletion while jobs still reference the company.
    const jobs = await companyRepository.applicationsCount(id);
    if (jobs > 0) {
      throw new ConflictError(`לא ניתן למחוק — יש ${jobs} משרות מקושרות לחברה`);
    }
    await companyRepository.remove(id);
    return { id };
  },
};
