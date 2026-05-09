/**
 * Fix Vercel envs : supprime les vars cassées (BOM/CRLF) + recrée propres.
 * Spawn `vercel env rm/add` avec stdin propre (pas de BOM/newline parasites).
 */
import { spawn } from "node:child_process";

const VARS = {
  NEXTAUTH_SECRET: "fDRF6TbVCzL9ENscvR/xHTSepY45QHhIyiCnVqF1fG8=",
  NEXTAUTH_URL: "https://tableo-sepia.vercel.app",
  NEXT_PUBLIC_BASE_URL: "https://tableo-sepia.vercel.app",
  NEXT_PUBLIC_APP_URL: "https://tableo-sepia.vercel.app",
  ADMIN_EMAILS: "skyymar69@gmail.com",
  NEXT_PUBLIC_ADMIN_EMAILS: "skyymar69@gmail.com",
};

const ENVS = ["production", "preview"];

function run(args, input) {
  return new Promise((resolve) => {
    const p = spawn("npx", ["vercel", ...args, "--yes"], {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "", stderr = "";
    p.stdout.on("data", d => stdout += d);
    p.stderr.on("data", d => stderr += d);
    p.on("close", code => resolve({ code, stdout, stderr }));
    if (input != null) {
      p.stdin.write(input);
      p.stdin.end();
    } else {
      p.stdin.end();
    }
  });
}

for (const env of ENVS) {
  for (const [k, v] of Object.entries(VARS)) {
    process.stdout.write(`${env} | ${k} : `);
    // Suppress existing
    await run(["env", "rm", k, env]);
    // Re-add proprement (stdin = juste la valeur, pas de newline)
    const r = await run(["env", "add", k, env], v);
    if (r.code === 0) console.log("OK");
    else console.log("FAIL", r.stderr.trim().split("\n").slice(-2).join(" | "));
  }
}
console.log("\nDone");
