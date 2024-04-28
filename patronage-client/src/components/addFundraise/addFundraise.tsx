import React, { useEffect, useState } from "react";
import { createFundraising } from '../../services/api/fundraisings/fundraisings';
import { FundraisingFormData } from "../../types/FundraisingsData";
import { getOrganizations } from "../../services/api/organizations/organizations";

const AddFundraise: React.FC = () => {
  const [formData, setFormData] = useState<FundraisingFormData>({
    title: "",
    description: "",
    organization_id: 1,
    sources: [{
      title: "",
      type: "",
      url: ""
    }],
    creator_id: 1,
  });

  const [organizations, setOrganizations] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const fetchedOrganizations = await getOrganizations();
        setOrganizations(fetchedOrganizations);
      } catch (error) {
        console.error("Failed to fetch organizations", error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSourceChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newSources = [...formData.sources];
    newSources[index] = { ...newSources[index], [event.target.name]: event.target.value };
    setFormData({ ...formData, sources: newSources });
  };

  const allSourcesFilled = () => {
    return formData.sources.every(source => source.title && source.type && source.url);
  };

  const addSource = () => {
    if (allSourcesFilled()) {
      setFormData(prevData => ({
        ...prevData,
        sources: [...prevData.sources, { title: "", type: "", url: "" }]
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (allSourcesFilled()) {
      try {
        const response = await createFundraising(formData);
        console.log("Fundraising Created:", response);
      } catch (error) {
        console.error("Error creating fundraising:", error);
      }
    } else {
      console.error("Please fill all fields for all sources.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Додати новий збір</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Назва збору</label>
          <input type="text" className="form-control" id="title" name="title"
            value={formData.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Опис</label>
          <textarea className="form-control" id="description" name="description"
            value={formData.description || ''} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="organization_id" className="form-label">Організація</label>
          <select className="form-control" id="organization_id" name="organization_id"
            value={formData.organization_id} onChange={handleChange} required>
            {organizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>

        {formData.sources.map((source, index) => (
          <div key={index}>
            <h4>Джерело надходження коштів {index + 1}</h4>
            <div className="mb-3">
              <label htmlFor={`source-title-${index}`} className="form-label">Назва</label>
              <input type="text" className="form-control" id={`source-title-${index}`} name="title" value={source.title}
                onChange={handleSourceChange(index)} />
            </div>
            <div className="mb-3">
              <label htmlFor={`source-type-${index}`} className="form-label">Тип</label>
              <input type="text" className="form-control" id={`source-type-${index}`} name="type" value={source.type}
                onChange={handleSourceChange(index)} />
            </div>
            <div className="mb-3">
              <label htmlFor={`source-url-${index}`} className="form-label">URL</label>
              <input type="text" className="form-control" id={`source-url-${index}`} name="url" value={source.url}
                onChange={handleSourceChange(index)} />
            </div>
          </div>
        ))}
        {allSourcesFilled() && (
          <button type="button" className="btn btn-secondary mt-3 d-block" onClick={addSource}>Додати ще одне джерело</button>
        )}
        <button type="submit" className="btn btn-primary mt-3">Зберегти збір</button>
      </form>
    </div>
  );
};

export default AddFundraise;
