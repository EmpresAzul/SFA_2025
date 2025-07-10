import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Perfil</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <p className="text-gray-600">{user?.email}</p>
        </div>
        
        <Button onClick={handleSignOut} disabled={loading}>
          {loading ? "Saindo..." : "Sair"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;