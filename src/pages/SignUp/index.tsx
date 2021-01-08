import React from 'react';
import logo from '../../assets/logo.svg';
import { FiLogIn, FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';

import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Content, Background } from './styles';

const SingIn: React.FC = () => (
    <Container>
        <Background />
        <Content>
            <img src={logo} alt="goBarber" />
            <form>
                <h1>Faça seu cadastro</h1>

                <Input name="name" icon={FiUser} placeholder="Nome" />
                <Input name="email" icon={FiMail} placeholder="Email" />
                <Input
                    name="password"
                    icon={FiLock}
                    type="password"
                    placeholder="Senha"
                />
                <Button type="submit">Cadastrar</Button>
            </form>
            <a href="login">
                <FiArrowLeft />
                Voltar para logon
            </a>
        </Content>
    </Container>
);

export default SingIn;
