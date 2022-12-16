// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// This import is where the code from the CI lessons starts.
import {setupServer} from 'msw/node';
import { handler } from './mocks/handlers';

// Setup our mock server, using the handlers we've defined in mocks/handlers.js
const server = setupServer(...handlers)

// Setup and closedown code runs before all the tests, after each test or after all tests.
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
