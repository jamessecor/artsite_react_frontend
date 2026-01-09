import * as React from "react";
import { useContext, useState } from "react";
import { Container, Row, Col, Card, Nav, Tab, Tabs } from "react-bootstrap";
import { soloShows, groupShows, residencies, education, press, links, ICVItem } from "../data/cv";
import { BackgroundColorContext } from "./providers/BackgroundColorProvider";
import './Cv.css';

const Cv = () => {
    const { color } = useContext(BackgroundColorContext);
    const [activeTab, setActiveTab] = useState("solo");

    const renderCard = (item: ICVItem) => (
        <Card key={`${item.name}${item.location}`} className="mb-3 bg-dark text-light border-secondary">
            <Card.Body>
                <Card.Title className="h5">{item.name}</Card.Title>
                <Card.Subtitle className="mb-2">
                    {item.url ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-info">
                            {item.location}
                        </a>
                    ) : (
                        item.location
                    )}
                </Card.Subtitle>
                {item.address && <Card.Text className="text-muted small">{item.address}</Card.Text>}
                {item.dates && <Card.Text><small className="text-light-50">{item.dates}</small></Card.Text>}
            </Card.Body>
        </Card>
    );

    return (
        <Container fluid className="py-4">
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || "solo")}
                className="mb-4 justify-content-center"
                variant="pills"
            >
                <Tab eventKey="solo" title="Solo Shows" className="py-3">
                    <Row xs={1} className="g-4 justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                            {soloShows.map(renderCard)}
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="group" title="Group Shows" className="py-3">
                    <Row xs={1} className="g-4 justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                            {groupShows.map(renderCard)}
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="residency" title="Residencies" className="py-3">
                    <Row xs={1} className="g-4 justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                            {residencies.map(renderCard)}
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="education" title="Education" className="py-3">
                    <Row xs={1} className="g-4 justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                            {education.map(renderCard)}
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="press" title="Press" className="py-3">
                    <Row xs={1} className="g-4 justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                            {press.map(renderCard)}
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="links" title="Links" className="py-3">
                    <Row xs={1} className="g-4 justify-content-center">
                        <Col xs={12} md={8} lg={6}>
                            {links.map(renderCard)}
                        </Col>
                    </Row>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default Cv;