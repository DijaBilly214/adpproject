import React from 'react';
import {render, screen } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import AddPet from "./addPets";

test("Animal Name input should be rendered", ()=>{
    render(
        <MemoryRouter>
          <AddPet />
        </MemoryRouter>
      );
    const nameInputTest = screen.getByPlaceholderText(/Animal Name/i);
    expect(nameInputTest).toBeInTheDocument()
})

test("Animal Species input should be rendered", ()=>{
    render(
        <MemoryRouter>
          <AddPet />
        </MemoryRouter>
      );
    const speciesInputTest = screen.getByPlaceholderText(/Animal Species/i);
    expect(speciesInputTest).toBeInTheDocument()
})

test("Animal Breed input should be rendered", ()=>{
    render(
        <MemoryRouter>
          <AddPet />
        </MemoryRouter>
      );
    const breedInputTest = screen.getByPlaceholderText(/Animal Breed/i);
    expect(breedInputTest).toBeInTheDocument()
})

test("Animal Gender input should be rendered", ()=>{
    render(
        <MemoryRouter>
          <AddPet />
        </MemoryRouter>
      );
    const genderInputTest = screen.getByPlaceholderText(/Animal Gender/i);
    expect(genderInputTest).toBeInTheDocument()
})

test("Animal Age input should be rendered", ()=>{
    render(
        <MemoryRouter>
          <AddPet />
        </MemoryRouter>
      );
    const ageInputTest = screen.getByPlaceholderText(/Animal Age/i);
    expect(ageInputTest).toBeInTheDocument()
})
test("Animal Color input should be rendered", ()=>{
    render(
        <MemoryRouter>
          <AddPet />
        </MemoryRouter>
      );
    const colorInputTest = screen.getByPlaceholderText(/Animal Color/i);
    expect(colorInputTest).toBeInTheDocument()
})

test("Animal Comment input should be rendered", ()=>{
    render(
        <MemoryRouter>
          <AddPet />
        </MemoryRouter>
      );
    const commentInputTest = screen.getByPlaceholderText(/Animal Comment/i);
    expect(commentInputTest).toBeInTheDocument()
})

test("button input should be rendered", ()=>{
    render(
        <MemoryRouter>
          <AddPet />
        </MemoryRouter>
      );
    const buttonInputTest = screen.getByRole("button");
    expect(buttonInputTest).toBeInTheDocument()
})
