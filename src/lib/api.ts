import { describeSubjectQuery } from "@/query/common";

const API_BASE_URL = process.env.API_BASE_URL!;
const QUERY_BASE_URL = process.env.QUERY_BASE_URL!;
const TRIPLYDB_TOKEN = process.env.TRIPLYDB_TOKEN!;

export async function fetchFromAPI<T>(endpoint: string, version = '1'): Promise<T[]> {
  const url = `${API_BASE_URL}/${endpoint}/${version}/run`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TRIPLYDB_TOKEN}`,
      Accept: "application/json",
    },
    next: { revalidate: 60 }, // cache for 60 seconds
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function queryFromTriplyDB<T>(query: string): Promise<T[]> {
  const url = `${QUERY_BASE_URL}`;

  const res = await fetch(url, {
    method: "POST",
    body: query,
    headers: {
      "Authorization": `Bearer ${TRIPLYDB_TOKEN}`,
      "Accept": "application/json",
      "Content-Type": "application/sparql-query",
    },
    next: { revalidate: 60 }, // cache for 60 seconds
  });

  if (!res.ok) {
    throw new Error(`TriplyDB request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function describeSubjectFromTriplyDB(subjectId: string): Promise<Record<string, any>[][]> {
  const url = `${QUERY_BASE_URL}`;

  const res = await fetch(url, {
    method: "POST",
    body: describeSubjectQuery(subjectId),
    headers: {
      "Authorization": `Bearer ${TRIPLYDB_TOKEN}`,
      "Accept": "application/json",
      "Content-Type": "application/sparql-query",
    },
    next: { revalidate: 60 }, // cache for 60 seconds
  });

  if (!res.ok) {
    throw new Error(`TriplyDB request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}