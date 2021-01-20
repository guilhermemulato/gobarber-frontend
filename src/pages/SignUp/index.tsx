import React, { useCallback, useRef } from 'react';
import logo from '../../assets/logo.svg';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValadationErrors';

import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Content, Background } from './styles';
import { Link } from 'react-router-dom';

const SingIn: React.FC = () => {
    const FormRef = useRef<FormHandles>(null);

    const handleSubmit = useCallback(async (data: object) => {
        try {
            FormRef.current?.setErrors({});
            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string()
                    .required('Email obrigatorio')
                    .email('Digite um email valido'),
                password: Yup.string().min(6, 'No minimo 6 digitos'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });
        } catch (err) {
            console.log(err);
            const errors = getValidationErrors(err);
            FormRef.current?.setErrors(errors);
        }
    }, []);
    return (
        <Container>
            <Background />
            <Content>
                <img src={logo} alt="goBarber" />
                <Form ref={FormRef} onSubmit={handleSubmit}>
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
                </Form>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para logon
                </Link>
            </Content>
        </Container>
    );
};

export default SingIn;
