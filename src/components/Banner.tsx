import * as React from 'react';
import { useState } from 'react';
import { Button, Toast, ToastContainer } from 'react-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
    const navigateTo = useNavigate();
    const [isVisible, setIsVisible] = useState(Boolean(!sessionStorage.getItem('artsite-cleared-banner')));

    const onCloseBanner = () => {
        sessionStorage.setItem('artsite-cleared-banner', Date.now().toString());
        setIsVisible(false);
    };

    return (
        <div className={'outer-container m-auto'}>
            <ToastContainer className={'position-static'}>
                <Toast
                    bg={'secondary'}
                    show={isVisible}
                    onClose={onCloseBanner}
                >
                    <Toast.Header>
                        <strong className={'me-auto'}>
                            {'On view now at the Tunbridge General Store'}
                        </strong>
                    </Toast.Header>
                    <Toast.Body className={'d-flex'}>
                        <div className={'d-flex flex-column'}>
                            <span>
                                {'Oct 20 - Dec 20'}
                            </span>
                            <span>
                                {'Reception: Sat, Oct 21, 3-5 pm'}
                            </span>
                            <span className={'pt-2'}>
                                {'Tunbridge General Store'}
                            </span>
                            <span>
                                {'304 VT-110, Tunbridge, VT'}
                            </span>
                        </div>
                        <Button
                            onClick={() => {
                                navigateTo('/artworks?grouping=eclosion');
                                onCloseBanner();
                            }}
                            className={'ms-auto'}
                            variant={'success'}
                        >
                            {'See images'}
                        </Button>
                    </Toast.Body>
                </Toast>
            </ToastContainer>
            <Outlet />
        </div>
    );
};

export default Banner;
