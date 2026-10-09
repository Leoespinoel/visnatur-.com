// Lets plain `node` scripts import the site's TypeScript data files, whose own imports
// omit the ".ts" extension the way Next.js allows ("./site" → "./site.ts").
//   node --import ./scripts/ts-resolve.mjs scripts/whatever.mts
import { register } from "node:module";

register(
  "data:text/javascript," +
    encodeURIComponent(`
      export async function resolve(specifier, context, next) {
        try {
          return await next(specifier, context);
        } catch (err) {
          if (err?.code === "ERR_MODULE_NOT_FOUND" && /^\\.{1,2}\\//.test(specifier) && !/\\.[a-z]+$/i.test(specifier)) {
            return next(specifier + ".ts", context);
          }
          throw err;
        }
      }
    `),
  import.meta.url,
);
