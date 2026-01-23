import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LoadingProvider } from './contexts/LoadingContext';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';
import LoadingOverlay from './components/LoadingOverlay';//bitl3 klshi foe loadinf by controlled
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import AuditLogs from './pages/AuditLogs';
//app huwi bilef kel al appsbibaeda byrbot ben al context wl routing al protected bas akid maby7ki ma3 al backend 
const App: React.FC = () => {//fc hiye function component 
    return (
        <NotificationProvider>
            <LoadingProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/products"
                                element={
                                    <ProtectedRoute>
                                        <Products />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/audit-logs"
                                element={
                                    <ProtectedRoute>
                                        <AuditLogs />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </BrowserRouter>
                    <Toast />
                    <LoadingOverlay />
                </AuthProvider>
            </LoadingProvider>
        </NotificationProvider>
    );
};

export default App;

