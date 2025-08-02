import React from 'react';
import { useContentParser, type ParsedLine } from '../../hooks';

// Note component props
interface NoteProps {
  content: string;
  timestamp: string;
  className?: string;
}

// Separate component for content line rendering
const ContentLine: React.FC<{
  line: ParsedLine;
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
