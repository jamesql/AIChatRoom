import React from 'react';
import classes from "../styles/hero.module.css";

const Hero: React.FC = () => {
    return (
        <section className={classes.hero}>
            <div className="container">
                <h1 className="hero-title">Welcome to AI Chat Room</h1>
                <p className="hero-description">Connect, chat, and collaborate with ease.</p>
            </div>
        </section>
    );
};

export default Hero;