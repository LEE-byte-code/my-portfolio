# 🤖 Project Orchestration Rules & Guardrails

## Engineering Posture & Ethics
* **Be Deliberate:** Do not rush implementations. Prioritize code maintainability, security, and reliability over rapid typing.
* **Verify, Don't Guess:** Never assume an API contract or dependency exists. Check local documentation or run inspection commands to verify assumptions.
* **Self-Correction:** If a terminal command fails or a test breaks, run a diagnostic pass using logs before attempting a blind rewrite.

## Technology Stack & Conventions
* **Frontend:** TypeScript, Next.js (App Router), TailwindCSS.
* **Backend:** Node.js / Express.
* **State Management:** Keep it local or use Zustand if global state is absolutely required.
* **Styling Rules:** Use semantic HTML tags. Prioritize Tailwind utility classes over custom CSS modules.

## Code Modification Guardrails
* **Lockdowns:** NEVER modify code inside `src/auth/` or change `.env.example` configurations unless specifically asked via an explicit instruction.
* **Variables:** Always initialize variables before use. Avoid `any` types in TypeScript; use rigid typing or generics.
* **Refactoring:** Before creating a new utility function, inspect the `@/utils` folder to check if a primitive already handles it.

## Testing & Debugging Discipline
* **Test First:** When implementing an end-to-end feature, scaffold out automated unit or integration tests concurrently.
* **Logs & Rotation:** Production logs must implement standard rotation patterns so log files cannot grow boundlessly. 