import React, { useCallback, useRef, useState } from 'react';

import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Container, AnimationContainer, Content, Background } from './styles';
import logo from '../../assets/logo.svg';

import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmitSignIn = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);

        formRef.current?.setErrors([]);
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });

        await schema.validate(data, { abortEarly: false });

        /* Recuperação de senha */
        await api.post('password/forgot', {
          email: data.email
        });

        addToast({
          title: 'E-mail de recuperação de senha',
          description: 'Foi enviado um e-mail para recuperação de senha, verifique sua conta de e-mail.',
          type: 'success'
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description: 'Houve um erro na recuperação de senha, tente novamente.',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, setLoading],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmitSignIn}>
            <h1>Recuperar senha</h1>
            <Input icon={FiMail} name="email" placeholder="E-mail" />
            <Button loading={loading} type="submit">Recuperar</Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Voltar para login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
