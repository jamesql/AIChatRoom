import Footer from '@/components/Footer';
import NavigationBar from '@/components/NavigationBar';
import React from 'react';
import classes from '../styles/eogDev.module.css';


// need to have a button to return to the main page directly under the sub header
const LoseComponent: React.FC = () => {
    return (
        <div className={classes.container}>
            <NavigationBar authButtons={false} />
            <main className={classes.main}>
                <h1 className={classes.header}>Humans have won!</h1>
                <h5 className={classes.subHeader}>We're not doomed after all.</h5>
            </main>
            <Footer/>
        </div>
    );
};

export default LoseComponent;