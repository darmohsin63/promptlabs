export function AnimatedLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-background/50">
      <div className="flex items-center">
        {/* Circle loader */}
        <div className="shape-loader">
          <svg viewBox="0 0 80 80">
            <circle r="32" cy="40" cx="40"></circle>
          </svg>
        </div>

        {/* Triangle loader */}
        <div className="shape-loader shape-loader--triangle">
          <svg viewBox="0 0 86 80">
            <polygon points="43 8 79 72 7 72"></polygon>
          </svg>
        </div>

        {/* Rectangle loader */}
        <div className="shape-loader">
          <svg viewBox="0 0 80 80">
            <rect height="64" width="64" y="8" x="8"></rect>
          </svg>
        </div>
      </div>
    </div>
  );
}
