import { spawn } from 'node:child_process';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import * as readline from 'node:readline';
import { fileURLToPath } from 'node:url';

// Equivalent to __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Base64Converter {
    private pythonScriptPath: string;

    constructor() {
        this.pythonScriptPath = path.join(__dirname, 'base64_to_json.py');
    }

    public convertBase64ToJSON(base64String: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python3', [this.pythonScriptPath, base64String]);

            let output = '';
            let errorOutput = '';

            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            pythonProcess.on('close', async (code) => {
                if (code === 0) {
                    const outputPath = path.join('output', 'decoded_output.json');
                    try {
                        const jsonContent = await fs.readFile(outputPath, 'utf-8');
                        resolve(jsonContent);
                    } catch (readError) {
                        reject(new Error(`Failed to read output file: ${readError}`));
                    }
                } else {
                    reject(new Error(`Process failed with code ${code}. Error: ${errorOutput}`));
                }
            });
        });
    }

    public static async getUserInput(): Promise<string> {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            rl.question('Enter base64 encoded string: ', (base64String) => {
                rl.close();
                resolve(base64String.trim());
            });
        });
    }

    public static async runTest() {
        try {
            const base64String = await Base64Converter.getUserInput();
            console.log("Entered Base64 String:", base64String);

            const converter = new Base64Converter();
            const result = await converter.convertBase64ToJSON(base64String);
            console.log('Converted JSON:', result);
        } catch (error) {
            console.error('Conversion failed:', error);
        }
    }
}

// Run test if script is executed directly
if (import.meta.url === `file://${__filename}`) {
    Base64Converter.runTest();
}