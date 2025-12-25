import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) {
    return <div className="theme-toggle-switch" />;
  }

  return (
    <>
      <input
        id="themeToggleInput"
        type="checkbox"
        checked={isDark}
        onChange={handleToggle}
        className="theme-toggle-checkbox"
      />
      <label className="theme-toggle-switch" htmlFor="themeToggleInput">
        {/* Sorting Hat - Dark Mode */}
        <div className="theme-icon theme-icon--moon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="32"
            height="32"
          >
            {/* Hat base */}
            <path
              d="M10 52 C10 52 15 38 32 38 C49 38 54 52 54 52 L54 56 C54 58 52 60 50 60 L14 60 C12 60 10 58 10 56 Z"
              fill="#4a3728"
            />
            {/* Hat brim */}
            <ellipse cx="32" cy="56" rx="26" ry="6" fill="#3d2d1f" />
            {/* Hat cone */}
            <path
              d="M20 40 C20 40 24 8 30 4 C32 2 36 6 38 12 C42 24 48 36 48 36 C48 36 40 32 32 34 C24 36 20 40 20 40 Z"
              fill="#5c4433"
            />
            {/* Hat fold/wrinkle */}
            <path
              d="M22 38 C26 34 38 30 46 36"
              stroke="#3d2d1f"
              strokeWidth="2"
              fill="none"
            />
            {/* Face - eyes */}
            <ellipse cx="26" cy="48" rx="2" ry="3" fill="#1a1a1a" />
            <ellipse cx="38" cy="48" rx="2" ry="3" fill="#1a1a1a" />
            {/* Face - mouth */}
            <path
              d="M28 52 Q32 56 36 52"
              stroke="#1a1a1a"
              strokeWidth="2"
              fill="none"
            />
            {/* Hat tip curl */}
            <path
              d="M30 4 C28 2 24 4 26 10"
              stroke="#5c4433"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </div>

        {/* Magic Wand - Light Mode */}
        <div className="theme-icon theme-icon--sun">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="32"
            height="32"
          >
            {/* Wand body */}
            <rect
              x="28"
              y="20"
              width="8"
              height="40"
              rx="2"
              fill="#8B4513"
              transform="rotate(-30 32 40)"
            />
            {/* Wand handle */}
            <rect
              x="29"
              y="44"
              width="6"
              height="14"
              rx="1"
              fill="#5D3A1A"
              transform="rotate(-30 32 50)"
            />
            {/* Wand tip glow */}
            <circle cx="22" cy="14" r="4" fill="#FFD700" opacity="0.8" />
            <circle cx="22" cy="14" r="6" fill="#FFD700" opacity="0.4" />
            <circle cx="22" cy="14" r="8" fill="#FFD700" opacity="0.2" />
            {/* Sparkles */}
            <path
              d="M14 8 L16 12 L14 16 L12 12 Z"
              fill="#FFD700"
            />
            <path
              d="M28 6 L29 9 L28 12 L27 9 Z"
              fill="#FFD700"
            />
            <path
              d="M10 18 L12 20 L10 22 L8 20 Z"
              fill="#FFD700"
            />
            <path
              d="M18 2 L19 4 L18 6 L17 4 Z"
              fill="#FFD700"
            />
            {/* Star burst */}
            <polygon
              points="22,6 23,10 27,11 23,12 22,16 21,12 17,11 21,10"
              fill="#FFF8DC"
            />
          </svg>
        </div>
      </label>
    </>
  );
}
