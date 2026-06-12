import React from 'react';
import { AppProvider } from './store/AppContext';

function App(props) {
  return (
    <AppProvider>
      {props.children}
    </AppProvider>
  );
}

export default App;
