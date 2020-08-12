import React, { useCallback, useRef, ChangeEvent } from 'react';

import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiMail, FiUser, FiCamera } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';
import { Container, Content, AvatarInput } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';

import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
}
const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth();

  const handleSubmitSignUp = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors([]);
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post('/users', data);
        history.push('/');
        addToast({
          type: 'success',
          title: 'Cadastro realizado',
          description: 'Você já pode fazer seu logon no GoBarber.',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Houve um erro no cadastro, tente novamente.',
        });
      }
    },
    [history, addToast],
  );

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      const data = new FormData();
      data.append('avatar',e.target.files[0]);

      api.patch('/users/avatar', data).then((response) => {
        addToast({
          title: 'Avatar atualizado',
          type: 'success'
        });
        console.log(response.data);
        updateUser(response.data);

      }).catch(e => {
        addToast({
          title: 'Houve um erro ao atualizar o avatar',
          type: 'error'
        });
      })
    }
  }, [addToast,updateUser])

  return (
    <Container>
      <header>
        <div>
        <Link to="/dashboard">
          <FiArrowLeft />
        </Link>
        </div>
      </header>
      <Content>
          <Form initialData={{
            name: user.name,
            email: user.email
          }} ref={formRef} onSubmit={handleSubmitSignUp}>
            <AvatarInput>
              <img src={user.avatar_url} alt={user.name}/>
              <label htmlFor="avatar">
                <FiCamera />
                <input onChange={handleAvatarChange} type="file" id="avatar" />
              </label>
            </AvatarInput>
            <h1>Meu perfil</h1>
            <Input icon={FiUser} name="name" placeholder="Nome" />
            <Input icon={FiMail} name="email" placeholder="E-mail" />
            <Input
              containerStyle={{marginTop: 24}}
              icon={FiLock}
              type="password"
              name="old_password"
              placeholder="Senha atual"
            />
            <Input
              icon={FiLock}
              type="password"
              name="password"
              placeholder="Nova senha"
            />
            <Input
              icon={FiLock}
              type="password"
              name="password_confirmation"
              placeholder="Confirmar senha"
            />
            <Button type="submit">Confirmar alterações</Button>
          </Form>
      </Content>
    </Container>
  );
};

export default Profile;
