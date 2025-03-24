# CrimeReport Web Application

A modern, responsive web application for reporting crimes and incidents. Built with HTML, CSS (Tailwind), and JavaScript.

## Features

- User authentication (login/registration)
- Incident reporting with location tracking
- Interactive map integration
- Multimedia upload support
- Real-time notifications
- Offline functionality
- Progressive Web App (PWA) support
- Responsive design
- Accessibility features
- Multilingual support

## Project Structure

```
crimereport/
├── index.html              # Landing page
├── login.html             # Login page
├── register.html          # Registration page
├── report.html           # Incident reporting page
├── profile.html          # User profile page
├── history.html          # Incident history page
├── manifest.json         # PWA manifest
├── sw.js                 # Service worker
├── css/
│   └── styles.css       # Custom styles
├── js/
│   ├── app.js           # Main application logic
│   ├── auth.js          # Authentication handling
│   ├── map.js           # Map functionality
│   └── reports.js       # Report management
└── assets/
    ├── icons/           # Application icons
    └── images/          # Other images
```

## Technologies Used

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (ES6+)
- Service Workers
- IndexedDB
- Geolocation API
- Maps API

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/crimereport.git
   ```

2. Navigate to the project directory:
   ```bash
   cd crimereport
   ```

3. Open `index.html` in your web browser or use a local server.

## Development

To modify the application:

1. Edit the HTML files for structure changes
2. Modify `css/styles.css` for custom styles
3. Update JavaScript files in the `js` directory for functionality changes
4. Add new assets to the `assets` directory

## Deployment

The application is designed to be hosted on GitHub Pages:

1. Push your changes to GitHub
2. Enable GitHub Pages in your repository settings
3. Select the main branch as the source

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Tailwind CSS for the styling framework
- Font Awesome for icons
- OpenStreetMap for map integration 