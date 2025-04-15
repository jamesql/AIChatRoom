import React, { useState } from 'react';
import classes from '../styles/navbar.module.css';
import Image from 'next/image';

export interface NavigationBarProps {
    authButtons: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ authButtons }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <nav className={`${classes.navbar} ${authButtons ? '' : classes.navbar_no_buttons}`}>
            <div className={classes.navbar_header}>
                <Image src={"/botify_logo.png"} alt='Botify' width={150} height={150}></Image>
                <button className={classes.hamburger} onClick={toggleMenu}>
                    ☰
                </button>

                {isMenuOpen && (
                    <div className={classes.overlay_menu}>
                        <ul className={classes.overlay_links}>
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>
                                <a href="/application">Games</a>
                            </li>
                            <li>
                                <a href="/application">Profile</a>
                            </li>
                            {authButtons && (
                                <>
                                    <li>
                                        <a onClick={() => { window.location.href = "/login" }}>Login</a>
                                    </li>
                                    <li>
                                        <a onClick={() => { window.location.href = "/register" }}>Register</a>
                                    </li>
                                </>
                            )}
                        </ul>
                        <button className={classes.close_button} onClick={toggleMenu}>
                            ✖
                        </button>
                    </div>
                )}
            </div>
            <ul className={`${classes.nav_links} ${isMenuOpen ? classes.show : ''}`}>
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href="/application">Games</a>
                </li>
                <li>
                    <a href="/application">Profile</a>
                </li>
            </ul>
            {(authButtons===true) && (<div className={`${classes.nav_buttons} ${isMenuOpen ? classes.show : ''}`}>
                <button onClick={() => {window.location.href="/login"}}>Login</button>
                <button onClick={() => {window.location.href="/register"}}>Register</button>
            </div>)}
        </nav>
    );
};

export default NavigationBar;