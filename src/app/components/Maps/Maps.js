import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
const Maps = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={12}
    defaultCenter={{ lat: props.lat, lng:props.long }}
  >
    {props.isMarkerShown && <Marker position={{ lat: props.lat, lng: props.long }} />}
  </GoogleMap>
))

export default Maps;