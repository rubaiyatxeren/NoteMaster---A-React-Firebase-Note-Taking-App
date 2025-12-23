import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Auth from "./components/Auth";
import Navbar from "./components/Navbar";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import { auth } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubcribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Toaster position="top-right" />
        <main className="container mx-auto px-4 py-8">
          {!user ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Welcome to NoteMaster
                </h1>
                <p className="text-gray-600 text-lg">
                  A simple note-taking app to learn React, Tailwind CSS, and
                  Firebase
                </p>
              </div>
              <Auth />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Your Notes
                </h1>
                <p className="text-gray-600">
                  Create, view, and manage your personal notes
                </p>
              </div>
              <NoteForm />
              <NoteList />
            </div>
          )}
        </main>
        <footer className="bg-white border-t border-gray-200 p-6">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>Note App Project • React + Tailwind CSS + Firebase</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
