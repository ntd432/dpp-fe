import { TriplyDBClient } from "./triplydb-client";

export interface ManufacturerOption {
  id?: string;
  name?: string;
  url?: string;
  identifier?: string;
}

// TODO: This is just temporary, there should be a way to prevent duplicates on the database level
function filterManufacturers(manufacturers: ManufacturerOption[]): ManufacturerOption[] {
  const seen = new Set<string>();
  
  return manufacturers.filter((manufacturer) => {
    const key = `${manufacturer.name}|${manufacturer.url}`;
    
    if (seen.has(key)) {
      return false;
    }
    
    seen.add(key);
    return true;
  });
}

export class ServerUtils {
  static async loadManufacturers(): Promise<ManufacturerOption[]> {
    try {
      const data = await TriplyDBClient.fetchFromAPI<ManufacturerOption>("manufacturers", "1");
      return filterManufacturers(data)
        .filter((m) => m.id || m.name)
        .map((m) => ({
          id: m.id,
          name: m.name,
          url: m.url,
          identifier: m.identifier,
        }));
    } catch {
      return [];
    }
  }
}
