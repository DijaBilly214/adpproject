import React from 'react';
import {render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import {RegisterCus} from "./registerCus";

test('should render register page', () => {
    render(<RegisterCus/>);
    const elem = screen.getByText(/customer registration/i);
    expect(elem).toBeInTheDocument();
});

test('should update state on input change', () => {
    render(<RegisterCus />);
    
    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const userNameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const occupationInput = screen.getByLabelText(/Occupation/i);
    const desireInput = screen.getByLabelText(/Desire/i);

    userEvent.type(firstNameInput, 'Jack');
    userEvent.type(lastNameInput, 'Harlow');
    userEvent.type(userNameInput, 'jackHarlow');
    userEvent.type(emailInput, 'jackharlow@gmail.com');
    userEvent.type(passwordInput, 'jackHarlow123!');
    userEvent.type(occupationInput, 'Singer/Songwriter');
    userEvent.type(desireInput, 'I am always traveling and need a friend');

    expect(firstNameInput.value).toBe('Jack');
    expect(lastNameInput.value).toBe('Harlow');
    expect(userNameInput.value).toBe('jackHarlow');
    expect(emailInput.value).toBe('jackharlow@gmail.com');
    expect(passwordInput.value).toBe('jackHarlow123!');
    expect(occupationInput.value).toBe('Singer/Songwriter');
    expect(desireInput.value).toBe('I am always traveling and need a friend');
});
