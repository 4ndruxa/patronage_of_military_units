import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { getFundraisings, getFundraisingsByOrganization } from '../../services/api/fundraisings/fundraisings';
import './fundraisings.scss';
import { Fundraising } from '../../types/FundraisingsData';
import FundraisingCard from '../ui/fundraisingCard';
import Pagination from '../ui/pagination';
import EmptyState from '../ui/emptyState';
import Icon from '../ui/icon';

interface FundraisingsProps {
  organizationId?: number;
}

type Status = 'loading' | 'ready' | 'error';

const CARDS_PER_PAGE = 6;

// Fundraising grid: the home catalog and the list on an organization page.
const Fundraisings: React.FC<FundraisingsProps> = ({ organizationId }) => {
  const [fundraisings, setFundraisings] = useState<Fundraising[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [attempt, setAttempt] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setStatus('loading');
      const fetchedFundraisings = organizationId ?
        await getFundraisingsByOrganization(organizationId) :
        await getFundraisings();

      if (cancelled) {
        return;
      }
      // The services return undefined on failure (the global toast already says so).
      if (fetchedFundraisings) {
        setFundraisings(fetchedFundraisings);
        setCurrentPage(1);
        setStatus('ready');
      } else {
        setStatus('error');
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [organizationId, attempt]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Back to the top of the grid when the new page starts above the screen.
    const list = listRef.current;
    if (list && list.getBoundingClientRect().top < 0) {
      list.scrollIntoView?.({ block: 'start' });
    }
  };

  const handleCardClick = (fundraising: Fundraising) => {
    navigate(`/fundraisings/${fundraising.id}`, { state: fundraising });
  };

  const pageCount = Math.ceil(fundraisings.length / CARDS_PER_PAGE);
  const currentCards = fundraisings.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  let content: React.ReactNode;
  if (status === 'loading') {
    content = (
      <div className="d-flex justify-content-center py-5" role="status">
        <span className="spinner-border text-primary" aria-hidden="true"></span>
        <span className="visually-hidden">Завантажуємо збори…</span>
      </div>
    );
  } else if (status === 'error') {
    content = (
      <EmptyState
        role="alert"
        title="Не вдалося завантажити дані"
        text="Спробуйте ще раз."
        action={
          <button type="button" className="btn btn-primary" onClick={() => setAttempt((n) => n + 1)}>
            <Icon name="refresh" className="pm-i-start" />Повторити
          </button>
        }
      />
    );
  } else if (fundraisings.length === 0) {
    content = <EmptyState title="Зборів поки немає" text="Зазирніть пізніше." />;
  } else {
    content = (
      <>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 pm-reveal">
          {currentCards.map((fundraising) => (
            <div className="col" key={fundraising.id}>
              <FundraisingCard fundraising={fundraising} onOpen={handleCardClick} />
            </div>
          ))}
        </div>
        <Pagination page={currentPage} pageCount={pageCount} onChange={handlePageChange} label="Сторінки зборів" />
      </>
    );
  }

  return (
    <div className="pm-fundraisings" ref={listRef}>
      {!organizationId && (
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <div>
            <h2 className="mb-1" id="zbory-title">Актуальні збори</h2>
            <p className="pm-muted mb-0">Матеріали й техніка, які потрібні постійно.</p>
          </div>
          <Link className="btn btn-outline-ink" to="/organizations">Усі організації</Link>
        </div>
      )}
      {content}
    </div>
  );
};

export default Fundraisings;
