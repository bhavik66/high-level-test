import React, { useMemo } from 'react';

// Type for parsed line
export interface ParsedLine {
  key: number;
  content: string | React.ReactElement | (string | React.ReactElement)[];
  hasNextLine: boolean;
}

// Generic type for tag styles - can be extended by consumers
export type TagStylesMap = Record<string, string>;

// Hook configuration interface
export interface UseContentParserConfig {
  tagStyles?: TagStylesMap;
  defaultTagStyle?: string;
}

// Custom hook for parsing content with tags
export const useContentParser = (
  content: string,
  config: UseContentParserConfig = {}
): ParsedLine[] => {
  const { tagStyles = {}, defaultTagStyle = 'text-gray-500 font-medium' } =
    config;

  return useMemo(() => {
    const lines = content.split('\n');

    return lines.map((line, lineIndex) => {
      const tagRegex = /<span class="tag-([^"]+)">@([^<]+)<\/span>/g;
      const parts: (string | React.ReactElement)[] = [];
      let lastIndex = 0;
      let match;

      while ((match = tagRegex.exec(line)) !== null) {
        const [fullMatch, tagType, tagName] = match;

        // Add text before the tag
        if (match.index > lastIndex) {
          parts.push(line.slice(lastIndex, match.index));
        }

        // Add the tag with proper styling
        const tagStyle = tagStyles[tagType] || defaultTagStyle;
        parts.push(
          <span key={`tag-${lineIndex}-${parts.length}`} className={tagStyle}>
            @{tagName}
          </span>
        );

        lastIndex = match.index + fullMatch.length;
      }

      // Add remaining text
      if (lastIndex < line.length) {
        parts.push(line.slice(lastIndex));
      }

      return {
        key: lineIndex,
        content: parts.length > 0 ? parts : line,
        hasNextLine: lineIndex < lines.length - 1,
      };
    });
  }, [content, tagStyles, defaultTagStyle]);
};
