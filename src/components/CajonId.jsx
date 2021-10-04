import React, { useState, useEffect } from 'react'
import { CajonGrid } from './CajonGrid'


export const CajonId = () => {

    const [cajones, setCajones] = useState([])

    const getCajonesById = (id) => {
        setCajones(cajon => [
            ...cajon, id
        ]);
    }


    useEffect(() => {
        getCajonesById('1');
    }, [])

    return (
        <>
            <h2>Cajones</h2>s
            <ol>
                {
                    cajones.map(cajon => { <CajonGrid key={cajon} cajon={cajon} /> })
                }
            </ol>
        </>
    )
}
