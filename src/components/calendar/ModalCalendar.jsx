import { useState } from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/esm/Button'
import { addHours, differenceInSeconds } from 'date-fns'
import DatePicker, { registerLocale } from "react-datepicker";

import es from 'date-fns/locale/es';

registerLocale('es', es)
import "react-datepicker/dist/react-datepicker.css";
import { useAppProvider } from '../../context/actasContext/AppProvider';
import { useAuth } from '../../context/userContext/UserProvider';
import { useEffect } from 'react';



const ModalCalendar = (props) => {

  const [inputs, setInputs] = useState({
    title:  '',
    notes: '',
    start: new Date(),
    end: addHours(new Date(), 2)
  })

  const { agregarOEditarEventofn } = useAppProvider()
  const { user } = useAuth()

  //esto funciona por si se selecciona fechas en el calendario
  useEffect(() => {
    console.log('useffect ejecutandose')
    if (props.selectedDates.start) {
      console.log('aqui en la validaccion de use effect')
      setInputs({
        ...inputs,
        ['start']: props.selectedDates.start,
        ['end']: props.selectedDates.end
      })
    }
  }, [props.selectedDates.start])


//este useeffect controla si se edita un evento o no
  useEffect(() => {

    console.log('useeffect de editar')
    setInputs({
      title: props.eventToEdit.title,
      notes: props.eventToEdit.notes,
      start: props.eventToEdit.start,
      end: props.eventToEdit.end,
      _id: props.eventToEdit._id
    })

  }, [props.eventToEdit._id])



  //este useEffect es para resetear el formulario cuando se oculta el modal
  useEffect(() => {
    if (!props.show) {
      setInputs({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours(new Date(), 2)
      })
      props.setEventToEdit({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours(new Date(), 2)
      })
    }
    console.log('reseteal form useEffect')
  }, [props.show])


  //estas dos obtienenen los inputs del formulario
  const onFirstInputChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    })
  }
  //este obtiene la fecha, se esta usando el datepicker
  const onSecondInputChange = (e, property) => {
    setInputs({
      ...inputs,
      [property]: e
    })
  }


  //este es el handle submits
  const handleSubmit = (e) => {
    e.preventDefault()

    //codigo de validacion
    const validTime = differenceInSeconds(inputs.end, inputs.start)
    if (isNaN(validTime) || validTime <= 0) {
      console.log('error en la fecha')
      return
    }
    if (inputs.title.length <= 0) {
      console.log('titulo obligatorio')
      return
    }


    //aqui se agregar el correo que crea el evento y luego se manda al provider para la llamada al backend y almacenarlo en la base de datos
    inputs.user = props.eventToEdit._id ? props.eventToEdit.user :  user.email
    agregarOEditarEventofn(inputs)


    //aqui se limpia el formulario despues de almacenar los datos
    setInputs({
      title: '',
      notes: '',
      start: new Date(),
      end: addHours(new Date(), 2)
    })

    //despues de que todo sale bien este oculta el modal
    props.onHide()

  }


  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Formulario Agregar un Evento
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <h1> Nuevo evento </h1>
        <hr />
        <form onSubmit={handleSubmit} className="container">

          <div className="form-group mb-2">
            <label>Fecha y hora inicio</label>
            <DatePicker
              className='form-control'
              locale="es"
              selected={inputs.start}
              timeInputLabel="Time:"
              timeFormat="HH:mm"
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
              selectsStart
              startDate={inputs.start}
              endDate={inputs.end}
              onChange={(event) => onSecondInputChange(event, 'start')} />
          </div>

          <div className="form-group mb-2">
            <label>Fecha y hora fin</label>
            <DatePicker
              className='form-control'
              locale="es"
              selected={inputs.end}
              timeInputLabel="Time:"
              timeFormat="HH:mm"
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
              selectsEnd
              startDate={inputs.start}
              endDate={inputs.end}
              minDate={inputs.start}
              onChange={(event) => onSecondInputChange(event, 'end')} />
          </div>

          <hr />
          <div className="form-group mb-2">
            <label>Titulo y notas</label>
            <input
              type="text"
              className="form-control"
              placeholder="Título del evento"
              name="title"
              autoComplete="off"
              value={inputs.title}
              onChange={onFirstInputChange}
            />
            <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
          </div>

          <button
            type="submit"
            className="btn btn-outline-primary btn-block"
          >
            Guardar
          </button>

        </form>


      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalCalendar