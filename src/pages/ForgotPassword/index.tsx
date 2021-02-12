import React, { useRef, useCallback, useState } from 'react';
import logo from '../../assets/logo.svg';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link } from 'react-router-dom';
import { useToast } from '../../hooks/toast';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValadationErrors';

import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Content, AnimationContainer, Background } from './styles';
import { api } from '../../services/apiClient';

interface CredencialsFormData {
    email: string;
}

const ForgotPassword: React.FC = () => {
    const FormRef = useRef<FormHandles>(null);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = useCallback(
        async (data: CredencialsFormData) => {
            try {
                setLoading(true);
                FormRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    email: Yup.string()
                        .required('Email obrigatorio')
                        .email('Digite um email valido'),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await api.post('/password/forgot', {
                    email: data.email,
                });

                addToast({
                    type: 'success',
                    title: 'Email de recuperação enviado',
                    description:
                        'Um email de recuperação de senha foi enviado, cheque sua caixa de entrada',
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    FormRef.current?.setErrors(errors);

                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Ocorreu um erro na recuperação de senha',
                    description:
                        'Ocorreu um erro ao tentar recuperar a senha, tente novamente',
                });
            } finally {
                setLoading(false);
            }
        },
        [addToast],
    );

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logo} alt="goBarber" />
                    <Form ref={FormRef} onSubmit={handleSubmit}>
                        <h1>Resetar Senha</h1>

                        <Input name="email" icon={FiMail} placeholder="Email" />

                        <Button loading={loading} type="submit">
                            Resetar
                        </Button>
                    </Form>
                    <Link to="/">
                        <FiLogIn />
                        Voltar ao login
                    </Link>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    );
};

export default ForgotPassword;
