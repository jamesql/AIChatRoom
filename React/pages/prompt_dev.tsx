import React, { useState } from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import classes from '../styles/promptDev.module.css';

const PromptDev: React.FC = () => {
    const [response, setResponse] = useState("");

    const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setResponse(e.target.value);
    };

    const handleSubmit = () => {
        if (response.trim() === "") return;
        console.log("User response:", response); //check response in the console
        setResponse("");
    };

    return (
        <div className={classes.container}>
            <NavigationBar authButtons={false} />
            <main className={classes.main}>
                <div className={classes.header}>
                    <h1 className={classes.title}>Answer this Prompt</h1>
                </div>
                <div className={classes.prompt}>
                    <h5 className={classes.subtitle}>Answer the prompts and vote for the AI's response!</h5>    
                </div>
                <textarea
                    className={classes.responseInput}
                    value={response}
                    onChange={handleResponseChange}
                    placeholder="Answer the prompt...."
                />
                {/* might add functionality to press enter to submit the response */}
                <button
                    onClick={handleSubmit}
                    className={classes.submitButton}
                >
                    Submit
                </button>
            </main>
            <Footer/>
        </div>
    );
};

export default PromptDev;