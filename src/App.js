import React from 'react'
import Navigation from "./Navigation";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoggedIn: props.isLoggedIn}
    }

    render() {
        return (
            <div className="container-fluid">
                <Navigation filter={2020} isLoggedIn={this.state.isLoggedIn} />
            </div>
        )

    }
}

export default App;