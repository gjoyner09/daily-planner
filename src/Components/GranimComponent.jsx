import Granim from 'granim'
import { useEffect } from 'react';
import styled from 'styled-components'

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
        const granimInstance = new Granim({
            element: '#canvas-basic',
            direction: 'diagonal',
            isPausedWhenNotInView: true,
            states : {
                "default-state": {
                    gradients: [
                        ['#ff9966', '#ff5e62'],
                        ['#00F260', '#0575E6'],
                        ['#e1eec3', '#f05053']
                    ]
                }
            }
        });
    }, [])
    
    return (
        <Canvas id="canvas-basic"></Canvas>
    )
}

export default GranimComponent