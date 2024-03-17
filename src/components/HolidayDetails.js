import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchHolidayPlanById } from '../services/holidayPlanService';

function HolidayDetails() {
  const [plan, setPlan] = useState({});
  const { id } = useParams();

  useEffect(() => {
    fetchHolidayPlanById(id).then(setPlan);
  }, [id]);

  return (
    <div>
      <h2>{plan.title}</h2>
    </div>
  );
}

export default HolidayDetails;