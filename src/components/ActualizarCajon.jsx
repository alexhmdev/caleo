import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';
import Swal from 'sweetalert2'
import { Enviroments } from '../../enviroments/enviroments.url';

export const ActualizarCajon = ({ setReload, id, reload }) => {

    const [newData, setNewData] = useState()

    const reset = () => {
        setReload(reload => !reload);
    }

    const handleInputChange = ({ target }) => {
        console.log(target.value);
        setNewData({
            ...newData,
            [target.name]: target.value
        });
    }

    const update = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${Enviroments.urlBack}/api/cajon/`, newData)
                .then(res => {
                    setReload(reload => !reload);
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        text: res.data.msg,
                        showConfirmButton: false,
                        timer: 1500
                    })

                })
        } catch (error) {
            console.log(error.response.data.msg);
            Swal.fire({
                position: 'center',
                icon: 'error',
                text: error.response.data.msg,
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

    useEffect(async () => {
        await axios.get(`${Enviroments.urlBack}/api/cajon/obtenerId/${id}`)
            .then(res => {
                // console.log(res.data.cont.cajon[0]);
                const datos = res.data.cont.cajon[0];
                setNewData(datos);

            }).catch((err) => {
                console.log(err);
            })

    }, [])


    return (
        <div className="container" className="was-validated">
            <div className="row">
                <div className="col-11 col-lg-11">
                    <h5 className="card-title">Actualizar Cajón</h5>
                </div>
                <div className="col-1 col-lg-1" style={{ cursor: 'pointer', color: 'red' }}>
                    <i className="far fa-times-circle" onClick={() => reset()}></i>
                </div>
            </div>

            <hr />
            <form onSubmit={update} >
                <div className="form-group mb-3">
                    <label htmlFor="number">Número del cajón</label>
                    <input type="number" className="form-control form-control-sm" id="number" placeholder="Número del cajón" name="nmbCajon"
                        value={newData ? newData.nmbCajon : ''}
                        onChange={handleInputChange} required />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="description">Descripción del Cajón</label>
                    <input type="text" className="form-control form-control-sm" id="description" placeholder="Descripción del Cajón" name="strDescripcion"
                        value={newData ? newData.strDescripcion : ''}
                        onChange={handleInputChange} required />
                </div>
                <hr />
                <div className=" form-group row text-right" >
                    <div className="col-12 text-center">
                        <button className="btn btn-primary m-1" type="submit">Actualizar</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

ActualizarCajon.propTypes = {
    setReload: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    reload: PropTypes.bool.isRequired
};