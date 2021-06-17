import styled from 'styled-components'

// Button style used throughout the app
const Button = styled.button`
    display: inline-block;
    padding: 0.1em 0.7em;
    border: 0.1em solid #FFFFFF;
    margin: 0 0.3em 0.3em 0;
    border-radius: 0.3em;
    box-sizing: border-box;
    text-decoration: none;
    font-family: 'Manrope', sans-serif;
    font-weight: bold;
    color: #000000;
    background-color: rgb(230,230,230,0.65);
    text-align: center;
    transition: all 0.2s;

    &:hover{
        color:#000000;
        background-color: rgb(230,230,230,0.9);
        border: 0.1em solid #aaaaaa;
    }
`

export default Button