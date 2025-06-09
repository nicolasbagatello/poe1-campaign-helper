interface ZoneInfo {
  name: string;
  layout: string;
  notes: string;
  images: string[]; // Array of image filenames
}

interface ActData {
  actNumber: number;
  title: string;
  zones: Record<string, ZoneInfo>;
}

export interface ZoneLayoutData {
  [actKey: string]: ActData;
}

export function parseZoneLayoutMarkdown(markdownContent: string): ZoneLayoutData {
  const lines = markdownContent.split('\n');
  const result: ZoneLayoutData = {};
  
  let currentAct: string | null = null;
  let currentActData: ActData | null = null;
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Match act headers: Extract "Act <name>" from various formats
    const actMatch = line.match(/^#.*?Act\s+([\w\s]+?)[\]\*\(\)]/i);
    if (actMatch) {
      currentAct = actMatch[1].trim().toLowerCase();
      
      const actNumber = extractActNumber(currentAct);
      if (actNumber) {
        const actKey = `act${actNumber}`;
        currentActData = {
          actNumber,
          title: currentAct,
          zones: {}
        };
        result[actKey] = currentActData;
      }
      inTable = false;
      continue;
    }
    
    // Table header
    if (line.includes('|') && line.includes('-----')) {
      inTable = true;
      continue;
    }
    
    // Table rows
    if (line.includes('|') && inTable && currentActData) {
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      
      if (cells.length > 0) {
        // Check if this is a header row (zone names)
        const isHeaderRow = !cells.some(cell => 
          cell.toLowerCase().startsWith('note:') || 
          cell.toLowerCase().includes('layout') ||
          cell.includes('![][image')
        );
        
        if (isHeaderRow) {
          tableHeaders = cells;
          tableRows = [];
        } else if (tableHeaders.length > 0) {
          tableRows.push(cells);
        }
        
        // Process when we have headers and rows
        if (tableHeaders.length > 0 && tableRows.length > 0) {
          for (let col = 0; col < tableHeaders.length; col++) {
            const zoneName = tableHeaders[col];
            const cellContent = tableRows[0]?.[col] || '';
            
            // Skip processing if this is a note row or empty zone name
            if (!zoneName || 
                zoneName.toLowerCase().includes('note:') || 
                cellContent.toLowerCase().startsWith('note:') ||
                zoneName === '') {
              continue;
            }
            
            // Clean zone name
            const cleanZoneName = zoneName.replace(/^\s*\|\s*|\s*\|\s*$/g, '').trim();
            if (!cleanZoneName) continue;
            
            const zoneKey = cleanZoneName.toLowerCase().replace(/\s+/g, '_');
            
            // Extract image references
            const imageMatches = cellContent.match(/!\[\]\[image(\d+)\]/g) || [];
            const imageFilenames = imageMatches.map(match => {
              const imageNumber = match.match(/image(\d+)/)?.[1];
              return imageNumber ? `/poe1-campaign-helper/images/zone-layouts/image${imageNumber}.png` : null;
            }).filter(Boolean) as string[];
            
            // Generate HTML layout
            let layout = '';
            if (imageFilenames.length > 0) {
              layout = imageFilenames.map(src => 
                `<img src="${src}" alt="${cleanZoneName} layout" style="max-width: 300px; margin: 5px;" />`
              ).join('');
            } else {
              layout = 'No specific layout information available.';
            }
            
            // Extract notes
            let notes = '';
            if (tableRows.length > 1) {
              const noteRow = tableRows.find(row => row[col]?.toLowerCase().startsWith('note:'));
              if (noteRow) {
                notes = noteRow[col].replace(/^note:\s*/i, '').trim();
              }
            }
            
            // Check for overwrites of existing zones
            if (currentActData.zones[zoneKey]) {
              const existingZone = currentActData.zones[zoneKey];
              if (existingZone.images.length > 0 && imageFilenames.length === 0) {
                continue; // Skip this update to prevent overwriting good data with empty data
              }
            }
            
            currentActData.zones[zoneKey] = {
              name: cleanZoneName,
              layout,
              notes,
              images: imageFilenames
            };
          }
        }
      }
    }
  }
  
  return result;
}

