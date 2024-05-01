import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createOrganization, updateOrganization, getOrganizationById } from '../../services/api/organizations/organizations';

const AddEditOrganization: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = 1;

  useEffect(() => {
    if (id) {
      const fetchOrganization = async () => {
        try {
          const orgData = await getOrganizationById(Number(id));
          setFormData({ name: orgData.name, description: orgData.description || '' });
        } catch (error) {
          console.error('Failed to fetch organization details', error);
        }
      };
      fetchOrganization();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (id) {
        const updatedOrganization = await updateOrganization(Number(id), formData);
        console.log('Organization updated:', updatedOrganization);
        navigate(`/organizations`);
      } else {
        const createdOrganization = await createOrganization(formData, userId);
        console.log('Organization created:', createdOrganization);
        navigate('/organizations');
      }
    } catch (error) {
      console.error('Error handling organization:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>{id ? 'Редагувати організацію' : 'Додати організацію'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="name">Ім'я</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Введіть назву організації"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="description">Опис</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Додати опис"
            rows={3}
          />
        </div>
        <button type="submit" className="btn btn-primary">{id ? 'Оновити' : 'Додати'}</button>
      </form>
    </div>
  );
};

export default AddEditOrganization;