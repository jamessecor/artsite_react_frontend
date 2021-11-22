import React from "react"
import Accordion from "react-bootstrap/Accordion";
import {soloShows} from "./data/cv"
import {groupShows} from "./data/cv"
import {residencies} from "./data/cv"
import {education} from "./data/cv"

class Cv extends React.Component {
    render() {
        return (
            <Accordion className="col-lg-10 offset-lg-1 col-12" defaultActiveKey={"solo"}>
                <Accordion.Item eventKey={"solo"}>
                    <Accordion.Header>Solo Shows</Accordion.Header>
                    <Accordion.Body>
                        {soloShows.map(function (show) {
                            return (
                                <div key={`${show.name}${show.dates}`} className="mb-2">
                                     {/*TODO: change separators */}
                                    <strong>{show.name}</strong> | <a target="_blank" rel="noopener noreferrer" href={show.url}>{show.location}</a> - {show.address} {show.dates}
                                </div>
                            )
                        })}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"group"}>
                    <Accordion.Header>Group Shows</Accordion.Header>
                    <Accordion.Body>
                        {groupShows.map(function (show) {
                            return (
                                <div key={`${show.name}${show.dates}`} className="mb-2">
                                    {show.name} | <a href={show.url}>{show.location}</a> - {show.address} {show.dates}
                                </div>
                            )
                        })}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"residency"}>
                    <Accordion.Header>Residency Participation</Accordion.Header>
                    <Accordion.Body>
                        {residencies.map(function (residency) {
                            return (
                                <div key={residency.name} className="mb-2">
                                    {residency.name} | <a
                                    href={residency.url}>{residency.location}</a> - {residency.address} {residency.dates}
                                </div>
                            )
                        })}
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"education"}>
                    <Accordion.Header>Education</Accordion.Header>
                    <Accordion.Body>
                        {education.map(function (ed) {
                            return (
                                <div key={ed.name} className="mb-2">
                                    {ed.name} | <a href={ed.url}>{ed.location}</a> - {ed.address} {ed.dates}
                                </div>
                            )
                        })}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        );
    };
}

export default Cv