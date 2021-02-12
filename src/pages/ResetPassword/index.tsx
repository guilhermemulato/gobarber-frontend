import React, { useRef, useCallback } from 'react';
import logo from '../../assets/logo.svg';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useHistory, useLocation } from 'react-router-dom';
import { useToast } from '../../hooks/toast';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValadationErrors';

import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Content, AnimationContainer, Background } from './styles';
import { api } from '../../services/apiClient';

interface CredencialsFormData {
    password: string;
    password_confirmation: string;
}

const SingIn: React.FC = () => {
    const FormRef = useRef<FormHandles>(null);

    const location = useLocation();
    const history = useHistory();
    const { addToast } = useToast();

    const handleSubmit = useCallback(
        async (data: CredencialsFormData) => {
            try {
                FormRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    password: Yup.string().required('Senha obrigatória'),
                    password_confirmation: Yup.string().oneOf(
                        [Yup.ref('password'), null],
                        'Senhas não conferem',
                    ),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });
                const { password, password_confirmation } = data;
                const token = location.search.replace('?token=', '');

                if (!token) {
                    throw new Error();
                }

                await api.post('/password/reset', {
                    password,
                    password_confirmation,
                    token,
                });

                history.push('/');
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    FormRef.current?.setErrors(errors);

                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Ocorreu um erro na alteração de senha',
                    description:
                        'Ocorreu um erro ao alterar sua senha, tente novamente',
                });
            }
        },
        [addToast, history, location.search],
    );

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logo} alt="goBarber" />
                    <Form ref={FormRef} onSubmit={handleSubmit}>
                        <h1>Resetar Senha</h1>

                        <Input
                            name="password"
                            icon={FiLock}
                            type="password"
                            placeholder="Nova senha"
                        />
                        <Input
                            name="password_confirmation"
                            icon={FiLock}
                            type="password"
                            placeholder="Confirmar nova senha"
                        />
                        <Button type="submit">Alterar Senha</Button>
                    </Form>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    );
};

export default SingIn;
