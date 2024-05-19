import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import organizationDefault from "../../assets/organization-default.png";  
import { getOrganizationsByCreatorId, deleteOrganization } from '../../services/api/organizations/organizations';
import { OrganizationsData } from "../../types/OrganizationsData";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { handleError } from '../../services/errorHandler';

const MyOrganizations: React.FC = () => {
  const [organizations, setOrganizations] = useState<OrganizationsData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      const fetchOrganizations = async () => {
        try {
          const data = await getOrganizationsByCreatorId(user.id);
          setOrganizations(data || []);
        } catch (error) {
          handleError(error);
        }
      };
      fetchOrganizations();
    }
  }, [user]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const currentOrganizations = (organizations || []).slice(
    (currentPage - 1) * cardsPerPage, 
    currentPage * cardsPerPage
  ).map(org => ({
    ...org,
    img: org.img || organizationDefault  
  }));

  return (
    <div className="d-flex flex-wrap gap-1 container">
      {currentOrganizations.map((org, index) => (
        <div className="card-width" key={index}>
          <div className="card card-scale">
            <div className="card-body">
              <div className="d-flex flex-column gap-1 cursor-pointer mb-2" onClick={() => navigate(`/organizations/${org.id}`)}>
                <img className="col-12 object-fit-contain" src={org.img} alt={org.name} />
                <h5 className="card-text fw-semibold">{org.name}</h5>
                <p>{org.description}</p>
              </div>
              <button className="btn btn-outline-secondary fw-medium d-block mb-2" onClick={() => navigate(`/edit-organization/${org.id}`)}>
                Редагувати
              </button>
              <button className="btn btn-dark fw-medium d-block" onClick={async () => {
                try {
                  await deleteOrganization(org.id);
                  setOrganizations(organizations.filter(o => o.id !== org.id));
                } catch (error) {
                  handleError(error);
                }
              }}>Видалити</button>
            </div>
          </div>
        </div>
      ))}
      <nav aria-label="..." className="d-flex justify-content-center my-2 w-100">
        <ul className="pagination pagination-sm">
          {[...Array(Math.ceil(organizations.length / cardsPerPage))].map((_, index) => (
            <li className={`page-item ${currentPage === index + 1 ? 'active-card-page' : ''}`} key={index} role="button">
              <span className="page-link text-primary" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MyOrganizations;