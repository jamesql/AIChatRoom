import React from 'react';
import classes from '../styles/footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={classes.footer}>
            <p>&copy; {new Date().getFullYear()} <a href="https://github.com/jamesql/Botify">Botify</a>. All rights reserved.</p>
        </footer>
    );
};

export default Footer;