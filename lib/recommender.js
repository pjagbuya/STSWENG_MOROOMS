function getRooms(roomSet, rooms_data, roomTypes_data) {
  const rooms = [];
  const unformattedRooms = [];

  // temp functionality
  for (let room_data of rooms_data) {
    if (room_data.roomSet == roomSet) {
      if (roomTypes_data[room_data.roomType] !== undefined) {
        unformattedRooms.push({
          room: room_data.room,
          roomSet: room_data.roomSet,
          startTime: roomTypes_data[room_data.roomType].startTime,
          endTime: roomTypes_data[room_data.roomType].endTime,
        });
      }
    }
  }
  //

  for (let room of unformattedRooms) {
    rooms.push({
      room: room.room,
      roomSet: room.roomSet,
      startTime: room.startTime,
      endTime: room.endTime,
    });
  }
  return rooms;
}

function getReservations(room, checkDate, reservations_data) {
  const reservations = [];
  const unformattedReservations = []; //getReservationFromDB where room and checkDate

  // temp functionality
  for (let reservation_data of reservations_data) {
    if (reservation_data.room == room && reservation_data.date == checkDate) {
      unformattedReservations.push({
        room: reservation_data.room,
        startTime: reservation_data.startTime,
        endTime: reservation_data.endTime,
      });
    }
  }
  //

  for (let reservation of unformattedReservations) {
    reservations.push({
      room: reservation.room,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
    });
  }
  return reservations;
}

function getRoomSchedules(room, checkDay, roomSchedules_data) {
  const roomSchedules = [];
  const unformattedRoomSchedules = []; //getReservationFromDB where room and checkDate

  // temp functionality
  for (let roomSchedule_data of roomSchedules_data) {
    if (roomSchedule_data.room == room && roomSchedule_data.day == checkDay) {
      unformattedRoomSchedules.push({
        room: roomSchedule_data.room,
        startTime: roomSchedule_data.startTime,
        endTime: roomSchedule_data.endTime,
      });
    }
  }
  //

  for (let roomSchedule of unformattedRoomSchedules) {
    roomSchedules.push({
      room: roomSchedule.room,
      startTime: roomSchedule.startTime,
      endTime: roomSchedule.endTime,
    });
  }
  return roomSchedules;
}

