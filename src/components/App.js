import React from 'react'
import HomePage from "./HomePage";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Artworks from './Artworks';
import Cv from './Cv';
import Colors from './Colors';
import Navigation from './Navigation';
import Store from './store/Store';

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path={'/'} element={<HomePage />} />
            <Route element={<Navigation />}>
                <Route path={'/artworks'} element={<Artworks />}>
                    <Route path={":year"} element={<Artworks />} />
                </Route>
                <Route path={'/cv'} element={<Cv />} />
                <Route path={'/colors'} element={<Colors />} />
                <Route path={'/store'} element={<Store />} />
            </Route>
        </Routes>
    </BrowserRouter>
);

export default App;