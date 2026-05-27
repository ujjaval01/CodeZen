export const BOILERPLATES: Record<string, Record<string, string>> = {
  javascript: {
    "two-sum": `function twoSum(nums, target) {
  // Write your code here
  
}

// Stdin reading code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
if (input.length >= 2) {
  const nums = JSON.parse(input[0]);
  const target = parseInt(input[1]);
  console.log(JSON.stringify(twoSum(nums, target)));
}`,
    "valid-parentheses": `function isValid(s) {
  // Write your code here
  
}

// Stdin reading code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
console.log(isValid(input).toString());`,
    "climbing-stairs": `function climbStairs(n) {
  // Write your code here
  
}

// Stdin reading code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
console.log(climbStairs(parseInt(input)).toString());`,
    "maximum-subarray": `function maxSubArray(nums) {
  // Write your code here
  
}

// Stdin reading code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
console.log(maxSubArray(JSON.parse(input)).toString());`,
    "coin-change": `function coinChange(coins, amount) {
  // Write your code here
  
}

// Stdin reading code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
if (input.length >= 2) {
  const coins = JSON.parse(input[0]);
  const amount = parseInt(input[1]);
  console.log(coinChange(coins, amount).toString());
}`,
    "number-of-islands": `function numIslands(grid) {
  // Write your code here
  
}

// Stdin reading code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
if (input.length >= 2) {
  const m = parseInt(input[0]);
  const n = parseInt(input[1]);
  const grid = [];
  for (let i = 0; i < m; i++) {
    grid.push(input[i + 2].trim().split(' '));
  }
  console.log(numIslands(grid).toString());
}`,
    "edit-distance": `function minDistance(word1, word2) {
  // Write your code here
  
}

// Stdin reading code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
if (input.length >= 2) {
  const word1 = JSON.parse(input[0]);
  const word2 = JSON.parse(input[1]);
  console.log(minDistance(word1, word2).toString());
}`,
    "n-queens": `function solveNQueens(n) {
  // Write your code here
  
}

// Stdin reading code
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
console.log(JSON.stringify(solveNQueens(parseInt(input))));`,
    default: `// Write your code here and read inputs from stdin
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
console.log("Input received:", input);`
  },
  python: {
    "two-sum": `import sys
import json

def twoSum(nums, target):
    # Write your code here
    pass

# Stdin reading code
lines = sys.stdin.read().splitlines()
if len(lines) >= 2:
    nums = json.loads(lines[0])
    target = int(lines[1])
    print(json.dumps(twoSum(nums, target)))`,
    "valid-parentheses": `import sys

def isValid(s):
    # Write your code here
    pass

# Stdin reading code
s = sys.stdin.read().strip()
if s.startswith('"') and s.endswith('"'):
    s = s[1:-1]
print(str(isValid(s)).lower())`,
    "climbing-stairs": `import sys

def climbStairs(n):
    # Write your code here
    pass

# Stdin reading code
n = int(sys.stdin.read().strip())
print(climbStairs(n))`,
    "maximum-subarray": `import sys
import json

def maxSubArray(nums):
    # Write your code here
    pass

# Stdin reading code
nums = json.loads(sys.stdin.read().strip())
print(maxSubArray(nums))`,
    "coin-change": `import sys
import json

def coinChange(coins, amount):
    # Write your code here
    pass

# Stdin reading code
lines = sys.stdin.read().splitlines()
if len(lines) >= 2:
    coins = json.loads(lines[0])
    amount = int(lines[1])
    print(coinChange(coins, amount))`,
    "number-of-islands": `import sys

def numIslands(grid):
    # Write your code here
    pass

# Stdin reading code
lines = sys.stdin.read().splitlines()
if len(lines) >= 2:
    m = int(lines[0])
    n = int(lines[1])
    grid = []
    for i in range(m):
        grid.append(lines[i + 2].strip().split(' '))
    print(numIslands(grid))`,
    "edit-distance": `import sys
import json

def minDistance(word1, word2):
    # Write your code here
    pass

# Stdin reading code
lines = sys.stdin.read().splitlines()
if len(lines) >= 2:
    word1 = json.loads(lines[0])
    word2 = json.loads(lines[1])
    print(minDistance(word1, word2))`,
    "n-queens": `import sys
import json

def solveNQueens(n):
    # Write your code here
    pass

# Stdin reading code
n = int(sys.stdin.read().strip())
print(json.dumps(solveNQueens(n)))`,
    default: `# Write your code here and read inputs from sys.stdin
import sys
input_data = sys.stdin.read().strip()
print("Input received:", input_data)`
  },
  cpp: {
    "two-sum": `#include <iostream>
#include <vector>
#include <string>
#include <sstream>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
    
}

int main() {
    string line1, line2;
    if (getline(cin, line1) && getline(cin, line2)) {
        vector<int> nums;
        size_t start = line1.find('[');
        size_t end = line1.find(']');
        if (start != string::npos && end != string::npos) {
            string arrStr = line1.substr(start + 1, end - start - 1);
            stringstream ss(arrStr);
            string temp;
            while (getline(ss, temp, ',')) {
                if (!temp.empty()) nums.push_back(stoi(temp));
            }
        }
        int target = stoi(line2);
        vector<int> res = twoSum(nums, target);
        if (res.size() >= 2) {
            cout << "[" << res[0] << "," << res[1] << "]" << endl;
        } else {
            cout << "[]" << endl;
        }
    }
    return 0;
}`,
    "valid-parentheses": `#include <iostream>
#include <string>

using namespace std;

bool isValid(string s) {
    // Write your code here
    
}

int main() {
    string s;
    if (getline(cin, s)) {
        if (s.length() >= 2 && s.front() == '"' && s.back() == '"') {
            s = s.substr(1, s.length() - 2);
        }
        cout << (isValid(s) ? "true" : "false") << endl;
    }
    return 0;
}`,
    "climbing-stairs": `#include <iostream>

using namespace std;

int climbStairs(int n) {
    // Write your code here
    
}

int main() {
    int n;
    if (cin >> n) {
        cout << climbStairs(n) << endl;
    }
    return 0;
}`,
    "maximum-subarray": `#include <iostream>
#include <vector>
#include <string>
#include <sstream>

using namespace std;

int maxSubArray(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string line;
    if (getline(cin, line)) {
        vector<int> nums;
        size_t start = line.find('[');
        size_t end = line.find(']');
        if (start != string::npos && end != string::npos) {
            string arrStr = line.substr(start + 1, end - start - 1);
            stringstream ss(arrStr);
            string temp;
            while (getline(ss, temp, ',')) {
                if (!temp.empty()) nums.push_back(stoi(temp));
            }
        }
        cout << maxSubArray(nums) << endl;
    }
    return 0;
}`,
    "coin-change": `#include <iostream>
#include <vector>
#include <string>
#include <sstream>

using namespace std;

int coinChange(vector<int>& coins, int amount) {
    // Write your code here
    
}

int main() {
    string line1, line2;
    if (getline(cin, line1) && getline(cin, line2)) {
        vector<int> coins;
        size_t start = line1.find('[');
        size_t end = line1.find(']');
        if (start != string::npos && end != string::npos) {
            string arrStr = line1.substr(start + 1, end - start - 1);
            stringstream ss(arrStr);
            string temp;
            while (getline(ss, temp, ',')) {
                if (!temp.empty()) coins.push_back(stoi(temp));
            }
        }
        int amount = stoi(line2);
        cout << coinChange(coins, amount) << endl;
    }
    return 0;
}`,
    "number-of-islands": `#include <iostream>
#include <vector>

using namespace std;

int numIslands(vector<vector<char>>& grid) {
    // Write your code here
    
}

int main() {
    int m, n;
    if (cin >> m >> n) {
        vector<vector<char>> grid(m, vector<char>(n));
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                cin >> grid[i][j];
            }
        }
        cout << numIslands(grid) << endl;
    }
    return 0;
}`,
    "edit-distance": `#include <iostream>
#include <string>

using namespace std;

int minDistance(string word1, string word2) {
    // Write your code here
    
}

int main() {
    string w1, w2;
    if (getline(cin, w1) && getline(cin, w2)) {
        if (w1.length() >= 2 && w1.front() == '"' && w1.back() == '"') w1 = w1.substr(1, w1.length() - 2);
        if (w2.length() >= 2 && w2.front() == '"' && w2.back() == '"') w2 = w2.substr(1, w2.length() - 2);
        cout << minDistance(w1, w2) << endl;
    }
    return 0;
}`,
    "n-queens": `#include <iostream>
#include <vector>
#include <string>

using namespace std;

vector<vector<string>> solveNQueens(int n) {
    // Write your code here
    
}

int main() {
    int n;
    if (cin >> n) {
        vector<vector<string>> res = solveNQueens(n);
        cout << "[";
        for (size_t i = 0; i < res.size(); ++i) {
            cout << "[";
            for (size_t j = 0; j < res[i].size(); ++j) {
                cout << "\\"" << res[i][j] << "\\"";
                if (j + 1 < res[i].size()) cout << ",";
            }
            cout << "]";
            if (i + 1 < res.size()) cout << ",";
        }
        cout << "]";
    }
    return 0;
}`,
    default: `#include <iostream>
#include <string>

using namespace std;

int main() {
    string line;
    while (getline(cin, line)) {
        cout << "Input line: " << line << endl;
    }
    return 0;
}`
  },
  java: {
    "two-sum": `import java.io.*;
import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}

class SolutionDriver {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line1 = br.readLine();
        String line2 = br.readLine();
        if (line1 != null && line2 != null) {
            line1 = line1.trim().replace("[", "").replace("]", "");
            String[] tokens = line1.split(",");
            int[] nums = new int[tokens.length];
            for (int i = 0; i < tokens.length; i++) {
                nums[i] = Integer.parseInt(tokens[i].trim());
            }
            int target = Integer.parseInt(line2.trim());
            int[] result = Solution.twoSum(nums, target);
            System.out.println("[" + result[0] + "," + result[1] + "]");
        }
    }
}`,
    "valid-parentheses": `import java.io.*;

public class Solution {
    public static boolean isValid(String s) {
        // Write your code here
        
    }
}

class SolutionDriver {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String s = br.readLine();
        if (s != null) {
            s = s.trim();
            if (s.startsWith("\\"") && s.endsWith("\\"")) {
                s = s.substring(1, s.length() - 1);
            }
            System.out.println(Solution.isValid(s));
        }
    }
}`,
    "climbing-stairs": `import java.io.*;

public class Solution {
    public static int climbStairs(int n) {
        // Write your code here
        
    }
}

class SolutionDriver {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null) {
            int n = Integer.parseInt(line.trim());
            System.out.println(Solution.climbStairs(n));
        }
    }
}`,
    "maximum-subarray": `import java.io.*;

public class Solution {
    public static int maxSubArray(int[] nums) {
        // Write your code here
        
    }
}

class SolutionDriver {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null) {
            line = line.trim().replace("[", "").replace("]", "");
            String[] tokens = line.split(",");
            int[] nums = new int[tokens.length];
            for (int i = 0; i < tokens.length; i++) {
                nums[i] = Integer.parseInt(tokens[i].trim());
            }
            System.out.println(Solution.maxSubArray(nums));
        }
    }
}`,
    "coin-change": `import java.io.*;

public class Solution {
    public static int coinChange(int[] coins, int amount) {
        // Write your code here
        
    }
}

class SolutionDriver {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line1 = br.readLine();
        String line2 = br.readLine();
        if (line1 != null && line2 != null) {
            line1 = line1.trim().replace("[", "").replace("]", "");
            String[] tokens = line1.split(",");
            int[] coins = new int[tokens.length];
            for (int i = 0; i < tokens.length; i++) {
                coins[i] = Integer.parseInt(tokens[i].trim());
            }
            int amount = Integer.parseInt(line2.trim());
            System.out.println(Solution.coinChange(coins, amount));
        }
    }
}`,
    "number-of-islands": `import java.io.*;

public class Solution {
    public static int numIslands(char[][] grid) {
        // Write your code here
        
    }
}

class SolutionDriver {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line1 = br.readLine();
        String line2 = br.readLine();
        if (line1 != null && line2 != null) {
            int m = Integer.parseInt(line1.trim());
            int n = Integer.parseInt(line2.trim());
            char[][] grid = new char[m][n];
            for (int i = 0; i < m; i++) {
                String rowLine = br.readLine();
                if (rowLine != null) {
                    String[] tokens = rowLine.trim().split("\\\\s+");
                    for (int j = 0; j < n; j++) {
                        grid[i][j] = tokens[j].charAt(0);
                    }
                }
            }
            System.out.println(Solution.numIslands(grid));
        }
    }
}`,
    "edit-distance": `import java.io.*;

public class Solution {
    public static int minDistance(String word1, String word2) {
        // Write your code here
        
    }
}

class SolutionDriver {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line1 = br.readLine();
        String line2 = br.readLine();
        if (line1 != null && line2 != null) {
            String w1 = line1.trim();
            String w2 = line2.trim();
            if (w1.startsWith("\\"") && w1.endsWith("\\"")) w1 = w1.substring(1, w1.length() - 1);
            if (w2.startsWith("\\"") && w2.endsWith("\\"")) w2 = w2.substring(1, w2.length() - 1);
            System.out.println(Solution.minDistance(w1, w2));
        }
    }
}`,
    "n-queens": `import java.io.*;
import java.util.*;

public class Solution {
    public static List<List<String>> solveNQueens(int n) {
        // Write your code here
        
    }
}

class SolutionDriver {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line = br.readLine();
        if (line != null) {
            int n = Integer.parseInt(line.trim());
            List<List<String>> res = Solution.solveNQueens(n);
            StringBuilder sb = new StringBuilder();
            sb.append("[");
            for (int i = 0; i < res.size(); i++) {
                sb.append("[");
                List<String> list = res.get(i);
                for (int j = 0; j < list.size(); j++) {
                    sb.append("\\"").append(list.get(j)).append("\\"");
                    if (j + 1 < list.size()) sb.append(",");
                }
                sb.append("]");
                if (i + 1 < res.size()) sb.append(",");
            }
            sb.append("]");
            System.out.println(sb.toString());
        }
    }
}`,
    default: `import java.io.*;

public class Solution {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String line;
        while ((line = br.readLine()) != null) {
            System.out.println("Line: " + line);
        }
    }
}`
  },
  kotlin: {
    "two-sum": `import java.io.BufferedReader
import java.io.InputStreamReader

fun twoSum(nums: IntArray, target: Int): IntArray {
    // Write your code here
    
}

fun main() {
    val reader = BufferedReader(InputStreamReader(System.\`in\`))
    val line1 = reader.readLine()
    val line2 = reader.readLine()
    if (line1 != null && line2 != null) {
        val cleanLine1 = line1.trim().replace("[", "").replace("]", "")
        val nums = cleanLine1.split(",").map { it.trim().toInt() }.toIntArray()
        val target = line2.trim().toInt()
        val result = twoSum(nums, target)
        println("[\${result[0]},\${result[1]}]")
    }
}`,
    "valid-parentheses": `import java.io.BufferedReader
import java.io.InputStreamReader

fun isValid(s: String): Boolean {
    // Write your code here
    
}

fun main() {
    val reader = BufferedReader(InputStreamReader(System.\`in\`))
    var s = reader.readLine()
    if (s != null) {
        s = s.trim()
        if (s.startsWith("\\"") && s.endsWith("\\"")) {
            s = s.substring(1, s.length - 1)
        }
        println(isValid(s))
    }
}`,
    "climbing-stairs": `import java.io.BufferedReader
import java.io.InputStreamReader

fun climbStairs(n: Int): Int {
    // Write your code here
    
}

fun main() {
    val reader = BufferedReader(InputStreamReader(System.\`in\`))
    val line = reader.readLine()
    if (line != null) {
        val n = line.trim().toInt()
        println(climbStairs(n))
    }
}`,
    "maximum-subarray": `import java.io.BufferedReader
import java.io.InputStreamReader

fun maxSubArray(nums: IntArray): Int {
    // Write your code here
    
}

fun main() {
    val reader = BufferedReader(InputStreamReader(System.\`in\`))
    val line = reader.readLine()
    if (line != null) {
        val cleanLine = line.trim().replace("[", "").replace("]", "")
        val nums = cleanLine.split(",").map { it.trim().toInt() }.toIntArray()
        println(maxSubArray(nums))
    }
}`,
    "coin-change": `import java.io.BufferedReader
import java.io.InputStreamReader

fun coinChange(coins: IntArray, amount: Int): Int {
    // Write your code here
    
}

fun main() {
    val reader = BufferedReader(InputStreamReader(System.\`in\`))
    val line1 = reader.readLine()
    val line2 = reader.readLine()
    if (line1 != null && line2 != null) {
        val cleanLine1 = line1.trim().replace("[", "").replace("]", "")
        val coins = cleanLine1.split(",").map { it.trim().toInt() }.toIntArray()
        val amount = line2.trim().toInt()
        println(coinChange(coins, amount))
    }
}`,
    "number-of-islands": `import java.io.BufferedReader
import java.io.InputStreamReader

fun numIslands(grid: Array<CharArray>): Int {
    // Write your code here
    
}

fun main() {
    val reader = BufferedReader(InputStreamReader(System.\`in\`))
    val line1 = reader.readLine()
    val line2 = reader.readLine()
    if (line1 != null && line2 != null) {
        val m = line1.trim().toInt()
        val n = line2.trim().toInt()
        val grid = Array(m) { CharArray(n) }
        for (i in 0 until m) {
            val rowLine = reader.readLine()
            if (rowLine != null) {
                val tokens = rowLine.trim().split("\\\\s+".toRegex())
                for (j in 0 until n) {
                    grid[i][j] = tokens[j][0]
                }
            }
        }
        println(numIslands(grid))
    }
}`,
    "edit-distance": `import java.io.BufferedReader
import java.io.InputStreamReader

fun minDistance(word1: String, word2: String): Int {
    // Write your code here
    
}

fun main() {
    val reader = BufferedReader(InputStreamReader(System.\`in\`))
    val line1 = reader.readLine()
    val line2 = reader.readLine()
    if (line1 != null && line2 != null) {
        var w1 = line1.trim()
        var w2 = line2.trim()
        if (w1.startsWith("\\"") && w1.endsWith("\\"")) w1 = w1.substring(1, w1.length - 1)
        if (w2.startsWith("\\"") && w2.endsWith("\\"")) w2 = w2.substring(1, w2.length - 1)
        println(minDistance(w1, w2))
    }
}`,
    "n-queens": `import java.io.BufferedReader
import java.io.InputStreamReader

fun solveNQueens(n: Int): List<List<String>> {
    // Write your code here
    
}

fun main() {
    val reader = BufferedReader(InputStreamReader(System.\`in\`))
    val line = reader.readLine()
    if (line != null) {
        val n = line.trim().toInt()
        val res = solveNQueens(n)
        val sb = StringBuilder()
        sb.append("[")
        for (i in res.indices) {
            sb.append("[")
            val list = res[i]
            for (j in list.indices) {
                sb.append("\\"").append(list[j]).append("\\"")
                if (j + 1 < list.size) sb.append(",")
            }
            sb.append("]")
            if (i + 1 < res.size) sb.append(",")
        }
        sb.append("]")
        println(sb.toString())
    }
}`,
    default: `import java.io.BufferedReader
import java.io.InputStreamReader

fun main() {
    val reader = BufferedReader(InputStreamReader(System.\`in\`))
    var line: String?
    while (reader.readLine().also { line = it } != null) {
        println("Line: \$line")
    }
}`
  }
};

