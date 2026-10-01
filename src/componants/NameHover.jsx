import { ShimmeringText } from "@/components/shimmering-text";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import React, { useState } from "react";

const NameHover = ({ isDark }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowHint(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowHint(true);
  };

  return (
    <div className="hidden lg:block">
      <div
        className="h-64 flex items-center justify-center relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Show "Hover it" hint when not hovered */}
        {showHint && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">
              <ShimmeringText text="Hover It To See The Magic" />
            </p>
            {!isDark && (
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-2">
                Enable Dark Mode For Better Experience
              </p>
            )}
          </div>
        )}

        {/* Always show the TextHoverEffect */}
        <TextHoverEffect text="DIPANKAR" />
      </div>
    </div>
  );
};

export default NameHover;
