import React from 'react';

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  label: string;
}

// Round page buttons (mockups/v2/01-home.html). Nothing to switch with a single page,
// so it renders nothing then.
const Pagination: React.FC<PaginationProps> = ({ page, pageCount, onChange, label }) => {
  if (pageCount <= 1) {
    return null;
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const isFirst = page <= 1;
  const isLast = page >= pageCount;

  return (
    <nav className="d-flex justify-content-center mt-5" aria-label={label}>
      <ul className="pagination mb-0">
        <li className={`page-item${isFirst ? ' disabled' : ''}`}>
          <button type="button" className="page-link" aria-label="Попередня сторінка" disabled={isFirst} onClick={() => onChange(page - 1)}>
            ‹
          </button>
        </li>
        {pages.map((number) => (
          <li className={`page-item${number === page ? ' active' : ''}`} key={number}>
            <button
              type="button"
              className="page-link"
              aria-current={number === page ? 'page' : undefined}
              onClick={() => onChange(number)}
            >
              {number}
            </button>
          </li>
        ))}
        <li className={`page-item${isLast ? ' disabled' : ''}`}>
          <button type="button" className="page-link" aria-label="Наступна сторінка" disabled={isLast} onClick={() => onChange(page + 1)}>
            ›
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
