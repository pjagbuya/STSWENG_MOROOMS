// Parser for TZDateRanges
// returns an array of dateRanges
export const parseTZDateRanges = ranges => {
  // Replace mismatched brackets and parentheses to conform to [ and ) format
  const cleaned = ranges.replace(/(\[|\()/g, '[').replace(/(\]|\))/g, ')');

  // Split the cleaned string into sets
  const sets = cleaned.match(/\[.*?\)/g);

  // Parse sets into an array of objects with cleaned start and end times
  const parsedSets = sets
    ? sets.map(set => {
        const [start, end] = set
          .slice(1, -1)
          .split(',')
          .map(
            item => item.replace(/["]/g, '').trim(), // Remove escaped quotes and trim whitespace
          );
        return { start, end }; // Return objects with cleaned timestamps
      })
    : [];

  return parsedSets;
};

// Converts ranges into the hour numbers
// returns an object containing a start and end digit
export const convertRangeToNumbers = time => {
  return {
    start: new Date(time.start).getHours().toString(), // Extract and format start hour
    end: new Date(time.end).getHours().toString(), // Extract and format end hour
  };
};

// Converts ranges into the hour numbers
// input for no date in input "time"
export const getHourFromRange = time => {
  const getUtcHours = timeString => {
    // Create a Date object in UTC and return the hour part
    const date = new Date(`1970-01-01T${timeString}Z`);
    return date.getUTCHours(); // Use getUTCHours() to avoid local timezone interference
  };

  return {
    start: getUtcHours(time.start),
    end: getUtcHours(time.end),
  };
};

export const toTZMultiRange = (date, hours) => {
  // Convert the date to a base date at midnight
  const baseDate = new Date(date);
  baseDate.setUTCHours(0, 0, 0, 0);

  // Helper function to format date and time as "YYYY-MM-DD HH:MM:SS"
  const formatDateTime = dateObj => {
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const hours = String(dateObj.getUTCHours()).padStart(2, '0');
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Generate each time range based on the selected hours
  const ranges = hours.map(hour => {
    const startTime = new Date(baseDate);
    startTime.setUTCHours(hour);

    const endTime = new Date(baseDate);
    endTime.setUTCHours(hour + 1);

    // Format the range in the expected format
    return `["${formatDateTime(startTime)}","${formatDateTime(endTime)}")`;
  });

  return `{${ranges.join(', ')}}`;
};
