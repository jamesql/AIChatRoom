import NavigationBar from '@/components/NavigationBar';
import React from 'react';
import classes from "../styles/dashboard.module.css";
import DashUserCard from '@/components/DashUserCard';
import Matchmaker from '@/components/Matchmaker';
import Footer from '@/components/Footer';

const Dashboard: React.FC = () => {
    return (
        <div className={classes.container}>
            <NavigationBar authButtons={false} />
            <DashUserCard name="John Doe" avatarUrl="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWVweXViZDdra24xdmNubTBxZmNjY2p3bzJucGRxajdoZjRybnB1ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7VzgMsB6FLCilwS30v/giphy.gif" />
            <Matchmaker />
            <Footer />
        </div>
    );
};

export default Dashboard;