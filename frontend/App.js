import React from 'react';

import Map from './screens/Map';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      parkings: []
    }
  }
  async componentDidMount() {

    const response = await fetch('http://192.168.1.33:8080/parkingspots');
    const data = await response.json();
    console.log(data.result)
    this.setState({
      parkings: data.result
    })

  }
  render() {
    return (
      <Map parkings={this.state.parkings} />
    );
  }
}
