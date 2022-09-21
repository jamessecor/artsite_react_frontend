import * as React from "react";
import { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import {soloShows} from "../data/cv";
import {groupShows} from "../data/cv";
import {residencies} from "../data/cv";
import {education} from "../data/cv";
import {press} from "../data/cv";
import {links} from "../data/cv";
import './Cv.css';

const Cv = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Accordion className="col-lg-10 offset-lg-1 col-12" defaultActiveKey={"solo"}>
            <Accordion.Item className={'bg-dark'} eventKey={"solo"}>
                <Accordion.Header>Selected Solo Shows</Accordion.Header>
                <Accordion.Body>
                    {soloShows.map(function (show) {
                        return (
                            <div key={`${show.name}${show.dates}`} className="mb-3">
                                <strong>{show.name}</strong><br/>
                                {show.url ? (<a target="_blank" rel="noopener noreferrer" href={show.url}>{show.location}</a>) : show.location}<br/>
                                {show.address}<br/>
                                {show.dates}
                            </div>
                        )
                    })}
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className={'bg-dark'} eventKey={"group"}>
                <Accordion.Header>Selected Group Shows</Accordion.Header>
                <Accordion.Body>
                    {groupShows.map(function (show) {
                        return (
                            <div key={`${show.name}${show.dates}`} className="mb-3">
                                <strong>{show.name}</strong><br/>
                                {show.url ? (<a target="_blank" rel="noopener noreferrer" href={show.url}>{show.location}</a>) : show.location}<br/>
                                {show.address}<br/>
                                {show.dates}
                            </div>
                        )
                    })}
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className={'bg-dark'} eventKey={"residency"}>
                <Accordion.Header>Residency Participation</Accordion.Header>
                <Accordion.Body>
                    {residencies.map(function (residency) {
                        return (
                            <div key={residency.name} className="mb-3">
                                <strong>{residency.name}</strong><br/>
                                {residency.url ? (<a target="_blank" rel="noopener noreferrer" href={residency.url}>{residency.location}</a>) : residency.location}<br/>
                                {residency.address}<br/>
                                {residency.dates}
                            </div>
                        )
                    })}
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className={'bg-dark'} eventKey={"education"}>
                <Accordion.Header>Education</Accordion.Header>
                <Accordion.Body>
                    {education.map(function (ed) {
                        return (
                            <div key={ed.name} className="mb-3">
                                <strong>{ed.name}</strong><br/>
                                {ed.url ? (<a target="_blank" rel="noopener noreferrer" href={ed.url}>{ed.location}</a>) : ed.location}<br/>
                                {ed.address}<br/>
                                {ed.dates}
                            </div>
                        )
                    })}
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className={'bg-dark'} eventKey={"press"}>
                <Accordion.Header>Press</Accordion.Header>
                <Accordion.Body>
                    {press.map(function (pressItem) {
                        return (
                            <div key={pressItem.name} className="mb-3">
                                <strong>{pressItem.name}</strong><br/>
                                {pressItem.url ? (<a target="_blank" rel="noopener noreferrer" href={pressItem.url}>{pressItem.location}</a>) : pressItem.location}<br/>
                                {pressItem.address}<br/>
                                {pressItem.dates}
                            </div>
                        )
                    })}
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className={'bg-dark'} eventKey={"links"}>
                <Accordion.Header>Links</Accordion.Header>
                <Accordion.Body>
                    {links.map(function (link) {
                        return (
                            <div key={link.name} className="mb-3">                                
                                {link.url ? (<a target="_blank" rel="noopener noreferrer" href={link.url}>{link.location}</a>) : link.location}<br/>                                
                            </div>
                        )
                    })}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

export default Cv;
