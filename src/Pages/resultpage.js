import React, { useEffect } from 'react'
import RoundTrip from '../Pages/roundtrip_sresult'
import Oneway from '../Pages/oneway_sresult'
import { useLocation } from 'react-router-dom'

function Resultpage() {
    const location = useLocation();
    const { flights } = location.state || { flights: [] };    
    return (
        // <RoundTrip />
        flights[0]?.tripType == "one-way" ?
            <Oneway flightData={flights}/> : <RoundTrip flightData={flights} />
    )
}

export default Resultpage