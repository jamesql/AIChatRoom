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
                <h1 className={classes.header}>The AI has Won!</h1>
                <h5 className={classes.subHeader}>We are doomed after all.</h5>
            </main>
            <Footer/>
        </div>
    );
};

export default LoseComponent;