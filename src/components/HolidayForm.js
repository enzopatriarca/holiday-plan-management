import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import '../CreationForm.css';
import { useNavigate } from 'react-router-dom';



const HolidayValidationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  start_date: Yup.date().required('Start date is required').nullable(),
  end_date: Yup.date().required('End date is required')
             .min(Yup.ref('start_date'), "End date can't be before start date")
             .nullable(),
  location: Yup.string().required('Location is required'),
  participants: Yup.array().of(Yup.number()).required('At least one participant is required'),
});

function HolidayCreationForm() {
  const [participantOptions, setParticipantOptions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://127.0.0.1:8000/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
    .then(response => {
      setParticipantOptions(response.data.users);
    })
    .catch(error => {
      console.error('There was an error fetching the participants:', error);
    });
  }, []);
  

  const initialValues = {
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    participants: [],
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token'); 
    const submitValues = {
      ...values,
      user_id: user_id
    };
  
    axios.post(`http://127.0.0.1:8000/api/holiday_plans/user/${user_id}`, submitValues, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log('Holiday created:', response.data);
      setSubmitting(false);
      resetForm();
      navigate('/');
    })
    .catch(error => {
      console.error('There was an error creating the holiday:', error);
      setSubmitting(false);
    });
  };
  

  return (
    <div className="update-holiday-container">
      <h1>Create Holiday Plan</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={HolidayValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="form-container">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <Field name="title" type="text" />
              <ErrorMessage className="error-message" name="title" component="div" />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <Field name="description" as="textarea" />
              <ErrorMessage className="error-message" name="description" component="div" />
            </div>

            <div className="form-group">
              <label htmlFor="start_date">Start Date</label>
              <Field name="start_date" type="date" />
              <ErrorMessage className="error-message" name="start_date" component="div" />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <Field name="end_date" type="date" />
              <ErrorMessage className="error-message" name="end_date" component="div" />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <Field name="location" type="text" />
              <ErrorMessage className="error-message" name="location" component="div" />
            </div>

            <div className="form-group">
              <label htmlFor="participants">Participants</label>
              <div className="participant-checkboxes-container">
                {participantOptions.map(option => (
                  <label key={option.id} className="checkbox-label">
                    <input
                      className='input_selec'
                      type="checkbox"
                      name="participants"
                      value={option.id}
                      checked={values.participants.includes(option.id)}
                      onChange={event => {
                        if (event.target.checked) {
                          setFieldValue('participants', [...values.participants, option.id]);
                        } else {
                          setFieldValue(
                            'participants',
                            values.participants.filter(id => id !== option.id)
                          );
                        }
                      }}
                    />
                    {option.name}
                  </label>
                ))}
              </div>
              <ErrorMessage name="participants" component="div" className="error-message" />
            </div>

            <button type="submit" className="btn btn-primary">Create Holiday</button>
          </Form>
        )}
      </Formik>
    </div>
    
  );
}

export default HolidayCreationForm;
