# 🤖 Playwright AI Crash Reporter

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Ollama](https://img.shields.io/badge/Ollama-White?style=flat-square&logo=ollama&logoColor=black)](https://ollama.ai/)

## 🎯 The Concept: AI for QA
Debugging flaky or failed E2E tests is one of the most time-consuming tasks in test automation. Reading through lengthy stack traces and DOM snapshots takes valuable engineering hours. 

This project implements a **Custom Playwright Reporter** that intercepts test failures, extracts the error trace and test context, and feeds them into a local LLM. The AI instantly analyzes the failure and provides a concise root cause explanation and actionable fix directly in the terminal.

## 🚀 Key Features
*   **Zero API Costs & Total Privacy:** Uses [Ollama](https://ollama.ai/) to run models locally (e.g., Llama 3) entirely offline. No test data or proprietary code is sent to OpenAI or third-party servers.
*   **Seamless Playwright Integration:** Implements the native `Reporter` interface. No changes to existing test files are required.
*   **Instant Terminal Feedback:** Provides colored, easy-to-read AI insights right below the standard Playwright error logs.

## 💻 Sample Output

When a test fails, instead of just a raw timeout error, you get this summary in your CI/CD or local terminal:

```text
  1) login.spec.ts:15:5 › should login successfully ─────────────────────────
    Error: locator.click: Timeout 10000ms exceeded.

🤖 [AI Assistant] Analyzing failure for: "should login successfully"...
💡 AI Analysis:
The test failed because the Playwright engine could not locate the 'button#submit-login' element within the 10-second timeout. 
Fix: Verify if the 'button#submit-login' selector has been modified by the frontend team, or ensure there are no blocking network requests preventing the button from rendering.
```

🛠 Prerequisites & Setup
---
Hardware Note: Local LLM inference runs exceptionally fast on Apple Silicon (M-series chips). An average failure analysis takes ~2-3 seconds.

1. Install Node dependencies:
```Bash
   npm install
```

2. Install Ollama and start the local server:
```Bash
   ollama serve
```
3. Pull the required model (we use llama3 by default):
```Bash
   ollama run llama3
```
(Exit the interactive prompt once the download is complete).


⚙️ Configuration
---

To use the AI reporter, simply add it to your playwright.config.ts:

```TypeScript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'], // Keep standard terminal output
    ['./ai-reporter.ts'] // Add the custom AI analyzer
  ],
});
```

🏃‍♂️ Running the Tests
Trigger a test run as usual. If any test fails, the AI will automatically catch the error and analyze it:

```Bash
npx playwright test
```

📈 Future Roadmap
---
HTML/Allure Integration: Attach AI summaries directly into Allure or Playwright HTML reports.

Auto-Ticketing: Automatically generate Jira bug drafts based on the AI's root cause analysis.

DOM Context Awareness: Feed the localized DOM snippet at the time of failure into the LLM for more precise frontend debugging.