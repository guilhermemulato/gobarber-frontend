import React, { useRef, useCallback } from 'react';
import logo from '../../assets/logo.svg';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValadationErrors';

import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Content, Background } from './styles';

interface CredencialsFormData {
    email: string;
    password: string;
}

const SingIn: React.FC = () => {
    const FormRef = useRef<FormHandles>(null);

    const { signIn } = useAuth();
    const { addToast } = useToast();

    const handleSubmit = useCallback(
        async (data: CredencialsFormData) => {
            try {
                FormRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required('Email obrigatorio')
                        .email('Digite um email valido'),
                    password: Yup.string().required('Senha obrigatória'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await signIn({
                    email: data.email,
                    password: data.password,
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    FormRef.current?.setErrors(errors);

                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Ocorreu um erro na autenticação',
                    description:
                        'Ocorreu um erro ao fazer login, cheque as credenciais',
                });
            }
        },
        [signIn, addToast],
    );

    return (
        <Container>
            <Content>
                <img src={logo} alt="goBarber" />
                <Form ref={FormRef} onSubmit={handleSubmit}>
                    <h1>Faça seu logon</h1>

                    <Input name="email" icon={FiMail} placeholder="Email" />
                    <Input
                        name="password"
                        icon={FiLock}
                        type="password"
                        placeholder="Senha"
                    />
                    <Button type="submit">Entrar</Button>
                    <a href="forgot">Esqueci minha senha</a>
                </Form>
                <Link to="signup">
                    <FiLogIn />
                    Criar Conta
                </Link>
            </Content>
            <Background />
        </Container>
    );
};

export default SingIn;
