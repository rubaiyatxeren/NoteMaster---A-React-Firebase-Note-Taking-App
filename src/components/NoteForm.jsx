import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Save } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { auth, db } from "../firebase";

export default function NoteForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both fields");
      return;
    }
    setLoading(true);

    try {
      await addDoc(collection(db, "notes"), {
        title,
        content,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success("Note saved successfully!");
      setTitle("");
      setContent("");
    } catch (error) {
      toast.error("Error saving note: " + error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Note</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          {/* Input field for note title */}
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            placeholder="Note Title"
          />
        </div>

        {/* Content textarea container */}
        <div>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setContent(e.target.value)}
            value={content}
            rows="4"
            placeholder="Note Content"
            disabled={loading}
          ></textarea>
        </div>

        {/* Submit button */}
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          type="submit"
          disabled={loading}
        >
          {/* Save icon from lucide-react */}
          <Save className="w-4 h-4" />
          <span>{loading ? "Saving..." : "Save Note"}</span>
        </button>
      </form>
    </div>
  );
}
