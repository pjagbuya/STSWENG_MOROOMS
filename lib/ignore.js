function getRooms(roomSet, rooms_data, roomTypes_data) {
    const rooms = [];
    const unformattedRooms = [];

    // temp functionality
    for (let room_data of rooms_data) {
        if (room_data.roomSet == roomSet) {
            unformattedRooms.push({
                room: room_data.room,
                roomSet: room_data.roomSet,
                startTime: roomTypes_data[room_data.roomType].startTime,
                endTime: roomTypes_data[room_data.roomType].endTime,
            });
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
        if (
            reservation_data.room == room &&
            reservation_data.date == checkDate
        ) {
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

function checkAvailability(schedules, reservations, currentHour, isCurrentDate, date, currentDay) {
    const recommendations = [];
    const time = [];

    for (let i = 0; i < reservations.length; i++) {
        time.push([
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0,
        ]);
        for (let reservation of reservations[i].reservations) {
            
            for (let j = reservation.startTime; j < reservation.endTime; j++) {
                time[i][j] = 1;
            }
        }
        for (let j = 0; j < reservations[i].room.startTime; j++) {
            time[i][j] = 1;
        }
        for (let j = reservations[i].room.endTime; j < 24; j++) {
            time[i][j] = 1;
        }
    }

    if (isCurrentDate) {
        for (let i = 0; i < reservations.length; i++) {
            for (let j = 0; j < currentHour + 1; j++) {
                time[i][j] = 1;
            }
        }
    }

    for (let schedule of schedules) {
        for (let i = 0; i < reservations.length; i++) {
            for (let j = schedule.startTime; j < schedule.endTime; j++) {
                time[i][j] = 1;
            }
        }
    }

    for (let i = 0; i < schedules.length; i++) {
        for (let j = 0; j < reservations.length; j++) {
            if(schedules[i].roomSet == reservations[j].room.roomSet && currentDay == schedules[i].day){
                if(schedules.length-1 > i){
                    for(let k = schedules[i].endTime; k < schedules[i+1].startTime; k++){
                        if (time[j][k] == 0) {
                            recommendations.push({
                                date: date,
                                startTime: k,
                                endTime: k + 1,
                                room: reservations[j].room.room,
                            });
                            break;
                        }
                    }
                }
                else{
                    for(let k = schedules[i].endTime; k < reservations[j].room.endTime; k++){
                        if (time[j][k] == 0) {
                            recommendations.push({
                                date: date,
                                startTime: k,
                                endTime: k + 1,
                                room: reservations[j].room.room,
                            });
                            break;
                        }
                    }
                }
            }
        }
    }
    return recommendations;
}

function filterRooms(unfilteredRooms){
    const rooms = []
    for(let room of unfilteredRooms){
        if(rooms.length == 0){
            rooms.push(room)
        }
        else{
            let similar = false
            for(let checkRoom of rooms){
                if(checkRoom.room == room.room){
                    similar = true
                }
            }
            if(!similar){
                rooms.push(room)
            }
        }
    }
    return rooms 
}

function recommenderSystems(
    date,
    schedules,
    reservations_data,
    rooms_data,
    roomTypes_data,
) {
    let current = new Date(date);
    const recommendations = [];
    let j = 0;
    for (let i = current.getDay(); i < 7; i++) {
        let checkDay = current.getDate() + j;
        let checkDate = current.getFullYear().toString().concat("-").concat((current.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})).concat("-").concat(checkDay.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));
        let checkHour = current.getHours();
        const checkSchedule = [];
        const unfilteredRooms = [];
        const reservations = [];
        for (let schedule of schedules) {
            
            if (schedule.day == i && schedule.startTime > checkHour) {
                checkSchedule.push(schedule);
            }
            else{
                if(schedule.day >= i) {
                    checkSchedule.push(schedule);
                }
            }
        }

        for (let schedule of checkSchedule) {
            for (let room of getRooms(schedule.roomSet, rooms_data, roomTypes_data)){
                unfilteredRooms.push(
                    room
                )
            }
        }

        const rooms = filterRooms(unfilteredRooms)

        for (let room of rooms) {
            reservations.push({
                room: room,
                reservations: getReservations(
                    room.room,
                    checkDate,
                    reservations_data,
                ),
            });
        }

        for (let recommendation of checkAvailability(
            checkSchedule,
            reservations,
            checkHour,
            checkDay == current.getDate(),
            checkDate, i
        )) {
            recommendations.push(recommendation);
        }

        j++;
    }

    return recommendations;
}

module.exports = recommenderSystems;
