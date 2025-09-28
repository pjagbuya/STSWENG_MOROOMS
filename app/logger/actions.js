'use server';

import { createClient } from '@/utils/supabase/server';

export async function getLogs(page = 0, limit = 20, filters = {}) {
  const supabase = createClient();

  try {
    let query = supabase
      .from('logs')
      .select(
        `
        id,
        timestamp,
        action,
        method,
        table,
        user_id,
        data,
        error,
        status
      `,
      )
      .order('timestamp', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters.method && filters.method !== 'all') {
      query = query.eq('method', filters.method);
    }

    if (filters.table && filters.table !== 'all') {
      query = query.eq('table', filters.table);
    }

    // Search in action or data fields
    if (filters.search) {
      query = query.or(
        `action.ilike.%${filters.search}%,data.cs."${filters.search}"`,
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching logs:', error);
      return { error: error.message };
    }

    return {
      success: true,
      data: data || [],
      hasMore: data && data.length === limit,
      total: count,
    };
  } catch (err) {
    console.error('Failed to fetch logs:', err);
    return { error: 'Failed to fetch logs' };
  }
}

export async function getLogFilters() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('logs')
      .select('method, table, status')
      .not('method', 'is', null)
      .not('table', 'is', null)
      .not('status', 'is', null);

    if (error) return { error: error.message };

    const methods = [...new Set(data.map(log => log.method))].filter(Boolean);
    const tables = [...new Set(data.map(log => log.table))].filter(Boolean);
    const statuses = [...new Set(data.map(log => log.status))].filter(Boolean);

    return {
      success: true,
      data: { methods, tables, statuses },
    };
  } catch (err) {
    return { error: 'Failed to fetch filter options' };
  }
}
