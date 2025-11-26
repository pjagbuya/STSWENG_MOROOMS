'use server';

import { createClient } from '@/utils/supabase/server';
import { convertKeysToCamelCase } from '@/utils/utils';

export async function getCurrentUserInfo() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user.id;
  const { data, error } = await supabase.rpc('get_user_by_id', {
    p_user_id: userId,
  });
  if (error) {
    // console.error(error.message);
  }

  data.map(user => {
    const { data: fileURL } = supabase.storage
      .from('Morooms-file')
      .getPublicUrl(`profile/${user.user_id}/${user.user_profilepic}`);
    user.profileURL = fileURL.publicUrl;
    return user;
  });

  return convertKeysToCamelCase(data)[0];
}

export async function getLastLogin(email) {
  const supabase = createClient();

  const adminSupabase = createClient(true);

  const { data: logs, error } = await adminSupabase
    .from('logs')
    .select('*')
    .eq('action', 'login')
    .order('timestamp', { ascending: false });

  if (error || !logs) {
    return { text: 'N/A', isError: false };
  }

  // Filter client-side to avoid JSONB query issues with special characters
  const filteredLogs = logs
    .filter(log => {
      try {
        const logData =
          typeof log.data === 'string' ? JSON.parse(log.data) : log.data;
        return logData?.email === email;
      } catch {
        return false;
      }
    })
    .slice(0, 2);

  if (filteredLogs.length !== 2) {
    return { text: 'N/A', isError: false };
  }

  const lastLog = filteredLogs[1];

  const date = new Date(lastLog.timestamp);
  const formattedDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  if (lastLog.status !== 'success') {
    return { text: `${formattedDate} (Unsuccessful Login!)`, isError: true };
  }

  return { text: formattedDate, isError: false };
}
