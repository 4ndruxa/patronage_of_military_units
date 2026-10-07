import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CardData } from "../../types/CardData";
import { createSubscription } from '../../services/api/subscriptions/subscriptions';
import { getFundraisingById } from '../../services/api/fundraisings/fundraisings';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const SUBSCRIBE_EXPLAINER =
  'Раз на місяць ми нагадаємо вам про цей збір у застосунку. Гроші ми не збираємо: донат ви робите на сторінці організації.';

const TOAST_TIMEOUT_MS = 5000;

const ICON_PATHS = {
  arrow: 'M5 12h14M12 5l7 7-7 7',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  card: 'M3 4h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM1 10h22',
  check: 'M20 6 9 17l-5-5',
  ext: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3',
};

const Icon: React.FC<{ name: keyof typeof ICON_PATHS; className?: string }> = ({ name, className }) => (
  <svg className={`pm-i${className ? ` ${className}` : ''}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d={ICON_PATHS[name]} />
  </svg>
);

// Only http(s) sources become links; anything else (javascript:, data:, typos) is plain text.
const isWebUrl = (url: string | undefined): boolean => {
  if (!url) {
    return false;
  }
  try {
    const { protocol } = new URL(url);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

const Fundraising: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const { id: routeId } = useParams<{ id: string }>();

  const [fundraisingData, setFundraisingData] = useState<CardData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  // Bumped on unmount and on every route change, so a late subscription
  // response never lands on another fundraising or an unmounted page.
  const requestEpoch = useRef(0);
  const hasData = fundraisingData !== null;

  useEffect(() => () => {
    requestEpoch.current += 1;
  }, []);

  useEffect(() => {
    if (!hasData) {
      return;
    }
    // The mobile action bar is fixed to the bottom: give the footer room under it.
    document.body.classList.add('pm-has-actionbar');
    return () => document.body.classList.remove('pm-has-actionbar');
  }, [hasData]);

  useEffect(() => {
    if (!showToast) {
      return;
    }
    const timer = setTimeout(() => setShowToast(false), TOAST_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [showToast]);

  // Subscription state is local to the fundraising shown (it does not come from the API yet).
  useEffect(() => {
    requestEpoch.current += 1;
    setSubscribed(false);
    setSubscribing(false);
    setShowToast(false);
  }, [routeId]);

  useEffect(() => {
    setNotFound(false);
    // Cards pass the fundraising in navigation state (it survives a reload via
    // history.state); a direct link or a new tab arrives without it and has to
    // be fetched by the id in the URL.
    if (location.state) {
      setFundraisingData(location.state as CardData);
      return;
    }

    setFundraisingData(null);
    if (!routeId || !/^\d+$/.test(routeId) || Number(routeId) === 0) {
      setNotFound(true);
      return;
    }
    const fundraisingId = Number(routeId);

    let cancelled = false;
    getFundraisingById(fundraisingId).then((data) => {
      if (cancelled) {
        return;
      }
      if (data) {
        setFundraisingData({ ...data, description: data.description ?? '', img: '' });
      } else {
        setNotFound(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [location.state, routeId]);

  // The first source with a web url; non-http(s) urls are never followed.
  const donateUrl = fundraisingData?.sources?.find((source) => isWebUrl(source.url))?.url;

  const navigateToBankLink = () => {
    if (donateUrl) {
      navigate('/redirect-bank-link', { state: { url: donateUrl } });
    }
  };

  const handleSubscribe = async () => {
    if (!user || !fundraisingData || subscribing) {
      return;
    }
    setSubscribing(true);
    const epoch = requestEpoch.current;
    try {
      // The service reports failures in the global error toast and resolves undefined.
      const result = await createSubscription({ fundraising_id: fundraisingData.id, user_id: user.id });
      if (epoch !== requestEpoch.current) {
        return;
      }
      if (result) {
        setSubscribed(true);
        setShowToast(true);
      }
    } catch (error) {
      console.error("Failed to create subscription", error);
    } finally {
      if (epoch === requestEpoch.current) {
        setSubscribing(false);
      }
    }
  };

  if (notFound) {
    return (
      <div className="container">
        <div className="d-flex flex-column align-items-center">
          <h1 className="mt-5 mb-3">Збір не знайдено</h1>
          <p className="fs-18">Можливо, його видалили або посилання неправильне.</p>
          <button className="btn btn-primary fw-medium" onClick={() => navigate('/patronage_of_military_units')}>
            До всіх зборів
          </button>
        </div>
      </div>
    );
  }

  if (!fundraisingData) {
    return <div>Loading...</div>;
  }

  const { title, description, organizations, sources, id } = fundraisingData;
  const canDonate = Boolean(donateUrl);
  const coverClass = `pm-g${(Math.abs(id) % 6) + 1}`;

  const subscribeSpinner = subscribing && (
    <span className="spinner-border spinner-border-sm pm-i-start" aria-hidden="true"></span>
  );

  return (
    <div className="container pt-4 pt-lg-5 pm-fundraising">
      <nav aria-label="Хлібні крихти" className="mb-3">
        <ol className="breadcrumb mb-0 small">
          <li className="breadcrumb-item"><Link to="/patronage_of_military_units">Збори</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{title}</li>
        </ol>
      </nav>
      <div className="pm-detail">
        <div className="pm-detail__main">
          <div className={`pm-cover pm-cover--tall ${coverClass} mb-4`} aria-hidden="true"></div>
          <Link className="badge pm-badge-org" to={`/organizations/${organizations.id}`}>
            {organizations.name}
          </Link>
          <h1 className="mb-3">{title}</h1>
          {description?.trim()
            ? <p className="fs-5 pm-detail__desc">{description}</p>
            : <p className="pm-muted">Опис ще не додано.</p>}
        </div>

        {sources && sources.length > 0 && (
          <div className="pm-detail__sources">
            <h2 className="h3 mb-3">Способи оплати</h2>
            <ul className="list-unstyled d-grid gap-2">
              {sources.map((source, index) => {
                const content = (
                  <>
                    <span className="pm-source__ico"><Icon name="card" /></span>
                    <span className="pm-source__body">
                      <strong>{source.title}</strong>
                      {source.type && <small>{source.type}</small>}
                    </span>
                  </>
                );
                return (
                  <li key={source.id ?? index}>
                    {isWebUrl(source.url) ? (
                      <a className="pm-source" href={source.url} target="_blank" rel="noopener noreferrer">
                        {content}
                        <Icon name="ext" />
                        <span className="visually-hidden"> (відкриється в новій вкладці)</span>
                      </a>
                    ) : (
                      <div className="pm-source">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="pm-panel-col">
          <aside className="pm-panel" aria-label="Підтримати збір">
            {/* TODO(Е4): термометр */}
            <button type="button" className="btn btn-donate btn-lg w-100" onClick={navigateToBankLink} disabled={!canDonate}>
              Задонатити <Icon name="arrow" className="pm-i-end" />
            </button>
            <p className="pm-caption text-center mt-2 mb-0">
              {canDonate
                ? 'Ви перейдете на сторінку організації. Там ви самі обираєте суму.'
                : 'Організація ще не додала способи оплати'}
            </p>
            <hr />
            {/* TODO(API): subscribers_count — Е3.4 */}
            {!user ? (
              <div>
                <p className="small pm-muted">{SUBSCRIBE_EXPLAINER}</p>
                <Link className="btn btn-primary w-100" to="/login">Увійти, щоб підписатись</Link>
              </div>
            ) : subscribed ? (
              <div>
                {/* TODO(API): стан після F5, «Я задонатив(ла)» (Е5), «Скасувати підписку» */}
                <div className="pm-checkline"><Icon name="check" />Ви підписані на цей збір</div>
              </div>
            ) : (
              <div>
                <p className="small pm-muted">{SUBSCRIBE_EXPLAINER}</p>
                <button type="button" className="btn btn-primary w-100" onClick={handleSubscribe} disabled={subscribing}>
                  {subscribeSpinner || <Icon name="bell" className="pm-i-start" />}
                  Підписатись на щомісячне нагадування
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>

      <div className="pm-actionbar" role="group" aria-label="Швидкі дії">
        <button type="button" className="btn btn-donate" onClick={navigateToBankLink} disabled={!canDonate}>
          Задонатити
        </button>
        {!user ? (
          <Link className="btn btn-primary" to="/login">Увійти, щоб підписатись</Link>
        ) : !subscribed && (
          <button type="button" className="btn btn-primary" onClick={handleSubscribe} disabled={subscribing}>
            {subscribeSpinner}
            Підписатись
          </button>
        )}
      </div>

      {showToast && (
        <div className="pm-toast-area">
          <div className="toast show pm-toast pm-toast--ok" role="status" aria-live="polite" aria-atomic="true">
            <div className="d-flex p-3 gap-3">
              <span style={{ color: 'var(--pm-success)' }}><Icon name="check" /></span>
              <div className="flex-grow-1">
                <strong className="d-block">Підписку оформлено</strong>
                <span className="small pm-muted">Раз на місяць ми нагадаємо вам про цей збір у застосунку.</span>
              </div>
              <button type="button" className="btn-close" aria-label="Закрити" onClick={() => setShowToast(false)}></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fundraising;