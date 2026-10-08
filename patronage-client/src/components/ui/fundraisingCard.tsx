import React from 'react';
import { Link } from 'react-router-dom';
import { Fundraising } from '../../types/FundraisingsData';
import { coverClass } from '../../utils/cover';
import Icon from './icon';

interface FundraisingCardProps {
  fundraising: Fundraising;
  onOpen: (fundraising: Fundraising) => void;
}

// A plain click goes through onOpen (navigate with state); ctrl/cmd/middle click
// keeps the browser's own behaviour of the real link (open in a new tab).
const isPlainClick = (event: React.MouseEvent) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

// One fundraising card for every list (mockups/v2/01-home.html). The title link is
// stretched over the whole card, so a click anywhere on it opens the fundraising.
const FundraisingCard: React.FC<FundraisingCardProps> = ({ fundraising, onOpen }) => {
  const { id, title, description, organizations } = fundraising;
  const text = description?.trim();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isPlainClick(event)) {
      event.preventDefault();
      onOpen(fundraising);
    }
  };

  return (
    <article className="card pm-card pm-card--link h-100">
      <div className={`pm-cover ${coverClass(id)}`} aria-hidden="true"></div>
      <div className="card-body">
        {organizations?.name && <span className="badge pm-badge-org">{organizations.name}</span>}
        <h3 className="card-title">
          <Link className="stretched-link" to={`/fundraisings/${id}`} onClick={handleClick}>
            {title}
          </Link>
        </h3>
        {text && <p className="pm-desc">{text}</p>}
        {/* TODO(Е4/API): термометр, кількість підписників */}
        <div className="pm-foot">
          <span className="pm-more" aria-hidden="true">Детальніше <Icon name="arrow" /></span>
        </div>
      </div>
    </article>
  );
};

export default FundraisingCard;