function checkAvailability(
  schedules,
  reservations,
  roomSchedules,
  currentHour,
  isCurrentDate,
  currentFullDate,
  currentDay,
) {
  const recommendations = [];
  const time = [];
  const rooms = [];

  for (let i = 0; i < reservations.length; i++) {
    if (rooms.length == 0) {
      rooms.push([]);
      rooms[0].push(reservations[i].room.roomSet);
    }
    let isExist = false;
    for (let j = 0; j < rooms.length; j++) {
      if (reservations[i].room.roomSet == rooms[j][0]) {
        isExist = true;
        rooms[j].push({
          room: reservations[i].room,
          reservations: reservations[i].reservations,
        });
      }
    }
    if (!isExist) {
      rooms.push([]);
      rooms[rooms.length - 1].push(reservations[i].room.roomSet);
      rooms[rooms.length - 1].push({
        room: reservations[i].room,
        reservations: reservations[i].reservations,
        roomSchedules: [],
      });
    }
  }

  for (let i = 0; i < roomSchedules.length; i++) {
    for (let j = 0; j < rooms.length; j++) {
      for (let k = 1; k < rooms[j].length; k++) {
        if (roomSchedules[i].room.room == rooms[j][k].room.room) {
          rooms[j][k].roomSchedules = roomSchedules[i].roomSchedules;
        }
      }
    }
  }

  for (let i = 0; i < rooms.length; i++) {
    time.push([]);
    // Room Availability for whole day
    for (let j = 1; j < rooms[i].length; j++) {
      time[i].push([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      for (let k = 0; k < rooms[i][j].room.startTime; k++) {
        time[i][j - 1][k] = 1;
      }
      for (let k = rooms[i][j].room.endTime; k < 24; k++) {
        time[i][j - 1][k] = 1;
      }
    }

    // Room unavailable due to reservations
    for (let j = 1; j < rooms[i].length; j++) {
      for (let k = 0; k < rooms[i][j].reservations.length; k++) {
        for (
          let l = rooms[i][j].reservations[k].startTime;
          l < rooms[i][j].reservations[k].endTime;
          l++
        ) {
          time[i][j - 1][l] = 1;
        }
      }
    }

    // Room unavailable due to room schedules
    for (let j = 1; j < rooms[i].length; j++) {
      for (let k = 0; k < rooms[i][j].roomSchedules.length; k++) {
        for (
          let l = rooms[i][j].roomSchedules[k].startTime;
          l < rooms[i][j].roomSchedules[k].endTime;
          l++
        ) {
          time[i][j - 1][l] = 1;
        }
      }
    }

    if (isCurrentDate) {
      for (let j = 1; j < rooms[i].length; j++) {
        for (let k = 0; k < currentHour + 1; k++) {
          time[i][j - 1][k] = 1;
        }
      }
    }

    for (let schedule of schedules) {
      for (let j = 1; j < rooms[i].length; j++) {
        for (let k = schedule.startTime; k < schedule.endTime; k++) {
          time[i][j - 1][k] = 1;
        }
      }
    }
  }

  for (let i = 0; i < schedules.length; i++) {
    for (let j = 0; j < rooms.length; j++) {
      if (schedules[i].roomSet == rooms[j][0]) {
        if (schedules.length - 1 > i) {
          for (
            let k = schedules[i].endTime;
            k < schedules[i + 1].startTime;
            k++
          ) {
            for (let l = 1; l < rooms[j].length; l++) {
              if (time[j][l - 1][k] == 0) {
                recommendations.push({
                  date: currentFullDate,
                  startTime: k,
                  endTime: k + 1,
                  room: rooms[j][l].room.room,
                });
                j = rooms.length + 1;
                k = schedules[i + 1].startTime + 1;
                break;
              }
            }
          }
        } else {
          for (let k = schedules[i].endTime; k < 24; k++) {
            for (let l = 1; l < rooms[j].length; l++) {
              if (time[j][l - 1][k] == 0) {
                recommendations.push({
                  date: currentFullDate,
                  startTime: k,
                  endTime: k + 1,
                  room: rooms[j][l].room.room,
                });
                j = rooms.length + 1;
                k = 24;
                break;
              }
            }
          }
        }
      }
    }
  }

  return recommendations;
}

function filterRooms(unfilteredRooms) {
  const rooms = [];
  for (let room of unfilteredRooms) {
    if (rooms.length == 0) {
      rooms.push(room);
    } else {
      let similar = false;
      for (let checkRoom of rooms) {
        if (checkRoom.room == room.room) {
          similar = true;
        }
      }
      if (!similar) {
        rooms.push(room);
      }
    }
  }
  return rooms;
}

module.exports.recommenderSystems = function(
  date,
  schedules,
  reservations_data,
  rooms_data,
  roomTypes_data,
  roomSchedules_data,
) {
  let current = new Date(date);
  const recommendations = [];
  let j = 0;
  for (let i = current.getDay(); i < 7; i++) {
    let checkDay = i;
    let checkDate = current.getDate() + j;
    let checkFullDate = current
      .getFullYear()
      .toString()
      .concat('-')
      .concat(
        (current.getMonth() + 1).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }),
      )
      .concat('-')
      .concat(
        checkDate.toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }),
      );
    let checkHour = current.getHours();
    const checkSchedule = [];
    const unfilteredRooms = [];
    const reservations = [];
    const roomSchedules = [];
    for (let schedule of schedules) {
      if (schedule.day == i && schedule.startTime > checkHour) {
        checkSchedule.push(schedule);
      } else {
        if (schedule.day == i) {
          checkSchedule.push(schedule);
        }
      }
    }

    for (let schedule of checkSchedule) {
      for (let room of getRooms(schedule.roomSet, rooms_data, roomTypes_data)) {
        unfilteredRooms.push(room);
      }
    }

    const rooms = filterRooms(unfilteredRooms);

    for (let room of rooms) {
      reservations.push({
        room: room,
        reservations: getReservations(
          room.room,
          checkFullDate,
          reservations_data,
        ),
      });
    }

    for (let room of rooms) {
      roomSchedules.push({
        room: room,
        roomSchedules: getRoomSchedules(
          room.room,
          checkDay,
          roomSchedules_data,
        ),
      });
    }

    for (let recommendation of checkAvailability(
      checkSchedule,
      reservations,
      roomSchedules,
      checkHour,
      checkDate == current.getDate(),
      checkFullDate,
      checkDay,
    )) {
      recommendations.push(recommendation);
    }

    j++;
  }

  return recommendations;
}
