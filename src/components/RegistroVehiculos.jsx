import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2'
import './App.css'
import { useHistory, useParams } from 'react-router';
import { Enviroments } from '../../enviroments/enviroments.url';


export const RegistroVehiculo = ({ setReload }) => {
    const { _id } = useParams();
    const history = useHistory();
    const initialState = {
        strMarca: '',
        strModelo: '',
        nmbAño: '',
        strDescripcion: '',
        strPlacas: '',
        strColor: '#000000',
        idCajon: _id == "undefined" ? '' : _id,
        idPersona: 0,
        blnActivo: true
    }
    const [data, setData] = useState(initialState);
    const [persona, setPersona] = useState([]);
    const [cajon, setCajon] = useState([]);
    const [cargar, setCargar] = useState(true)
    const [nombreCajon, setNombreCajon] = useState()
    const handleInputChange = ({ target }) => {
        setData({
            ...data,
            [target.name]: target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${Enviroments.urlBack}/api/vehiculo`, data)
                .then(res => {
                    setCargar(false)
                    setReload(reload => !reload);
                    setData(initialState);
                    history.push('/rentar/undefined')
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        text: res.data.msg,
                        showConfirmButton: false,
                        timer: 1500
                    })

                })
            setCargar(true)
        } catch (error) {
            setReload(reload => !reload);
            console.log(error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                text: error.response ? error.response.data.msg : error,
                showConfirmButton: false,
                timer: 1500
            })
        }

    }

    useEffect(() => {
        try {
            axios.get(`${Enviroments.urlBack}/api/cajon/${true}`,).then((res) => {
                const data = res.data.cont.cajon;
                for (const iterator of res.data.cont.cajon) {
                    if (iterator._id == _id) {
                        setNombreCajon(iterator.nmbCajon)
                    }
                }
                if (data.length < 1) {
                    Swal.fire({
                        title: 'No existen cajones disponibles por el momento',
                        text: '¿Desea registrar un nuevo cajón?',
                        showCancelButton: true,
                        reverseButtons: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar'
                    }).then((resp) => {
                        if (resp.isConfirmed) {
                            history.push('/gestionCajones')
                        }
                    })
                }
                setCajon(data);
            }).catch((error) => {
                console.log(error);
            })
            axios.get(`${Enviroments.urlBack}/api/persona/${true}`,)
                .then(res => {
                    const data = res.data.cont.persona
                    setPersona(data)
                })
        } catch (error) {
            console.log(error);
        }
    }, [cargar, _id])

    const reset = () => {
        setData(initialState);
    }

    return (
        <div className="container">
            <h5 className="card-title">Registro de Vehiculos</h5>
            <hr />
            <form onSubmit={handleSubmit} className="was-validated">
                <div className="form-group mb-3">
                    <div className="row">
                        <div className="col-6">
                            <label htmlFor="strMarca">Marca</label>
                            <input type="text" className="form-control form-control-sm" id="strMarca" placeholder="Marca vehiculo" name="strMarca"
                                value={data.strMarca}
                                onChange={handleInputChange} required />
                        </div>
                        <div className="col-6">
                            <label htmlFor="strModelo">Modelo</label>
                            <input type="text" className="form-control form-control-sm" id="strModelo" placeholder="Modelo vehiculo" name="strModelo"
                                value={data.strModelo}
                                onChange={handleInputChange} required />
                        </div>
                    </div>

                </div>
                <div className="form-group mb-3">
                    <label htmlFor="strDescripcion">Descripción</label>
                    <textarea className="form-control form-control-sm" id="strDescripcion" placeholder="Descripción vehiculo" name="strDescripcion"
                        value={data.strDescripcion}
                        onChange={handleInputChange} required></textarea>
                </div>


                <div className="form-group mb-3">
                    <div className="row">
                        <div className="col-6">
                            <label htmlFor="nmbAño">Año</label>
                            <input type="number" className="form-control form-control-sm" id="nmbAño" placeholder="Año vehiculo" name="nmbAño"
                                value={data.nmbAño}
                                onChange={handleInputChange} required />
                        </div>
                        <div className="col-6">
                            <label htmlFor="strPlacas">Placas</label>
                            <input type="textarea" className="form-control form-control-sm" id="strPlacas" placeholder="Placas vehiculo" name="strPlacas"
                                value={data.strPlacas}
                                onChange={handleInputChange} required />
                        </div>
                    </div>

                </div>


                <div className="form-group mb-3">
                    <label htmlFor="strColor">Color</label>
                    <input type="color" className="form-control form-control-sm" id="strColor" placeholder="Color vehiculo" name="strColor"
                        value={data.strColor}
                        onChange={handleInputChange} />
                </div>
                {
                    cargar &&
                    <div className="form-group mb-3">
                        <label htmlFor="strPlacas">Asignar persona</label>
                        <select class="form-select form-select-sm" required name="idPersona" onChange={handleInputChange} aria-label="Default select example" >
                            <option value={''} defaultValue={'Seleccione persona...'}>Seleccione persona ...</option>
                            {
                                persona.map(personas => {
                                    return (
                                        <option key={personas._id} value={personas._id} >{personas.strNombre} {personas.strPrimerApellido ? personas.strPrimerApellido : ''} {personas.strSegundoApellido ? personas.strSegundoApellido : ''}</option>
                                    )
                                })
                            }
                        </select>

                    </div>
                }
                {
                    cargar && (_id == '' || _id == 'undefined') ?
                        <div className="form-group mb-3" >
                            <label htmlFor="strPlacas">Asignar cajón </label>
                            <select class="form-select form-select-sm" required name="idCajon" onChange={handleInputChange} aria-label="Default select example" >
                                <option value={''}>{'Seleccione cajón ...'}</option>
                                {
                                    cajon.map(cajones => {
                                        return (
                                            <option key={cajones._id} value={cajones._id} style={{ display: _id == cajones._id ? 'none' : 'inline' }}>{cajones.nmbCajon} </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        :
                        <div className="form-group mb-3">
                            <label htmlFor="strColor">Cajón asignado</label>
                            <input type="text" className="form-control form-control-sm" id="idCajon" placeholder="Color vehiculo" name="idCajon"
                                value={data.idCajon}
                                onChange={handleInputChange} disabled style={{ display: 'none' }} />
                            <input type="text" className="form-control form-control-sm text-center"
                                value={nombreCajon} disabled />
                        </div>
                }
                <hr />
                <div className=" form-group row text-right" >
                    <div className="col-12 text-center">
                        <button className="btn btn-danger m-1 " type="button" onClick={() => reset()}>Cancelar</button>
                        <button className="btn btn-primary m-1" type="submit" >Registrar</button>
                    </div>
                </div>
            </form >
        </div >
    )
}