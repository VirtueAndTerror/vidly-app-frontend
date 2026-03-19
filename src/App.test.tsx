import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import App from './App';

// Mock the authentication service to avoid reading from localStorage/JWT decoding
vi.mock('./services/authService', () => ({
  default: {
    getCurrentUser: vi.fn().mockReturnValue(null),
    login: vi.fn(),
    logout: vi.fn(),
    loginWithJwt: vi.fn(),
    getJwt: vi.fn().mockReturnValue(null)
  }
}));

// Mock the movie service to avoid network requests on mount
vi.mock('./services/movieService', () => ({
  getMovies: vi.fn().mockResolvedValue({ data: [] }),
  getMovie: vi.fn(),
  saveMovie: vi.fn(),
  deleteMovie: vi.fn()
}));

// Mock the genre service to avoid network requests on mount
vi.mock('./services/genreService', () => ({
  getGenres: vi.fn().mockResolvedValue({ data: [] })
}));

test('renders App component', () => {
  const { container } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(container).toBeTruthy();
});
