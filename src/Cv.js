import React from "react"
import {soloShows} from "./data/cv"
import {groupShows} from "./data/cv"
import {residencies} from "./data/cv"
import {education} from "./data/cv"

class Cv extends React.Component {
    render() {
        return (
            <div>
                <div>Solo Shows</div>
                {soloShows.map(function (show) {
                    return (
                        <div key={show.name}>
                            {show.name} | <a href={show.url}>{show.location}</a> - {show.address} {show.dates}
                        </div>
                    )
                })}
                <div>Group Shows</div>
                {groupShows.map(function (show) {
                    return (
                        <div key={show.name}>
                            {show.name} | <a href={show.url}>{show.location}</a> - {show.address} {show.dates}
                        </div>

                    )
                })}
                <div>Residency Participation</div>
                {residencies.map(function (residency) {
                    return (
                        <div key={residency.name}>
                            {residency.name} | <a
                            href={residency.url}>{residency.location}</a> - {residency.address} {residency.dates}
                        </div>

                    )
                })}
                <div>Education</div>
                {education.map(function (ed) {
                    return (
                        <div key={ed.name}>
                            {ed.name} | <a href={ed.url}>{ed.location}</a> - {ed.address} {ed.dates}
                        </div>

                    )
                })}
            </div>
        );
    };
}

export default Cv