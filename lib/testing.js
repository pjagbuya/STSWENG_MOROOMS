function getRooms(roomSet, rooms_data, roomTypes_data){
    let rooms = []
    let unformattedRooms = []

    // temp functionality
    for(let room_data in rooms_data){
        if(room_data.roomSet == roomSet){
            unformattedRooms.append({
                "room" : room_data.room,
                "roomSet" : room_data.roomSet,
                "startTime" : roomTypes_data[room_data.roomType].startTime,
                "endTime" : roomTypes_data[room_data.roomType].endTime
            })
        }
    }
    //

    for(let room in unformattedRooms){
        rooms.append({
            "room" : room.room,
            "roomSet" : room.roomSet,
            "startTime" : room.startTime,
            "endTime" : room.endTime
        })
    }
    return rooms
}

function getReservations(room, checkDate, reservations_data){
    let reservations = []
    let unformattedReservations = [] //getReservationFromDB where room and checkDate

    // temp functionality
    for(let reservation_data in reservations_data){
        if(reservation_data.room == room && reservation_data.date == checkDate){
            unformattedReservations.append({
                "room" : reservation_data.room,
                "startTime" : reservation_data.startTime,
                "endTime" : reservation_data.endTime
            })
        }
    }
    //

    for(let reservation in unformattedReservations){
        reservations.append({
            "room" : reservation.room,
            "startTime" : reservation.startTime,
            "endTime" : reservation.endTime
        })
    }
    return reservations
}

function recommenderSystems(date, schedules, reservations_data, rooms_data, roomTypes_data){
    let current = new Date(date)
    let recommendations = []
    for(let i = current.getDay(); i < 7; i++){
        let checkDate = (current.getMonth()+1).toString().concat("/").concat(current.getDay().toString());
        let checkHour = current.getHours()
        let checkSchedule = []
        let rooms = []
        let reservations = []
        for(let schedule in schedules){
            if(schedule.date == i && schedule.startTime > checkHour){
                checkSchedule.append(schedule)
            }
        }
        
        for(let schedule in checkSchedule){
            rooms.append(getRooms(schedule.roomSet, rooms_data, roomTypes_data))
        }

        for(let room in rooms){
            reservations.append({"room" : room, "reservations": getReservations(room, checkDate, reservations_data)})
        }

        for(let recommendation in (checkAvailability(checkSchedule, reservations))){
            recommendations.append(recommendation)
        }
    }

    return recommendations
}

function checkAvailability(schedules, reservations){
    let recommendations = []

    for(let schedule in schedules){
        for(let reservation in reservations){
            if(reservation.reservations.lenght == 0){
                recommendations.append({
                    "day" : schedule.day,
                    "start_time" : schedule.endTime,
                    "end_time" : schedule.endTime + 1,
                    "room" : reservation.room
                })
            }
            else{
                if(schedule.endTime <= reservation.startTime || schedule.endTime >= reservation.endTime){
                    recommendations.append({
                        "day" : schedule.day,
                        "start_time" : schedule.endTime,
                        "end_time" : schedule.endTime + 1,
                        "room" : reservation.room
                    })
                }
            }
        }
    }

    return recommendations
}