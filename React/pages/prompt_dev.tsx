import Footer from '@/components/Footer';
import NavigationBar from '@/components/NavigationBar';
import React, { useEffect, useRef, useState } from 'react';
import classes from '../styles/promptDev.module.css';

interface Message {
    sender: string; // "player" or "other", neeed help with connecting other people to this page
    text: string;
}

const PromptDev: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: "other", text: "does this work?" }
    ]);
    const [response, setResponse] = useState("");
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const handleResponseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResponse(e.target.value);
    };

    const handleSubmit = () => {
        if (response.trim() === "") return;

        // add the users messages to the list
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "player", text: response }
        ]);

        // test prompts,change this with the other users prompts
        // not sure how to do that
        setTimeout(() => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "other", text: "its working!" }
            ]);
        }, 1000);

        setResponse("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    // scroll to the bottom of the chat box
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className={classes.container}>
            <NavigationBar authButtons={false} />
            <main className={classes.main}>
                <h1 className={classes.title}>Chat</h1>
                <div className={classes.chatContainer} ref={chatContainerRef}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={
                                message.sender === "player"
                                    ? classes.playerMessage
                                    : classes.otherMessage
                            }
                        >
                            {message.text}
                        </div>
                    ))}
                </div>
                <div className={classes.inputBox}>
                    <input
                        type="text"
                        value={response}
                        onChange={handleResponseChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className={classes.input}
                    />
                    <button onClick={handleSubmit} className={classes.submitButton}>
                        Send
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PromptDev;