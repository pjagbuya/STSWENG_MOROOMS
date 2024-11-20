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
