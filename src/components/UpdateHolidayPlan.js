import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../UpdateHolidayPlan.css';
import * as Yup from 'yup';

const holidayValidationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters long'),
    description: Yup.string().required('Description is required').min(5, 'Description must be at least 5 characters long'),
    start_date: Yup.date().required('Start date is required'),
    end_date: Yup.date().required('End date is required').min(Yup.ref('start_date'), "End date can't be before start date"),
    location: Yup.string().required('Location is required').min(3, 'Location must be at least 3 characters long'),
    participants: Yup.array().of(Yup.number()).required('At least one participant is required').min(1, 'At least one participant is required'),
});
  

function UpdateHolidayPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [holidayPlan, setHolidayPlan] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    participants: [],
  });


  const validate = async (values) => {
    try {
      await holidayValidationSchema.validate(values, { abortEarly: false });
      setFormErrors({}); 
    } catch (yupError) {
      const errors = yupError.inner.reduce((acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {});
      setFormErrors(errors);
      return false;
    }
  };

  const [allParticipants, setAllParticipants] = useState([]); 
  const [selectedParticipants, setSelectedParticipants] = useState(new Set()); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHolidayPlan = async () => {
      const token = localStorage.getItem('token'); 
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      };
  
      try {
        const responsePlan = await axios.get(`http://127.0.0.1:8000/api/holiday/${id}`, config);
        setHolidayPlan(responsePlan.data);
        const initialSelected = new Set(responsePlan.data.participants.map(p => p.id));
        setSelectedParticipants(initialSelected);
  
        const responseParticipants = await axios.get(`http://127.0.0.1:8000/api/users`, config);
        setAllParticipants(responseParticipants.data.users);
  
      } catch (err) {
        setError('Failed to fetch holiday plan details.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchHolidayPlan();
  }, [id]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedPlan = {
      ...holidayPlan,
      participants: Array.from(selectedParticipants),
    };

    console.log(updatedPlan)

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:8000/api/holiday/${id}`, updatedPlan, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/'); 
    } catch (err) {
      setError('Failed to update holiday plan.');
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === 'checkbox') {
      const newSelectedParticipants = new Set(selectedParticipants);
      if (checked) {
        newSelectedParticipants.add(Number(value));
      } else {
        newSelectedParticipants.delete(Number(value));
      }
      setSelectedParticipants(newSelectedParticipants);
    } else {
      setHolidayPlan((prevPlan) => ({ ...prevPlan, [name]: value }));
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (  
    <div className="update-holiday-container">
      <h1>Update Holiday Plan</h1>
      <form onSubmit={handleSubmit} className="update-holiday-form" noValidate>
        <div className="form-group">
          <label>Title</label>
          <input name="title" type="text" value={holidayPlan.title} onChange={handleChange} required />
          {formErrors.title && <div className="form-error">{formErrors.title}</div>}
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={holidayPlan.description} onChange={handleChange} required />
          {formErrors.description && <div className="form-error">{formErrors.description}</div>}
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input type="date" name="start_date" value={holidayPlan.start_date} onChange={handleChange} required />
          {formErrors.start_date && <div className="form-error">{formErrors.start_date}</div>}
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input type="date" name="end_date" value={holidayPlan.end_date} onChange={handleChange} required />
          {formErrors.end_date && <div className="form-error">{formErrors.end_date}</div>}
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={holidayPlan.location} onChange={handleChange} required />
          {formErrors.location && <div className="form-error">{formErrors.location}</div>}
        </div>
        <div className="form-group checkbox-group">
          <h3>Participants</h3>
          {allParticipants.map((participant) => (
            <label key={participant.id} className="checkbox-label">
              <input
                className='input_select'
                type="checkbox"
                name="participants"
                value={participant.id}
                checked={selectedParticipants.has(participant.id)}
                onChange={handleChange}
              />
              {participant.name}
            </label>
          ))}
          {formErrors.participants && <div className="form-error">{formErrors.participants}</div>}
        </div>
        <button type="submit" className="button" disabled={Object.keys(formErrors).length > 0 || isLoading}>Update Holiday Plan</button>
      </form>
    </div>

  );
}

export default UpdateHolidayPlan;
