import React, {useState, useEffect} from 'react'
import Modal from 'react-modal';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import styled from 'styled-components'

const CalendarSpan = styled.span`
  margin-top: 2rem;
  width: 65%; 
`

const CalendarWrapper = styled.span`
  width: 100%;
  margin-top: 2rem;
  margin-right: 2rem;
  margin-left: 2rem;
`
  
Modal.setAppElement('body')

const Calendar = () => {
    const initialEvents = localStorage.getItem('events')
    const [events, setEvents] = useState(initialEvents ? JSON.parse(initialEvents) : [])
    const [eventInfo, setEventInfo] = useState(null)
    const [eventTitle, setEventTitle] = useState('')
    const [eventStart, setEventStart] = useState('')
    const [eventEnd, setEventEnd] = useState('')
    const [eventDescription, setEventDescription] = useState('')
    
    const addEvent = (event) => {
        const newEvents = [
            ...events,
            event
        ]
        localStorage.setItem('events', JSON.stringify(newEvents))
        setEvents(newEvents)
    }
    
    const handleDateClick = (arg) => { // bind with an arrow function

        const timeFormat = /^\d{1,2}:\d{2}([ap]m)?$/;
        const name = prompt("Event name:")
        
        const validateHour = (hour) => {
          return hour >=0 && hour <= 23 ? true : false
        }
        
        const validateMinute = (minute) => {
          return minute >= 0 && minute <= 59 ? true : false
        }
        
        const startBeforeEnd = (startHour, startMinute, endHour, endMinute) => {
          if (startHour < endHour) {
            return true
          } else if (startHour > endHour) {
            return false
          } else if (startMinute < endMinute) {
            return true
          } else {
            return false
          }
        }
        
        
        if(name) {
          try {
            let userStart = prompt("Enter the event start in 24hr 'hh:mm' format: ")
            let hourStart = Number(userStart.substring(0,2))
            let minuteStart = Number(userStart.substring(3,5))
            while (!userStart.match(timeFormat) || !validateHour(hourStart) || !validateMinute(minuteStart)) {
                alert("Please enter a valid time in 24hr 'hh:mm' format")
                userStart = prompt("Enter the event start in 24hr 'hh:mm' format: ")
                hourStart = Number(userStart.substring(0,2))
                minuteStart = Number(userStart.substring(3,5))
            } 
            
            let start = arg.date.toString()
            
            let userEnd = prompt("Enter the event end in 24hr 'hh:mm' format: ")
            let hourEnd = Number(userEnd.substring(0,2))
            let minuteEnd = Number(userEnd.substring(3,5))
            while (!userEnd.match(timeFormat) || !validateHour(hourEnd) || !validateMinute(minuteEnd) || !startBeforeEnd(hourStart, minuteStart, hourEnd, minuteEnd)) {
                alert("Please enter a valid time in 24hr 'hh:mm' format, ensuring that it is after the event start time")
                userEnd = prompt("Enter the event start in 24hr 'hh:mm' format: ")
                hourEnd = Number(userEnd.substring(0,2))
                minuteEnd = Number(userEnd.substring(3,5))
              }
            
            let end = Date.parse(start.replace("00:00:00", userEnd + ":00"))
            start = Date.parse(start.replace("00:00:00", userStart + ":00"))
            let description = prompt("Description (optional):")
            let id = events.length ? events[events.length - 1].id + 1 : 1
            addEvent({title: name, start: start, end: end, id: id, description: description})
          } catch {
            alert("Event not created")
          }
        }
    }
    
    const renderEventContent = (eventInfo) => {
        setEventInfo(eventInfo)
        openModal()
    }

    const deleteEvent = () => {
        const newEvents = events.filter(event => event.id !== Number(eventInfo.event._def.publicId))
        localStorage.setItem('events', JSON.stringify(newEvents))
        setEvents(newEvents)
        setEventInfo(null)                
    }
    
    useEffect(()=>{
        if (eventInfo!==null) {
            setEventTitle(events.filter(event => event.id === Number(eventInfo.event._def.publicId))[0].title)
            setEventStart(events.filter(event => event.id === Number(eventInfo.event._def.publicId))[0].start)
            setEventEnd(events.filter(event => event.id === Number(eventInfo.event._def.publicId))[0].end)
            setEventDescription(events.filter(event => event.id === Number(eventInfo.event._def.publicId))[0].description)
        }
    },[])

    const [modalIsOpen,setIsOpen] = useState(false);
    function openModal() {
      setIsOpen(true);
    }
  
    function afterOpenModal() {
      // references are now sync'd and can be accessed.
    //   subtitle.style.color = '#f00';
    }
  
    function closeModal(){
      setIsOpen(false);
    }
      
    return (
        <CalendarSpan>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={{
            overlay: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.75)'
            },
            content: {
              position: 'absolute',
              top: '20%',
              left: '20%',
              right: '20%',
              bottom: '20%',
              border: '1px solid #ccc',
              background: '#fff',
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch',
              borderRadius: '10px',
              outline: 'none',
              padding: '20px',
            },
            overlay: {zIndex: 10}
          }}
          contentLabel="Event"
        >
          <button onClick={closeModal}>close</button>
          <div>EVENT</div>
          <p>Title: {eventTitle}</p>
          <p>Start: {new Date(eventStart).toString().substring(0,24)}</p>
          <p>End: {new Date(eventEnd).toString().substring(0,24)}</p>
          <p>Description: {eventDescription}</p>
          <form>
            <button onClick={deleteEvent}>DELETE</button>
          </form>
        </Modal>







          <CalendarWrapper>
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
          </CalendarWrapper>

      

        </CalendarSpan>
        

    )
}

export default Calendar