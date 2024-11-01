"use client";
import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

const Todo = () => {
    const [value, setValue] = useState("");
    const { connected } = useWallet();
    const [todos, setTodos] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const onOpenModal = (todo: string) => {
        setSelectedTodo(todo);
        setOpen(true);
    };
    const onCloseModal = () => setOpen(false);
    const onEditOpenModal = (todo: string) => {
        setSelectedTodo(todo);
        setEditValue(todo); // Set the current value to edit
        setEditOpen(true);
    };
    const onEditCloseModal = () => setEditOpen(false);

    // Fetch initial todos from the backend if the wallet is connected
    useEffect(() => {
        if (connected) {
            fetch("http://localhost:8080/todos")
                .then((res) => res.json())
                .then((data) => setTodos(data))
                .catch(() => toast.error("Failed to fetch todos."));
        }
    }, [connected]);

    // Handle input field change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    // Handle form submit to add a new todo
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (value.trim() === "") {
            toast.error("Please fill in the input field.");
            return;
        }

        fetch("http://localhost:8080/add_todo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Network response was not ok");
                setTodos((prevTodos) => [...prevTodos, value]);
                setValue("");
                toast.success("Task added successfully.");
            })
            .catch(() => toast.error("Failed to add task."));
    };

    // Handle removing a todo
    const handleRemoveTodo = () => {
        if (!selectedTodo) return;

        fetch("http://localhost:8080/remove_todo", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedTodo),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Network response was not ok");
                setTodos((prevTodos) => prevTodos.filter((todo) => todo !== selectedTodo));
                setSelectedTodo(null);
                toast.success("Task removed successfully.");
            })
            .catch(() => toast.error("Failed to remove task."));

        onCloseModal();
    };

    // Handle editing a todo
    const handleEditTodo = () => {
        if (!selectedTodo || !editValue) return;

        const index = todos.indexOf(selectedTodo);
        fetch("http://localhost:8080/edit_todo", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([index, editValue]),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Network response was not ok");
                setTodos((prevTodos) =>
                    prevTodos.map((todo, i) => (i === index ? editValue : todo))
                );
                toast.success("Task updated successfully.");
            })
            .catch(() => toast.error("Failed to update task."));

        onEditCloseModal(); // Close edit modal after editing
    };

    return (
        <div className="border-white border-[2px] border-dashed p-5 rounded-xl">
            {connected ? (
                <div className="w-[80vw] md:w-[25vw] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <form className="w-full mx-auto px-4 py-2" onSubmit={handleSubmit}>
                        <div className="flex items-center border-b-2 border-teal-500 py-2">
                            <input
                                onChange={handleInputChange}
                                className="appearance-none bg-transparent font-bold placeholder:font-bold border-none w-full text-gray-700 mr-3 text-xl py-1 px-2 leading-tight focus:outline-none"
                                type="text"
                                placeholder="Add a task"
                                value={value}
                            />
                            <button
                                className="flex-shrink-0 bg-teal-500 font-bold hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                                type="submit"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                    <ul className="divide-y divide-gray-200 px-4 max-h-[40vh] overflow-scroll">
                        {todos.map((todo, index) => (
                            <li key={index} className="py-4" onClick={() => onOpenModal(todo)}>
                                <label className="flex items-center gap-3 text-gray-900">
                                    <span className="text-lg mr-1 font-medium">{index + 1}) {todo}</span>
                                </label>
                            </li>
                        ))}
                    </ul>

                    {/* Modal for delete confirmation */}
                    <Modal open={open} onClose={onCloseModal} center>
                        <div className="p-5 bg-black md:w-[30vw] text-center">
                            <h2 className="text-2xl font-semibold mb-4">Do you want to delete this task?</h2>
                            <p>This action cannot be undone.</p>
                            <div className="flex justify-center space-x-4 mt-6">
                                <button
                                    onClick={handleRemoveTodo}
                                    className="border-white hover:bg-black hover:text-white border-[1px] text-bold rounded-full w-40"
                                >
                                    Remove
                                </button>
                                <button
                                    onClick={() => {
                                        onEditOpenModal(selectedTodo!);
                                        onCloseModal(); // Close delete modal and open edit modal
                                    }}
                                    className="border-white hover:bg-black hover:text-white border-[1px] text-bold rounded-full w-40"
                                >
                                    Edit it
                                </button>
                            </div>
                        </div>
                    </Modal>

                    {/* Modal for editing a todo */}
                    <Modal open={editOpen} onClose={onEditCloseModal} center>
                        <div className="p-5 bg-black md:w-[30vw] text-center">
                            <h2 className="text-2xl font-semibold mb-4">Edit your task</h2>
                            <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="border-b-2 border-teal-500 bg-transparent text-white placeholder:text-white w-full text-lg py-1 font-bold placeholder:font-bold border-none mr-3 px-2 leading-tight focus:outline-none"
                                placeholder="Edit your task"
                            />
                            <div className="flex justify-center space-x-4 mt-6">
                                <button
                                    onClick={handleEditTodo}
                                    className="border-white hover:bg-black hover:text-white border-[1px] text-bold rounded-full w-40"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </Modal>

                    <ToastContainer />
                </div>
            ) : (
                <p className="text-center">Please connect your wallet</p>
            )}
        </div>
    );
};

export default Todo;
