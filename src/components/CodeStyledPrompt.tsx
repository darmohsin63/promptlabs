import { useMemo } from "react";
import logo from "@/assets/logo.png";

interface CodeStyledPromptProps {
  content: string;
  className?: string;
}

// Vibrant color palette
const tokenColors = {
  keyword: "text-[#C678DD]",       // Purple - keywords
  function: "text-[#61AFEF]",      // Blue - functions
  string: "text-[#98C379]",        // Green - strings
  property: "text-[#E06C75]",      // Red - properties
  number: "text-[#D19A66]",        // Orange - numbers
  comment: "text-[#5C6370]",       // Gray - comments
  tag: "text-[#E5C07B]",           // Yellow - tags
  symbol: "text-[#ABB2BF]",        // Light gray - symbols
  type: "text-[#56B6C2]",          // Cyan - types
  default: "text-foreground",
};

// Code keywords
const keywords = ["const", "let", "var", "function", "return", "import", "export", "from", "async", "await", "new", "class", "extends", "if", "else", "for", "while", "switch", "case", "break", "default", "try", "catch", "throw", "typeof", "instanceof"];

// Convert content to authentic code format
const formatAsCode = (content: string): string[] => {
  const words = content.split(/\s+/);
  const lines: string[] = [];
  const wordsPerLine = 5;
  
  // Seeded random for consistent display
  let seed = content.length;
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  
  // Generate random variable names
  const varNames = ["style", "scene", "subject", "mood", "lighting", "composition", "detail", "texture", "color", "atmosphere"];
  const getVar = () => varNames[Math.floor(seededRandom() * varNames.length)];
  
  let wordIndex = 0;
  
  // Header comment
  lines.push(`// @prompt-config v2.1.0`);
  lines.push(`// @author darmohsin63`);
  lines.push(`// @type image-generation`);
  lines.push(``);
  
  // Import statement
  lines.push(`import { createPrompt } from "@prompthub/core";`);
  lines.push(``);
  
  // Main function
  lines.push(`export const generateImage = async () => {`);
  lines.push(`  const config = {`);
  
  while (wordIndex < words.length) {
    const chunk = words.slice(wordIndex, wordIndex + wordsPerLine);
    const chunkText = chunk.join(" ");
    const rand = seededRandom();
    
    if (wordIndex + wordsPerLine >= words.length) {
      // Last chunk
      lines.push(`    output: "${chunkText}"`);
      break;
    } else if (rand > 0.8) {
      // Array style
      lines.push(`    ${getVar()}: ["${chunkText}"],`);
    } else if (rand > 0.6) {
      // Tagged template
      lines.push(`    ${getVar()}: \`${chunkText}\`,`);
    } else if (rand > 0.4) {
      // Object property
      lines.push(`    "${getVar()}": "${chunkText}",`);
    } else {
      // Regular string
      lines.push(`    ${getVar()}: "${chunkText}",`);
    }
    
    wordIndex += wordsPerLine;
    
    // Random blank line or comment
    if (seededRandom() > 0.7 && wordIndex < words.length - wordsPerLine) {
      if (seededRandom() > 0.5) {
        lines.push(``);
      } else {
        const comments = ["// additional styling", "// composition details", "// mood settings", "// fine-tune parameters"];
        lines.push(`    ${comments[Math.floor(seededRandom() * comments.length)]}`);
      }
    }
  }
  
  lines.push(`  };`);
  lines.push(``);
  lines.push(`  return await createPrompt(config);`);
  lines.push(`};`);
  
  return lines;
};

