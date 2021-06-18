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

const InfoStyle = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`



// modal for clicking on events

Modal.setAppElement('body')

const Calendar = () => {
    // the app will store and retrieve events in localstorage
    const initialEvents = localStorage.getItem('events')
    const [events, setEvents] = useState(initialEvents ? JSON.parse(initialEvents) : [])
    const [eventInfo, setEventInfo] = useState(null)
    
    // add an event to state and save in localstorage
    const addEvent = (event) => {
        const newEvents = [
            ...events,
            event
        ]
        localStorage.setItem('events', JSON.stringify(newEvents))
        setEvents(newEvents)
    }



    // timeFormat, validateMinute, startBeforeEnd are common to both handleDateClick and updateEvent
    
    // will be used to verify that the user's input is in the correct time format
    const timeFormat = /^\d{1,2}:\d{2}([ap]m)?$/;
  
    // validates that the hour is within 0-23
    const validateHour = (hour) => {
      return hour >=0 && hour <= 23 ? true : false
    }
    
    // validates that the minute is within 0-59
    const validateMinute = (minute) => {
      return minute >= 0 && minute <= 59 ? true : false
    }
    
    // validates that the start time is before the end time
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



    
    // when the user clicks on a date in the calendar, it will prompt the user to create an event
    const handleDateClick = (arg) => {

        const name = prompt("Event name:")
        

        
        // does not create an event if the user doesn't specify a title

        if(name) {
          try {
            let userStart = prompt("Enter the event start in 24hr 'hh:mm' format: ")
            let hourStart = Number(userStart.substring(0,2))
            let minuteStart = Number(userStart.substring(3,5))
            // asks the user to try again if input is not valid
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
            // asks the user to try again if input is not valid
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
            // adds the event to the calendar
            addEvent({title: name, start: start, end: end, id: id, description: description})
          } catch {
            // warns the user if they click cancel
            alert("Event not created")
          }
        }
    }
    
    // sets the state based on the event that the user clicks on in the calendar
    const renderEventContent = ({event}) => {
      
      setEventInfo({
        title: event._def.title,
        start: event._instance.range.start,
        end: event._instance.range.end,
        description: event._def.extendedProps.description,
        id: event.id})

    }
    
    // once event info state is updated, opens the modal with the info about that event
    useEffect(() => {
      eventInfo && openModal()
    }, [eventInfo])


    // deletes the event from state and localstorage when the user clicks on the event and then clicks delete
    const deleteEvent = (event) => {
        event.preventDefault()
        const newEvents = events.filter(event => event.id !== Number(eventInfo.id))
        localStorage.setItem('events', JSON.stringify(newEvents))
        setEvents(newEvents)
        setEventInfo(null)
        setIsOpen(false)               
    }




    const editEvent = (event, str) => {

      event.preventDefault()
      const myEvent = events.filter(event => event.id === Number(eventInfo.id))[0]
      const newEvents = events.slice(0, events.length)
      const date = new Date()
      const timeZoneOffset = date.getTimezoneOffset()*60000


      let title = eventInfo.title
      let start = eventInfo.start
      let end = eventInfo.end
      let description = eventInfo.description
      let hourStart = start.getUTCHours()
      let minuteStart = start.getUTCMinutes()
      let hourEnd = end.getUTCHours()
      let minuteEnd = end.getUTCMinutes()




      try {

        if (str==='title') {

          title = prompt("Event name:")
          eventInfo.title = title
          myEvent.title = title

        } else if (str==='start') {

          let userStart = prompt("Enter the event start in 24hr 'hh:mm' format: ")
          hourStart = Number(userStart.substring(0,2))
          minuteStart = Number(userStart.substring(3,5))
          while (!userStart.match(timeFormat) || !validateHour(hourStart) || !validateMinute(minuteStart)) {
              alert("Please enter a valid time in 24hr 'hh:mm' format")
              userStart = prompt("Enter the event start in 24hr 'hh:mm' format: ")
              hourStart = Number(userStart.substring(0,2))
              minuteStart = Number(userStart.substring(3,5))
          } 

          eventInfo.start.setUTCHours(hourStart)
          eventInfo.start.setUTCMinutes(minuteStart)
          myEvent.start = Date.parse(eventInfo.start) + timeZoneOffset

        } else if (str==='end') {

          let userEnd = prompt("Enter the event end in 24hr 'hh:mm' format: ")
          hourEnd = Number(userEnd.substring(0,2))
          minuteEnd = Number(userEnd.substring(3,5))
          while (!userEnd.match(timeFormat) || !validateHour(hourEnd) || !validateMinute(minuteEnd) || !startBeforeEnd(hourStart, minuteStart, hourEnd, minuteEnd)) {
            alert("Please enter a valid time in 24hr 'hh:mm' format, ensuring that it is after the event start time")
            userEnd = prompt("Enter the event start in 24hr 'hh:mm' format: ")
            hourEnd = Number(userEnd.substring(0,2))
            minuteEnd = Number(userEnd.substring(3,5))
          }

          eventInfo.end.setUTCHours(hourEnd)
          eventInfo.end.setUTCMinutes(minuteEnd)
          myEvent.end = Date.parse(eventInfo.end) + timeZoneOffset

        } else if (str==='description') {
          description = prompt("Description (optional):")
          eventInfo.description = description
          myEvent.description = description
        }


        localStorage.setItem('events', JSON.stringify(newEvents))
        setEvents(newEvents)

      } catch {
        alert("Event not updated")
      }


      
    }




    // sets state for modal and functions to open and close the modal

    const [modalIsOpen,setIsOpen] = useState(false);
    function openModal() {
      setIsOpen(true);
    }
  
    function closeModal(){
      setIsOpen(false);
    }
    
    // converts date to Australian style
    const ausDateStyle = (date) => {
      return date.toLocaleString('en-AU', { timeZone: 'UTC' })
    }
      
    return (
        <CalendarSpan>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className='modal'
          overlayClassName='overlayModal'
          contentLabel="Event"
        >
          <InfoStyle>
            <p style={{margin: '5px'}}><b>Title:</b> {eventInfo && eventInfo.title}</p>
            <Button onClick={(event => {editEvent(event, 'title')})}>Edit</Button>
          </InfoStyle>

          <InfoStyle>
            <p style={{margin: '5px'}}><b>Start:</b> {eventInfo && ausDateStyle(eventInfo.start)}</p>
            <Button onClick={(event => {editEvent(event, 'start')})}>Edit</Button>
          </InfoStyle>

          <InfoStyle>
            <p style={{margin: '5px'}}><b>End:</b> {eventInfo && ausDateStyle(eventInfo.end)}</p>
            <Button onClick={(event => {editEvent(event, 'end')})}>Edit</Button>
          </InfoStyle>

          <InfoStyle>
            <p style={{margin: '5px'}}><b>Description:</b> {eventInfo && eventInfo.description}</p>
            <Button onClick={(event => {editEvent(event, 'description')})}>Edit</Button>
          </InfoStyle>

          <Button onClick={deleteEvent}>Delete event</Button>
          <Button onClick={closeModal}>Close window</Button>
        </Modal>


          <CalendarWrapper>
            <CalendarPadding>
              {/* Calendar from the fullcalendar.io library */}
              <FullCalendar
                  locale='en-gb'
                  titleFormat={{
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