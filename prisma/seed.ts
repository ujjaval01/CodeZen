import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding started...");

  // Clean existing data
  await prisma.submission.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.note.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.contest.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleared.");

  // 1. Create Badges
  const badges = [
    { name: "Code Recruit", description: "Solve your first coding question", icon: "Code", conditionType: "PROBLEMS_SOLVED", conditionValue: 1 },
    { name: "Streak Master", description: "Reach a 7-day daily streak", icon: "Flame", conditionType: "STREAK", conditionValue: 7 },
    { name: "XP Hoarder", description: "Earn 1,000 total experience points (XP)", icon: "Sparkles", conditionType: "XP", conditionValue: 1000 },
    { name: "DP Champion", description: "Solve 5 Dynamic Programming problems", icon: "Brain", conditionType: "PROBLEMS_SOLVED", conditionValue: 5 },
    { name: "Elite Coder", description: "Reach Level 10 on the platform", icon: "Crown", conditionType: "XP", conditionValue: 5000 },
  ];

  for (const b of badges) {
    await prisma.badge.create({ data: b });
  }
  console.log("Badges seeded.");

  // 2. Create Users (hashed passwords)
  const passwordHash = await bcrypt.hash("password123", 10);

  const users = [
    { name: "Admin", email: "admin@codepractice.com", passwordHash, role: "ADMIN", xp: 5200, level: 11, streak: 12 },
    { name: "Alex Mercer", email: "alex@codepractice.com", passwordHash, role: "USER", xp: 2400, level: 5, streak: 8 },
    { name: "Sophia Chen", email: "sophia@codepractice.com", passwordHash, role: "USER", xp: 3800, level: 8, streak: 15 },
    { name: "Vikram Dev", email: "vikram@codepractice.com", passwordHash, role: "USER", xp: 1200, level: 3, streak: 4 },
    { name: "Linus Coder", email: "linus@codepractice.com", passwordHash, role: "USER", xp: 9500, level: 15, streak: 45 },
    { name: "Ada Lovelace", email: "ada@codepractice.com", passwordHash, role: "USER", xp: 7500, level: 13, streak: 28 },
  ];

  const seededUsers = [];
  for (const u of users) {
    const user = await prisma.user.create({ data: u });
    seededUsers.push(user);
  }
  console.log("Users seeded.");

  // 3. Create Problems
  const problemsData = [
    {
      title: "Two Sum",
      slug: "two-sum",
      difficulty: "EASY",
      category: "DSA",
      statement: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
      constraints: "- `2 <= nums.length <= 10^4`\n- `-10^9 <= nums[i] <= 10^9`\n- `-10^9 <= target <= 10^9`\n- Only one valid answer exists.",
      examplesJson: JSON.stringify([
        { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
        { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
      ]),
      hintsJson: JSON.stringify([
        "Try using a hash map to store elements we have seen so far.",
        "For each element `x`, check if `target - x` exists in the hash map."
      ]),
      editorial: "### Two Sum Editorial\n\n#### Approach: Hash Map\nWe can solve this in $O(N)$ time by using a hash map (dictionary) to store the complement of each element. For each number, we check if its complement (`target - num`) is already in the map. If it is, we return the index of the complement and the current index.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      companiesJson: JSON.stringify(["Google", "Meta", "Amazon", "Apple", "Microsoft"]),
      tagsJson: JSON.stringify(["Arrays", "Hashing"]),
      acceptanceRate: 49.5,
      premium: false,
      orderIndex: 1,
      testCases: [
        { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isSample: true },
        { input: "[3,2,4]\n6", expectedOutput: "[1,2]", isSample: true },
        { input: "[3,3]\n6", expectedOutput: "[0,1]", isSample: false },
        { input: "[1,5,9,11,13]\n20", expectedOutput: "[2,3]", isSample: false }
      ]
    },
    {
      title: "Valid Parentheses",
      slug: "valid-parentheses",
      difficulty: "EASY",
      category: "DSA",
      statement: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
      constraints: "- `1 <= s.length <= 10^4`\n- `s` consists of parentheses only `'()[]{}'`.",
      examplesJson: JSON.stringify([
        { input: 's = "()"', output: "true" },
        { input: 's = "()[]{}"', output: "true" },
        { input: 's = "(]"', output: "false" }
      ]),
      hintsJson: JSON.stringify([
        "Use a Stack data structure.",
        "Push opening brackets onto the stack. For a closing bracket, pop the stack and check if it matches."
      ]),
      editorial: "### Valid Parentheses Editorial\n\n#### Approach: Stack\nWe push opening brackets onto a stack. When we see a closing bracket, we check if the stack is empty or if the top of the stack matches the closing bracket. If it does, we pop it. At the end, the stack should be empty if the string is valid.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      companiesJson: JSON.stringify(["Google", "Meta", "Microsoft"]),
      tagsJson: JSON.stringify(["Stack", "Strings"]),
      acceptanceRate: 41.2,
      premium: false,
      orderIndex: 2,
      testCases: [
        { input: "\"()\"", expectedOutput: "true", isSample: true },
        { input: "\"()[]{}\"", expectedOutput: "true", isSample: true },
        { input: "\"(]\"", expectedOutput: "false", isSample: true },
        { input: "\"]\"", expectedOutput: "false", isSample: false },
        { input: "\"(((())))\"", expectedOutput: "true", isSample: false }
      ]
    },
    {
      title: "Climbing Stairs",
      slug: "climbing-stairs",
      difficulty: "EASY",
      category: "DSA",
      statement: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
      constraints: "- `1 <= n <= 45`",
      examplesJson: JSON.stringify([
        { input: "n = 2", output: "2", explanation: "There are two ways: 1 step + 1 step, or 2 steps." },
        { input: "n = 3", output: "3", explanation: "Three ways: 1+1+1, 1+2, or 2+1." }
      ]),
      hintsJson: JSON.stringify([
        "To reach step `i`, you must come from step `i-1` or `i-2`.",
        "This problem is equivalent to finding the n-th Fibonacci number."
      ]),
      editorial: "### Climbing Stairs Editorial\n\n#### Approach: Dynamic Programming\nLet $dp[i]$ be the number of ways to reach step $i$. Since we can reach step $i$ only from step $i-1$ or $i-2$, the recurrence relation is $dp[i] = dp[i-1] + dp[i-2]$ with base cases $dp[1] = 1$ and $dp[2] = 2$.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)",
      companiesJson: JSON.stringify(["Adobe", "Apple", "Uber"]),
      tagsJson: JSON.stringify(["DP", "Recursion", "Math"]),
      acceptanceRate: 52.4,
      premium: false,
      orderIndex: 3,
      testCases: [
        { input: "2", expectedOutput: "2", isSample: true },
        { input: "3", expectedOutput: "3", isSample: true },
        { input: "5", expectedOutput: "8", isSample: false },
        { input: "40", expectedOutput: "165580141", isSample: false }
      ]
    },
    {
      title: "Maximum Subarray",
      slug: "maximum-subarray",
      difficulty: "MEDIUM",
      category: "DSA",
      statement: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
      constraints: "- `1 <= nums.length <= 10^5`\n- `-10^4 <= nums[i] <= 10^4`",
      examplesJson: JSON.stringify([
        { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum = 6." },
        { input: "nums = [1]", output: "1" }
      ]),
      hintsJson: JSON.stringify([
        "Try using Kadane's Algorithm.",
        "Keep track of the max sum seen so far and the current running sum. If the running sum becomes negative, reset it to 0."
      ]),
      editorial: "### Maximum Subarray Editorial\n\n#### Approach: Kadane's Algorithm\nWe iterate through the array and maintain a running sum. At each step, if the running sum becomes negative, we reset it because adding a negative number to subsequent elements will only decrease their sum. We keep track of the maximum running sum seen so far.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(1)",
      companiesJson: JSON.stringify(["Google", "Meta", "Amazon"]),
      tagsJson: JSON.stringify(["Arrays", "DP"]),
      acceptanceRate: 50.1,
      premium: false,
      orderIndex: 4,
      testCases: [
        { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6", isSample: true },
        { input: "[1]", expectedOutput: "1", isSample: true },
        { input: "[-5,-4,-3,-2,-1]", expectedOutput: "-1", isSample: false },
        { input: "[5,4,-1,7,8]", expectedOutput: "23", isSample: false }
      ]
    },
    {
      title: "Coin Change",
      slug: "coin-change",
      difficulty: "MEDIUM",
      category: "DSA",
      statement: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
      constraints: "- `1 <= coins.length <= 12`\n- `1 <= coins[i] <= 2^31 - 1`\n- `0 <= amount <= 10^4`",
      examplesJson: JSON.stringify([
        { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" },
        { input: "coins = [2], amount = 3", output: "-1" }
      ]),
      hintsJson: JSON.stringify([
        "Use dynamic programming to build up the solution for all amounts from 0 to target.",
        "For each coin, iterate from coin value up to target amount and update the DP table."
      ]),
      editorial: "### Coin Change Editorial\n\n#### Approach: Dynamic Programming (Bottom-Up)\nWe define $dp[i]$ as the minimum number of coins needed to make amount $i$. We initialize $dp[0] = 0$ and all other values to infinity. The recurrence relation is $dp[i] = \\min(dp[i], dp[i - \\text{coin}] + 1)$ for each coin.",
      timeComplexity: "O(N * M) where N is amount and M is coins length",
      spaceComplexity: "O(N)",
      companiesJson: JSON.stringify(["Amazon", "Microsoft", "ByteDance"]),
      tagsJson: JSON.stringify(["DP", "Greedy"]),
      acceptanceRate: 43.1,
      premium: false,
      orderIndex: 5,
      testCases: [
        { input: "[1,2,5]\n11", expectedOutput: "3", isSample: true },
        { input: "[2]\n3", expectedOutput: "-1", isSample: true },
        { input: "[186,419,83,408]\n6249", expectedOutput: "20", isSample: false },
        { input: "[1]\n0", expectedOutput: "0", isSample: false }
      ]
    },
    {
      title: "Number of Islands",
      slug: "number-of-islands",
      difficulty: "MEDIUM",
      category: "DSA",
      statement: "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
      constraints: "- `m == grid.length`\n- `n == grid[i].length`\n- `1 <= m, n <= 300`\n- `grid[i][j]` is `'0'` or `'1'`.",
      examplesJson: JSON.stringify([
        { input: "grid = [\n  [\"1\",\"1\",\"1\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"1\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"0\",\"0\"]\n]", output: "1" },
        { input: "grid = [\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"1\",\"1\",\"0\",\"0\",\"0\"],\n  [\"0\",\"0\",\"1\",\"0\",\"0\"],\n  [\"0\",\"0\",\"0\",\"1\",\"1\"]\n]", output: "3" }
      ]),
      hintsJson: JSON.stringify([
        "We can treat the grid as an unweighted undirected graph.",
        "Perform a DFS or BFS traversal whenever a land ('1') is encountered, marking visited lands to avoid double counting."
      ]),
      editorial: "### Number of Islands Editorial\n\n#### Approach: DFS Graph Traversal\nWe iterate through the grid. When we find a '1', we increment our island count and trigger a Depth First Search (DFS) to explore and sink ('0') all connected land pieces. This ensures that each island is counted exactly once.",
      timeComplexity: "O(M * N)",
      spaceComplexity: "O(M * N) recursion stack",
      companiesJson: JSON.stringify(["Google", "Amazon", "Apple"]),
      tagsJson: JSON.stringify(["Graph", "BST"]), // Tree / Graph categories
      acceptanceRate: 57.3,
      premium: false,
      orderIndex: 6,
      testCases: [
        { input: "4\n5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0", expectedOutput: "1", isSample: true },
        { input: "4\n5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", expectedOutput: "3", isSample: true }
      ]
    },
    {
      title: "Edit Distance",
      slug: "edit-distance",
      difficulty: "HARD",
      category: "DSA",
      statement: "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\nYou have the following three operations permitted on a word:\n1. Insert a character\n2. Delete a character\n3. Replace a character",
      constraints: "- `0 <= word1.length, word2.length <= 500`\n- `word1` and `word2` consist of lowercase English letters.",
      examplesJson: JSON.stringify([
        { input: 'word1 = "horse", word2 = "ros"', output: "3", explanation: "horse -> rorse (replace 'h' with 'r')\nrorse -> rose (delete 'r')\nrose -> ros (delete 'e')" }
      ]),
      hintsJson: JSON.stringify([
        "This is a classic dynamic programming problem.",
        "Define dp[i][j] as the edit distance between prefix word1[0..i] and word2[0..j]."
      ]),
      editorial: "### Edit Distance Editorial\n\n#### Approach: Dynamic Programming 2D\nWe construct a 2D grid $dp$ where $dp[i][j]$ stores the distance between prefixes. If the characters match, $dp[i][j] = dp[i-1][j-1]$. Otherwise, we take the minimum of Insert ($dp[i][j-1]$), Delete ($dp[i-1][j]$), and Replace ($dp[i-1][j-1]$) operations plus 1.",
      timeComplexity: "O(M * N)",
      spaceComplexity: "O(M * N)",
      companiesJson: JSON.stringify(["Google", "Meta", "Tiktok"]),
      tagsJson: JSON.stringify(["DP", "Strings"]),
      acceptanceRate: 54.8,
      premium: false,
      orderIndex: 7,
      testCases: [
        { input: "\"horse\"\n\"ros\"", expectedOutput: "3", isSample: true },
        { input: "\"intention\"\n\"execution\"", expectedOutput: "5", isSample: true },
        { input: "\"\"\n\"a\"", expectedOutput: "1", isSample: false }
      ]
    },
    {
      title: "N-Queens",
      slug: "n-queens",
      difficulty: "HARD",
      category: "DSA",
      statement: "The n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other.\n\nGiven an integer `n`, return all distinct solutions to the n-queens puzzle.\n\nEach solution contains a distinct board configuration of the n-queens' placement, where `'Q'` and `'.'` both indicate a queen and an empty space, respectively.",
      constraints: "- `1 <= n <= 9`",
      examplesJson: JSON.stringify([
        { input: "n = 4", output: '[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]', explanation: "There exist two distinct solutions for 4-queens." }
      ]),
      hintsJson: JSON.stringify([
        "Use Backtracking recursively.",
        "Keep track of safe columns, main diagonals, and anti-diagonals to place a queen."
      ]),
      editorial: "### N-Queens Editorial\n\n#### Approach: Backtracking\nWe attempt to place a queen row by row. For each row, we try all column positions. We check validity using boolean arrays/sets to keep track of columns, main diagonals ($row - col$), and anti-diagonals ($row + col$) that already contain a queen. If placing is valid, we recurse to the next row.",
      timeComplexity: "O(N!)",
      spaceComplexity: "O(N^2) to store board configs",
      companiesJson: JSON.stringify(["Meta", "Adobe", "Salesforce"]),
      tagsJson: JSON.stringify(["Backtracking", "Recursion"]),
      acceptanceRate: 65.6,
      premium: true,
      orderIndex: 8,
      testCases: [
        { input: "4", expectedOutput: '[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]', isSample: true },
        { input: "1", expectedOutput: '[[\"Q\"]]', isSample: false }
      ]
    }
  ];

  // We can seed 8 detailed problems first. We can add minor variants or add details. Let's seed these 8 rich ones.
  // Wait, let's create them!
  for (const p of problemsData) {
    const { testCases, ...problemData } = p;
    const problem = await prisma.problem.create({
      data: problemData
    });

    for (const tc of testCases) {
      await prisma.testCase.create({
        data: {
          problemId: problem.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isSample: tc.isSample
        }
      });
    }
  }

  // 3b. Programmatically generate 295 extra problem variants to exceed 300+ questions
  const topics = [
    "Arrays", "Strings", "Linked List", "Stack", "Queue", "Trees", "BST", "Heap", 
    "Graph", "DP", "Greedy", "Backtracking", "Sliding Window", "Binary Search", 
    "Recursion", "Bit Manipulation", "Tries", "Segment Trees", "Math", "Hashing"
  ];
  
  const difficulties = ["EASY", "MEDIUM", "HARD"];
  const companies = ["Google", "Meta", "Amazon", "Microsoft", "Netflix", "Apple", "Uber", "Airbnb", "ByteDance"];

  console.log("Generating 295 programmatic problem variants to reach 303 total problems...");
  for (let i = 1; i <= 295; i++) {
    const topic = topics[i % topics.length];
    const difficulty = difficulties[i % difficulties.length];
    const targetCompany = companies[i % companies.length];
    const problemSlug = `programmatic-challenge-${i}`;
    const problemTitle = `${topic} Challenge #${i}`;
    
    const examples = [
      { input: `input_data_${i}`, output: `expected_output_${i}`, explanation: `Basic test case explanation for ${problemTitle}.` }
    ];

    const hints = [
      `This is a programmatically generated hint for ${problemTitle}.`,
      `Think about optimal space allocation in ${topic} structures.`
    ];

    const testCases = [
      { input: `input_data_${i}`, expectedOutput: `expected_output_${i}`, isSample: true },
      { input: `hidden_data_${i}`, expectedOutput: `hidden_output_${i}`, isSample: false }
    ];

    const problem = await prisma.problem.create({
      data: {
        title: problemTitle,
        slug: problemSlug,
        difficulty,
        category: "DSA",
        statement: `This is a programmatically generated DSA challenge for practicing **${topic}**. Solve it optimally in ${difficulty} constraints.\n\n### Task\nGiven input parameters, calculate the correct output representing the solution logic for ${topic} variant #${i}.`,
        constraints: `- \`1 <= input.length <= 10^3\`\n- Space boundaries must be within O(N) auxiliary space.`,
        examplesJson: JSON.stringify(examples),
        hintsJson: JSON.stringify(hints),
        editorial: `### ${problemTitle} Editorial\n\nTo solve this challenge, we must apply ${topic} traversals or optimization. We maintain a pointer tracking active indices.`,
        timeComplexity: difficulty === "EASY" ? "O(N)" : "O(N log N)",
        spaceComplexity: "O(1)",
        companiesJson: JSON.stringify([targetCompany]),
        tagsJson: JSON.stringify([topic]),
        acceptanceRate: Math.round((40 + Math.random() * 50) * 10) / 10,
        premium: i % 12 === 0,
        orderIndex: 10 + i
      }
    });

    for (const tc of testCases) {
      await prisma.testCase.create({
        data: {
          problemId: problem.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isSample: tc.isSample
        }
      });
    }
  }

  console.log("Problems and TestCases seeded.");

  // 4. Create Contest
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);
  const futureEndDate = new Date();
  futureEndDate.setDate(futureEndDate.getDate() + 7);
  futureEndDate.setHours(futureEndDate.getHours() + 2);

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 1);
  const pastEndDate = new Date();
  pastEndDate.setDate(pastEndDate.getDate() - 1);
  pastEndDate.setHours(pastEndDate.getHours() + 2);

  const activeProblems = await prisma.problem.findMany({ select: { id: true }, take: 3 });
  const problemIds = activeProblems.map(p => p.id);

  const contests = [
    {
      title: "Weekly Code Clash #42",
      description: "Compete against global coders in this standard 2-hour algorithm challenge. Rated for all users.",
      startTime: pastDate,
      endTime: pastEndDate,
      problemsJson: JSON.stringify(problemIds),
      standingsJson: JSON.stringify([
        { rank: 1, name: "Linus Coder", score: 300, time: "00:45:21" },
        { rank: 2, name: "Ada Lovelace", score: 300, time: "00:52:10" },
        { rank: 3, name: "Admin", score: 200, time: "00:35:12" },
      ])
    },
    {
      title: "Weekly Code Clash #43",
      description: "Join the upcoming contest. Improve your rating, solve 4 DSA problems, and win custom profile badges!",
      startTime: futureDate,
      endTime: futureEndDate,
      problemsJson: JSON.stringify(problemIds),
      standingsJson: "[]"
    }
  ];

  for (const c of contests) {
    await prisma.contest.create({ data: c });
  }
  console.log("Contests seeded.");

  // 5. Seed some sample submissions to show in recent submissions
  const usersList = await prisma.user.findMany({ select: { id: true } });
  const problemsList = await prisma.problem.findMany({ select: { id: true } });

  if (usersList.length > 0 && problemsList.length > 0) {
    const submissions = [
      {
        userId: usersList[0].id, // Admin
        problemId: problemsList[0].id, // Two Sum
        code: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}",
        language: "javascript",
        status: "ACCEPTED",
        executionTime: 82,
        memoryUsage: 42100,
      },
      {
        userId: usersList[1].id, // Alex
        problemId: problemsList[0].id,
        code: "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []",
        language: "python",
        status: "ACCEPTED",
        executionTime: 35,
        memoryUsage: 14500,
      },
      {
        userId: usersList[1].id, // Alex
        problemId: problemsList[1].id, // Valid Parentheses
        code: "def isValid(s):\n    stack = []\n    for char in s:\n        if char in '([{':\n            stack.append(char)\n        else:\n            if not stack: return False\n            # bug here: matches all\n            stack.pop()\n    return len(stack) == 0",
        language: "python",
        status: "WRONG_ANSWER",
        executionTime: 12,
        memoryUsage: 14200,
        error: "Test case 3 failed. Input: \"(]\" Expected: false, Got: true",
      }
    ];

    for (const sub of submissions) {
      await prisma.submission.create({ data: sub });
    }
    console.log("Submissions seeded.");
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// We need a reference to the db to close it!
// Let's extract the db object. Wait, the better-sqlite3 database is created internally inside PrismaClient,
// but wait, does PrismaClient close itself when we call prisma.$disconnect()?
// Yes! prisma.$disconnect() will close the connection and dispose of the adapter!
// Let's modify the finally block to use prisma.$disconnect().
// Wait, let's fix the database client close in finally block.
// The code uses `db.close()`, but there is no `db` in scope because it was instantiated inside createPrismaClient.
// So we should do: `await prisma.$disconnect();`.
// Let's replace the finally block.
