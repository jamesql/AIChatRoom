import React, { useState } from 'react';
import classes from '../styles/navbar.module.css';
import Image from 'next/image';

const NavigationBar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbar_header}>
                <Image src={"/botify_logo.png"} alt='Botify' width={150} height={150}></Image>
                <button className={classes.hamburger} onClick={toggleMenu}>
                    ☰
                </button>
            </div>
            <ul className={`${classes.nav_links} ${isMenuOpen ? classes.show : ''}`}>
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href="/game">Games</a>
                </li>
                <li>
                    <a href="/profile">Profile</a>
                </li>
            </ul>
            <div className={`${classes.nav_buttons} ${isMenuOpen ? classes.show : ''}`}>
                <button>Login</button>
                <button>Register</button>
            </div>
        </nav>
    );
};

export default NavigationBar;