import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from "./App";
import './index.css'
import './styles/global.css'


// createRoot(document.getElementById('root')).render(
//     <Provider store={store}>
//         <App/>
//     </Provider>
// );

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
}

