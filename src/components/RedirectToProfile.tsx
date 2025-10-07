import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToProfile: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar imediatamente para o perfil
    navigate("/dashboard/perfil", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando...</p>
      </div>
    </div>
  );
};

export default RedirectToProfile;