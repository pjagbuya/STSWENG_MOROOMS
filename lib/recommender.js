
function recommenderSystems(schedules){
    let current = new Date()
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
            rooms.append(getRooms(schedule.roomSet))
        }

        for(let room in rooms){
            reservations.append({"room" : room, "reservations": getReservations(room, checkDate)})
        }

        for(let recommendation in (checkAvailability(checkSchedule, rooms, reservations))){
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