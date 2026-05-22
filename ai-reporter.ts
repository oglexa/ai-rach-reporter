import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

export default class AIReporter implements Reporter {
    
    // Этот хук срабатывает после завершения каждого теста
    async onTestEnd(test: TestCase, result: TestResult) {
        if (result.status === 'failed' && result.error) {
            console.log(`\n [AI Assistant] Analyzing test failure: "${test.title}"...`);
            
            const errorMessage = result.error.message || result.error.stack || 'Unknown error';
            const location = `${test.location.file}:${test.location.line}`;

            const prompt = `
                You are Senior SDET. Your E2E Playwright test failed.
                File: ${location}
                Error: ${errorMessage}
                
                Explain the cause of the error as briefly as possible (1-2 sentences) and offer one specific solution.
                Answer in English.
            `;

            try {
                const response = await fetch('http://127.0.0.1:11434/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'llama3.1', // Select your local ai model
                        prompt: prompt,
                        stream: false,
                        options: { temperature: 0.2 } // Defined low creativity level for accuracy
                    })
                });

                const data = await response.json();
                
                console.log(`\x1b[33m AI Analysis:\x1b[0m\n${data.response.trim()}\n`);
                console.log('---------------------------------------------------');
                
            } catch (error) {
                console.error('Unable to connect to Ollama. Check if the server is running. (ollama serve).');
            }
        }
    }
}