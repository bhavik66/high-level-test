import React, { useMemo } from 'react';
import type { TagType } from './type';
import { TAG_STYLES } from './type';

interface NoteProps {
  content: string;
  timestamp: string;
  className?: string;
}

// Custom hook for parsing content with tags
const useContentParser = (content: string) => {
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
        const tagStyle = TAG_STYLES[tagType as TagType] || TAG_STYLES.primary;
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
  }, [content]);
};

// Separate component for content line rendering
const ContentLine: React.FC<{
  line: ReturnType<typeof useContentParser>[0];
}> = ({ line }) => (
  <div key={line.key}>
    {line.content}
    {line.hasNextLine && <br />}
  </div>
);

const Note: React.FC<NoteProps> = ({ content, timestamp, className = '' }) => {
  const parsedLines = useContentParser(content);

  return (
    <div className={`card bg-warning/20 border border-warning ${className}`}>
      <div className="card-body p-4">
        <div className="flex flex-col gap-2">
          {/* Note content */}
          <div className="text-gray-700 text-sm leading-relaxed">
            {parsedLines.map(line => (
              <ContentLine key={line.key} line={line} />
            ))}
          </div>

          {/* Timestamp */}
          <div className="text-gray-500 text-xs">{timestamp}</div>
        </div>
      </div>
    </div>
  );
};

export default Note;
