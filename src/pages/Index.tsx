
import React from 'react';
import { useAuth } from '../components/AuthProvider';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const { user } = useAuth();
  
  return user ? <Dashboard /> : <Login />;
};

export default Index;
