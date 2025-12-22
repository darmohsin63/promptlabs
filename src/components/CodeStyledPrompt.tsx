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
  default: "text-foreground",      // Default text color
};

// Action verbs (red)
const actionWords = [
  "create", "generate", "make", "write", "design", "build", "develop",
  "add", "show", "display", "render", "draw", "paint", "capture",
  "imagine", "visualize", "depict", "illustrate", "portray", "compose",
  "leaning", "looking", "covering", "crossed", "visible", "standing",
  "sitting", "walking", "running", "holding", "wearing"
];

// Descriptive words (blue)
const descriptorWords = [
  "beautiful", "stunning", "elegant", "modern", "classic", "vintage",
  "dramatic", "subtle", "bold", "soft", "sharp", "smooth", "rough",
  "young", "old", "tall", "short", "dark", "light", "bright", "dim",
  "cinematic", "artistic", "professional", "natural", "artificial"
];

// Objects/things (purple)
const objectWords = [
  "portrait", "image", "photo", "picture", "scene", "background",
  "man", "woman", "person", "face", "eyes", "hair", "hands", "body",
  "chair", "table", "window", "door", "wall", "floor", "room",
  "camera", "lens", "light", "shadow", "color", "texture"
];

// Quality words (yellow/gold)
const qualityWords = [
  "high", "low", "ultra", "extreme", "maximum", "minimum",
  "resolution", "quality", "detail", "contrast", "saturation",
  "warm", "cool", "neutral", "vivid", "muted", "rich", "deep",
  "curly", "straight", "wavy", "smooth", "textured"
];

// Connector words (cyan)
const connectorWords = [
  "with", "and", "or", "but", "the", "a", "an", "in", "on", "at",
  "by", "for", "from", "to", "of", "over", "under", "between",
  "toward", "towards", "into", "onto", "upon", "within"
];

// Emotion/mood words (green)
const emotionWords = [
  "moody", "happy", "sad", "angry", "calm", "peaceful", "intense",
  "romantic", "mysterious", "dramatic", "serene", "energetic",
  "melancholic", "joyful", "somber", "vibrant", "atmospheric"
];

// Style words (orange)
const styleWords = [
  "realistic", "abstract", "minimalist", "maximalist", "surreal",
  "photorealistic", "artistic", "commercial", "editorial", "fashion",
  "wooden", "metal", "glass", "fabric", "leather", "stone",
  "cane-woven", "handcrafted", "rustic", "contemporary"
];

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

// Split content into display lines with random blank lines for code feel
const splitIntoDisplayLines = (content: string, wordsPerLine: number = 7): string[] => {
  const words = content.split(/\s+/);
  const lines: string[] = [];
  let wordIndex = 0;
  
  while (wordIndex < words.length) {
    lines.push(words.slice(wordIndex, wordIndex + wordsPerLine).join(" "));
    wordIndex += wordsPerLine;
    
    // Add random blank line (roughly 30% chance, but not on last line)
    if (wordIndex < words.length && Math.random() < 0.3) {
      lines.push("");
    }
  }
  
  return lines;
};

export function CodeStyledPrompt({ content, className = "", allowCopy = true }: CodeStyledPromptProps) {
  const displayLines = useMemo(() => splitIntoDisplayLines(content, 7), [content]);

  const tokenizedContent = useMemo(() => {
    return displayLines.map((line, lineIndex) => {
      // Empty line
      if (line === "") {
        return (
          <div key={lineIndex} className="flex h-5">
            <span className="w-10 md:w-12 text-right pr-4 text-muted-foreground/40 text-xs border-r border-border/30 mr-4 font-mono">
              {lineIndex + 1}
            </span>
            <span className="flex-1"></span>
          </div>
        );
      }

      const words = line.split(" ");
      
      const tokens = words.map((word, wordIndex) => (
        <span key={wordIndex}>
          <span className={getColorClass(word)}>{word}</span>
          {wordIndex < words.length - 1 && <span> </span>}
        </span>
      ));

      return (
        <div key={lineIndex} className="flex hover:bg-muted/20 dark:hover:bg-white/5 transition-colors min-h-[1.5rem]">
          <span className="w-10 md:w-12 text-right pr-4 text-muted-foreground/40 text-xs border-r border-border/30 mr-4 font-mono flex-shrink-0">
            {lineIndex + 1}
          </span>
          <span className="flex-1 pl-1">{tokens}</span>
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
      
      {/* Code content - always prevent selection and copy */}
      <div 
        className="bg-background dark:bg-[#1E1E1E] p-4 max-h-[14rem] overflow-y-auto overflow-x-hidden select-none"
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        onCopy={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <pre className="font-mono text-sm leading-relaxed">
          <code className="block">{tokenizedContent}</code>
        </pre>
      </div>

      {/* Subtle border glow */}
      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-border/50" />
    </div>
  );
}
