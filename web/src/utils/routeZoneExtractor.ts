import { RouteData } from "../../../common/route-processing/types";
import { Fragments } from "../../../common/route-processing/fragment/types";

export function extractZoneIdsFromSection(section: RouteData.Section): string[] {
  const zoneIds = new Set<string>();
  
  for (const step of section.steps) {
    if (step.type === "fragment_step") {
             // Extract zone IDs from fragment parts
       for (const part of step.parts) {
         if (typeof part === 'object' && part !== null) {
           // Extract area IDs from various fragment types
           if ('areaId' in part && part.areaId) {
             zoneIds.add(part.areaId);
           }
           if ('dstAreaId' in part && part.dstAreaId) {
             zoneIds.add(part.dstAreaId);
           }
           if ('srcAreaId' in part && part.srcAreaId) {
             zoneIds.add(part.srcAreaId);
           }
         }
       }
    }
  }
  
  return Array.from(zoneIds);
}

export function getActNumberFromSectionName(sectionName: string): number {
  const actMatch = sectionName.match(/Act\s+(\d+)/i);
  if (actMatch) {
    return parseInt(actMatch[1], 10);
  }
  
  // Fallback: try to detect act from section content
  // This is a simple heuristic based on common naming patterns
  const actNameMap: Record<string, number> = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
  };
  
  for (const [name, num] of Object.entries(actNameMap)) {
    if (sectionName.toLowerCase().includes(name)) {
      return num;
    }
  }
  
  return 1; // Default to Act 1 if we can't determine
} 