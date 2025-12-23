import { LogOut, Notebook } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { auth } from "../firebase";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Notebook className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">NoteMaster</h1>
              <p className="text-sm text-gray-600">
                Your personal note-taking app
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium text-gray-800">
                    {currentUser.email}
                  </p>
                  <p className="text-sm text-gray-600">Beginner Level</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors flex items-center space-x-2"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <p className="text-gray-600">Please login to continue</p>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
