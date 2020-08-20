import React, { Component } from 'react';
import LoginComponent from './login';
import MainComponent from './main';
import IntroComponent from './intro';
import { Router, Scene, Stack } from 'react-native-router-flux';


class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Stack key="root" hideNavBar={true}>
          <Scene key="intro" component={IntroComponent} initial={true}/>
          <Scene key="login" component={LoginComponent}/>
          <Scene key="main" component={MainComponent}/>
        </Stack>
      </Router>
    );
  }
}

export default App;