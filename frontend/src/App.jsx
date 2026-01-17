import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

axios.defaults.baseURL = "https://mern-todo-app-mu-orpin.vercel.app";

import { MdDeleteOutline, MdLightMode, MdDarkMode } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { MdOutlineDone } from "react-icons/md";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [isDark, setIsDark] = useState(true);

  // add a new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post("/api/todos", { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.log(`Error adding todo ${error}`);
    }
  };

  // start editing
  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  // confirm or save editing todo
  const saveEditing = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedText,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingTodo(null);
      setEditedText("");
    } catch (error) {
      console.log(`Error updating todo: ${error}`);
    }
  };

  // delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log(`Error deleting todo: ${error}`);
    }
  };

  // toggle completed todos
  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (error) {
      console.log(`Error toggling todo: ${error}`);
    }
  };
  // fetch todo from the api
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("/api/todos");
        setTodos(response.data);
      } catch (error) {
        console.log(`error fetching todos: ${error}`);
      }
    };
    fetchTodos();
  }, []);

  return (
    <>
      <div
        className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
          isDark ? "bg-gray-950" : "bg-gray-100"
        }`}
      >
        <div
          className={`rounded-2xl shadow-xl w-full max-w-lg p-8 border transition-all duration-300 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center mb-8">
            <h1
              className={`text-4xl font-bold text-center ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Task Manager
            </h1>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                isDark
                  ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {isDark ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
            </button>
          </div>

          <form
            onSubmit={addTodo}
            className={`flex items-center gap-2 shadow-sm border p-2 rounded-xl mb-8 transition-colors duration-300 ${
              isDark
                ? "border-gray-700 bg-gray-900/50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <input
              className={`flex-1 outline-none px-4 py-2 bg-transparent transition-colors duration-300 ${
                isDark
                  ? "text-gray-100 placeholder-gray-500"
                  : "text-gray-700 placeholder-gray-400"
              }`}
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition-all duration-200 shadow-lg shadow-blue-600/20"
            >
              Add
            </button>
          </form>

          <div>
            {todos.length === 0 ? (
              <div className="text-center py-10">
                <h4
                  className={`text-lg transition-colors duration-300 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  No tasks yet. Add one to get started!
                </h4>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo) => (
                  <div
                    key={todo._id}
                    className={`border p-4 rounded-2xl hover:shadow-lg transition-all duration-300 group ${
                      todo.completed
                        ? isDark
                          ? "bg-blue-900/10 border-blue-900/30"
                          : "bg-blue-50 border-blue-100"
                        : isDark
                        ? "bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800"
                        : "bg-white border-gray-100 hover:border-blue-200"
                    }`}
                  >
                    {editingTodo === todo._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          className={`flex-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                            isDark
                              ? "bg-gray-700/50 border-gray-600 text-gray-100"
                              : "bg-gray-50 border-gray-200 text-gray-700"
                          }`}
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                          autoFocus
                        />
                        <button
                          onClick={() => saveEditing(todo._id)}
                          className="p-2 text-green-500 hover:bg-green-500/10 rounded-xl transition-colors cursor-pointer"
                        >
                          <MdOutlineDone size={20} />
                        </button>
                        <button
                          onClick={() => setEditingTodo(null)}
                          className={`p-2 rounded-xl transition-colors cursor-pointer ${
                            isDark
                              ? "text-gray-400 hover:bg-gray-700/50"
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                        >
                          <IoIosClose size={24} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <button
                            onClick={() => toggleTodo(todo._id)}
                            className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                              todo.completed
                                ? "bg-blue-500 border-blue-500 text-white"
                                : isDark
                                ? "border-gray-500 hover:border-blue-500 hover:scale-110"
                                : "border-gray-300 hover:border-blue-500 hover:scale-110"
                            }`}
                          >
                            {todo.completed && <MdOutlineDone size={18} />}
                          </button>
                          <span
                            className={`font-medium transition-all duration-200 truncate ${
                              todo.completed
                                ? "text-gray-500 line-through"
                                : isDark
                                ? "text-gray-200"
                                : "text-gray-700"
                            }`}
                          >
                            {todo.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                          <button
                            onClick={() => startEditing(todo)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors cursor-pointer"
                          >
                            <FaRegEdit size={18} />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo._id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                          >
                            <MdDeleteOutline size={20} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
