import { useMemo } from "react";
import logo from "@/assets/logo.png";

interface CodeStyledPromptProps {
  content: string;
  className?: string;
  allowCopy?: boolean;
}

// Vibrant color palette - 7 distinct colors
const tokenColors = {
  action: "text-[#E06C75]",        // Red - action verbs
  descriptor: "text-[#61AFEF]",    // Blue - descriptive words
  object: "text-[#C678DD]",        // Purple - objects/things
  quality: "text-[#E5C07B]",       // Yellow/Gold - qualities
  connector: "text-[#56B6C2]",     // Cyan - connectors
  emotion: "text-[#98C379]",       // Green - emotions/mood
  style: "text-[#D19A66]",         // Orange - style words
  symbol: "text-[#ABB2BF]",        // Gray - symbols
  string: "text-[#98C379]",        // Green - strings
  default: "text-foreground",      // Default text color
};

// Word categories
const actionWords = ["create", "generate", "make", "write", "design", "build", "develop", "add", "show", "display", "render", "draw", "paint", "capture", "imagine", "visualize", "depict", "illustrate", "portray", "compose", "leaning", "looking", "covering", "crossed", "visible", "standing", "sitting", "walking", "running", "holding", "wearing"];
const descriptorWords = ["beautiful", "stunning", "elegant", "modern", "classic", "vintage", "dramatic", "subtle", "bold", "soft", "sharp", "smooth", "rough", "young", "old", "tall", "short", "dark", "light", "bright", "dim", "cinematic", "artistic", "professional", "natural", "artificial"];
const objectWords = ["portrait", "image", "photo", "picture", "scene", "background", "man", "woman", "person", "face", "eyes", "hair", "hands", "body", "chair", "table", "window", "door", "wall", "floor", "room", "camera", "lens", "light", "shadow", "color", "texture"];
const qualityWords = ["high", "low", "ultra", "extreme", "maximum", "minimum", "resolution", "quality", "detail", "contrast", "saturation", "warm", "cool", "neutral", "vivid", "muted", "rich", "deep", "curly", "straight", "wavy", "smooth", "textured"];
const connectorWords = ["with", "and", "or", "but", "the", "a", "an", "in", "on", "at", "by", "for", "from", "to", "of", "over", "under", "between", "toward", "towards", "into", "onto", "upon", "within"];
const emotionWords = ["moody", "happy", "sad", "angry", "calm", "peaceful", "intense", "romantic", "mysterious", "dramatic", "serene", "energetic", "melancholic", "joyful", "somber", "vibrant", "atmospheric"];
const styleWords = ["realistic", "abstract", "minimalist", "maximalist", "surreal", "photorealistic", "artistic", "commercial", "editorial", "fashion", "wooden", "metal", "glass", "fabric", "leather", "stone", "cane-woven", "handcrafted", "rustic", "contemporary"];

const getColorClass = (word: string) => {
  const cleanWord = word.toLowerCase().replace(/[.,!?;:()[\]{}'"<>]/g, "");
  if (actionWords.includes(cleanWord)) return tokenColors.action;
  if (descriptorWords.includes(cleanWord)) return tokenColors.descriptor;
  if (objectWords.includes(cleanWord)) return tokenColors.object;
  if (qualityWords.includes(cleanWord)) return tokenColors.quality;
  if (connectorWords.includes(cleanWord)) return tokenColors.connector;
  if (emotionWords.includes(cleanWord)) return tokenColors.emotion;
  if (styleWords.includes(cleanWord)) return tokenColors.style;
  return tokenColors.default;
};

// Convert content to code-like format with syntax
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
  
  let wordIndex = 0;
  let isInFunction = false;
  let lineCount = 0;
  
  while (wordIndex < words.length) {
    const chunk = words.slice(wordIndex, wordIndex + wordsPerLine);
    let line = "";
    
    // Add code-like formatting based on position
    if (lineCount === 0) {
      // First line - function declaration style
      line = `prompt.create({`;
      isInFunction = true;
    } else if (wordIndex + wordsPerLine >= words.length) {
      // Last content line
      line = `  "${chunk.join(" ")}"`;
      lines.push(line);
      lines.push(`});`);
      break;
    } else {
      // Middle lines - property style
      const propName = chunk[0]?.toLowerCase().replace(/[^a-z]/g, "") || "desc";
      const restWords = chunk.slice(1).join(" ");
      
      if (seededRandom() > 0.7) {
        // Object property style
        line = `  ${propName}: "${restWords}",`;
      } else if (seededRandom() > 0.5) {
        // String continuation
        line = `  "${chunk.join(" ")}" +`;
      } else {
        // Array item style
        line = `  ["${chunk.join(" ")}"],`;
      }
    }
    
    lines.push(line);
    wordIndex += wordsPerLine;
    lineCount++;
    
    // Random blank line
    if (seededRandom() > 0.75 && wordIndex < words.length - wordsPerLine) {
      lines.push("");
    }
  }
  
  return lines;
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

      // Tokenize line with syntax highlighting
      const tokens: JSX.Element[] = [];
      let i = 0;
      let currentWord = "";
      
      while (i < line.length) {
        const char = line[i];
        
        // Check for symbols
        if ('{}[]();:,+"\''.includes(char)) {
          // Push current word if exists
          if (currentWord) {
            tokens.push(
              <span key={`word-${i}`} className={getColorClass(currentWord)}>{currentWord}</span>
            );
            currentWord = "";
          }
          // Push symbol
          tokens.push(
            <span key={`sym-${i}`} className={tokenColors.symbol}>{char}</span>
          );
        } else if (char === " ") {
          if (currentWord) {
            tokens.push(
              <span key={`word-${i}`} className={getColorClass(currentWord)}>{currentWord}</span>
            );
            currentWord = "";
          }
          tokens.push(<span key={`space-${i}`}> </span>);
        } else {
          currentWord += char;
        }
        i++;
      }
      
      // Push remaining word
      if (currentWord) {
        tokens.push(
          <span key={`word-end`} className={getColorClass(currentWord)}>{currentWord}</span>
        );
      }

      return (
        <div key={lineIndex} className="flex hover:bg-muted/20 dark:hover:bg-white/5 transition-colors min-h-[1.5rem]">
          <span className="w-10 md:w-12 text-right pr-4 text-muted-foreground/40 text-xs border-r border-border/30 mr-4 font-mono flex-shrink-0">
            {lineIndex + 1}
          </span>
          <span className="flex-1 pl-1 break-words">{tokens}</span>
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