// Tokenize and color a line
const tokenizeLine = (line: string): JSX.Element[] => {
  const tokens: JSX.Element[] = [];
  
  // Check for comment
  if (line.trim().startsWith("//")) {
    return [<span key="comment" className={tokenColors.comment}>{line}</span>];
  }
  
  let i = 0;
  let currentToken = "";
  let inString = false;
  let stringChar = "";
  
  const pushToken = (text: string, color: string) => {
    if (text) {
      tokens.push(<span key={tokens.length} className={color}>{text}</span>);
    }
  };
  
  while (i < line.length) {
    const char = line[i];
    
    // Handle strings
    if ((char === '"' || char === "'" || char === "`") && !inString) {
      pushToken(currentToken, getTokenColor(currentToken));
      currentToken = char;
      inString = true;
      stringChar = char;
    } else if (char === stringChar && inString) {
      currentToken += char;
      pushToken(currentToken, tokenColors.string);
      currentToken = "";
      inString = false;
      stringChar = "";
    } else if (inString) {
      currentToken += char;
    } else if ('{}[]();:,=<>'.includes(char)) {
      pushToken(currentToken, getTokenColor(currentToken));
      currentToken = "";
      pushToken(char, tokenColors.symbol);
    } else if (char === " ") {
      pushToken(currentToken, getTokenColor(currentToken));
      currentToken = "";
      tokens.push(<span key={tokens.length}> </span>);
    } else {
      currentToken += char;
    }
    i++;
  }
  
  if (currentToken) {
    pushToken(currentToken, inString ? tokenColors.string : getTokenColor(currentToken));
  }
  
  return tokens;
};

const getTokenColor = (token: string): string => {
  const clean = token.trim();
  if (!clean) return tokenColors.default;
  if (keywords.includes(clean)) return tokenColors.keyword;
  if (clean.startsWith("@")) return tokenColors.tag;
  if (/^\d+$/.test(clean)) return tokenColors.number;
  if (clean === "async" || clean === "await" || clean === "export" || clean === "import" || clean === "const" || clean === "let" || clean === "return" || clean === "from") return tokenColors.keyword;
  if (clean === "createPrompt" || clean === "generateImage") return tokenColors.function;
  return tokenColors.property;
};

export function CodeStyledPrompt({ content, className = "" }: CodeStyledPromptProps) {
  const displayLines = useMemo(() => formatAsCode(content), [content]);

  const tokenizedContent = useMemo(() => {
    return displayLines.map((line, lineIndex) => {
      if (line === "") {
        return (
          <div key={lineIndex} className="flex h-5">
            <span className="w-10 md:w-12 text-right pr-4 text-muted-foreground/40 text-xs border-r border-border/30 mr-4 font-mono flex-shrink-0">
              {lineIndex + 1}
            </span>
            <span className="flex-1"></span>
          </div>
        );
      }

      const tokens = tokenizeLine(line);
      
      // Calculate indentation
      const indent = line.match(/^(\s*)/)?.[1] || "";

      return (
        <div key={lineIndex} className="flex hover:bg-muted/20 dark:hover:bg-white/5 transition-colors min-h-[1.5rem]">
          <span className="w-10 md:w-12 text-right pr-4 text-muted-foreground/40 text-xs border-r border-border/30 mr-4 font-mono flex-shrink-0">
            {lineIndex + 1}
          </span>
          <span className="flex-1 break-words whitespace-pre-wrap">{tokens}</span>
        </div>
      );
    });
  }, [displayLines]);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border shadow-lg ${className}`}>
      {/* Title bar with logo */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/80 dark:bg-[#2D2D2D] border-b border-border">
        <img src={logo} alt="PromptHub" className="w-5 h-5 rounded object-contain" />
        <span className="text-xs text-muted-foreground ml-1 font-mono">darmohsin63.txt</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground/50 font-mono">TypeScript JSX</span>
        </div>
      </div>
      
      {/* Code content - prevent selection, show 10-13 lines */}
      <div 
        className="bg-background dark:bg-[#1E1E1E] p-4 max-h-[22rem] overflow-y-auto overflow-x-hidden select-none"
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        onCopy={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
          <code className="block">{tokenizedContent}</code>
        </pre>
      </div>

      {/* Subtle border glow */}
      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-border/50" />
    </div>
  );
}
