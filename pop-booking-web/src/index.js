import React from 'react';
import ReactDOM from 'react-dom';
// TODO check that react-bootstrap-table-next is imported
// import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import './stylesheets/css/App.css'

import './stylesheets/css/index.css';
import './stylesheets/css/select.css'

import App from "./App";
import {stores} from "./controllers/Context";
import {HashRouter} from "react-router-dom";

console.log("start stores");
console.log(stores);
console.log("end stores");

// <App stores={stores}/>

ReactDOM.render(
    <HashRouter>
    <div>Yeah</div>
    <App stores={stores}/>
    </HashRouter>,
    document.getElementById('main-content')
)

