import type { NoteData, NoteTagType } from '../type';

// Sample content templates for generating diverse notes
const contentTemplates = [
  'Inspection completed. Heavy moss buildup on {location}, moderate algae staining. Customer very satisfied with quote presentation. Chose {package} package. Payment processed via {payment}. Mentioned neighbor also needs service.',
  'Roof cleaning finished ahead of schedule. Excellent results on {roofType} roof. Customer extremely happy with outcome. Referred {referrals} new clients. Scheduled follow-up maintenance for {timeframe}.',
  'Initial assessment completed. Severe algae and moss infestation on entire roof. Safety concerns with steep pitch. Recommended professional equipment. Customer approved safety measures.',
  'Commercial building maintenance. Large {area} area. Used specialized equipment for safety. Completed in {duration} hours. Building manager requested {contract} service contract.',
  'Emergency call - severe storm damage. Fallen branches and debris on roof. Quick response team dispatched. Cleared debris and assessed damage. Insurance claim assistance provided.',
  'Regular maintenance visit. Light cleaning required. Customer mentioned {issue} issues. Recommended {service} service. Scheduled for next week.',
  'Multi-unit complex cleaning. {units} units completed. HOA very satisfied with results. Negotiated annual contract. Payment terms: {billing} billing.',
  'New construction post-build cleaning. Builder requested premium service. Excellent results on new {material}. Photos taken for portfolio. Builder referred to other projects.',
  'Heritage building restoration. Special care required for old {material}. Used gentle cleaning methods. Preservation guidelines followed. Local council approved work.',
  'High-altitude property. Challenging access. Used specialized equipment. Weather delays encountered. Customer understanding about conditions. Completed successfully.',
  'Residential gutter cleaning completed. Found significant blockage from {debris}. Customer impressed with before/after photos. Recommended seasonal maintenance program.',
  'Power washing service for {surface}. Removed years of buildup. Customer amazed at transformation. Booked additional services for {additional}.',
  'Chimney inspection and cleaning. Found {issue} requiring attention. Customer appreciated detailed report. Scheduled repair work for next month.',
  'Solar panel cleaning service. Improved efficiency by {percentage}%. Customer noticed immediate difference in energy output. Set up quarterly maintenance schedule.',
  'Window cleaning for {floors}-story building. Used professional equipment for safety. All windows spotless. Customer requested monthly service contract.',
];

const locations = [
  'north side',
  'south side',
  'east wing',
  'west section',
  'front area',
  'back section',
  'entire roof',
  'upper level',
  'lower section',
  'main building',
];
const packages = [
  'Premium',
  'Standard',
  'Basic',
  'Deluxe',
  'Professional',
  'Complete',
  'Essential',
  'Advanced',
];
const payments = [
  'credit card',
  'bank transfer',
  'cash',
  'check',
  'online payment',
  'mobile payment',
];
const roofTypes = [
  'tile',
  'shingle',
  'metal',
  'slate',
  'flat',
  'composite',
  'clay tile',
  'asphalt',
];
const referrals = ['two', 'three', 'four', 'five', 'several', 'multiple'];
const timeframes = [
  '6 months',
  '3 months',
  '1 year',
  '9 months',
  '4 months',
  '8 months',
];
const areas = [
  'flat roof',
  'parking lot',
  'courtyard',
  'deck area',
  'patio space',
  'rooftop',
];
const durations = ['2', '3', '4', '5', '6', '1.5', '2.5', '3.5'];
const contracts = ['quarterly', 'monthly', 'bi-annual', 'annual', 'seasonal'];
const issues = [
  'gutter',
  'drainage',
  'ventilation',
  'flashing',
  'downspout',
  'fascia',
];
const services = [
  'gutter cleaning',
  'repair',
  'maintenance',
  'inspection',
  'replacement',
];
const units = ['8', '12', '15', '20', '25', '30', '18', '22'];
const billings = ['quarterly', 'monthly', 'bi-annual', 'annual'];
const materials = ['shingles', 'tiles', 'metal sheets', 'slate', 'composite'];
const debris = ['leaves', 'twigs', 'bird nests', 'moss', 'dirt buildup'];
const surfaces = ['driveway', 'patio', 'deck', 'sidewalk', 'fence', 'siding'];
const additional = [
  'deck cleaning',
  'fence washing',
  'driveway cleaning',
  'siding wash',
];
const percentages = ['15', '20', '25', '30', '18', '22', '28'];
const floors = ['2', '3', '4', '5', '6', '8', '10'];

