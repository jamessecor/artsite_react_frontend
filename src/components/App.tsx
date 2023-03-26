import * as React from 'react';
import HomePage from "./HomePage";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Artworks from './Artworks';
import SoldArtworks from './SoldArtworks';
import Cv from './Cv';
import Colors from './Colors';
import Navigation from './Navigation';
import Store from './store/Store';
import ContactForm from './ContactForm';
import BackgroundColorProvider from './providers/BackgroundColorProvider';
import Nomophobia from './nomophobia/Nomophobia';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import LoginForm from './LoginForm';
import AuthenticationProvider from './providers/AuthenticationProvider';
import PhoneHome from './nomophobia/PhoneHome';
import Canvas from './nomophobia/Canvas';
import News from './nomophobia/News';
import Spotify from './nomophobia/Spotify';
import Instagram from './nomophobia/Instagram';
import SchoolInstructions from './nomophobia/SchoolInstructions';
import School from './nomophobia/School';
import GalleryTour from './nomophobia/GalleryTour';
import { chirpingInTheThicketsTour } from '../data/gallery-tour/chirping-in-the-thickets';
import PhoneOff from './nomophobia/PhoneOff';
import Likes from './nomophobia/Likes';

const fourHoursInMs = 1000 * 60 * 60 * 4;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: fourHoursInMs
        }
    }
});

const App = () => {
    return (
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <AuthenticationProvider>
                    <BackgroundColorProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route element={<Navigation />}>
                                    <Route path={'/'} element={<Artworks current={true} />} />
                                    <Route path={'/artworks/current'} element={<Artworks current={true} />} />
                                    <Route path={'/artworks/sold'} element={<SoldArtworks />} />
                                    <Route path={'/artworks'} element={<Artworks />} />
                                    <Route path={'/cv'} element={<Cv />} />
                                    <Route element={<Nomophobia />}>
                                        <Route path={'/nomophobia/canvas'} element={<Canvas />} />
                                        <Route path={'/nomophobia/spotify'} element={<Spotify />} />
                                        <Route path={'/nomophobia/instagram'} element={<Instagram />} />
                                        <Route path={'/nomophobia/school-instructions'} element={<SchoolInstructions />} />
                                        <Route path={'/nomophobia/school'} element={<School />} />
                                        <Route path={'/nomophobia/gallery-tour'} element={<GalleryTour images={chirpingInTheThicketsTour} />} />
                                        <Route path={'/nomophobia/news'} element={<News />} />
                                        <Route path={'/nomophobia/home'} element={<PhoneHome />} />
                                        <Route path={'/nomophobia/likes'} element={<Likes />} />
                                        <Route path={'/nomophobia*'} element={<PhoneOff />} />
                                    </Route>
                                    <Route path={'/colors'} element={<Colors />} />
                                    <Route path={'/contact'} element={<ContactForm />} />
                                    <Route path={'/store'} element={<Store />}>
                                        <Route path={'postcards'} element={<Store />} />
                                    </Route>
                                    <Route path={'/login'} element={<LoginForm />} />
                                </Route>
                                <Route path={'*'} element={<HomePage />} />
                            </Routes>
                        </BrowserRouter>
                    </BackgroundColorProvider>
                </AuthenticationProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </React.StrictMode>
    );
};

export default App;