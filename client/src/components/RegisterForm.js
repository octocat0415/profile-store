import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import FormError from './FormError';
import contactService from '../services/contacts';
import authService from '../services/auth';
import storageService from '../utils/localStorageHelpers';

import { Form, Button, Icon, Header } from 'semantic-ui-react';

const RegisterForm = ({ setUser, notify }) => {
  const [userDetails, setUserDetails] = useState({
    displayName: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const { displayName, email, password } = userDetails;

  const handleOnChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    if (password !== confirmPassword)
      return setError(`Confirm password failed. Both passwords need to match.`);
    e.preventDefault();
    try {
      setIsLoading(true);
      const user = await authService.register(userDetails);
      setUser(user);
      setIsLoading(false);
      setError(null);

      notify(`Welcome ${user.displayName}, you have successfully registered!`, {
        appearance: 'success',
      });
      contactService.setToken(user.token);
      storageService.saveUser(user);
      history.push('/');
    } catch (err) {
      setIsLoading(false);
      const errRes = err.response.data;

      if (errRes && errRes.error) {
        return setError(errRes.error);
      } else {
        return setError(err.message);
      }
    }
  };

  return (
    <Form onSubmit={handleRegister}>
      {error && <FormError message={error} setError={setError} />}
      <Form.Input
        required
        placeholder="For ex. Ben Awad"
        label="Dispay Name"
        type="text"
        name="displayName"
        value={displayName}
        onChange={handleOnChange}
        icon="user"
        iconPosition="left"
      />
      <Form.Input
        required
        placeholder="For ex. abc@example.com"
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={handleOnChange}
        icon="at"
        iconPosition="left"
      />
      <Form.Input
        required
        placeholder="Password must have minimum characters of 6."
        label="Password"
        type="password"
        name="password"
        value={password}
        onChange={handleOnChange}
        icon="lock"
        iconPosition="left"
      />
      <Form.Input
        required
        placeholder="Confirm Password"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={({ target }) => setConfirmPassword(target.value)}
        icon="lock"
        iconPosition="left"
      />

      <Button
        animated="vertical"
        color="teal"
        icon
        labelPosition="left"
        type="submit"
        floated="right"
        size="large"
        loading={isLoading}
      >
        <Icon name="signup" />
        Register
      </Button>
      <Header as="h4">
        Already have an account? <Link to="/login">Login.</Link>
      </Header>
    </Form>
  );
};

export default RegisterForm;
