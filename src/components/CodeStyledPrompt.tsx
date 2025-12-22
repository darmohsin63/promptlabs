import { useMemo } from "react";
import logo from "@/assets/logo.png";

interface CodeStyledPromptProps {
  content: string;
  className?: string;
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

export function CodeStyledPrompt({ content, className = "" }: CodeStyledPromptProps) {
  const tokenizedContent = useMemo(() => {
    const lines = content.split("\n");
    
    return lines.map((line, lineIndex) => {
      // Tokenize the line - split by spaces but keep punctuation attached
      const tokens: JSX.Element[] = [];
      const words = line.split(/(\s+)/);
      
      words.forEach((word, wordIndex) => {
        const cleanWord = word.toLowerCase().replace(/[.,!?;:()[\]{}'"<>]/g, "");
        let colorClass = tokenColors.default;

        // Check word categories
        if (actionWords.includes(cleanWord)) {
          colorClass = tokenColors.action;
        } else if (descriptorWords.includes(cleanWord)) {
          colorClass = tokenColors.descriptor;
        } else if (objectWords.includes(cleanWord)) {
          colorClass = tokenColors.object;
        } else if (qualityWords.includes(cleanWord)) {
          colorClass = tokenColors.quality;
        } else if (connectorWords.includes(cleanWord)) {
          colorClass = tokenColors.connector;
        } else if (emotionWords.includes(cleanWord)) {
          colorClass = tokenColors.emotion;
        } else if (styleWords.includes(cleanWord)) {
          colorClass = tokenColors.style;
        }

        tokens.push(
          <span key={wordIndex} className={colorClass}>
            {word}
          </span>
        );
      });

      return (
        <div key={lineIndex} className="flex hover:bg-muted/30 dark:hover:bg-white/5 transition-colors">
          <span className="w-8 md:w-10 text-right pr-3 text-muted-foreground/50 select-none text-xs md:text-sm border-r border-border/50 mr-3">
            {lineIndex + 1}
          </span>
          <span className="flex-1">{tokens}</span>
        </div>
      );
    });
  }, [content]);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border shadow-lg ${className}`}>
      {/* Title bar with logo */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/80 dark:bg-[#2D2D2D] border-b border-border">
        <img src={logo} alt="PromptHub" className="w-5 h-5 rounded object-contain" />
        <span className="text-xs text-muted-foreground ml-1 font-mono">darmohsin63.txt</span>
      </div>
      
      {/* Code content with themed background */}
      <div className="bg-background dark:bg-[#1E1E1E] p-4 max-h-[12rem] overflow-y-auto overflow-x-hidden">
        <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
          <code className="block">{tokenizedContent}</code>
        </pre>
      </div>

      {/* Subtle border glow */}
      <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-inset ring-border/50" />
    </div>
  );
}
