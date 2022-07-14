import React from 'react'

//este es parte del calendario para ser capaz de mostrar el usuario que crea el evento
const CustonCalendarEvent = ({event}) => {
  return (
    <>
        <strong> {event.title }</strong>
        <span className='text-warning'> - { event.user }</span>
    </>

  )
}

export default CustonCalendarEvent