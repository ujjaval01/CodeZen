import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";

const execPromise = promisify(exec);

interface RunResult {
  status: "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR" | "COMPILE_ERROR";
  stdout: string;
  stderr: string;
  executionTime: number; // in ms
  memoryUsage: number; // in KB (estimate)
  error?: string;
}

export async function executeCode(
  language: string,
  code: string,
  input: string
): Promise<RunResult> {
  const isJudge0Enabled = !!process.env.JUDGE0_API_URL;

  if (isJudge0Enabled) {
    return runRemoteJudge0(language, code, input);
  }

  // Local execution sandbox fallback (supports JavaScript and Python out-of-the-box)
  return runLocalSandbox(language, code, input);
}

// Map frontend language identifiers to Judge0 Language IDs
const LANGUAGE_IDS: Record<string, number> = {
  c: 50,          // GCC 9.2.0
  cpp: 54,        // G++ 9.2.0
  java: 62,       // OpenJDK 13
  kotlin: 78,     // Kotlin 1.3.70
  python: 71,     // Python 3.8.1
  javascript: 63, // Node.js 12.14.0
  typescript: 74, // TypeScript 3.7.4
  go: 60,         // Go 1.13.5
  rust: 73,       // Rust 1.40.0
};

async function runRemoteJudge0(
  language: string,
  code: string,
  input: string
): Promise<RunResult> {
  const url = process.env.JUDGE0_API_URL;
  const apiKey = process.env.JUDGE0_API_KEY || "";

  const languageId = LANGUAGE_IDS[language.toLowerCase()];
  if (!languageId) {
    return {
      status: "COMPILE_ERROR",
      stdout: "",
      stderr: `Language ${language} is not supported on Judge0`,
      executionTime: 0,
      memoryUsage: 0,
    };
  }

  try {
    // Create submission
    const res = await fetch(`${url}/submissions?wait=true&base64_encoded=false`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": apiKey,
        "X-Auth-Token": apiKey, // Support self-hosted tokens
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: input,
      }),
    });

    if (!res.ok) {
      throw new Error(`Judge0 API error: ${res.statusText}`);
    }

    const data = await res.json();
    const token = data.token;

    // If wait=true was set, it might return the result immediately. Let's parse it
    return parseJudge0Result(data);
  } catch (err: any) {
    console.error("Judge0 submission failed, falling back to local:", err);
    return runLocalSandbox(language, code, input);
  }
}

function parseJudge0Result(data: any): RunResult {
  const statusId = data.status?.id;
  const stdout = data.stdout || "";
  const stderr = data.stderr || "";
  const compileOutput = data.compile_output || "";
  const time = Math.round((parseFloat(data.time) || 0) * 1000); // sec to ms
  const memory = data.memory || 0; // KB

  // Judge0 status ids: 3 = Accepted, 4 = Wrong Answer, 5 = Time Limit Exceeded, 6 = Compilation Error, 7-12 = Runtime errors
  let status: RunResult["status"] = "ACCEPTED";
  let error = "";

  if (statusId === 3) {
    status = "ACCEPTED";
  } else if (statusId === 4) {
    status = "WRONG_ANSWER";
  } else if (statusId === 5) {
    status = "TIME_LIMIT_EXCEEDED";
    error = "Time Limit Exceeded";
  } else if (statusId === 6) {
    status = "COMPILE_ERROR";
    error = compileOutput || stderr;
  } else {
    status = "RUNTIME_ERROR";
    error = stderr || data.status?.description || "Runtime Error";
  }

  return {
    status,
    stdout: stdout.trim(),
    stderr: stderr.trim() || compileOutput.trim(),
    executionTime: time,
    memoryUsage: memory,
    error,
  };
}

