export class APILogger {
  static async log(
    action,
    method,
    table = null,
    userId = null,
    data = null,
    error = null,
  ) {
    const timestamp = new Date();
    const logEntry = {
      timestamp,
      action,
      method,
      table,
      user_id: userId,
      data: data ? JSON.stringify(data) : null, //is in JSONB
      error: error ? error.message || error : null,
      status: error ? 'error' : 'success',
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API ${logEntry.status.toUpperCase()}]`, {
        timestamp: logEntry.timestamp.toISOString(),
        action: logEntry.action,
        method: logEntry.method,
        table: logEntry.table,
        user: logEntry.user_id,
        ...(logEntry.error && { error: logEntry.error }),
      });
    }

    // Optionally log to Supabase logs table
    try {
      const { createClient } = await import('@/utils/supabase/server');
      const supabase = createClient(true);

      await supabase.from('logs').insert(logEntry);
    } catch (logError) {
      // Don't let logging errors break the main action
      console.error('Failed to log to database:', logError);
    }
  }
}
