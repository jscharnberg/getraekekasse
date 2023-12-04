// AdminPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../shared/header';

const AdminPage = () => {
    return (
        <div>
            <Header isAdminPage />
            {/* Hier könnte der Inhalt für die Benutzer- und Artikelansichten stehen */}
        </div>
    );
};

export default AdminPage;
