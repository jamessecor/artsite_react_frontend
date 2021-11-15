import React from 'react'
import Navigation from "./Navigation";
import HomePage from "./HomePage";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: "home"
        }

        this.enterSite = this.enterSite.bind(this);
    }

    enterSite() {
        console.log("trying to enter")
        this.setState({
            currentPage: ""
        })
    }

    render() {
        if (this.state.currentPage === "home") {
            return (
                <HomePage enterSite={this.enterSite}/>
            )
        } else {
            return (
                <div className="container-fluid">
                    <Navigation filter={2021} returnHome={() => this.setState({currentPage: "home"})}/>
                </div>
            )

        }

    }
}

export default App;