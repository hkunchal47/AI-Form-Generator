import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { AdminDashboard } from './components/AdminDashboard';
import { FormCreator } from './components/FormCreator';
import { PublicFormView } from './components/PublicFormView';
import { ResponseViewer } from './components/ResponseViewer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create" element={<FormCreator />} />
        <Route path="/admin/edit/:formId" element={<FormCreator />} />
        <Route path="/admin/responses/:formId" element={<ResponseViewer />} />
        <Route path="/forms/:formId" element={<PublicFormView />} />
      </Routes>
    </Router>
  );
}

export default App;
