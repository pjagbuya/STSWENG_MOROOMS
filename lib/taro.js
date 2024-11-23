// test.js

const recommenderSystems = require('./index.js'); 

// Mock data (replace with your actual data structures)
const rooms_data = [
  { room: 'A1', roomSet: 'Set1', roomType: 'Standard' },
  { room: 'B2', roomSet: 'Set2', roomType: 'Deluxe' }
];
const roomTypes_data = {
  Standard: { startTime: 8, endTime: 20 },
  Deluxe: { startTime: 9, endTime: 21 }
};
const reservations_data = [
  { room: 'A1', date: '1/1', startTime: 10, endTime: 12 },
  { room: 'B2', date: '1/2', startTime: 11, endTime: 13 }
];

// Example test
test('Test Case 1 (', () => {
  
  const schedules = [
    { date: 0, roomSet: 'Set1', startTime: 10, endTime: 12 },
    { date: 1, roomSet: 'Set2', startTime: 11, endTime: 13 },
  ]; // Replace with your schedules

  const recommendations = recommenderSystems(
    '2021-03-25, 14:35:09.99',
    schedules,
    reservations_data,
    rooms_data,
    roomTypes_data
  );

  expect(recommendations).toBeDefined();
  // Add more specific assertions to test your logic
});