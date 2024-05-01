import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrganizationById } from '../../services/api/organizations/organizations';
import Fundraisings from '../fundraisings/fundraisings';
import organizationDefault from '../../assets/organization-default.png';
import { OrganizationsData } from '../../types/OrganizationsData';

const OrganizationDetails: React.FC = () => {
    const [organization, setOrganization] = useState<OrganizationsData | null>(null);
    const { id } = useParams<{ id?: string }>();

    useEffect(() => {
        const fetchOrganization = async () => {
            if (id) {
                try {
                    const data = await getOrganizationById(parseInt(id, 10));
                    setOrganization(data);
                } catch (error) {
                    console.error('Error fetching organization details:', error);
                }
            }
        };
        fetchOrganization();
    }, [id]);

    if (!organization) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex flex-column align-items-center justify-content-center">
            <h1 className="my-5">{organization.name}</h1>
            <img className="h-auto object-fit-contain w-75 mb-4" src={organizationDefault} alt={organization.name} />
            </div>
            <p className="fs-18">{organization.description}</p>
            {id && <Fundraisings organizationId={parseInt(id)} />}
        </div>
    );
};

export default OrganizationDetails;