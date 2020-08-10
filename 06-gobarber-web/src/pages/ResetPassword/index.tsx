import React, { useCallback, useRef } from 'react';

import { useHistory, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Container, AnimationContainer, Content, Background } from './styles';
import logo from '../../assets/logo.svg';

import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';

import getValidationErrors from '../../utils/getValidationErrors';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();
  const token = location.search.replace('?token=','');

  const handleSubmitResetPassword = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors([]);
        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Confirmação inválida')
        });

        await schema.validate(data, { abortEarly: false });

        const { password, password_confirmation} = data;

        if(!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na alteração de senha.',
          description: 'Houve um erro na alteração de senha, tente novamente.',
        });
      }
    },
    [addToast, history, token],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmitResetPassword}>
            <h1>Alteração de Senha</h1>
            <Input
              icon={FiLock}
              type="password"
              name="password"
              placeholder="Nova Senha"
            />
            <Input
              icon={FiLock}
              type="password"
              name="password_confirmation"
              placeholder="Confirmação de Senha"
            />
            <Button type="submit">Alterar Senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
