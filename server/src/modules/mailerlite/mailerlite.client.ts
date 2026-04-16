/**
 * @satisfies read file src/app.ts
 */

import { mailerLiteApiKey } from "../../config/env";

const BASE_URL = "https://connect.mailerlite.com/api";

const headers = {
  "Content-Type":  "application/json",
  "Accept":        "application/json",
  "Authorization": `Bearer ${mailerLiteApiKey}`,
};

export interface SubscriberFields {
  name?:                          string;
  what_would_you_use_these_gifts_for?: string;
  how_did_you_find_out_about_us?: string;
  [key: string]: string | undefined;
}

export interface UpsertSubscriberPayload {
  email:   string;
  fields?: SubscriberFields;
  groups?: string[];
}

export interface MailerLiteGroup {
  id:   string;
  name: string;
}

async function request<T>( 
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MailerLite ${method} ${path} → ${res.status}: ${text}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}


export async function upsertSubscriber(
  payload: UpsertSubscriberPayload
): Promise<{ data: { id: string; email: string } }> {
  return request("POST", "/subscribers", payload);
}

export async function listGroups(): Promise<{ data: MailerLiteGroup[] }> {
  return request("GET", "/groups?limit=100");
}

export async function resolveGroupId(name: string): Promise<string> {
  const { data } = await listGroups();
  const group = data.find((g) => g.name === name);
  if (!group) {
    throw new Error(`MailerLite group not found: "${name}"`);
  }
  return group.id;
}