export function getZoneLayout(zoneId: string, layoutData: ZoneLayoutData): ZoneInfo | null {
  const zoneName = ZONE_ID_TO_NAME_MAP[zoneId];
  if (!zoneName) {
    return null;
  }
  
  for (const actData of Object.values(layoutData)) {
    const zoneKey = zoneName.toLowerCase().replace(/\s+/g, '_');
    const zone = actData.zones[zoneKey];
    if (zone) {
      return zone;
    }
  }
  
  return null;
}

export function getZoneLayoutForArea(areaId: string, actNumber: number, zoneLayoutData: ZoneLayoutData): ZoneInfo | null {
  const actKey = `act${actNumber}`;
  const actData = zoneLayoutData[actKey];
  
  if (!actData) {
    return null;
  }
  
  const zoneName = ZONE_ID_TO_NAME_MAP[areaId];
  if (!zoneName) {
    return null;
  }
  
  // Convert zone name to the format used in the parsed data (lowercase with underscores)
  const zoneKey = zoneName.toLowerCase().replace(/\s+/g, '_');
  
  return actData.zones[zoneKey] || null;
}

function extractActNumber(actName: string): number | null {
  const actMap: Record<string, number> = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
  };
  
  // Extract text numbers from strings like "act six" or "[**act seven**]"
  const match = actName.toLowerCase().match(/(?:act\s+)?(\w+)/);
  if (match) {
    const textNumber = match[1];
    return actMap[textNumber] || parseInt(textNumber) || null;
  }
  
  return parseInt(actName) || null;
}

