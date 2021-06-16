import Granim from 'granim'
import { useEffect } from 'react';
import styled from 'styled-components'
import background from '../Img/background.jpg'

const Canvas = styled.canvas`
    position: fixed;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -10;
`

const GranimComponent = () => {

    useEffect(()=> {
        var granimInstance = new Granim({
            element: '#canvas-image-blending',
            direction: 'top-bottom',
            isPausedWhenNotInView: true,
            image : {
                source: background,
                blendingMode: 'multiply',
                position: ['center', 'center'],
                stretchMode: ['stretch-if-smaller', 'stretch-if-smaller']
            },
            states : {
                "default-state": {
                    gradients: [
                        ['#29323c', '#485563'],
                        ['#FF6B6B', '#556270'],
                        ['#80d3fe', '#7ea0c4'],
                        ['#f0ab51', '#eceba3']
                    ],
                    transitionSpeed: 7000
                }
            }
        });
    }, [])
    
    return (
        <Canvas id="canvas-image-blending"></Canvas>
    )
}

export default GranimComponent