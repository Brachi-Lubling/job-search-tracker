import { ZodError, ZodIssueCode } from "zod";
import { handle } from "@/server/http";
import { saveUpload } from "@/server/storage";

// Accepts multipart/form-data with a single "file" field. Returns { fileUrl }.
export async function POST(req: Request) {
  return handle(async () => {
    const noFile = new ZodError([
      { code: ZodIssueCode.custom, path: ["file"], message: "לא נבחר קובץ" },
    ]);
    // formData() throws on a missing/non-multipart body — treat as "no file" (400).
    const form = await req.formData().catch(() => {
      throw noFile;
    });
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) throw noFile;
    return saveUpload(file);
  }, 201);
}