// Zone name mapping from route IDs to readable names (updated to match markdown)
export const ZONE_ID_TO_NAME_MAP: Record<string, string> = {
  // Act 1
  '1_1_1': 'The Twilight Strand',
  '1_1_2': 'The Coast',
  '1_1_3': 'Mud Flats',
  '1_1_2a': 'Tidal Island',
  '1_1_4_1': 'Submerged Passage',
  '1_1_5': 'The Ledge',
  '1_1_4_0': 'Flooded Depths',
  '1_1_6': 'The Climb',
  '1_1_7_1': 'The Lower Prison',
  '1_1_7_2': 'The Upper Prison',
  '1_1_8': 'The Prisoner\'s Gate',
  '1_1_9': 'The Ship Graveyard',
  '1_1_11_1': 'The Cavern of Wrath',
  '1_1_11_2': 'The Cavern of Anger',
  
  // Act 2
  '1_2_1': 'The Southern Forest',
  '1_2_2': 'The Old Fields',
  '1_2_3': 'The Crossroads',
  '1_2_6_1': 'Chamber of Sins 1',
  '1_2_6_2': 'Chamber of Sins 2',
  '1_2_4': 'Broken Bridge',
  '1_2_7': 'The Riverways',
  '1_2_9': 'The Western Forest',
  '1_2_10': 'Weaver\'s Chambers',
  '1_2_12': 'The Wetlands',
  '1_2_11': 'The Vaal Ruins',
  '1_2_8': 'The Northern Forest',
  '1_2_14_2': 'The Caverns',
  '1_2_14_3': 'Ancient Pyramid',
  
  // Act 3
  '1_3_1': 'The City of Sarn',
  '1_3_2': 'The Slums',
  '1_3_3_1': 'The Crematorium',
  '1_3_10_1': 'The Sewers',
  '1_3_5': 'The Marketplace',
  '1_3_7': 'The Battlefront',
  '1_3_9': 'The Docks',
  '1_3_8_1': 'The Solaris Temple 1',
  '1_3_8_2': 'The Solaris Temple 2',
  '1_3_13': 'The Ebony Barracks',
  '1_3_14_1': 'Lunaris Temple 1',
  '1_3_14_2': 'Lunaris Temple 2',
  '1_3_15': 'Imperial Gardens',
  '1_3_18_1': 'The Sceptre of God',
  '1_3_18_2': 'Upper Sceptre of God',
  
  // Act 4
  '1_4_1': 'The Aqueduct',
  '1_4_2': 'The Dried Lake',
  '1_4_3_1': 'The Mines 1',
  '1_4_3_2': 'The Mines 2',
  '1_4_3_3': 'The Crystal Veins',
  '1_4_5_1': 'Daresso\'s Dream',
  '1_4_5_2': 'The Grand Arena',
  '1_4_4_1': 'Kaom\'s Dream',
  '1_4_4_3': 'Kaom\'s Stronghold',
  '1_4_6_1': 'Belly of the Beast 1',
  '1_4_6_2': 'Belly of the Beast 2',
  '1_4_6_3': 'The Harvest',
  '1_4_7': 'The Ascent',
  
  // Act 5
  '1_5_1': 'The Slave Pens',
  '1_5_2': 'The Control Blocks',
  '1_5_3': 'Oriath Square',
  '1_5_4': 'The Templar Courts',
  '1_5_5': 'Chamber of Innocence',
  '1_5_4b': 'The Torched Courts',
  '1_5_3b': 'The Ruined Square',
  '1_5_6': 'The Ossuary',
  '1_5_7': 'The Reliquary',
  '1_5_8': 'Cathedral Rooftop',
  
  // Act 6
  '2_6_1': 'The Twilight Strand',
  '2_6_2': 'The Coast',
  '2_6_3': 'The Tidal Island',
  '2_6_4': 'The Mud Flats',
  '2_6_5': 'The Karui Fortress',
  '2_6_6': 'The Ridge',
  '2_6_7_1': 'The Lower Prison',
  '2_6_7_2': 'Shavronne\'s Tower',
  '2_6_8': 'Prisoner\'s Gate',
  '2_6_9': 'The Western Forest',
  '2_6_10': 'The Riverways',
  '2_6_11': 'The Wetlands',
  '2_6_12': 'The Southern Forest',
  '2_6_13': 'The Cavern of Anger',
  '2_6_14': 'The Beacon',
  '2_6_15': 'The Brine King\'s Reef',
  
  // Act 7
  '2_7_1': 'The Broken Bridge',
  '2_7_2': 'The Crossroads',
  '2_7_3': 'The Fellshrine Ruins',
  '2_7_4': 'The Crypt',
  '2_7_5_1': 'The Chamber of Sins Level 1',
  '2_7_5_2': 'The Chamber of Sins Level 2',
  '2_7_6': 'The Den',
  '2_7_7': 'The Ashen Fields',
  '2_7_8': 'The Northern Forest',
  '2_7_9': 'The Dread Thicket',
  '2_7_10': 'The Causeway',
  '2_7_11': 'The Vaal City',
  '2_7_12_1': 'The Temple of Decay Level 1',
  '2_7_12_2': 'The Temple of Decay Level 2',
  
  // Act 8
  '2_8_1': 'The Sarn Ramparts',
  '2_8_2_1': 'The Toxic Conduits',
  '2_8_2_2': 'Doedre\'s Cesspool',
  '2_8_3': 'The Grand Promenade',
  '2_8_4': 'The High Gardens',
  '2_8_5': 'The Bath House',
  '2_8_6': 'The Lunaris Concourse',
  '2_8_7_1_': 'The Lunaris Temple Level 1',
  '2_8_7_2': 'The Lunaris Temple Level 2',
  '2_8_8': 'The Quay',
  '2_8_9': 'The Grain Gate',
  '2_8_10': 'The Imperial Fields',
  '2_8_11': 'The Solaris Concourse',
  '2_8_12_1': 'The Solaris Temple Level 1',
  '2_8_12_2': 'The Solaris Temple Level 2',
  '2_8_13': 'The Harbour Bridge',
  '2_8_14': 'The Hidden Underbelly',
  
  // Act 9
  '2_9_1': 'The Blood Aqueduct',
  '2_9_2': 'The Descent',
  '2_9_3': 'The Vastiri Desert',
  '2_9_4': 'The Oasis',
  '2_9_5': 'The Foothills',
  '2_9_6': 'The Boiling Lake',
  '2_9_7': 'The Tunnel',
  '2_9_8': 'The Quarry',
  '2_9_9': 'The Refinery',
  '2_9_10_1': 'The Belly of the Beast',
  '2_9_10_2': 'The Rotting Core',
  
  // Act 10
  '2_10_1': 'The Cathedral Rooftop',
  '2_10_2': 'The Ravaged Square',
  '2_10_3': 'The Torched Courts',
  '2_10_4': 'The Desecrated Chambers',
  '2_10_5': 'The Canals',
  '2_10_6': 'The Feeding Trough',
  '2_10_7': 'The Control Blocks',
  '2_10_8': 'The Reliquary',
  '2_10_9': 'The Ossuary'
}; 