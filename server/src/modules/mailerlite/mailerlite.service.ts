/**
 * @satisfies read file src/app.ts
 */

import { upsertSubscriber, resolveGroupId } from "./mailerlite.client";

export const GROUP_NEW_LEAD  = "Stage 0 - New Lead";
export const GROUP_CONVERTED = "Converted";

export interface SyncLeadOptions {
  email:       string;
  name:        string;
  groupName:   typeof GROUP_NEW_LEAD | typeof GROUP_CONVERTED;
  extraFields?: Record<string, string>;
}

export async function syncLeadToMailerLite(opts: SyncLeadOptions): Promise<{
  success:      boolean;
  subscriberId: string | null;
  groupId:      string | null;
  error:        string | null;
}> {
  try {
    const groupId = await resolveGroupId(opts.groupName);

    const result = await upsertSubscriber({
      email:  opts.email,
      fields: { name: opts.name, ...opts.extraFields },
      groups: [groupId],
    });

    return {
      success:      true,
      subscriberId: result.data.id,
      groupId,
      error:        null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[MailerLite] syncLeadToMailerLite failed: ${message}`);
    return { success: false, subscriberId: null, groupId: null, error: message };
  }
}
