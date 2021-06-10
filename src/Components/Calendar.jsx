import React, {useState} from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"

const Calendar = () => {
    const initialEvents = localStorage.getItem('events')
    const [events, setEvents] = useState(initialEvents ? JSON.parse(initialEvents) : [])
    
    const addEvent = (event) => {
        const newEvents = [
            ...events,
            event
        ]
        localStorage.setItem('events', JSON.stringify(newEvents))
        setEvents(newEvents)
    }
    
    const handleDateClick = (arg) => { // bind with an arrow function
        const name = prompt("Event name:")
        if(name) {
            const userStart = prompt("Enter the event start in 24hr 'hh:mm' format: ")
            let start = arg.date.toString()
            const userEnd = prompt("Enter the event end in 24hr 'hh:mm' format: ")
            let end = Date.parse(start.replace("00:00:00", userEnd + ":00"))
            start = Date.parse(start.replace("00:00:00", userStart + ":00"))
            let id = events.length ? events[events.length - 1].id + 1 : 1
            addEvent({title: name, start: start, end: end, id: id})
        }
    }
    
    const renderEventContent = (eventInfo) => {
        let toDelete
        if (window.confirm(`Do you want to delete the event ${eventInfo.event._def.title}?`)) {
            toDelete = true;
        } else {
            toDelete = false;
        }
        if(toDelete) {
            const newEvents = events.filter(event => event.id !== Number(eventInfo.event._def.publicId))
            localStorage.setItem('events', JSON.stringify(newEvents))
            setEvents(newEvents)
        }
    }
      
    return (
        <FullCalendar
            plugins={[ dayGridPlugin, interactionPlugin ]}
            headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,dayGridWeek,dayGridDay"
              }}
            initialView="dayGridWeek"
            events={events}
            dateClick={handleDateClick}
            eventClick={renderEventContent}
        />
    )
}

export default Calendar