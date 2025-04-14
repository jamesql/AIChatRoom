import Footer from '@/components/Footer';
import NavigationBar from '@/components/NavigationBar';
import React from 'react';
import classes from '../styles/eorDev.module.css';

const eorDev: React.FC = () => {
    return (
        <div className={classes.container}>
            <NavigationBar authButtons={false} />
            <main className={classes.main}>
                <h1 className={classes.header}>The Imposter still remains...</h1>
                <h5 className={classes.subHeader}>Some random text about how bad they are playing</h5>
            </main>
            <Footer/>
        </div>
    );
};

export default eorDev;