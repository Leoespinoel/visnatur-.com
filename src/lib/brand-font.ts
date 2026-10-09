import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Cormorant Garamond Medium (SIL OFL 1.1) for server-rendered brand images. */
export function loadBrandFont(): Promise<Buffer> {
  return readFile(join(process.cwd(), "src/assets/CormorantGaramond-Medium.ttf"));
}
