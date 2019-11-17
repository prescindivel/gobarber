import React from 'react';
import { Link } from 'react-router-dom';

import logo from '~/assets/logo.svg';

// import { Container } from './styles';

const SignIn = () => (
  <>
    <img src={logo} alt="GoBarber" />

    <form>
      <input type="email" placeholder="Seu email" />
      <input type="password" placeholder="Sua senha" />

      <button type="submit">Login </button>

      <Link to="/signup">Registrar</Link>
    </form>
  </>
);

export default SignIn;
