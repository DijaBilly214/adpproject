import React from 'react';
import {render, screen } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import {Login} from "./Login";

test("username input should be rendered", ()=>{
    render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );
    const userInputTest = screen.getByPlaceholderText(/username/i);
    expect(userInputTest).toBeInTheDocument()
})

test("password input should be rendered", ()=>{
    render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );
    const passInputTest = screen.getByPlaceholderText(/password/i);
    expect(passInputTest).toBeInTheDocument()
})

test("shelter check should be rendered", ()=>{
    render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );
    const shellInputTest = screen.getByTestId('shelter');
    expect(shellInputTest).toBeInTheDocument()
})

test("user check should be rendered", ()=>{
    render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );
    const usInputTest = screen.getByTestId('user');
    expect(usInputTest).toBeInTheDocument()
})

test("button input should be rendered", ()=>{
    render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );
    const buttonInputTest = screen.getByRole("button");
    expect(buttonInputTest).toBeInTheDocument()
})

