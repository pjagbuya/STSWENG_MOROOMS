'use client';

import { getLogFilters, getLogs } from '@/app/logger/actions';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Filter,
  RefreshCw,
  Search,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function LoggerPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    method: 'all',
    table: 'all',
    search: '',
  });
  const [filterOptions, setFilterOptions] = useState({
    methods: [],
    tables: [],
    statuses: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  const scrollRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Load initial logs and filter options
  useEffect(() => {
    loadInitialData();
  }, []);

  // Reload when filters change
  useEffect(() => {
    if (!loading) {
      resetAndReload();
    }
  }, [filters]);

  const loadInitialData = async () => {
    setLoading(true);

    // Load filter options
    const filterResult = await getLogFilters();
    if (filterResult.success) {
      setFilterOptions(filterResult.data);
    }

    // Load initial logs
    const result = await getLogs(0, 20, filters);
    if (result.success) {
      setLogs(result.data);
      setHasMore(result.hasMore);
      setPage(1);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const resetAndReload = async () => {
    setLogs([]);
    setPage(0);
    setHasMore(true);

    const result = await getLogs(0, 20, filters);
    if (result.success) {
      setLogs(result.data);
      setHasMore(result.hasMore);
      setPage(1);
    }
  };

  const loadMoreLogs = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const result = await getLogs(page, 20, filters);

    if (result.success) {
      setLogs(prev => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage(prev => prev + 1);
    }

    setLoadingMore(false);
  }, [page, hasMore, loadingMore, filters]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isNearBottom && hasMore && !loadingMore) {
      loadMoreLogs();
    }
  }, [hasMore, loadingMore, loadMoreLogs]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleSearchChange = value => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value }));
    }, 500);
  };

  const formatTimestamp = timestamp => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading logs...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          API Logs Dashboard
        </h1>
        <p className="text-gray-600">Monitor and analyze system API calls</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search in action or data..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>

          {/* Refresh */}
          <button
            onClick={loadInitialData}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  {filterOptions.statuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Method
                </label>
                <select
                  value={filters.method}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, method: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Methods</option>
                  {filterOptions.methods.map(method => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Table
                </label>
                <select
                  value={filters.table}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, table: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Tables</option>
                  {filterOptions.tables.map(table => (
                    <option key={table} value={table}>
                      {table}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logs List */}
      <div
        ref={scrollRef}
        className="overflow-auto rounded-lg border bg-white shadow-sm"
        style={{ maxHeight: '70vh' }}
      >
        {error ? (
          <div className="p-6 text-center text-red-600">
            <AlertCircle className="mx-auto mb-2 h-8 w-8" />
            <p>Error loading logs: {error}</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No logs found matching your criteria</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logs.map(log => (
              <div
                key={log.id}
                className="p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      {getStatusIcon(log.status)}
                      <span className="font-semibold text-gray-900">
                        {log.action}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-1 text-xs ${getStatusColor(log.status)}`}
                      >
                        {log.status}
                      </span>
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                        {log.method}
                      </span>
                      {log.table && (
                        <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800">
                          {log.table}
                        </span>
                      )}
                    </div>

                    {log.data && (
                      <div className="mt-2">
                        <details className="text-sm">
                          <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                            View Data
                          </summary>
                          <pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-2 text-xs">
                            {JSON.stringify(JSON.parse(log.data), null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}

                    {log.error && (
                      <div className="mt-2 rounded border border-red-200 bg-red-50 p-2">
                        <p className="text-sm font-medium text-red-800">
                          Error:
                        </p>
                        <p className="text-sm text-red-700">{log.error}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loadingMore && (
              <div className="p-4 text-center">
                <RefreshCw className="mx-auto h-5 w-5 animate-spin text-blue-500" />
                <p className="mt-1 text-sm text-gray-600">
                  Loading more logs...
                </p>
              </div>
            )}

            {!hasMore && logs.length > 0 && (
              <div className="p-4 text-center text-sm text-gray-500">
                <p>No more logs to load</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
