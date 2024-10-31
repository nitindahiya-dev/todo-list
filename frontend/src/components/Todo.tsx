// src/components/Todo.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Todo = () => {
    const [value, setValue] = useState("");
    const { connected } = useWallet();
    const [todos, setTodos] = useState<string[]>([]);

    useEffect(() => {
        // Fetch initial todos from the backend
        if (connected) {
            fetch("http://localhost:8080/todos")
                .then((res) => res.json())
                .then((data) => setTodos(data));
        }
    }, [connected]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (value.trim() === "") {
            toast.error("Fill the input fields");
            return;
        }

        // Add todo to backend
        fetch("http://localhost:8080/add_todo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(value),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');

                }
                return response.text(); // Parse response as text
            })
            .then(() => {
                // Update local state after successful backend update
                setTodos([...todos, value]);
                setValue("");
                toast.success("Task is added");
            })
            .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
                toast.error('There was a problem with the fetch operation');
            });
    }


    return (
        <div className="border-white border-[2px] border-dashed p-5 rounded-xl">
            {connected ? (
                <div className="w-[80vw] md:w-[25vw] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <form className="w-full mx-auto px-4 py-2" onSubmit={handleSubmit}>
                        <div className="flex items-center border-b-2 border-teal-500 py-2">
                            <input
                                onChange={handleInputChange}
                                className="appearance-none bg-transparent font-bold placeholder:font-bold border-none w-full text-gray-700 mr-3 text-xl py-1 px-2 leading-tight focus:outline-none"
                                type="text" placeholder="Add a task"
                                value={value}
                            />
                            <button
                                className="flex-shrink-0 bg-teal-500 font-bold hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                                type="submit">
                                Add
                            </button>
                        </div>
                    </form>
                    <ul className="divide-y divide-gray-200 px-4 max-h-[40vh] overflow-scroll">
                        {todos.map((todo, index) => (
                            <li key={index} className="py-4">

                                <label className="flex items-center gap-3 text-gray-900">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                    />
                                    <span className="text-lg mr-1 font-medium">{todo}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                    <ToastContainer />
                </div>
            ) : (
                <p className="text-center">Please connect your wallet</p>
            )}
        </div>
    );
};

export default Todo;
