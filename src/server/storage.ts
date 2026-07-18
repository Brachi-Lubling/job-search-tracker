import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

// Files live under public/uploads so Next serves them at /uploads/<name>.
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads";
const PUBLIC_PREFIX = "/uploads";

/** Persist an uploaded file and return its public URL (e.g. "/uploads/ab12.pdf"). */
export async function saveUpload(file: File): Promise<{ fileUrl: string }> {
  const ext = path.extname(file.name) || ".pdf";
  const safeName = `${randomUUID()}${ext}`;
  const dir = path.resolve(UPLOAD_DIR);
  await mkdir(dir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, safeName), bytes);

  return { fileUrl: `${PUBLIC_PREFIX}/${safeName}` };
}

/** Best-effort delete of a previously saved file given its public URL. */
export async function deleteUpload(fileUrl: string): Promise<void> {
  if (!fileUrl.startsWith(`${PUBLIC_PREFIX}/`)) return;
  const name = fileUrl.slice(PUBLIC_PREFIX.length + 1);
  try {
    await unlink(path.join(path.resolve(UPLOAD_DIR), name));
  } catch {
    // already gone — ignore
  }
}
