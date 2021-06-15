import React, {useState, useEffect} from 'react'
import Modal from 'react-modal';
import ReactDOMServer from 'react-dom/server';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import styled from 'styled-components'



const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      zIndex: '-1'
    }
};

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
        if(name) {
            let userStart = prompt("Enter the event start in 24hr 'hh:mm' format: ")
            while (!userStart.match(timeFormat)) {
                alert("Please enter a valid time")
                userStart = prompt("Enter the event start in 24hr 'hh:mm' format: ")
            }
            let start = arg.date.toString()
            let userEnd = prompt("Enter the event end in 24hr 'hh:mm' format: ")
            while (!userEnd.match(timeFormat)) {
                alert("Please enter a valid time")
                userEnd = prompt("Enter the event start in 24hr 'hh:mm' format: ")
            }
            let end = Date.parse(start.replace("00:00:00", userEnd + ":00"))
            start = Date.parse(start.replace("00:00:00", userStart + ":00"))
            let description = prompt("Description:")
            let id = events.length ? events[events.length - 1].id + 1 : 1
            addEvent({title: name, start: start, end: end, id: id, description: description})
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
    })



    var subtitle;
    const [modalIsOpen,setIsOpen] = React.useState(false);
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
        //   style={customStyles}
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