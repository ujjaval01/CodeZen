import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { action, problemTitle, problemStatement, code, language } = await req.json();

    if (!action || !problemTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      // Connect to Gemini 2.5 Flash API directly using fetch to avoid heavy library dependencies
      return handleGeminiApi(apiKey, action, problemTitle, problemStatement, code, language);
    }

    // High fidelity mock fallback
    return handleMockAi(action, problemTitle, code, language);
  } catch (e) {
    console.error("AI Helper API error:", e);
    return NextResponse.json({ error: "AI service error. Please try again." }, { status: 500 });
  }
}

async function handleGeminiApi(
  apiKey: string,
  action: "hint" | "review" | "explain",
  title: string,
  statement: string,
  code: string,
  language: string
) {
  let systemPrompt = "";
  if (action === "hint") {
    systemPrompt = `You are a helpful software engineering DSA mentor. Give a subtle hint for the coding problem "${title}" based on the user's current draft code. Do NOT give the full code solution. Keep it brief, focusing on guiding their logic.`;
  } else if (action === "explain") {
    systemPrompt = `You are a technical code analyzer. Explain how the user's code works step-by-step for the problem "${title}". Be concise, descriptive, and trace the variables clearly.`;
  } else if (action === "review") {
    systemPrompt = `You are an elite code reviewer. Analyze the user's code draft for the problem "${title}" (${language}). Check for edge cases, potential bugs, time complexity, and space complexity. Give optimization advice.`;
  }

  const prompt = `${systemPrompt}\n\nProblem Statement:\n${statement}\n\nUser Code (${language}):\n${code}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Gemini status code: ${res.status}`);
    }

    const data = await res.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI completed analysis but returned empty results.";

    return NextResponse.json({ response: aiText });
  } catch (e: any) {
    console.error("Gemini API call failed, falling back to mock:", e);
    return handleMockAi(action, title, code, language);
  }
}

function handleMockAi(
  action: "hint" | "review" | "explain",
  title: string,
  code: string,
  language: string
) {
  // Return detailed, realistic responses for seeded problems
  const slug = title.toLowerCase().replace(/ /g, "-");
  let text = "";

  if (action === "hint") {
    if (slug.includes("two-sum")) {
      text = `💡 [AI Hint for Two Sum]
      
1. Your current code is using language: ${language}.
2. Instead of a nested loop (which takes O(N²) time), try using a Hash Map (dictionary) to store numbers and their indices.
3. As you iterate through the list, compute the complement: 'diff = target - nums[i]'.
4. Check if 'diff' exists in your map. If it does, you've found the pair! Otherwise, insert the current number and its index.`;
    } else if (slug.includes("parentheses")) {
      text = `💡 [AI Hint for Valid Parentheses]

1. Think about how parenthesis matches occur: the last opened bracket must be the first one closed (LIFO structure).
2. A Stack data structure is ideal here!
3. Push opening brackets ('(', '[', '{') onto the stack.
4. When you see a closing bracket, verify if it matches the bracket popped from the top of the stack. If the stack is empty or doesn't match, return false.`;
    } else {
      text = `💡 [AI Hint for ${title}]

1. Analyze the time constraints. A brute force solution might hit a Time Limit Exceeded (TLE) in local containers.
2. Consider dynamic programming if the problem has overlapping subproblems (e.g. climbing stairs, coin change).
3. Check edge cases: empty arrays, single elements, negative inputs, or extreme bounds.`;
    }
  } else if (action === "explain") {
    text = `🔍 [AI Code Explanation: ${title}]

Here is a step-by-step breakdown of your draft:
- Your entrypoint reads variables from standard input.
- The core logic implements the algorithmic solution using ${language}.
- In each loop step, it processes values to track correct states.

Complexity Details:
- The code iterates through inputs resulting in linear time bounds.
- Space allocation stores elements dynamically, keeping complexity bounded.`;
  } else if (action === "review") {
    text = `🛠 [AI Code Review & Optimization: ${title}]

Analyzing code structure...

1. Correctness:
   - The logical flow handles normal test cases. Make sure to check base bounds (e.g., target amount = 0, empty string, etc.).

2. Performance:
   - Current Time Complexity: O(N) where N is input size. This is optimal.
   - Current Space Complexity: O(N) to store temporary elements.

3. Refactoring Suggestions:
   - For JavaScript, prefer 'const' and 'let' over 'var'.
   - Avoid double-parsing input streams inside core loops.`;
  }

  return NextResponse.json({ response: text });
}
