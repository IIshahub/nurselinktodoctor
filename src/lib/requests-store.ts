import { promises as fs } from "fs";
import path from "path";
import type { LabRequest } from "@/src/types/requests";
import { initialRequests } from "@/src/data/initialRequests";

const dbPath = path.join(process.cwd(), "db.json");

interface DbShape {
  requests: LabRequest[];
}

let dbQueue: Promise<unknown> = Promise.resolve();

function withDbLock<T>(operation: () => Promise<T>): Promise<T> {
  const run = dbQueue.then(operation, operation);
  dbQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readDbUnsafe(): Promise<DbShape> {
  try {
    const raw = await fs.readFile(dbPath, "utf-8");
    const parsed = JSON.parse(raw) as DbShape;

    if (!Array.isArray(parsed.requests)) {
      return { requests: initialRequests };
    }

    return parsed;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === "ENOENT") {
      const seed = { requests: initialRequests };
      await writeDbUnsafe(seed);
      return seed;
    }

    return { requests: initialRequests };
  }
}

async function writeDbUnsafe(data: DbShape) {
  const payload = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(dbPath, payload, "utf-8");
}

export async function getAllRequests(): Promise<LabRequest[]> {
  return withDbLock(async () => {
    const db = await readDbUnsafe();
    return db.requests;
  });
}

export async function updateRequest(
  id: number,
  patch: Partial<LabRequest>,
): Promise<LabRequest | null> {
  return withDbLock(async () => {
    const db = await readDbUnsafe();
    let updated: LabRequest | null = null;

    db.requests = db.requests.map((request) => {
      if (request.id !== id) {
        return request;
      }
      updated = { ...request, ...patch };
      return updated;
    });

    if (!updated) {
      return null;
    }

    await writeDbUnsafe(db);
    return updated;
  });
}

export async function replaceAllRequests(requests: LabRequest[]) {
  return withDbLock(async () => {
    await writeDbUnsafe({ requests });
  });
}
