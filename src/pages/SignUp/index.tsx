import React, { useCallback, useRef } from 'react';
import logo from '../../assets/logo.svg';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValadationErrors';
import { useToast } from '../../hooks/toast';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { api } from '../../services/apiClient';
import { Container, Content, AnimationContainer, Background } from './styles';
import { Link, useHistory } from 'react-router-dom';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SingIn: React.FC = () => {
    const FormRef = useRef<FormHandles>(null);
    const history = useHistory();
    const { addToast } = useToast();

    const handleSubmit = useCallback(
        async (data: SignUpFormData) => {
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

                await api.post('/users', data);

                history.push('/');

                addToast({
                    type: 'success',
                    title: 'Cadastro Realizado',
                    description: 'Voçê ja pode efetuar seu logon no GoBarber!',
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
        [history, addToast],
    );
    return (
        <Container>
            <Background />
            <Content>
                <AnimationContainer>
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
                </AnimationContainer>
            </Content>
        </Container>
    );
};

export default SingIn;
