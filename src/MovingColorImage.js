import React, { useEffect } from 'react';
import config from './config.json'
import useIsRotating from './hooks/useIsRotating';
import './MovingColorImage.css';

const MovingColorImage = ({src}) => {
    const { isRotating, setIsRotating } = useIsRotating();
    useEffect(() => {console.log('isR', isRotating)}, [isRotating]);
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         intervalId: null,
    //         rotationAmount: props.isRotating === undefined || !props.isRotating ? 0 : Math.random() * 360,
    //         isRotating: props.isRotating,
    //         imgClass: props.imgClass === undefined ? "w-100" : props.imgClass
    //     };
    //     this.setInterval = this.setInterval.bind(this);
    //     this.clearInterval = this.clearInterval.bind(this);
    //     this.toggleInterval = this.toggleInterval.bind(this);
    // }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (prevProps.isRotating !== this.props.isRotating) {
    //         this.toggleInterval();
    //     }
    // }

    // componentDidMount() {
    //     if (this.state.isRotating) {
    //         this.setInterval();
    //     }
    // }

    // componentWillUnmount() {
    //     this.clearInterval();
    // }

    // toggleInterval() {
    //     if (this.state.isRotating) {
    //         this.clearInterval();
    //     } else {
    //         this.setInterval();
    //     }
    // }

    // clearInterval() {
    //     if (this.state.intervalId !== null) {
    //         clearInterval(this.state.intervalId);
    //         this.setState({
    //             isRotating: false,
    //             rotationAmount: 0
    //         });
    //     }
    // }

    // setInterval() {
    //     this.setState({
    //         isRotating: true,
    //         intervalId: setInterval(() => {
    //             let newRotationAmount = this.state.rotationAmount + 3;
    //             if (this.state.rotationAmount > 360) {
    //                 newRotationAmount = 0;
    //             }
    //             this.setState({
    //                 rotationAmount: newRotationAmount
    //             });
    //         })
    //     });
    // }

    return (
        <img 
            alt="not found"
            onClick={() => setIsRotating(!isRotating)}
            className={isRotating ? 'w-100 rotating' : 'w-100'}
            // style={{filter: 'hue-rotate(' + this.state.rotationAmount + 'deg)'}}
            src={`${config.host}${src}`}/>
    )
}

export default MovingColorImage;