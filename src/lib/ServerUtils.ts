import { TriplyDBClient } from "./triplydb-client";

export interface ManufacturerOption {
  id?: string;
  name?: string;
  url?: string;
  identifier?: string;
}

export class ServerUtils {
  static async loadManufacturers(): Promise<ManufacturerOption[]> {
    try {
      const data = await TriplyDBClient.fetchFromAPI<ManufacturerOption>("manufacturers", "3");
      return data
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
