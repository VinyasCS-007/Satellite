# Satellite Collision Predictor

A modern web application for managing satellites, predicting potential collisions, and visualizing orbits in 3D.

## Features
- **Dashboard UI:** Quick access to analytics, satellite management, collision prediction, and 3D globe visualization.
- **Satellite Management:** Add, edit, and delete satellites with TLE data and color coding.
- **Collision Prediction:** Predict and review potential satellite collisions.
- **3D Globe Visualization:** Interactive CesiumJS-based globe to visualize satellite orbits and collisions.
- **Live Analytics:** View real-time stats and insights about your satellite fleet.
- **Dark Mode:** Toggle between light and dark themes for comfortable viewing.
- **Responsive Design:** Works on desktop and mobile devices.

## Tech Stack
- **Frontend:** React, Material UI, CesiumJS, Framer Motion
- **Backend:** Django, Django REST Framework

## Getting Started

### Prerequisites
- Node.js & npm
- Python 3.10+
- pip

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```bash
   python manage.py migrate
   ```
4. Start the backend server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm start
   ```

The frontend will be available at [http://localhost:3000](http://localhost:3000) and the backend at [http://localhost:8000](http://localhost:8000).

## Project Structure
- `backend/` - Django backend and API
- `frontend/` - React frontend
- `src/components/` - React components (dashboard, analytics, globe, etc.)

## Customization
- **Cesium Access Token:** Set your Cesium Ion access token in `src/index.js`.
- **API Endpoints:** Update API URLs in the frontend if your backend runs on a different host/port.

## License
This project is for educational and demonstration purposes.

---

*Made with ❤️ using React, Django, and CesiumJS.*
![Screenshot 2025-05-02 225251](https://github.com/user-attachments/assets/a0212d25-c411-47cc-b828-1f99ff618435)
![Screenshot 2025-05-02 224758](https://github.com/user-attachments/assets/6bc9e004-b65d-4b42-9104-356901ffbdaa)
![Screenshot 2025-05-01 222637](https://github.com/user-attachments/assets/cf6e28bc-5679-402e-8995-75bd6ccc5718)
![Screenshot 2025-05-01 221237](https://github.com/user-attachments/assets/9042299d-ce82-4607-9d04-07fc0ee9951d)
![Screenshot 2025-05-01 221210](https://github.com/user-attachments/assets/0880acb9-ddd9-4b89-9399-3edd28bb436e)
