import { registerHooks } from "node:module";

const projectRoot = new URL("../", import.meta.url);
const emptyModule = "data:text/javascript,export default {}";
const transportStub = `data:text/javascript,${encodeURIComponent(`
  export default {
    createTransport() {
      return {
        async sendMail(message) {
          const state = globalThis.__transgarantTestMail;
          if (state.failure) throw state.failure;
          state.messages.push(message);
          return { messageId: "test-only" };
        },
      };
    },
  };
`)}`;

// Keep handlers, validation, rate limits and mail configuration real. Only the
// external transport is replaced; these fixtures cannot contact an SMTP server.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") return { url: emptyModule, shortCircuit: true };
    if (specifier === "nodemailer") return { url: transportStub, shortCircuit: true };
    if (specifier.startsWith("@/")) {
      return nextResolve(new URL(`${specifier.slice(2)}.js`, projectRoot).href, context);
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith(projectRoot.href) && url.endsWith(".js") && !url.includes("node_modules")) {
      return nextLoad(url, { ...context, format: "module" });
    }
    return nextLoad(url, context);
  },
});

Object.assign(process.env, {
  SMTP_HOST: "smtp.invalid",
  SMTP_PORT: "587",
  SMTP_SECURE: "false",
  SMTP_USER: "sender@example.test",
  SMTP_PASS: "test-only",
  MAIL_TO: "recipient@example.test",
});

export const mail = { messages: [], failure: null };
globalThis.__transgarantTestMail = mail;

export function resetState() {
  mail.messages.length = 0;
  mail.failure = null;
  globalThis.__transgarantRateLimitState?.entries.clear();
}
