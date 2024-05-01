import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrganizations } from '../../services/api/organizations/organizations';
import organizationDefault from '../../assets/organization-default.png';
import { OrganizationsData } from '../../types/OrganizationsData';

const Organizations: React.FC = () => {
    const [organizations, setOrganizations] = useState<OrganizationsData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 6;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrganizations = async () => {
            const data = await getOrganizations();
            setOrganizations(data);
        };
        fetchOrganizations();
    }, []);

    const currentOrganizations = organizations.slice(
        (currentPage - 1) * cardsPerPage,
        currentPage * cardsPerPage
    );

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="d-flex flex-wrap gap-1 container">
            {currentOrganizations.map((org, index) => (
                <div className="card-width" key={index} onClick={() => navigate(`/organizations/${org.id}`)}>
                    <div className="card card-scale">
                        <img src={organizationDefault} alt={org.name} className="card-img-top" />
                        <div className="card-body">
                            <h5 className="card-title">{org.name}</h5>
                            <p className="card-text">{org.description}</p>
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

export default Organizations;