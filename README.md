# Zenfoline - Portfolio Builder

Zenfoline is a modern portfolio builder application that allows users to create professional portfolios with customizable templates, sections, and themes.

## Features

- **User Authentication**: Secure login and registration system
- **Template Selection**: Choose from multiple portfolio templates
- **Customizable Sections**: Add, remove, and customize various portfolio sections
- **Real-time Preview**: See changes in real-time as you edit your portfolio
- **Responsive Design**: Portfolios look great on all devices
- **Admin Dashboard**: Manage templates, components, and users

## Tech Stack

### Frontend
- React.js
- Zustand (State Management)
- Tailwind CSS
- React Icons
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/zenfoline.git
cd zenfoline
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend/zenfoline frontend/zenfoline
npm install
```

3. Set up environment variables
Create `.env` files in both frontend and backend directories with the necessary environment variables.

4. Start the development servers
```bash
# Start backend server
cd Backend
npm run dev

# Start frontend server
cd ../Frontend/zenfoline frontend/zenfoline
npm start
```

5. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
zenfoline/
├── Backend/                 # Backend server code
│   ├── controllers/         # API controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   └── server.js            # Entry point
│
├── Frontend/                # Frontend application
│   └── zenfoline frontend/  # React application
│       ├── public/          # Static files
│       ├── src/             # Source code
│       │   ├── assets/      # Images, fonts, etc.
│       │   ├── components/  # Reusable components
│       │   ├── store/       # State management
│       │   ├── Templates/   # Portfolio templates
│       │   └── ...
│       └── package.json     # Frontend dependencies
│
└── README.md                # Project documentation
```

## Known Issues

- **Template Editor Preview**: Some sections (like Experience) don't update in real-time for all fields
- **First-time Loading**: Some data doesn't appear in the preview until navigating to other sections

So lets create a readme first and start working on things taht are not working for the @TemplateEditor.jsx editor and preview @EditorPreview.jsx for @ExpertPortfolioTemplate.jsx 
so the preview is showing the sections according to the sections configuration visibility in a real time the each sections are getting the data fetched in form and visisbikity setting are being saved successfully: and only basic form name changes is showing in real time preview and also phone, emails and image  and for about form it is also updating in real time preview when anything is written in input field and skills also working in real timr preview for expeirence the start date end date i currently work here check box and key achievement are not geeting update in realtime, and projects is totally working in real time

and for first time landing in editor in preview oly when user first time goes to other sections the details are showin in preview for basic section the image name and phone nu,ber are only shown at first time landing in edittoe in preview

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 