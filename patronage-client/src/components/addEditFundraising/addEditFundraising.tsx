import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { createFundraising, updateFundraising, getFundraisingById } from '../../services/api/fundraisings/fundraisings';
import { FundraisingFormData } from "../../types/FundraisingsData";
import { getOrganizations } from "../../services/api/organizations/organizations";
import { handleError } from '../../services/errorHandler';

const AddEditFundraising: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [formData, setFormData] = useState<FundraisingFormData>({
    title: "",
    description: "",
    organization_id: 0,
    sources: [{
      title: "",
      type: "",
      url: ""
    }],
    creator_id: user!.id,
  });
  const [organizations, setOrganizations] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrganizationsAndData = async () => {
      try {
        const fetchedOrganizations = await getOrganizations();
        setOrganizations(fetchedOrganizations);
        if (id) {
          const fetchedFundraising = await getFundraisingById(parseInt(id));
          setFormData({ ...formData, ...fetchedFundraising, creator_id: user!.id });
        } else if (fetchedOrganizations.length > 0) {
          setFormData(prevData => ({
            ...prevData,
            organization_id: fetchedOrganizations[0].id
          }));
        }
      } catch (error) {
        handleError(error);
      }
    };

    fetchOrganizationsAndData();
  }, [id, user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === "organization_id" ? parseInt(value) : value
    }));
  };

  const handleSourceChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const newSources = [...formData.sources];
    newSources[index] = { ...newSources[index], [name]: value };
    setFormData({ ...formData, sources: newSources });
  };

  const allSourcesFilled = () => {
    return formData.sources.every(source => source.title.trim() !== "" && source.type.trim() !== "" && source.url.trim() !== "");
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
        if (id) {
          await updateFundraising(parseInt(id), formData);
          navigate('/my-fundraisings');
        } else {
          await createFundraising(formData);
          navigate('/my-fundraisings');
        }
      } catch (error) {
        handleError(error);
      }
    } else {
      console.error("Please fill all fields for all sources.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Редагувати збір" : "Додати новий збір"}</h2>
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
            <option value="" disabled>Оберіть організацію</option>
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
          <button type="button" className="btn btn-secondary mt-3 mb-3 d-block" onClick={addSource}>Додати ще одне джерело</button>
        )}
        <button type="submit" className="btn btn-primary">{id ? 'Оновити' : 'Зберегти збір'}</button>
      </form>
    </div>
  );
};

export default AddEditFundraising;