import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Gateway from '../pages/Gateway';
import Solution from '../pages/Solution';
import Device from '../pages/Device';
import Dashboard from '../pages/Dashboard';

const RoutesApp: React.FC = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/dashboard/solution/:solution" element={<Solution />} />
    <Route path="/dashboard/gateway/:gateway" element={<Gateway />} />
    <Route
      path="/dashboard/gateway/:gateway/device/:device"
      element={<Device />}
    />
  </Routes>
);

export default RoutesApp;
