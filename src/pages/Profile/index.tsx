import React, { ChangeEvent, useCallback, useRef } from 'react';
import { FiMail, FiLock, FiUser, FiArrowLeft, FiCamera } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValadationErrors';
import { useToast } from '../../hooks/toast';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { api } from '../../services/apiClient';
import { Container, Content, AvatarInput } from './styles';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
    name: string;
    email: string;
    old_password: string;
    password: string;
    password_confirmation: string;
}

const Profile: React.FC = () => {
    const FormRef = useRef<FormHandles>(null);
    const history = useHistory();
    const { addToast } = useToast();
    const { user, updateUser } = useAuth();

    const handleSubmit = useCallback(
        async (data: ProfileFormData) => {
            try {
                FormRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome obrigatório'),
                    email: Yup.string()
                        .required('Email obrigatorio')
                        .email('Digite um email valido'),
                    old_password: Yup.string(),
                    password: Yup.string().when('old_password', {
                        is: (val: any) => !!val.length,
                        then: Yup.string().required('Campo Obrigatorio'),
                        otherwise: Yup.string(),
                    }),
                    password_confirmation: Yup.string()
                        .when('old_password', {
                            is: (val: any) => !!val.length,
                            then: Yup.string().required('Campo Obrigatorio'),
                            otherwise: Yup.string(),
                        })
                        .oneOf(
                            [Yup.ref('password'), null],
                            'Confirmação Incorreta',
                        ),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                const {
                    name,
                    email,
                    old_password,
                    password,
                    password_confirmation,
                } = data;

                const formData = {
                    name,
                    email,
                    ...(old_password
                        ? {
                              old_password,
                              password,
                              password_confirmation,
                          }
                        : {}),
                };

                const response = await api.put('/profile', formData);

                updateUser(response.data);

                history.push('/dashboard');

                addToast({
                    type: 'success',
                    title: 'Perfil Atualizado',
                    description:
                        'Suas informações do perfil foram atualizadas com sucesso!',
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    FormRef.current?.setErrors(errors);

                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Ocorreu um erro na atualização',
                    description:
                        'Ocorreu um erro ao atualizar os dados do seu perfil, tente novamente',
                });
            }
        },
        [history, addToast, updateUser],
    );

    const handleAvatarChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const data = new FormData();

                data.append('avatar', e.target.files[0]);

                api.patch('/users/avatar', data).then((response) => {
                    updateUser(response.data);
                    addToast({
                        type: 'success',
                        title: 'Avatar Atualizado!',
                    });
                });
            }
        },
        [addToast, updateUser],
    );

    return (
        <Container>
            <header>
                <div>
                    <Link to={'/dashboard'}>
                        <FiArrowLeft />
                    </Link>
                </div>
            </header>
            <Content>
                <Form
                    ref={FormRef}
                    initialData={{ name: user.name, email: user.email }}
                    onSubmit={handleSubmit}
                >
                    <AvatarInput>
                        <img src={user.avatar_url} alt={user.name} />
                        <label htmlFor="avatar">
                            <FiCamera />

                            <input
                                type="file"
                                id="avatar"
                                onChange={handleAvatarChange}
                            />
                        </label>
                    </AvatarInput>
                    <h1>Meu Perfil</h1>

                    <Input name="name" icon={FiUser} placeholder="Nome" />
                    <Input name="email" icon={FiMail} placeholder="Email" />
                    <Input
                        containerStyle={{ marginTop: 24 }}
                        name="old_password"
                        icon={FiLock}
                        type="password"
                        placeholder="Senha Atual"
                    />
                    <Input
                        name="password"
                        icon={FiLock}
                        type="password"
                        placeholder="Nova Senha"
                    />
                    <Input
                        name="password_confirmation"
                        icon={FiLock}
                        type="password"
                        placeholder="Confirma Senha"
                    />
                    <Button type="submit">Confirmar Mudanças</Button>
                </Form>
            </Content>
        </Container>
    );
};

export default Profile;
