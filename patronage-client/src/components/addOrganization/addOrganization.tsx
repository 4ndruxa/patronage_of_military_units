import React, { useState } from 'react';
import { createOrganization } from '../../services/api/organizations/organizations';

const AddOrganization: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const userId = 1; // Assuming this comes from context or auth

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
      const createdOrganization = await createOrganization(formData, userId);
      console.log('Organization created:', createdOrganization);
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Додати організацію</h1>
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
        <button type="submit" className="btn btn-secondary">Додати організацію</button>
      </form>
    </div>
  );
};

export default AddOrganization;