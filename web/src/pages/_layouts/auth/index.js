import React from 'react';
import PropTypes from 'prop-types';

import { Wrapper } from './styles';

const AuthLayout = ({ children }) => <Wrapper>{children}</Wrapper>;

AuthLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default AuthLayout;
