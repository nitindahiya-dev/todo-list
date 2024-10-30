// src/components/Todo.tsx
"use client";
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const Todo = () => {
    const [value, setValue] = useState("");
    const { connected } = useWallet();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (value.trim() === "") return;
        console.log(value);
        setValue("");
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
                        <li className="py-4">
                            <div className="flex items-center">
                                <input id="todo1" name="todo1" type="checkbox"
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
                                <label className="ml-3 block text-gray-900">
                                    <span className="text-lg mr-1 font-medium">Finish project proposal</span>
                                </label>
                            </div>
                        </li>
                    </ul>
                </div>
            ) : (
                <p className="text-center">Please connect your wallet</p>
            )}
        </div>
    );
};

export default Todo;
