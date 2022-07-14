import { useState, useEffect } from 'react'
import { useAppProvider } from '../context/actasContext/AppProvider'

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import esEs from 'date-fns/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css';


import Button from 'react-bootstrap/Button'
import ModalCalendar from '../components/calendar/ModalCalendar'
import CustonCalendarEvent from '../components/calendar/CustonCalendarEvent'
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import SideBar from '../components/calendar/SideBar'


//configuracion del big calendar y el date-fns para pasar idioma a espanol
const locales = {
  'es': esEs,
}
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})




const PlanMantenimiento = () => {

  const [modalShow, setModalShow] = useState(false)
  const { obtenerEventosfn, eventosBd, eliminarEventofn } = useAppProvider()

  // Activar o Desactivar Sidebar
  const [sideActive, setSideActive] = useState(false)

  //esto se envia como props a modalcalendar cuando se selecciona fechas en el calendario
  const [selectedDates, setSelectedDates] = useState({})
  const [eventToEdit,setEventToEdit] = useState({})

  //funcion encargada de cargar la base de datos eventos siempre que se ingrese a la pagina (plan mantenimiento)
  useEffect(() => {
    console.log('plan mantenimiento en use effect')
    obtenerEventosfn()
  }, [eventosBd?.length])


  /*
  aqui transformo los eventos obtenidos de la base de datos,, ya que siempre que se obtienen los campos 
  fechas se ponen como string y el programa big calendar trabaja con las propiedates tipo  {objeto fecha}
  */
  const transformer = eventosBd?.map((item) => {
    return {
      ...item,
      ['start']: new Date(item.start),
      ['end']: new Date(item.end)
    }
  })


  /*funcion que captura cuando seleccionas varias fechas al instante, entonces abro el modal y paso las fechas seleccionadas
  al modal calendar que es donde esta el formulario asi lo cargo en el formulario
  */
  const handleSelectSlot = (e) => {
    setSelectedDates(e)
    setModalShow(true)
  }


  //este administra las opciones cuando se da doble click en un evento muestra editar o eliminar
  const onDoubleClickOpciones = (event) => {
    console.log(event)
    Swal.fire({
      title: 'Eliga que desea hacer',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Editar',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      if (result.isConfirmed) {
        setModalShow(true)
        setEventToEdit(event)
      } else if (result.isDenied) {
        eliminarevento(event)
      }
    })
    
  }
  const eliminarevento = (event)=>{
    
      Swal.fire({
      title: 'Estas Seguro?',
      text: "No seras capaz de revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Eliminar!',

    }).then((result) => {
      if (result.isConfirmed) {

        eliminarEventofn(event._id)
        Swal.fire(
          'Eliminado!',
          'Usuario Eliminado.',
          'success'
        )
      }

    })
  }





  return (

    <div className='container-fluid'>

      <div className='row border'>

        <div className='col-8 p-4' style={{flex: "1"}}>
          <Calendar
            className='border border-4'
            culture='es'
            localizer={localizer}
            events={transformer}
            startAccessor="start"
            endAccessor="end"
            selectable={true}
            onSelectSlot={handleSelectSlot}
            style={{ height: '87vh' }}
            messages={{
              next: ">",
              previous: "<",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día"
            }}
            components={{
              event: CustonCalendarEvent
            }}
            onDoubleClickEvent={onDoubleClickOpciones}
          />
        </div>

        <div className={` p-4 border border-4 side ${sideActive ? "col-4" : "closeSide"}`}>
          <button className={`arrow ${sideActive ? "" : "close"}`} onClick={() => { setSideActive(!sideActive)}}> <i className="bi bi-arrow-left-circle-fill fs-1"></i> </button>
          <SideBar/>
        </div>


      </div>


      <Button variant="primary" className='modalButton ' onClick={() => setModalShow(true)}>
        <i className="bi fs-4 bi-plus-lg"></i>
      </Button>

      <ModalCalendar
        selectedDates={selectedDates}
        show={modalShow}
        onHide={() => setModalShow(false)}
        eventToEdit={eventToEdit}
        setEventToEdit={setEventToEdit}
      />

    </div>

  )
}

export default PlanMantenimiento