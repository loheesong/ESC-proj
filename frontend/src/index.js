import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId="316769265044-oh9kbsi52kgahvfipl78mpf3rth78tla.apps.googleusercontent.com">
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>,
  </BrowserRouter>,
  document.getElementById('root')
);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <BrowserRouter>
//         <GoogleOAuthProvider clientId="316769265044-oh9kbsi52kgahvfipl78mpf3rth78tla.apps.googleusercontent.com">
//             <React.StrictMode>
//                 <App />
//             </React.StrictMode>
//         </GoogleOAuthProvider>
//     </BrowserRouter>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();