export function splitBoilerplate(language: string, fullCode: string) {
  const lang = language.toLowerCase();
  
  if (lang === "javascript" || lang === "typescript") {
    const idx = fullCode.indexOf("// Stdin reading code");
    if (idx !== -1) {
      return {
        userCode: fullCode.substring(0, idx).trimEnd(),
        driverCode: fullCode.substring(idx),
      };
    }
  } else if (lang === "python") {
    const idx = fullCode.indexOf("# Stdin reading code");
    if (idx !== -1) {
      return {
        userCode: fullCode.substring(0, idx).trimEnd(),
        driverCode: fullCode.substring(idx),
      };
    }
  } else if (lang === "cpp") {
    const idx = fullCode.indexOf("int main()");
    if (idx !== -1) {
      return {
        userCode: fullCode.substring(0, idx).trimEnd(),
        driverCode: fullCode.substring(idx),
      };
    }
  } else if (lang === "kotlin") {
    const idx = fullCode.indexOf("fun main()");
    if (idx !== -1) {
      return {
        userCode: fullCode.substring(0, idx).trimEnd(),
        driverCode: fullCode.substring(idx),
      };
    }
  } else if (lang === "java") {
    const idx = fullCode.indexOf("class SolutionDriver");
    if (idx !== -1) {
      return {
        userCode: fullCode.substring(0, idx).trimEnd(),
        driverCode: fullCode.substring(idx),
      };
    }
  }
  
  return {
    userCode: fullCode,
    driverCode: "",
  };
}

export function getCleanBoilerplate(language: string, slug: string): string {
  const boilerplates = BOILERPLATES[language] || BOILERPLATES.javascript;
  const fullCode = boilerplates[slug] || boilerplates.default;
  if (slug === "default") return fullCode;
  
  const { userCode } = splitBoilerplate(language, fullCode);
  return userCode;
}

export function getFullCode(language: string, slug: string, userCode: string): string {
  const boilerplates = BOILERPLATES[language] || BOILERPLATES.javascript;
  const fullCode = boilerplates[slug] || boilerplates.default;
  if (slug === "default") return userCode;
  
  const { driverCode } = splitBoilerplate(language, fullCode);
  if (!driverCode) return userCode;
  
  return `${userCode}\n\n${driverCode}`;
}
