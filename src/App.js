import React from 'react'
import Navigation from "./Navigation";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

class App extends React.Component {
    render() {
        return (
            <div className="container-fluid">
                <Navigation filter={2020} />
            </div>
        )

    }
}

export default App;