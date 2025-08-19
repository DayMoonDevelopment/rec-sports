// Helper function to create SVG text (for city, state)
export function createCityStateTextSVG(
  text: string,
  x: number,
  y: number,
  fontSize: number,
  maxWidth: number,
  color: string = "#333333",
): Buffer {
  // Calculate if we need to scale down the font
  let actualFontSize = fontSize;
  const estimatedWidth = text.length * fontSize * 0.6; // Rough estimation

  if (estimatedWidth > maxWidth) {
    actualFontSize = Math.floor(maxWidth / (text.length * 0.6));
    actualFontSize = Math.max(actualFontSize, 16); // Minimum font size
  }

  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <text x="${x}" y="${y}"
            font-family="Arial, sans-serif"
            font-size="${actualFontSize}px"
            font-weight="600"
            fill="${color}">
        ${text}
      </text>
    </svg>
  `;

  return Buffer.from(svg);
}

// Helper function to create location name SVG text with multi-line support
export function createLocationNameSVG(
  text: string,
  x: number,
  y: number,
  defaultFontSize: number,
  maxWidth: number,
  maxHeight: number,
  color: string = "#333333",
): Buffer {
  // Helper function to estimate text width
  const estimateTextWidth = (text: string, fontSize: number): number => {
    return text.length * fontSize * 0.55; // Slightly tighter estimation for larger text
  };

  // Helper function to break text into lines
  const breakTextIntoLines = (
    text: string,
    fontSize: number,
    maxWidth: number,
  ): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = estimateTextWidth(testLine, fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Single word is too long, add it anyway
          lines.push(word);
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  let fontSize = defaultFontSize;
  let lines: string[] = [];
  let totalHeight = 0;

  // Try to fit text by reducing font size if necessary
  while (fontSize >= 24) {
    // Minimum font size for location names
    lines = breakTextIntoLines(text, fontSize, maxWidth);
    const lineHeight = fontSize * 1.2; // Line height is 1.2x font size
    totalHeight = lines.length * lineHeight;

    if (totalHeight <= maxHeight) {
      break; // Text fits!
    }

    fontSize -= 4; // Reduce font size by 4px and try again
  }

  // Create SVG with multiple lines
  const lineHeight = fontSize * 1.2;
  const textElements = lines
    .map((line, index) => {
      const lineY = y + index * lineHeight;
      return `<text x="${x}" y="${lineY}"
                  font-family="Arial, sans-serif"
                  font-size="${fontSize}px"
                  font-weight="700"
                  fill="${color}">${line}</text>`;
    })
    .join("\n      ");

  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      ${textElements}
    </svg>
  `;

  return Buffer.from(svg);
}

// Text positioning constants
export const TEXT_CONFIG = {
  cityState: {
    x: 36,
    y: 54,
    fontSize: 38,
    maxWidth: 732,
    color: "#6B7280",
  },
  locationName: {
    x: 32,
    y: 136, // Positioned below city/state text with appropriate spacing
    fontSize: 84,
    maxWidth: 732,
    maxHeight: 440, // Adjusted height to accommodate the new Y position
    color: "#111827",
  },
} as const;
