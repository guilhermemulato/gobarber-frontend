import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';
import backgroundLogin from '../../assets/sign-in-background.png';

export const Container = styled.div`
    height: 100vh;

    display: flex;
    align-items: stretch;
`;
export const Content = styled.div`
    display: flex;

    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 100%;
    max-width: 700px;
`;
const apperFromLeft = keyframes`
    from{
        opacity: 0;
        transform: translateX(-50px);
    }
    to{
        opacity: 1;
        transform: translateX(0px);
    }

`;

export const AnimationContainer = styled.div`
    display: flex;

    flex-direction: column;
    justify-content: center;
    align-items: center;

    animation: ${apperFromLeft} 1s;

    form {
        display: flex;
        flex-direction: column;

        margin: 80px 0;
        width: 340px;
        text-align: center;

        h1 {
            margin-bottom: 24px;
        }

        a {
            display: block;
            color: #f4ede8;
            margin-top: 24px;
            text-decoration: none;
            transition: color 0.2s;

            &:hover {
                color: ${shade(0.2, '#f4ede8')};
            }
        }
    }

    > a {
        display: block;
        color: #ff9000;
        text-decoration: none;
        transition: color 0.2s;

        display: flex;
        align-items: center;

        svg {
            margin-right: 16px;
        }

        &:hover {
            color: ${shade(0.2, '#ff9000')};
        }
    }
`;

export const Background = styled.div`
    flex: 1;
    background: url(${backgroundLogin}) no-repeat center;
    background-size: cover;
`;
