import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import HomePage from '../../views/homePage/homePage';
import Hero from '../../components/hero/hero';
import { getFundraisings } from '../../services/api/fundraisings/fundraisings';
import { renderWithProviders, currentLocation } from './renderWithProviders';

jest.mock('../../services/api/fundraisings/fundraisings');
jest.mock('../../services/api/auth/auth');

describe('Home', () => {
  test('hero: the headline and two actions, no numbers', () => {
    const { container } = renderWithProviders(<Hero />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Підтримуйте підрозділи щомісяця, а не раз на рік',
    );
    expect(screen.getByRole('link', { name: 'Переглянути збори' })).toHaveAttribute('href', '#zbory');
    const hero = container.querySelector('.pm-hero') as HTMLElement;
    expect(hero.textContent).not.toMatch(/\d/);
    expect(hero.querySelector('.pm-stat')).toBeNull();

    const mockup = screen.getByRole('link', { name: /Новий дизайн \(в розробці\)/ });
    expect(mockup).toHaveAttribute('href', `${process.env.PUBLIC_URL ?? ''}/mockup/index.html`);
    expect(mockup).toHaveAttribute('target', '_blank');

    fireEvent.click(screen.getByRole('link', { name: 'Організації' }));
    expect(currentLocation()).toBe('/organizations');
  });

  test('order: hero, how it works, the catalog (#zbory), the photo strip', async () => {
    jest.mocked(getFundraisings).mockResolvedValue([]);
    renderWithProviders(<HomePage />);
    await screen.findByText('Зборів поки немає');

    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual([
      'Як це працює',
      'Актуальні збори',
      'За кожним збором стоять люди, які тримають оборону',
    ]);
    expect(document.getElementById('zbory')).toContainElement(screen.getByRole('heading', { name: 'Актуальні збори' }));
    expect(screen.getByRole('img', { name: /Ілюстрація/ })).toHaveAttribute('loading', 'lazy');
    expect(screen.getAllByRole('link', { name: 'Переглянути збори' })).toHaveLength(2);
  });
});
