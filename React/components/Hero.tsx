import React from 'react';
import classes from "../styles/hero.module.css";

export interface HeroProps {
    title: string,
    subtitle: string,
    buttonText: string,
    buttonLink: string
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, buttonText, buttonLink }) => {
    return (
        <section className={classes.hero}>
            <div className={classes.hero_content}>
                <h1>{title}</h1>
                <p>{subtitle}</p>
                <button>
                    <a href={buttonLink}>{buttonText}</a>
                </button>
            </div>
        </section>
    );
};

export default Hero;