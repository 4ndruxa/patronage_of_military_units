import React from 'react';
import { act, fireEvent, screen, within } from '@testing-library/react';
import PageLayout from '../../components/layout/pageLayout';
import ErrorAlert from '../../components/error/errorAlert';
import AlertComponent from '../../components/notificationAlert/notificationAlert';
import { getInitials } from '../../components/header/header';
import { showError } from '../../store/errorSlice';
import { renderWithProviders, currentLocation, testUser } from './renderWithProviders';

jest.mock('../../services/api/auth/auth');

describe('Shell', () => {
  beforeEach(() => sessionStorage.clear());

  test('every page gets a header, <main> and a footer with authorship and the repo link', () => {
    renderWithProviders(<PageLayout><p>content</p></PageLayout>);
    expect(screen.getByRole('navigation', { name: 'Головна навігація' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('content');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Проєкт розробив Андрій Боднар.');
    expect(screen.getByRole('link', { name: 'Код на GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/4ndruxa/patronage_of_military_units',
    );
  });

  test('the burger opens the menu and it collapses after picking a page', () => {
    renderWithProviders(<PageLayout><p /></PageLayout>, { path: '*', route: '/' });
    const burger = screen.getByRole('button', { name: 'Відкрити меню' });
    fireEvent.click(burger);
    expect(screen.getByRole('button', { name: 'Закрити меню' })).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getAllByRole('link', { name: 'Організації' })[0]);
    expect(currentLocation()).toBe('/organizations');
    expect(screen.getByRole('button', { name: 'Відкрити меню' })).toHaveAttribute('aria-expanded', 'false');
  });

  test('tapping the link of the page already open still collapses the menu', () => {
    renderWithProviders(<PageLayout><p /></PageLayout>, { path: '*', route: '/patronage_of_military_units' });
    fireEvent.click(screen.getByRole('button', { name: 'Відкрити меню' }));
    const nav = screen.getByRole('navigation', { name: 'Головна навігація' });
    fireEvent.click(within(nav).getByRole('link', { name: 'Збори' }));
    expect(screen.getByRole('button', { name: 'Відкрити меню' })).toHaveAttribute('aria-expanded', 'false');
  });

  test.each([
    ['/patronage_of_military_units', 'Збори'],
    ['/fundraisings/5', 'Збори'],
    ['/organizations', 'Організації'],
  ])('at %s the active nav item is «%s»', (route, name) => {
    renderWithProviders(<PageLayout><p /></PageLayout>, { path: '*', route });
    const nav = screen.getByRole('navigation', { name: 'Головна навігація' });
    const active = within(nav).getByRole('link', { name });
    expect(active).toHaveClass('active');
    expect(active).toHaveAttribute('aria-current', 'page');
    const other = within(nav).getByRole('link', { name: name === 'Збори' ? 'Організації' : 'Збори' });
    expect(other).not.toHaveClass('active');
    expect(other).not.toHaveAttribute('aria-current');
  });

  test('a guest gets neither the reminder modal nor «Мої підписки» in the footer', () => {
    jest.useFakeTimers();
    try {
      renderWithProviders(<PageLayout><AlertComponent /></PageLayout>);
      act(() => { jest.runOnlyPendingTimers(); });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      const footer = screen.getByRole('contentinfo');
      expect(within(footer).queryByRole('link', { name: 'Мої підписки' })).not.toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  });

  test('a user gets the reminder with focus on «Закрити»; Escape closes it', () => {
    jest.useFakeTimers();
    try {
      sessionStorage.setItem('user', JSON.stringify(testUser));
      renderWithProviders(<AlertComponent />, { user: testUser });
      act(() => { jest.runOnlyPendingTimers(); });
      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getAllByRole('button', { name: 'Закрити' })[0]).toHaveFocus();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  });

  test.each([
    ['Додати збір', '/add-fundraising'],
    ['Додати організацію', '/add-organization'],
  ])('«%s» in the avatar menu leads to %s', (name, path) => {
    sessionStorage.setItem('user', JSON.stringify(testUser));
    renderWithProviders(<PageLayout><p /></PageLayout>, { user: testUser });
    fireEvent.click(screen.getByRole('link', { name }));
    expect(currentLocation()).toBe(path);
  });

  test('avatar initials come from the user name', () => {
    expect(getInitials('Олена Коваль')).toBe('ОК');
    expect(getInitials('Test')).toBe('T');
    expect(getInitials('')).toBe('?');
    expect(getInitials('   ')).toBe('?');
    expect(getInitials('𝒜lex')).toBe('𝒜');
  });

  test('error toast shows the detail and hides on the close button or after 5 s', () => {
    jest.useFakeTimers();
    try {
      const { store } = renderWithProviders(<ErrorAlert />);
      act(() => { store.dispatch(showError('Network Error')); });
      expect(screen.getByRole('alert')).toHaveTextContent('Не вдалося виконати дію');
      expect(screen.getByRole('alert')).toHaveTextContent('Network Error');
      fireEvent.click(screen.getByRole('button', { name: 'Закрити' }));
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      act(() => { store.dispatch(showError('again')); });
      act(() => { jest.advanceTimersByTime(5000); });
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  });
});
