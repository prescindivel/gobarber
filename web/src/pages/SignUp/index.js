import React from 'react';
import { Link } from 'react-router-dom';

import logo from '~/assets/logo.svg';

// import { Container } from './styles';

const SignUp = () => (
  <>
    <img src={logo} alt="GoBarber" />

    <form>
      <input type="text" placeholder="Seu nome" />
      <input type="email" placeholder="Seu email" />
      <input type="password" placeholder="Sua senha" />

      <button type="submit">Registrar</button>

      <Link to="/">Já tenho uma conta</Link>
    </form>
  </>
);

export default SignUp;
