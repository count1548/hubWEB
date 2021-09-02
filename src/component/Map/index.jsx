import { Autocomplete, GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React, { Component } from 'react';

const mapContainerStyle = {
    height: "400px",
    width: "100%",
    border:'1px solid black',
    borderRadius:'5px'
}

const equals = (prev, next) =>
    ((prev['lat'] === next['lat']) &&
    (prev['lng'] === next['lng']))
const lib = ["places"]

class MyMapWithAutocomplete extends Component { //구글맵 컴포넌트
    constructor(props) {
        super(props)

        this.autocomplete = null

        this.onLoad = this.onLoad.bind(this)
        this.onPlaceChanged = this.onPlaceChanged.bind(this)
        this.state = {
            center : {...props.defaultCenter},
            markerPosition : {...props.defaultCenter}
        }
    }

    onLoad(autocomplete) {
        this.autocomplete = autocomplete
    }
    componentDidUpdate(prevProps) {
        if(!equals(this.props.defaultCenter, prevProps.defaultCenter)) 
            this.setState({
                center : {...this.props.defaultCenter},
                markerPosition : {...this.props.defaultCenter},
            })
    }

    onPlaceChanged() {
        if (this.autocomplete !== null) {
            if(Object.keys(this.autocomplete.getPlace()).length < 2) return
            let location = this.autocomplete.getPlace().geometry.location
            let loc = {
                lat : location.lat(),
                lng : location.lng()
            }
            //this.props.onClick(loc)
            this.setState({center : {...loc}})
        } else {
            console.log('Autocomplete is not loaded yet!')
        }
    }
    render() {
        return (
            <LoadScript
                googleMapsApiKey="AIzaSyACwixJrrTRyzuCE41kMC_-ZrGCMrRQFfY"
                libraries={lib}>
                <GoogleMap
                    id="searchbox-example"
                    mapContainerStyle={mapContainerStyle}
                    zoom={15}
                    center={this.state.center}
                    onClick={ev=>{
                        const location = {
                            lat : ev.latLng.lat(),
                            lng : ev.latLng.lng()
                        }
                        if(this.props.markerChange) {
                            this.props.onClick(location)
                            this.setState({...this.state, markerPosition : {...location}})
                        }
                    }}>
                    /**marker display**/
                    {(this.props.markers !== null) ? 
                    this.props.markers.map((pos, idx) => <Marker key={idx}
                        position={{
                            lat : pos['BUS_LATITUDE'],
                            lng : pos['BUS_LONGITUDE']
                        }}
                        {...(typeof this.props.markerIcon !== 'undefined') ? {
                            icon : (
                                this.props.defaultCenter.lat === pos['BUS_LATITUDE'] && 
                                this.props.defaultCenter.lng === pos['BUS_LONGITUDE']) ? this.props.selectedIcon : this.props.markerIcon
                        } : null}
                    />) : <Marker
                        position={this.state.markerPosition}
                        {...(typeof this.props.markerIcon !== 'undefined') ? {
                            icon : this.props.markerIcon
                        } : null}
                    />}
                    /**-------AutoComplete 자동완성 컴포넌트------**/
                    <Autocomplete
                        onLoad={this.onLoad}
                        onPlaceChanged={this.onPlaceChanged}>
                        <input
                            type="text"
                            placeholder="Search Place"
                            style={{
                                boxSizing: `border-box`,
                                border: `1px solid transparent`,
                                width: `240px`,
                                height: `32px`,
                                padding: `0 12px`,
                                borderRadius: `3px`,
                                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                fontSize: `14px`,
                                outline: `none`,
                                textOverflow: `ellipses`,
                                position: "absolute",
                                left: "50%",
                                marginLeft: "-120px"
                            }}
                        />
                    </Autocomplete>
                </GoogleMap>
            </LoadScript>
        )
    }
}

MyMapWithAutocomplete.defaultProps = {
    onClick : () => {},
    markers : null, 
    markerChange : true
}

export default MyMapWithAutocomplete