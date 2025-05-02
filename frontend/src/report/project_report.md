# Project Report: Satellite Collision Prediction System

## Abstract
The Satellite Collision Prediction System is a state-of-the-art, web-based platform designed to address the growing challenge of satellite congestion and collision risk in Earth's orbit. As the number of operational satellites and space debris increases, the probability of catastrophic collisions rises, threatening both current and future space missions. This system integrates real-time orbital data, advanced collision detection algorithms, and interactive 3D visualization to provide satellite operators, researchers, and educators with actionable insights into potential collision events. By leveraging a modern technology stack—React.js for the frontend, Django for the backend, Cesium.js for 3D visualization, and satellite.js for orbital mechanics—the platform delivers a seamless user experience, robust data management, and accurate, timely predictions. The system is designed for extensibility, supporting future enhancements such as debris tracking, integration with external data sources, and advanced analytics, making it a valuable tool for space situational awareness and operational decision-making.

## Introduction
The exponential growth in satellite launches, driven by commercial, governmental, and scientific initiatives, has transformed Earth's orbit into an increasingly crowded and complex environment. This proliferation of satellites, coupled with the accumulation of space debris, has elevated the risk of in-orbit collisions to unprecedented levels. Such collisions can generate thousands of debris fragments, further compounding the hazard and potentially triggering cascading events like the Kessler Syndrome, where debris generation leads to a self-sustaining chain reaction of collisions. Traditional collision prediction methods often suffer from limited data accessibility, lack of real-time processing, and inadequate visualization tools, making it difficult for operators to assess and respond to collision threats effectively. The Satellite Collision Prediction System is conceived to bridge these gaps by providing a comprehensive, user-friendly, and visually rich platform. It enables users to manage satellite data, perform real-time collision risk assessments, and visualize orbital dynamics in an interactive 3D environment. The system's architecture ensures scalability, reliability, and ease of integration with future technologies, positioning it as a forward-looking solution for the challenges of modern space operations.

## Objectives
- Develop a robust and extensible system for predicting satellite collisions using Two-Line Element (TLE) data.
- Provide an intuitive interface for satellite data management, including adding, editing, and deleting satellites.
- Enable real-time, interactive 3D visualization of satellite orbits and collision risks.
- Deliver timely and detailed alerts to users regarding potential collisions.
- Support future extensibility for debris tracking, advanced analytics, and integration with external data sources.

## Implementation
### System Architecture
The system is architected as a full-stack web application with clear separation of concerns:
- **Frontend**: Built with React.js, the frontend offers a responsive and interactive user experience. It communicates with the backend via RESTful APIs and renders satellite orbits and collision events using Cesium.js.
- **Backend**: Implemented in Django, the backend exposes API endpoints for satellite CRUD operations, collision prediction, and user management. It uses the SGP4 algorithm (via the `sgp4` Python library) for precise orbital propagation.
- **Database**: The backend uses a relational database (SQLite for development, easily switchable to MySQL/PostgreSQL for production) to persist satellite and prediction data.

### Database Design
The project database consists of the following tables:
1. **satellite_api_satellite**: Stores satellite metadata, including name, NORAD ID, TLE lines, last update timestamp, and display color.
2. **satellite_api_prediction**: Records collision predictions, linking two satellites, the predicted time of closest approach, minimum distance, risk assessment, and the user who created the prediction.
3. **Django Built-in Tables**: Additional tables for authentication, permissions, admin logs, sessions, and migrations (e.g., `auth_user`, `django_admin_log`).

### Key Algorithms
- **Collision Detection**: For each pair of satellites, the backend propagates their orbits to the current epoch and computes the Euclidean distance between them. If the distance falls below a defined threshold (e.g., 1 km), a collision risk is flagged and recorded.
- **TLE Validation**: The system validates TLE input using regular expressions to ensure data integrity before processing.

### API Endpoints
- `/api/satellites/`: List, create, update, and delete satellites.
- `/api/predict-collisions/`: Trigger collision prediction and retrieve current collision risks.
- `/api/register/`: User registration endpoint.

## Features
- **Satellite Management**: Users can add, edit, and remove satellites, with validation for TLE data.
- **Collision Prediction**: The system automatically checks for potential collisions and provides detailed reports, including involved satellites, distance, and risk level.
- **3D Visualization**: Satellites and collision events are rendered in a Cesium.js-powered globe, with colliding satellites highlighted in red and interactive tooltips.
- **Real-Time Alerts**: Users receive modal popups and visual cues when collisions are detected.
- **User Experience Enhancements**: Features such as dark mode, responsive design, and animated modals improve usability.

## Results
- The system accurately identifies potential satellite collisions and presents them in a clear, actionable format.
- The 3D visualization enables users to intuitively understand spatial relationships and collision risks.
- User testing indicates high satisfaction with the interface, especially the real-time feedback and interactive features.
- The backend efficiently processes collision predictions, even as the number of satellites increases.

## Conclusion
The Satellite Collision Prediction System demonstrates a practical and scalable approach to space situational awareness. By integrating advanced orbital mechanics, real-time data processing, and modern web technologies, the system empowers users to proactively manage collision risks. The modular architecture supports future enhancements, such as debris tracking, integration with external space data sources, and advanced analytics. This project lays the groundwork for safer and more efficient satellite operations in an increasingly crowded orbital environment.

## Appendix: Database Tables Overview
| Table Name                  | Description                                                      |
|----------------------------|------------------------------------------------------------------|
| satellite_api_satellite     | Stores satellite metadata (name, NORAD ID, TLE, color, etc.)      |
| satellite_api_prediction    | Records collision predictions and involved satellites             |
| auth_user                   | Django built-in: user accounts                                   |
| auth_group, auth_permission | Django built-in: permissions and groups                          |
| django_admin_log            | Django built-in: admin actions log                               |
| django_content_type         | Django built-in: content type registry                           |
| django_migrations           | Django built-in: migration history                               |
| django_session              | Django built-in: user sessions                                   |

*Note: The actual number of tables may vary depending on installed Django apps and migrations.*