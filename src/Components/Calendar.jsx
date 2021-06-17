import React, {useState, useEffect} from 'react'
import Modal from 'react-modal';
import FullCalendar, { EventApi } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import styled from 'styled-components'
import Button from './Button'

const CalendarSpan = styled.span`
  margin-top: 2rem;
  width: 65%; 
  font-family: 'Manrope', sans-serif;
  font-weight: bold;
  
  @media only screen and (max-width: 700px) {
    width: 100%;
  }
`

const CalendarWrapper = styled.div`
    width: 94%;
    height: 100%;
    margin-left: 3%;
    margin-right: 3%;
    background-color: rgb(255,255,255,0.7);
`

const CalendarPadding = styled.div`
    padding: 1rem;
`

Modal.setAppElement('body')

const Calendar = () => {
    const initialEvents = localStorage.getItem('events')
    const [events, setEvents] = useState(initialEvents ? JSON.parse(initialEvents) : [])
    const [eventInfo, setEventInfo] = useState(null)
    const [currentEvent, setCurrentEvent] = useState(null)
    
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
    
    const renderEventContent = ({event}) => {
      console.log(event)
      console.log(localStorage)
      // setCurrentEvent(event)
      // setEventInfo({title: event._def.title, start: event._instance.range.start, end: event._instance.range.end, description: event._def.extendedProps.description, id: event.id})
      setEventInfo({title: event._def.title, start: event._instance.range.start, end: event._instance.range.end, description: event._def.extendedProps.description, id: event.id})
    }
    
    useEffect(() => {
      eventInfo && openModal()
    }, [eventInfo])



    const deleteEvent = (event) => {
        event.preventDefault()
        const newEvents = events.filter(event => event.id !== Number(eventInfo.id))
        localStorage.setItem('events', JSON.stringify(newEvents))
        setEvents(newEvents)
        setEventInfo(null)
        setIsOpen(false)               
    }



    const editEvent = (event) => {
      event.preventDefault()
      let  newInfo = prompt("Description (optional):")

      const myEvent = events.filter(event => event.id === Number(eventInfo.id))[0]
      myEvent.description = newInfo
      
      let newEvents = events.slice(0, events.length)

      localStorage.setItem('events', JSON.stringify([{title: myEvent.title, start: myEvent.start, end: myEvent.end, description: myEvent.description, id: myEvent.id}]))
      // localStorage.setItem('events', JSON.stringify(events))
      setEventInfo({title: myEvent.title, start: Date(myEvent.start), end: Date(myEvent.end), description: myEvent.description, id: myEvent.id})
      setEvents(newEvents)

      // let newEvents = [{title: myEvent.title, start: myEvent.title, end: myEvent.end, id:  myEvent.id, description: newInfo}]


      console.log(events)
      console.log(localStorage['events'])



      
    }

    const [modalIsOpen,setIsOpen] = useState(false);
    function openModal() {
      console.log()
      setIsOpen(true);
    }
  
    function closeModal(){
      setIsOpen(false);
    }
    
    const ausDateStyle = (date) => {
      return date.toLocaleString('en-AU', { timeZone: 'UTC' })
      // let dateString = date.toString().substring(0,21)
      // return dateString.substring(0,4) + dateString.substring(8,11) + dateString.substring(4,8) + dateString.substring(11)
    }
      
    return (
        <CalendarSpan>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={{
            overlay: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.75)',
              zIndex: 10
            },
            content: {
              position: 'absolute',
              top: '20%',
              left: '38%',
              right: '38%',
              bottom: '20%',
              border: '1px solid #ccc',
              background: 'rgba(245, 245, 245)',
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch',
              borderRadius: '10px',
              outline: 'none',
              padding: '20px',
            }
          }}
          contentLabel="Event"
        >
          <p>Title: {eventInfo && eventInfo.title}</p>
          <p>Start: {eventInfo && ausDateStyle(eventInfo.start)}</p>
          <p>End: {eventInfo && ausDateStyle(eventInfo.end)}</p>
          <p>Description: {eventInfo && eventInfo.description}</p>
          <form>
            <Button onClick={deleteEvent}>Delete event</Button>
          </form>
          <Button onClick={editEvent}>Edit event</Button>
          <Button onClick={closeModal}>Close window</Button>
        </Modal>

          <CalendarWrapper>
            <CalendarPadding>
            <FullCalendar
                locale='en-gb'
                titleFormat={{ // will produce something like "Tuesday, September 18, 2018"
                  month: 'short',
                  day: 'numeric',
                }}
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
            </CalendarPadding>
          </CalendarWrapper>

      

        </CalendarSpan>
        

    )
}

export default Calendar