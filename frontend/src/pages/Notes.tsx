import { Link } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import { useEffect, useState } from "react";
import { fetchNotes } from "../services/service";
import NoteItem from "../components/list/NoteItem";
import Layout from "../components/layout/Layout";

const FILTERS = {
  TODO: "todo",
  IN_PROGRESS: "inProgress",
  DONE: "done",
};

type TypeNote = {
  id: number;
  body: string;
  priority: number;
  completed: boolean;
};

const Notes = () => {
  const [notes, setNotes] = useState<TypeNote[]>([]);
  const [filter, setFilter] = useState(FILTERS.TODO);

  const getNotes = async () => {
    const notes = await fetchNotes();
    setNotes(notes);
  };

  const handleNoteCheck = (noteId: number, completed: boolean) => {
    setNotes((notes) =>
      notes.map((note) => (note.id === noteId ? { ...note, completed } : note))
    );
    if (navigator.onLine) {
      getNotes();
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const filteredNotes = notes.filter((note) => {
    if (filter === FILTERS.IN_PROGRESS) return !note.completed;
    if (filter === FILTERS.DONE) return note.completed;
    return true;
  });

  return (
    <Layout>
      <header className="flex justify-between items-center w-full gap-2 mb-4">
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter(FILTERS.TODO)}
            className={`flex p-2 px-3 rounded-full cursor-pointer ${filter === FILTERS.TODO ? "text-black bg-green-200" : "text-white bg-gray-800"}`}
          >
            Todo
          </button>
          <button 
            onClick={() => setFilter(FILTERS.IN_PROGRESS)}
            className={`flex p-2 px-3 rounded-full cursor-pointer ${filter === FILTERS.IN_PROGRESS ? "text-black bg-green-200" : "text-white bg-gray-800"}`}
          >
            In Progress
          </button>
          <button 
            onClick={() => setFilter(FILTERS.DONE)}
            className={`flex p-2 px-3 rounded-full cursor-pointer ${filter === FILTERS.DONE ? "text-black bg-green-200" : "text-white bg-gray-800"}`}
          >
            Done
          </button>
        </div>
        <Link
          to='/note/create'
          className="flex h-fit my-auto ml-auto p-2 rounded-full text-black bg-yellow-200"
        >
          <IoAdd className="text-2xl" />
        </Link>
      </header>

      <main className="my-6">
        <ul className="space-y-2">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note, index) => (
              <NoteItem
                id={note.id}
                key={index + "note"}
                body={note.body}
                priority={note.priority}
                completed={note.completed}
                onCheck={(completed) => handleNoteCheck(note.id, completed)}
              />
            ))
          ) : (
            <p>No notes available</p>
          )}
        </ul>
      </main>
    </Layout>
  );
};

export default Notes;
