// Change from import to require
const { recommenderSystems } = require('./recommender.js');


// Mock data for room and room types
const rooms_data = [
  { room: "A1", roomSet: "A", roomType: "Lab" },
  { room: "B1", roomSet: "B", roomType: "Lec" },
  { room: "B2", roomSet: "B", roomType: "Lec" },
  { room: "C1", roomSet: "C", roomType: "Lab" }
];

const roomTypes_data = {
  Lab: { startTime: 8, endTime: 20 },
  Lec: { startTime: 9, endTime: 21 },
  Func: { startTime: 12, endTime: 24 },
};

// Test cases
describe("Recommender Systems Test Cases", () => {

  test("Test Case #0 Invalid Input - Negative Test", () => {
    const schedules = [];
    const reservations_data = [];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "a",
      "a",
      "a",
      "a",
      "a",
    );
    expect(result).toEqual([]); // Expecting an error result for invalid input
  });


  test("Test Case #1 One schedule, no conflicting reservations on free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 }
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 14, endTime: 15, room: "A1" },
    ]);
  });

  test("Test Case #2 One schedule, conflicting reservations on free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 }
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 15, endTime: 16, room: "A1" },
    ]);
  });

  test("Test Case #3 One schedule, current time past free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 }
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 15:30:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 16, endTime: 17, room: "A1" },
    ]);
  });

  test("Test Case #4 One schedule, current time past free time and conflicting reservations on free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 16, endTime: 17 }
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 15:30:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 17, endTime: 18, room: "A1" },
    ]);
  });

  test("Test Case #5 One schedule, no available reservations made", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 20 }
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([]);
  });

  test("Test Case #6 One schedule, schedule overtime", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 }
    ];
    const schedules = [
      { day: 1, startTime: 10, endTime: 20, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([]);
  });

  test("Test Case #7 One schedule, current time overtime", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 }
    ];
    const schedules = [
      { day: 1, startTime: 10, endTime: 12, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 20:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([]);
  });

  test("Test Case #8 Two schedules on same roomSet same weekDay not consecutive, no conflicting reservations on both free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 }
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 14, endTime: 15, room: "A1" },
      { date: "2024-01-01", startTime: 18, endTime: 19, room: "A1" },
    ]);
  });
  

  test("Test Case #9 Two schedules on same roomSet same weekDay not consecutive, conflicting reservations on entire 1st free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 16 }
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 18, endTime: 19, room: "A1" },
    ]);
  });

  test("Test Case #10 Two schedules on same roomSet same weekDay not consecutive, conflicting reservations on entire 2nd free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 },
      { room: "A1", date: "2024-01-01", startTime: 16, endTime: 20 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 14, endTime: 15, room: "A1" },
    ]);
  });

  test("Test Case #11 Two schedules on same roomSet same weekDay not consecutive, conflicting reservations on entire both free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 20 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([]);
  });

  test("Test Case #12 Two schedules on same roomSet same weekDay not consecutive, conflicting reservations on not entire 1st free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "A1", date: "2024-01-01", startTime: 16, endTime: 18 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 15, endTime: 16, room: "A1" },
      { date: "2024-01-01", startTime: 18, endTime: 19, room: "A1" },
    ]);
  });

  test("Test Case #13 Two schedules on same roomSet same weekDay not consecutive, conflicting reservations on not entire 2nd free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 },
      { room: "A1", date: "2024-01-01", startTime: 16, endTime: 19 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 14, endTime: 15, room: "A1" },
      { date: "2024-01-01", startTime: 19, endTime: 20, room: "A1" },
    ]);
  });

  test("Test Case #14 Two schedules on same roomSet same weekDay not consecutive, conflicting reservations on entire 1st free time and not entire 2nd free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 16 },
      { room: "A1", date: "2024-01-01", startTime: 16, endTime: 19 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 19, endTime: 20, room: "A1" },
    ]);
  });

  test("Test Case #15 Two schedules on same roomSet same weekDay not consecutive, conflicting reservations on not entire 1st free time and entire 2nd free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "A1", date: "2024-01-01", startTime: 16, endTime: 21 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 15, endTime: 16, room: "A1" },
    ]);
  });

  test("Test Case #16 Two schedules on same roomSet same weekDay not consecutive, conflicting reservations on not entire both free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "A1", date: "2024-01-01", startTime: 16, endTime: 19 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 15, endTime: 16, room: "A1" },
      { date: "2024-01-01", startTime: 19, endTime: 20, room: "A1" },
    ]);
  });

  test("Test Case #17 Two schedules on same roomSet same weekDay not consecutive, current time past 1st free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 }
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 14:30:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 15, endTime: 16, room: "A1" },
      { date: "2024-01-01", startTime: 18, endTime: 19, room: "A1" },
    ]);
  });

  test("Test Case #18 Two schedules on same roomSet same weekDay not consecutive, current time past 2nd free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 }
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 18:30:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 19, endTime: 20, room: "A1" },
    ]);
  });

  test("Test Case #19 Two schedules on same roomSet same weekDay not consecutive, last schedule overtime", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 }
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 20, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 14, endTime: 15, room: "A1" },
    ]);
  });

  test("Test Case #20 Two schedules on same roomSet same weekDay not consecutive, current time overtime", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 }
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 20, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 20:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([]);
  });

  test("Test Case #21 Two schedules on not same roomSet same weekDay not consecutive, no conflicting reservations on both free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 },
      { room: "B1", date: "2024-01-01", startTime: 9, endTime: 21 },
      { room: "B2", date: "2024-01-01", startTime: 12, endTime: 14 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "B" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 14, endTime: 15, room: "A1" },
      { date: "2024-01-01", startTime: 18, endTime: 19, room: "B2" },
    ]);
  });

  test("Test Case #22 Two schedules on not same roomSet same weekDay not consecutive, conflicting reservations on entire first free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 20 },
      { room: "B1", date: "2024-01-01", startTime: 9, endTime: 21 },
      { room: "B2", date: "2024-01-01", startTime: 12, endTime: 14 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "B" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 18, endTime: 19, room: "B2" },
    ]);
  });

  test("Test Case #23 Two schedules on not same roomSet same weekDay not consecutive, conflicting reservations on entire 2nd free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 },
      { room: "B1", date: "2024-01-01", startTime: 9, endTime: 21 },
      { room: "B2", date: "2024-01-01", startTime: 12, endTime: 21 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "B" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 14, endTime: 15, room: "A1" },
    ]);
  });

  test("Test Case #24 Two schedules on not same roomSet same weekDay not consecutive, conflicting reservations on entire both free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 20 },
      { room: "B1", date: "2024-01-01", startTime: 9, endTime: 21 },
      { room: "B2", date: "2024-01-01", startTime: 12, endTime: 21 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "B" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([]);
  });

  test("Test Case #25 Two schedules on not same roomSet same weekDay not consecutive, conflicting reservations on not entire 1st free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "B1", date: "2024-01-01", startTime: 9, endTime: 21 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "B" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 15, endTime: 16, room: "A1" },
      { date: "2024-01-01", startTime: 18, endTime: 19, room: "B2" },
    ]);
  });

  test("Test Case #26 Two schedules on not same roomSet same weekDay not consecutive, conflicting reservations on not entire 2nd free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 },
      { room: "B1", date: "2024-01-01", startTime: 9, endTime: 21 },
      { room: "B2", date: "2024-01-01", startTime: 12, endTime: 19 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "B" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 14, endTime: 15, room: "A1" },
      { date: "2024-01-01", startTime: 19, endTime: 20, room: "B2" },
    ]);
  });

  test("Test Case #27 Two schedules on not same roomSet same weekDay not consecutive, conflicting reservations on entire 1st free time and not entire 2nd free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 20 },
      { room: "B1", date: "2024-01-01", startTime: 9, endTime: 21 },
      { room: "B2", date: "2024-01-01", startTime: 12, endTime: 19 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "B" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 19, endTime: 20, room: "B2" },
    ]);
  });

  test("Test Case #28 Two schedules on not same roomSet same weekDay not consecutive, conflicting reservations on not entire 1st free time and entire 2nd free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "B1", date: "2024-01-01", startTime: 9, endTime: 21 },
      { room: "B2", date: "2024-01-01", startTime: 12, endTime: 21 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "B" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 15, endTime: 16, room: "A1" },
    ]);
  });

  test("Test Case #29 Two schedules on not same roomSet same weekDay not consecutive, conflicting reservations on not both entire 2nd free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "B1", date: "2024-01-01", startTime: 9, endTime: 21 },
      { room: "B2", date: "2024-01-01", startTime: 12, endTime: 19 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "B" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 15, endTime: 16, room: "A1" },
      { date: "2024-01-01", startTime: 19, endTime: 20, room: "B2" },
    ]);
  });

  test("Test Case #30 Two schedules on not same roomSet same weekDay not consecutive, current time past 1st free time ", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 },
      { room: "B1", date: "2024-01-01", startTime: 9, endTime: 21 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "B" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 14:30:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 15, endTime: 16, room: "A1" },
      { date: "2024-01-01", startTime: 18, endTime: 19, room: "B2" },
    ]);
  });

  test("Test Case #31 Two schedules on not same roomSet same weekDay not consecutive, current time past 2nd free time ", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 },
      { room: "B1", date: "2024-01-01", startTime: 9, endTime: 21 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "B" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 18:30:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 19, endTime: 20, room: "B2" },
    ]);
  });

  test("Test Case #32 Two schedules on not same roomSet same weekDay not consecutive, last schedule overtime", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 },
      { room: "B1", date: "2024-01-01", startTime: 9, endTime: 21 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 21, roomSet: "B" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 14, endTime: 15, room: "A1" },
    ]);
  });

  test("Test Case #33 Two schedules on not same roomSet same weekDay not consecutive, current time overtime", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 },
      { room: "B1", date: "2024-01-01", startTime: 9, endTime: 21 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 16, endTime: 18, roomSet: "B" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 22:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([]);
  });

  test("Test Case #34 Two schedules on same roomSet same weekDay consecutive, no conflicting reservations on free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 14, endTime: 16, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 16, endTime: 17, room: "A1" },
    ]);
  });

  test("Test Case #35 Two schedules on same roomSet same weekDay consecutive, conflicting reservations on free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 17 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 14, endTime: 16, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 17, endTime: 18, room: "A1" },
    ]);
  });

  test("Test Case #36 Two schedules on not same roomSet same weekDay consecutive, no conflicting reservations on free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 },
      { room: "B1", date: "2024-01-01", startTime: 9, endTime: 21 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 14, endTime: 16, roomSet: "B" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 16, endTime: 17, room: "B2" },
    ]);
  });

  test("Test Case #37 Two schedules on not same roomSet same weekDay consecutive, conflicting reservations on free time", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 },
      { room: "B1", date: "2024-01-01", startTime: 9, endTime: 21 },
      { room: "B2", date: "2024-01-01", startTime: 9, endTime: 17 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 1, startTime: 14, endTime: 16, roomSet: "B" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 17, endTime: 18, room: "B2" },
    ]);
  });

  test("Test Case #38 Two schedules on same roomSet not same weekDay not consecutive, no conflicting reservations on both free time, 1st weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 14, endTime: 15, room: "A1" },
      { date: "2024-01-02", startTime: 14, endTime: 15, room: "A1" },
    ]);
  });

  test("Test Case #39 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on entire 1st free time, 1st weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 20 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-02", startTime: 14, endTime: 15, room: "A1" },
    ]);
  });

  test("Test Case #40 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on entire 2nd free time, 1st weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-02", startTime: 10, endTime: 20 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 14, endTime: 15, room: "A1" },
    ]);
  });

  test("Test Case #41 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on entire both free time, 1st weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 20 },
      { room: "A1", date: "2024-01-02", startTime: 10, endTime: 20 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([]);
  });

  test("Test Case #42 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on not entire 1st free time, 1st weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 15, endTime: 16, room: "A1" },
      { date: "2024-01-02", startTime: 14, endTime: 15, room: "A1" },
    ]);
  });

  test("Test Case #43 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on not entire 2nd free time, 1st weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-02", startTime: 10, endTime: 15 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 14, endTime: 15, room: "A1" },
      { date: "2024-01-02", startTime: 15, endTime: 16, room: "A1" },
    ]);
  });

  test("Test Case #44 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on entire 1st free time and not entire 2nd free time, 1st weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 20 },
      { room: "A1", date: "2024-01-02", startTime: 10, endTime: 15 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-02", startTime: 15, endTime: 16, room: "A1" },
    ]);
  });

  test("Test Case #45 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on not entire 1st free time and entire 2nd free time, 1st weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "A1", date: "2024-01-02", startTime: 10, endTime: 20 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 15, endTime: 16, room: "A1" },
    ]);
  });

  test("Test Case #46 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on not entire both free time, 1st weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "A1", date: "2024-01-02", startTime: 10, endTime: 15 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 15, endTime: 16, room: "A1" },
      { date: "2024-01-02", startTime: 15, endTime: 16, room: "A1" },
    ]);
  });

  test("Test Case #47 Two schedules on same roomSet not same weekDay not consecutive, no conflicting reservations on free time, 2nd weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 12 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-02, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-02", startTime: 14, endTime: 15, room: "A1" },
    ]);
  });
  
  test("Test Case #48 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on entire 1st free time, 2nd weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 20 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-02, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-02", startTime: 14, endTime: 15, room: "A1" },
    ]);
  });

  test("Test Case #49 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on entire 2nd free time, 2nd weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-02", startTime: 10, endTime: 20 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-02, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([]);
  });

  test("Test Case #50 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on entire both free time, 2nd weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 20 },
      { room: "A1", date: "2024-01-02", startTime: 10, endTime: 20 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-02, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([]);
  });

  test("Test Case #51 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on not entire 1st free time, 2nd weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-02, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-02", startTime: 14, endTime: 15, room: "A1" },
    ]);
  });

  test("Test Case #52 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on not entire 2nd free time, 2nd weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-02", startTime: 10, endTime: 15 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-02, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-02", startTime: 15, endTime: 16, room: "A1" },
    ]);
  });

  test("Test Case #53 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on entire 1st free time and not entire 2nd free time, 2nd weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 20 },
      { room: "A1", date: "2024-01-02", startTime: 10, endTime: 15 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-02, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-02", startTime: 15, endTime: 16, room: "A1" },
    ]);
  });

  test("Test Case #54 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on not entire 1st free time and entire 2nd free time, 2nd weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "A1", date: "2024-01-02", startTime: 10, endTime: 20 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-02, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([]);
  });

  test("Test Case #55 Two schedules on same roomSet not same weekDay not consecutive, conflicting reservations on not entire both free time, 2nd weekDay", () => {
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "A1", date: "2024-01-02", startTime: 10, endTime: 15 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-02, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-02", startTime: 15, endTime: 16, room: "A1" },
    ]);
  });

  test("Test Case #56 Two schedules on same roomSet not same weekDay not consecutive, current time past free time, 1st weekDay", () => {
    const reservations_data = [

    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 14:30:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 15, endTime: 16, room: "A1" },
      { date: "2024-01-02", startTime: 14, endTime: 15, room: "A1" },
    ]);
  });

  test("Test Case #57 Two schedules on same roomSet not same weekDay not consecutive, current time past free time, 2nd weekDay", () => {
    const reservations_data = [

    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
      { day: 2, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-02, 14:30:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-02", startTime: 15, endTime: 16, room: "A1" },
    ]);
  });

  test("Test Case #58 One schedules, multiple rooms available, 1st room conflicting reservation", () => {
    const special_rooms_data = [
      { room: "A1", roomSet: "A", roomType: "Lab" },
      { room: "A2", roomSet: "A", roomType: "Lab" },
      { room: "A3", roomSet: "A", roomType: "Lec" },
      { room: "A4", roomSet: "A", roomType: "Func" },
      { room: "B1", roomSet: "B", roomType: "Lec" },
      { room: "B2", roomSet: "B", roomType: "Lec" },
      { room: "C1", roomSet: "C", roomType: "Lab" }
    ];
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      special_rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 14, endTime: 15, room: "A2" },
    ]);
  });

  test("Test Case #59 One schedules, multiple rooms available, 1st 2nd room conflicting reservation", () => {
    const special_rooms_data = [
      { room: "A1", roomSet: "A", roomType: "Lab" },
      { room: "A2", roomSet: "A", roomType: "Lab" },
      { room: "A3", roomSet: "A", roomType: "Lec" },
      { room: "A4", roomSet: "A", roomType: "Func" },
      { room: "B1", roomSet: "B", roomType: "Lec" },
      { room: "B2", roomSet: "B", roomType: "Lec" },
      { room: "C1", roomSet: "C", roomType: "Lab" }
    ];
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "A2", date: "2024-01-01", startTime: 10, endTime: 15 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      special_rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 14, endTime: 15, room: "A3" },
    ]);
  });

  test("Test Case #60 One schedules, multiple rooms available, 1st 2nd 3rd room conflicting reservation", () => {
    const special_rooms_data = [
      { room: "A1", roomSet: "A", roomType: "Lab" },
      { room: "A2", roomSet: "A", roomType: "Lab" },
      { room: "A3", roomSet: "A", roomType: "Lec" },
      { room: "A4", roomSet: "A", roomType: "Func" },
      { room: "B1", roomSet: "B", roomType: "Lec" },
      { room: "B2", roomSet: "B", roomType: "Lec" },
      { room: "C1", roomSet: "C", roomType: "Lab" }
    ];
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "A2", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "A3", date: "2024-01-01", startTime: 10, endTime: 15 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      special_rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 14, endTime: 15, room: "A4" },
    ]);
  });

  test("Test Case #61 One schedules, multiple rooms available, 1st 2nd 3rd 4th room conflicting reservation", () => {
    const special_rooms_data = [
      { room: "A1", roomSet: "A", roomType: "Lab" },
      { room: "A2", roomSet: "A", roomType: "Lab" },
      { room: "A3", roomSet: "A", roomType: "Lec" },
      { room: "A4", roomSet: "A", roomType: "Func" },
      { room: "B1", roomSet: "B", roomType: "Lec" },
      { room: "B2", roomSet: "B", roomType: "Lec" },
      { room: "C1", roomSet: "C", roomType: "Lab" }
    ];
    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "A2", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "A3", date: "2024-01-01", startTime: 10, endTime: 15 },
      { room: "A4", date: "2024-01-01", startTime: 10, endTime: 15 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = []
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      special_rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 15, endTime: 16, room: "A1" },
    ]);
  });

  test("Test Case #62 One schedules, both reservation and room schedule used", () => {

    const reservations_data = [
      { room: "A1", date: "2024-01-01", startTime: 10, endTime: 15 },
    ];
    const schedules = [
      { day: 1, startTime: 12, endTime: 14, roomSet: "A" },
    ];
    const roomSchedules_data = [
      { room: "A1", day: 1, startTime: 15, endTime: 17 },
    ]
      const result = recommenderSystems(
      "2024-01-01, 10:00:00.00",
      schedules,
      reservations_data,
      rooms_data,
      roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-01-01", startTime: 17, endTime: 18, room: "A1" },
    ]);
  });

  test("Special Test Case #0", () => {
    const special_rooms_data = [
      { room: "GK101", roomSet: "GK1", roomType: "Lec" },
      { room: "GK102", roomSet: "GK1", roomType: "Lec" },
      { room: "GK103", roomSet: "GK1", roomType: "Lec" },
      { room: "GK104", roomSet: "GK1", roomType: "Func" },
      { room: "GK105", roomSet: "GK1", roomType: "Func" },
      { room: "GK106", roomSet: "GK1", roomType: "Func" },
      { room: "GK201", roomSet: "GK2", roomType: "Lec" },
      { room: "GK202", roomSet: "GK2", roomType: "Lec" },
      { room: "GK203", roomSet: "GK2", roomType: "Lec" },
      { room: "GK204", roomSet: "GK2", roomType: "Lec" },
      { room: "GK205", roomSet: "GK2", roomType: "Lec" },
      { room: "GK206", roomSet: "GK2", roomType: "Lec" },
      { room: "GK207", roomSet: "GK2", roomType: "Lec" },
      { room: "GK208", roomSet: "GK2", roomType: "Lec" },
      { room: "GK209", roomSet: "GK2", roomType: "Lec" },
      { room: "GK210", roomSet: "GK2", roomType: "Lab" },
      { room: "GK211", roomSet: "GK2", roomType: "Lab" },
      { room: "GK212", roomSet: "GK2", roomType: "Lab" },
      { room: "GK301", roomSet: "GK3", roomType: "Lec" },
      { room: "GK302A", roomSet: "GK3", roomType: "Lab" },
      { room: "GK302B", roomSet: "GK3", roomType: "Lab" },
      { room: "GK303", roomSet: "GK3", roomType: "Lec" },
      { room: "GK304A", roomSet: "GK3", roomType: "Lab" },
      { room: "GK304B", roomSet: "GK3", roomType: "Lab" },
      { room: "GK305", roomSet: "GK3", roomType: "Lec" },
      { room: "GK306A", roomSet: "GK3", roomType: "Lab" },
      { room: "GK306B", roomSet: "GK3", roomType: "Lab" },
      { room: "GK401", roomSet: "GK4", roomType: "Lab" },
      { room: "GK402", roomSet: "GK4", roomType: "Lab" },
      { room: "GK403", roomSet: "GK4", roomType: "Lab" },
      { room: "GK404", roomSet: "GK4", roomType: "Lab" },
      { room: "GK405", roomSet: "GK4", roomType: "Lab" },
      { room: "GK406", roomSet: "GK4", roomType: "Lab" },
      { room: "GK407", roomSet: "GK4", roomType: "Lab" },
      { room: "GK408", roomSet: "GK4", roomType: "Lab" },
    ];
    const special_roomTypes_data = {
      Lab: { startTime: 7, endTime: 21 },
      Lec: { startTime: 7, endTime: 21 },
      Func: { startTime: 9, endTime: 18 },
    };
    const reservations_data = [
      { room: "GK201", date: "2024-11-25", startTime: 10, endTime: 12 },
      { room: "GK203", date: "2024-11-25", startTime: 10, endTime: 12 },
      { room: "GK205", date: "2024-11-25", startTime: 10, endTime: 12 },
      { room: "GK202", date: "2024-11-26", startTime: 10, endTime: 18 },
      { room: "GK302A", date: "2024-11-26", startTime: 9, endTime: 12 },
      { room: "GK302B", date: "2024-11-26", startTime: 9, endTime: 12 },
      { room: "GK304A", date: "2024-11-26", startTime: 9, endTime: 12 },
      { room: "GK304B", date: "2024-11-26", startTime: 9, endTime: 12 },
      { room: "GK306A", date: "2024-11-26", startTime: 9, endTime: 12 },
      { room: "GK306B", date: "2024-11-26", startTime: 9, endTime: 12 },
      { room: "GK101", date: "2024-11-26", startTime: 10, endTime: 20 },
      { room: "GK102", date: "2024-11-26", startTime: 10, endTime: 20 },
      { room: "GK103", date: "2024-11-26", startTime: 10, endTime: 20 },
      { room: "GK401", date: "2024-11-27", startTime: 10, endTime: 14 },
      { room: "GK402", date: "2024-11-27", startTime: 10, endTime: 14 },
      { room: "GK403", date: "2024-11-27", startTime: 10, endTime: 14 },
      { room: "GK404", date: "2024-11-27", startTime: 10, endTime: 13 },
      { room: "GK405", date: "2024-11-27", startTime: 10, endTime: 14 },
      { room: "GK406", date: "2024-11-27", startTime: 10, endTime: 13 },
      { room: "GK407", date: "2024-11-27", startTime: 10, endTime: 13 },
      { room: "GK408", date: "2024-11-27", startTime: 10, endTime: 13 },
      { room: "GK301", date: "2024-11-27", startTime: 10, endTime: 11 },
      { room: "GK303", date: "2024-11-27", startTime: 10, endTime: 11 },
      { room: "GK305", date: "2024-11-27", startTime: 10, endTime: 11 },
      { room: "GK302A", date: "2024-11-27", startTime: 9, endTime: 11 },
      { room: "GK302B", date: "2024-11-27", startTime: 9, endTime: 11 },
      { room: "GK304A", date: "2024-11-27", startTime: 9, endTime: 11 },
      { room: "GK304B", date: "2024-11-27", startTime: 9, endTime: 11 },
      { room: "GK306A", date: "2024-11-27", startTime: 9, endTime: 11 },
      { room: "GK306B", date: "2024-11-27", startTime: 9, endTime: 11 },
      { room: "GK301", date: "2024-11-27", startTime: 12, endTime: 13 },
      { room: "GK303", date: "2024-11-27", startTime: 12, endTime: 13 },
      { room: "GK305", date: "2024-11-27", startTime: 12, endTime: 13 },
      { room: "GK302A", date: "2024-11-27", startTime: 12, endTime: 13 },
      { room: "GK302B", date: "2024-11-27", startTime: 12, endTime: 13 },
      { room: "GK304A", date: "2024-11-27", startTime: 12, endTime: 13 },
      { room: "GK304B", date: "2024-11-27", startTime: 12, endTime: 13 },
      { room: "GK306A", date: "2024-11-27", startTime: 12, endTime: 13 },
      { room: "GK306B", date: "2024-11-27", startTime: 12, endTime: 13 },
      { room: "GK301", date: "2024-11-27", startTime: 16, endTime: 19 },
      { room: "GK303", date: "2024-11-27", startTime: 16, endTime: 19 },
      { room: "GK305", date: "2024-11-27", startTime: 16, endTime: 19 },
      { room: "GK302A", date: "2024-11-27", startTime: 16, endTime: 19 },
      { room: "GK302B", date: "2024-11-27", startTime: 16, endTime: 18 },
      { room: "GK304A", date: "2024-11-27", startTime: 16, endTime: 19 },
      { room: "GK304B", date: "2024-11-27", startTime: 16, endTime: 18 },
      { room: "GK306A", date: "2024-11-27", startTime: 16, endTime: 19 },
      { room: "GK306B", date: "2024-11-27", startTime: 16, endTime: 18 },
      { room: "GK201", date: "2024-11-29", startTime: 11, endTime: 18 },
      { room: "GK202", date: "2024-11-29", startTime: 11, endTime: 15 },
      { room: "GK203", date: "2024-11-29", startTime: 11, endTime: 18 },
      { room: "GK204", date: "2024-11-29", startTime: 11, endTime: 18 },
      { room: "GK205", date: "2024-11-29", startTime: 11, endTime: 15 },
      { room: "GK206", date: "2024-11-29", startTime: 11, endTime: 18 },
      { room: "GK207", date: "2024-11-29", startTime: 11, endTime: 18 },
      { room: "GK208", date: "2024-11-29", startTime: 11, endTime: 15 },
      { room: "GK209", date: "2024-11-29", startTime: 11, endTime: 18 },
      { room: "GK210", date: "2024-11-29", startTime: 11, endTime: 18 },
      { room: "GK211", date: "2024-11-29", startTime: 11, endTime: 15 },
      { room: "GK212", date: "2024-11-29", startTime: 11, endTime: 18 },
      { room: "GK301", date: "2024-11-30", startTime: 11, endTime: 12 },
      { room: "GK302A", date: "2024-11-30", startTime: 11, endTime: 12 },
      { room: "GK302B", date: "2024-11-30", startTime: 11, endTime: 12 },
      { room: "GK401", date: "2024-11-30", startTime: 15, endTime: 16 },
      { room: "GK402", date: "2024-11-30", startTime: 15, endTime: 16 },
      { room: "GK403", date: "2024-11-30", startTime: 15, endTime: 16 },
      { room: "GK404", date: "2024-11-30", startTime: 15, endTime: 16 },
      { room: "GK101", date: "2024-11-30", startTime: 18, endTime: 21 },
      { room: "GK102", date: "2024-11-30", startTime: 18, endTime: 21 },
      { room: "GK103", date: "2024-11-30", startTime: 18, endTime: 21 },
    ];
    const schedules = [
      { day: 1, startTime: 9, endTime: 10, roomSet: "GK1" },
      { day: 1, startTime: 12, endTime: 14, roomSet: "GK2" },
      { day: 2, startTime: 10, endTime: 13, roomSet: "GK1" },
      { day: 3, startTime: 10, endTime: 11, roomSet: "GK1" },
      { day: 3, startTime: 11, endTime: 12, roomSet: "GK4" },
      { day: 3, startTime: 15, endTime: 16, roomSet: "GK3" },
      { day: 4, startTime: 10, endTime: 21, roomSet: "GK2" },
      { day: 5, startTime: 10, endTime: 11, roomSet: "GK2" },
      { day: 5, startTime: 18, endTime: 21, roomSet: "GK2" },
      { day: 6, startTime: 10, endTime: 11, roomSet: "GK3" },
      { day: 6, startTime: 12, endTime: 13, roomSet: "GK4" },
      { day: 6, startTime: 14, endTime: 15, roomSet: "GK4" },
      { day: 6, startTime: 16, endTime: 18, roomSet: "GK2" },
      { day: 6, startTime: 18, endTime: 19, roomSet: "GK1" },
    ];
    const roomSchedules_data = [
      { room: "GK101", day: 1, startTime: 12, endTime: 13 },
      { room: "GK101", day: 2, startTime: 13, endTime: 14 },
      { room: "GK101", day: 3, startTime: 14, endTime: 15 },
      { room: "GK101", day: 4, startTime: 15, endTime: 16 },
      { room: "GK101", day: 5, startTime: 16, endTime: 17 },
      { room: "GK101", day: 6, startTime: 17, endTime: 18 },
      { room: "GK102", day: 1, startTime: 12, endTime: 13 },
      { room: "GK102", day: 2, startTime: 13, endTime: 14 },
      { room: "GK102", day: 3, startTime: 14, endTime: 15 },
      { room: "GK102", day: 4, startTime: 15, endTime: 16 },
      { room: "GK102", day: 5, startTime: 16, endTime: 17 },
      { room: "GK102", day: 6, startTime: 17, endTime: 18 },
      { room: "GK103", day: 1, startTime: 12, endTime: 13 },
      { room: "GK103", day: 2, startTime: 13, endTime: 14 },
      { room: "GK103", day: 3, startTime: 14, endTime: 15 },
      { room: "GK103", day: 4, startTime: 15, endTime: 16 },
      { room: "GK103", day: 5, startTime: 16, endTime: 17 },
      { room: "GK103", day: 6, startTime: 17, endTime: 18 },
      { room: "GK104", day: 1, startTime: 12, endTime: 13 },
      { room: "GK104", day: 2, startTime: 13, endTime: 14 },
      { room: "GK104", day: 3, startTime: 14, endTime: 15 },
      { room: "GK104", day: 4, startTime: 15, endTime: 16 },
      { room: "GK104", day: 5, startTime: 16, endTime: 17 },
      { room: "GK104", day: 6, startTime: 17, endTime: 18 },
      { room: "GK105", day: 1, startTime: 12, endTime: 13 },
      { room: "GK105", day: 2, startTime: 13, endTime: 14 },
      { room: "GK105", day: 3, startTime: 14, endTime: 15 },
      { room: "GK105", day: 4, startTime: 15, endTime: 16 },
      { room: "GK105", day: 5, startTime: 16, endTime: 17 },
      { room: "GK105", day: 6, startTime: 17, endTime: 18 },
      { room: "GK106", day: 1, startTime: 12, endTime: 13 },
      { room: "GK106", day: 2, startTime: 13, endTime: 14 },
      { room: "GK106", day: 3, startTime: 14, endTime: 15 },
      { room: "GK106", day: 4, startTime: 15, endTime: 16 },
      { room: "GK106", day: 5, startTime: 16, endTime: 17 },
      { room: "GK106", day: 6, startTime: 17, endTime: 18 },
      { room: "GK401", day: 3, startTime: 10, endTime: 11 },
      { room: "GK401", day: 6, startTime: 10, endTime: 11 },
      { room: "GK402", day: 3, startTime: 10, endTime: 11 },
      { room: "GK402", day: 6, startTime: 10, endTime: 11 },
      { room: "GK403", day: 3, startTime: 10, endTime: 11 },
      { room: "GK403", day: 6, startTime: 10, endTime: 11 },
      { room: "GK404", day: 3, startTime: 10, endTime: 11 },
      { room: "GK404", day: 6, startTime: 10, endTime: 11 },
      { room: "GK405", day: 3, startTime: 10, endTime: 11 },
      { room: "GK405", day: 6, startTime: 10, endTime: 11 },
      { room: "GK406", day: 3, startTime: 10, endTime: 11 },
      { room: "GK406", day: 6, startTime: 10, endTime: 11 },
      { room: "GK407", day: 3, startTime: 10, endTime: 11 },
      { room: "GK407", day: 6, startTime: 10, endTime: 11 },
      { room: "GK408", day: 3, startTime: 10, endTime: 11 },
      { room: "GK408", day: 6, startTime: 10, endTime: 11 },
      { room: "GK407", day: 3, startTime: 14, endTime: 15 },
      { room: "GK407", day: 6, startTime: 14, endTime: 15 },
      { room: "GK408", day: 3, startTime: 14, endTime: 15 },
      { room: "GK408", day: 6, startTime: 14, endTime: 15 },
    ]
    const result = recommenderSystems(
      "2024-11-26, 08:59:17.32",
      schedules,
      reservations_data,
      special_rooms_data,
      special_roomTypes_data,
      roomSchedules_data
    );
    expect(result).toEqual([
      { date: "2024-11-26", startTime: 14, endTime: 15, room: "GK104" },
      { date: "2024-11-27", startTime: 13, endTime: 14, room: "GK404" },
      { date: "2024-11-27", startTime: 18, endTime: 19, room: "GK302B" },
      { date: "2024-11-29", startTime: 15, endTime: 16, room: "GK202" },
      { date: "2024-11-30", startTime: 11, endTime: 12, room: "GK303" },
      { date: "2024-11-30", startTime: 13, endTime: 14, room: "GK401" },
      { date: "2024-11-30", startTime: 15, endTime: 16, room: "GK405" },
    ]);
  });
  
});
