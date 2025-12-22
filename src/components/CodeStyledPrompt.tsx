import { useMemo } from "react";

interface CodeStyledPromptProps {
  content: string;
  className?: string;
}

// VS Code-inspired color tokens
const tokenColors = {
  keyword: "text-[#C586C0]",      // Purple/Pink - keywords
  string: "text-[#CE9178]",        // Orange - strings
  variable: "text-[#9CDCFE]",      // Light blue - variables
  function: "text-[#DCDCAA]",      // Yellow - functions
  comment: "text-[#6A9955]",       // Green - comments
  number: "text-[#B5CEA8]",        // Light green - numbers
  operator: "text-[#D4D4D4]",      // Gray - operators
  bracket: "text-[#FFD700]",       // Gold - brackets
  type: "text-[#4EC9B0]",          // Teal - types
  property: "text-[#9CDCFE]",      // Light blue - properties
  default: "text-[#D4D4D4]",       // Default gray
};

// Keywords to highlight
const keywords = [
  "create", "generate", "make", "write", "design", "build", "develop",
  "add", "include", "use", "using", "with", "for", "from", "to", "the",
  "a", "an", "in", "on", "at", "by", "as", "of", "is", "are", "be",
  "should", "must", "will", "would", "can", "could", "may", "might",
  "please", "ensure", "provide", "describe", "explain", "list", "show",
  "if", "then", "else", "when", "while", "and", "or", "not", "but",
  "style", "format", "output", "input", "response", "result"
];

// Function-like words
const functions = [
  "imagine", "think", "consider", "analyze", "summarize", "translate",
  "convert", "transform", "optimize", "improve", "enhance", "modify",
  "update", "change", "fix", "correct", "review", "check", "validate"
];

// Type-like words
const types = [
  "image", "text", "code", "json", "html", "css", "javascript", "python",
  "api", "data", "file", "document", "table", "list", "array", "object",
  "string", "number", "boolean", "null", "undefined"
];

export function CodeStyledPrompt({ content, className = "" }: CodeStyledPromptProps) {
  const tokenizedContent = useMemo(() => {
    const lines = content.split("\n");
    
    return lines.map((line, lineIndex) => {
      // Check if line is a comment (starts with # or //)
      if (line.trim().startsWith("#") || line.trim().startsWith("//")) {
        return (
          <div key={lineIndex} className="flex">
            <span className="w-8 md:w-12 text-right pr-3 md:pr-4 text-muted-foreground/50 select-none text-xs md:text-sm">
              {lineIndex + 1}
            </span>
            <span className={tokenColors.comment}>{line}</span>
          </div>
        );
      }

      // Tokenize the line
      const tokens: JSX.Element[] = [];
      const words = line.split(/(\s+|[.,!?;:()[\]{}'"<>])/);
      
      words.forEach((word, wordIndex) => {
        const lowerWord = word.toLowerCase();
        let colorClass = tokenColors.default;

        // Check for quoted strings
        if (word.startsWith('"') || word.startsWith("'") || word.startsWith("`")) {
          colorClass = tokenColors.string;
        }
        // Check for numbers
        else if (/^\d+$/.test(word)) {
          colorClass = tokenColors.number;
        }
        // Check for brackets
        else if (/^[()[\]{}]$/.test(word)) {
          colorClass = tokenColors.bracket;
        }
        // Check for operators
        else if (/^[+\-*/%=<>!&|^~]+$/.test(word)) {
          colorClass = tokenColors.operator;
        }
        // Check for keywords
        else if (keywords.includes(lowerWord)) {
          colorClass = tokenColors.keyword;
        }
        // Check for functions
        else if (functions.includes(lowerWord)) {
          colorClass = tokenColors.function;
        }
        // Check for types
        else if (types.includes(lowerWord)) {
          colorClass = tokenColors.type;
        }
        // Check for words ending with colon (like labels)
        else if (word.endsWith(":")) {
          colorClass = tokenColors.property;
        }
        // Check for words in ALL CAPS (like constants)
        else if (word.length > 1 && word === word.toUpperCase() && /[A-Z]/.test(word)) {
          colorClass = tokenColors.variable;
        }

        tokens.push(
          <span key={wordIndex} className={colorClass}>
            {word}
          </span>
        );
      });

      return (
        <div key={lineIndex} className="flex hover:bg-white/5 transition-colors">
          <span className="w-8 md:w-12 text-right pr-3 md:pr-4 text-muted-foreground/50 select-none text-xs md:text-sm border-r border-white/10 mr-3 md:mr-4">
            {lineIndex + 1}
          </span>
          <span className="flex-1">{tokens}</span>
        </div>
      );
    });
  }, [content]);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* VS Code-like title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#323233] border-b border-white/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27CA40]" />
        </div>
        <span className="text-xs text-muted-foreground/70 ml-2 font-mono">prompt.txt</span>
      </div>
      
      {/* Code content */}
      <div className="bg-[#1E1E1E] p-4 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed">
          <code className="block">{tokenizedContent}</code>
        </pre>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-white/10" />
    </div>
  );
}