async function runLocalSandbox(
  language: string,
  code: string,
  input: string
): Promise<RunResult> {
  const lang = language.toLowerCase();
  const runId = uuidv4();
  const scratchDir = path.resolve(process.cwd(), "scratch");

  // Ensure scratch directory exists
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  const supportedLanguages = ["javascript", "python", "cpp", "java", "kotlin"];
  if (!supportedLanguages.includes(lang)) {
    return {
      status: "COMPILE_ERROR",
      stdout: "",
      stderr: `Local compiler only supports JavaScript, Python, C++, Java, and Kotlin. Connect a Judge0 API in .env to execute Go, Rust, and other languages.`,
      executionTime: 0,
      memoryUsage: 0,
    };
  }

  const inputFilePath = path.join(scratchDir, `input_${runId}.txt`);
  fs.writeFileSync(inputFilePath, input);

  let tempFilePath = "";
  let execCommand = "";
  let compileCommand = "";
  let cleanupPaths: string[] = [inputFilePath];
  let runDir = "";

  const isWindows = process.platform === "win32";

  try {
    if (lang === "javascript") {
      tempFilePath = path.join(scratchDir, `run_${runId}.js`);
      fs.writeFileSync(tempFilePath, code);
      cleanupPaths.push(tempFilePath);
      execCommand = `node "${tempFilePath}" < "${inputFilePath}"`;
    } else if (lang === "python") {
      tempFilePath = path.join(scratchDir, `run_${runId}.py`);
      fs.writeFileSync(tempFilePath, code);
      cleanupPaths.push(tempFilePath);
      execCommand = `python "${tempFilePath}" < "${inputFilePath}"`;
    } else if (lang === "cpp") {
      tempFilePath = path.join(scratchDir, `run_${runId}.cpp`);
      const execFilePath = path.join(scratchDir, `run_${runId}${isWindows ? ".exe" : ""}`);
      fs.writeFileSync(tempFilePath, code);
      cleanupPaths.push(tempFilePath);
      cleanupPaths.push(execFilePath);

      compileCommand = `g++ -O3 "${tempFilePath}" -o "${execFilePath}"`;
      execCommand = `"${execFilePath}" < "${inputFilePath}"`;
    } else if (lang === "java") {
      runDir = path.join(scratchDir, `run_${runId}`);
      fs.mkdirSync(runDir, { recursive: true });
      tempFilePath = path.join(runDir, "Solution.java");
      fs.writeFileSync(tempFilePath, code);

      compileCommand = `javac "${tempFilePath}"`;
      execCommand = `java -cp "${runDir}" Solution < "${inputFilePath}"`;
    } else if (lang === "kotlin") {
      runDir = path.join(scratchDir, `run_${runId}`);
      fs.mkdirSync(runDir, { recursive: true });
      tempFilePath = path.join(runDir, "Solution.kt");
      const jarPath = path.join(runDir, "Solution.jar");
      fs.writeFileSync(tempFilePath, code);

      compileCommand = `kotlinc "${tempFilePath}" -include-runtime -d "${jarPath}"`;
      execCommand = `java -jar "${jarPath}" < "${inputFilePath}"`;
    }

    const startTime = Date.now();

    // 1. Compile if needed
    if (compileCommand) {
      try {
        await execPromise(compileCommand, { timeout: 8000 }); // 8s compilation limit
      } catch (compileErr: any) {
        const stderr = compileErr.stderr || compileErr.message || "Compilation failed";
        
        // Check if compiler is missing
        if (stderr.includes("not recognized") || stderr.includes("not found") || compileErr.message.includes("ENOENT")) {
          return {
            status: "COMPILE_ERROR",
            stdout: "",
            stderr: `Compiler for "${language.toUpperCase()}" is not installed or not in system PATH.\n\nRequired executable:\n${
              lang === "cpp" ? "- GCC C++ Compiler (g++)" : lang === "java" ? "- Java Compiler (javac)" : "- Kotlin Compiler (kotlinc)"
            }\n\nTo execute code in all 9 languages without local installations, set up a Judge0 API connection in your .env file.`,
            executionTime: 0,
            memoryUsage: 0,
            error: "Compiler not installed locally",
          };
        }

        return {
          status: "COMPILE_ERROR",
          stdout: "",
          stderr: stderr.trim(),
          executionTime: 0,
          memoryUsage: 0,
          error: "Compile Error",
        };
      }
    }

    // 2. Run Executable
    const { stdout, stderr } = await execPromise(execCommand, {
      timeout: 3000, // 3s execution timeout limit
      maxBuffer: 1024 * 1024 * 5, // 5MB buffer limits
    });

    const executionTime = Date.now() - startTime;

    return {
      status: stderr ? "RUNTIME_ERROR" : "ACCEPTED",
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      executionTime,
      memoryUsage: Math.round(code.length / 10 + 24000), // Mock memory estimate
      error: stderr ? stderr.trim() : undefined,
    };
  } catch (err: any) {
    const isTimeout = err.killed || err.signal === "SIGTERM";

    return {
      status: isTimeout ? "TIME_LIMIT_EXCEEDED" : "RUNTIME_ERROR",
      stdout: "",
      stderr: err.stderr || err.message || "Execution Failed",
      executionTime: 3000,
      memoryUsage: 0,
      error: isTimeout ? "Time Limit Exceeded (3.0 seconds limit)" : err.message,
    };
  } finally {
    // Clean up files
    cleanupPaths.forEach((p) => {
      try {
        if (fs.existsSync(p)) fs.unlinkSync(p);
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    });

    // Clean up directories
    if (runDir && fs.existsSync(runDir)) {
      try {
        fs.rmSync(runDir, { recursive: true, force: true });
      } catch (e) {
        console.error("Cleanup dir error:", e);
      }
    }
  }
}
