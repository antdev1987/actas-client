import React from 'react'

const CustonCalendarEvent = ({event}) => {

    // console.log(event)
    
  return (

    <>
        <strong> {event.title }</strong>
        <span className='text-warning'> - { event.user }</span>
    </>

  )
}

export default CustonCalendarEvent