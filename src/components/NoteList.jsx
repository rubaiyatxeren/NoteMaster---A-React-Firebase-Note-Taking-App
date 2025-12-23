import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Clock, Edit2, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { auth, db } from "../firebase";

export default function NoteList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "notes"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesData);
        setLoading(false);
      },
      (error) => {
        toast.error("Error loading notes: " + error.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  async function handleDelete(noteId) {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteDoc(doc(db, "notes", noteId));
        toast.success("Note deleted successfully!");
      } catch (error) {
        toast.error("Error deleting note: " + error.message);
      }
    }
  }

  function handleEditClick(note) {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  function handleCancelEdit() {
    setEditingNoteId(null);
    setEditTitle("");
    setEditContent("");
  }

  async function handleSaveEdit(noteId) {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Title and content cannot be empty");
      return;
    }

    setEditLoading(true);
    try {
      await updateDoc(doc(db, "notes", noteId), {
        title: editTitle,
        content: editContent,
        updatedAt: new Date(),
      });
      toast.success("Note updated successfully!");
      setEditingNoteId(null);
      setEditTitle("");
      setEditContent("");
    } catch (error) {
      toast.error("Error updating note: " + error.message);
    } finally {
      setEditLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          Your Notes ({notes.length})
        </h2>
      </div>
      {notes.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>No notes yet. Create your first note above!</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              {editingNoteId === note.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                    placeholder="Note Title"
                    disabled={editLoading}
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="4"
                    placeholder="Note Content"
                    disabled={editLoading}
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      Last edited: {new Date().toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2"
                        disabled={editLoading}
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={() => handleSaveEdit(note.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center space-x-2"
                        disabled={editLoading}
                      >
                        <Save className="w-4 h-4" />
                        <span>{editLoading ? "Saving..." : "Save"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {note.title}
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line mb-3 break-words">
                      {note.content}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1 shrink-0" />
                      <span>
                        Created: {note.createdAt?.toDate().toLocaleDateString()}
                        {note.updatedAt &&
                          note.updatedAt.toDate().getTime() !==
                            note.createdAt?.toDate().getTime() && (
                            <span className="ml-2">
                              • Updated:{" "}
                              {note.updatedAt?.toDate().toLocaleDateString()}
                            </span>
                          )}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-600 p-2"
                      onClick={() => handleEditClick(note)}
                      title="Edit note"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-600 p-2"
                      onClick={() => handleDelete(note.id)}
                      title="Delete note"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