const customerNames = [
  'Aaron Site',
  'Sarah Property',
  'Johnson Residence',
  'Downtown Office',
  'Miller Family',
  'Thompson House',
  'Riverside Condos',
  'Green Valley',
  'Historic District',
  'Mountain View',
  'Sunset Manor',
  'Oak Street',
  'Pine Ridge',
  'Cedar Heights',
  'Maple Grove',
  'Willow Creek',
  'Birch Lane',
  'Elm Avenue',
  'Ash Boulevard',
  'Cherry Hill',
  'Magnolia Court',
  'Rose Garden',
  'Lily Pond',
  'Iris Way',
  'Tulip Drive',
  'Daisy Circle',
  'Sunflower Street',
  'Lavender Lane',
  'Jasmine Court',
  'Orchid Place',
  'Hibiscus Heights',
  'Azalea Avenue',
  'Peony Park',
  'Camellia Close',
  'Gardenia Grove',
  'Begonia Bay',
  'Dahlia Drive',
  'Zinnia Zone',
  'Cosmos Corner',
  'Marigold Manor',
  'Poppy Plaza',
  'Snapdragon Square',
  'Pansy Place',
  'Violet Village',
  'Primrose Point',
  'Daffodil District',
  'Crocus Crossing',
  'Hyacinth Heights',
  'Bluebell Boulevard',
  'Foxglove Falls',
];

const tagTypes: NoteTagType[] = [
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
];

const timeAgoOptions = [
  '1 hour ago',
  '2 hours ago',
  '3 hours ago',
  '4 hours ago',
  '5 hours ago',
  '6 hours ago',
  '8 hours ago',
  '12 hours ago',
  '1 day ago',
  '2 days ago',
  '3 days ago',
  '4 days ago',
  '5 days ago',
  '6 days ago',
  '1 week ago',
  '2 weeks ago',
  '3 weeks ago',
  '1 month ago',
  '2 months ago',
  '3 months ago',
  '30 minutes ago',
  '45 minutes ago',
  '1.5 hours ago',
  '2.5 hours ago',
  '3.5 hours ago',
  '4.5 hours ago',
  '7 hours ago',
  '9 hours ago',
  '10 hours ago',
  '11 hours ago',
  '13 hours ago',
  '14 hours ago',
  '15 hours ago',
  '16 hours ago',
  '18 hours ago',
  '20 hours ago',
  '22 hours ago',
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function replacePlaceholders(template: string): string {
  return template
    .replace(/{location}/g, getRandomItem(locations))
    .replace(/{package}/g, getRandomItem(packages))
    .replace(/{payment}/g, getRandomItem(payments))
    .replace(/{roofType}/g, getRandomItem(roofTypes))
    .replace(/{referrals}/g, getRandomItem(referrals))
    .replace(/{timeframe}/g, getRandomItem(timeframes))
    .replace(/{area}/g, getRandomItem(areas))
    .replace(/{duration}/g, getRandomItem(durations))
    .replace(/{contract}/g, getRandomItem(contracts))
    .replace(/{issue}/g, getRandomItem(issues))
    .replace(/{service}/g, getRandomItem(services))
    .replace(/{units}/g, getRandomItem(units))
    .replace(/{billing}/g, getRandomItem(billings))
    .replace(/{material}/g, getRandomItem(materials))
    .replace(/{debris}/g, getRandomItem(debris))
    .replace(/{surface}/g, getRandomItem(surfaces))
    .replace(/{additional}/g, getRandomItem(additional))
    .replace(/{percentage}/g, getRandomItem(percentages))
    .replace(/{floors}/g, getRandomItem(floors));
}

/**
 * Generates an array of note data with realistic content
 * @param count - Number of notes to generate (default: 1000)
 * @returns Array of NoteData objects
 */
export function generateNotes(count: number = 1000): NoteData[] {
  const notes: NoteData[] = [];

  for (let i = 0; i < count; i++) {
    const template = getRandomItem(contentTemplates);
    const customerName = getRandomItem(customerNames);
    const tagType = getRandomItem(tagTypes);
    const timestamp = getRandomItem(timeAgoOptions);

    const content = replacePlaceholders(template);
    const taggedContent = `<span class="tag-${tagType}">@${customerName}</span> ${content}`;

    notes.push({
      id: (i + 1).toString(),
      content: taggedContent,
      timestamp,
    });
  }

  return notes;
}
