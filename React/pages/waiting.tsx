import Footer from '@/components/Footer';
import NavigationBar from '@/components/NavigationBar';
import React from 'react';
import classes from '../styles/waiting.module.css';
import { randomWaitingMessage } from '@/util/randomMsgs';

interface WaitingProps {
    header: string,
}


// need to have a button to return to the main page directly under the sub header
const WaitingElement: React.FC<WaitingProps> = ({header}) => {
    const [dots, setDots] = React.useState(".");
    const [message, setMessage] = React.useState(randomWaitingMessage());

    React.useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev.length === 5) return ".";
                return prev + ".";
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMessage(randomWaitingMessage());
        }, 5000);

        return () => clearInterval(interval);
    }, []);



    return (
        <div className={classes.container}>
            <NavigationBar authButtons={false} />
            <main className={classes.main}>
                <h1 className={classes.header}>{header + dots}</h1>
                <h5 className={classes.subHeader}>{message}</h5>
            </main>
            <Footer/>
        </div>
    );
};

export default WaitingElement;