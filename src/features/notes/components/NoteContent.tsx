import React from 'react';
import type { NoteData } from '../type';
import Note from './Note';

interface NoteContentProps {
  notes?: NoteData[];
  className?: string;
}

// Dummy data for 10 notes
const dummyNotes = [
  {
    id: '1',
    content: `<span class="tag-primary">@Aaron Site</span> Inspection completed. Heavy moss buildup on north side, moderate algae staining. Customer very satisfied with quote presentation. Chose Premium package. Payment processed via credit card. Mentioned neighbor also needs service.`,
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    content: `<span class="tag-success">@Sarah Property</span> Roof cleaning finished ahead of schedule. Excellent results on tile roof. Customer extremely happy with outcome. Referred two new clients. Scheduled follow-up maintenance for 6 months.`,
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    content: `<span class="tag-warning">@Johnson Residence</span> Initial assessment completed. Severe algae and moss infestation on entire roof. Safety concerns with steep pitch. Recommended professional equipment. Customer approved safety measures.`,
    timestamp: '6 hours ago',
  },
  {
    id: '4',
    content: `<span class="tag-info">@Downtown Office</span> Commercial building maintenance. Large flat roof area. Used specialized equipment for safety. Completed in 3 hours. Building manager requested quarterly service contract.`,
    timestamp: '1 day ago',
  },
  {
    id: '5',
    content: `<span class="tag-accent">@Miller Family</span> Emergency call - severe storm damage. Fallen branches and debris on roof. Quick response team dispatched. Cleared debris and assessed damage. Insurance claim assistance provided.`,
    timestamp: '1 day ago',
  },
  {
    id: '6',
    content: `<span class="tag-secondary">@Thompson House</span> Regular maintenance visit. Light cleaning required. Customer mentioned gutter issues. Recommended gutter cleaning service. Scheduled for next week.`,
    timestamp: '2 days ago',
  },
  {
    id: '7',
    content: `<span class="tag-primary">@Riverside Condos</span> Multi-unit complex cleaning. 12 units completed. HOA very satisfied with results. Negotiated annual contract. Payment terms: quarterly billing.`,
    timestamp: '3 days ago',
  },
  {
    id: '8',
    content: `<span class="tag-success">@Green Valley</span> New construction post-build cleaning. Builder requested premium service. Excellent results on new shingles. Photos taken for portfolio. Builder referred to other projects.`,
    timestamp: '4 days ago',
  },
  {
    id: '9',
    content: `<span class="tag-warning">@Historic District</span> Heritage building restoration. Special care required for old tiles. Used gentle cleaning methods. Preservation guidelines followed. Local council approved work.`,
    timestamp: '5 days ago',
  },
  {
    id: '10',
    content: `<span class="tag-info">@Mountain View</span> High-altitude property. Challenging access. Used specialized equipment. Weather delays encountered. Customer understanding about conditions. Completed successfully.`,
    timestamp: '1 week ago',
  },
];

const NoteContent: React.FC<NoteContentProps> = ({ notes = dummyNotes }) => {
  return (
    <>
      {notes.map(note => (
        <Note
          key={note.id}
          content={note.content}
          timestamp={note.timestamp}
          className="mb-3"
        />
      ))}
    </>
  );
};

export default NoteContent;
