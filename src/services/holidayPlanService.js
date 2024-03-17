import axios from 'axios';

export const fetchHolidayPlans = async () => {
  try {
      const user_id = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/api/holiday_plans/user/${user_id}`, {
          headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`, 
          },
      });
      return response.data;
  } catch (error) {
      console.error("Failed to fetch holiday plans:", error);
      throw new Error('Failed to fetch');
  }
};

export const fetchHolidayPlanById = async (id) => {
    try {
      const response = await fetch(`http://example.com/api/holidayPlans/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json(); // Parses JSON response into native JavaScript objects
    } catch (error) {
      console.error(`Failed to fetch holiday plan with id ${id}:`, error);
      throw error; // Rethrow to handle it in the calling component
    }
};