import NavigationBar from '@/components/NavigationBar';
import React, {useContext, useEffect, useState} from 'react';
import classes from "../styles/dashboard.module.css";
import DashUserCard from '@/components/DashUserCard';
import Matchmaker from '@/components/Matchmaker';
import Footer from '@/components/Footer';
import { WebSocketContext } from '@/components/WebSocket';
import { WebSocketClient } from '@/util/ws';
import User from '../../TYPES/userTypes';
import Cookies from 'js-cookie';
import ApiClient from '@/util/api';

const Dashboard: React.FC = () => {
    const wsClient = useContext(WebSocketContext);

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // get token
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");
        if (!accessToken || !refreshToken) {
            // redirect to login page
            window.location.href = "/login";
        } else {
            // get user data

            ApiClient.getInstance().getUserData(accessToken)
            .then((res) => {
                if (res.status === 200) {
                    setUser(res.data.user);
                } else {
                    console.error("Failed to get user data");
                }
            }
            ).catch((err) => {
                console.error(err);
            });



        }



    }, []);

    if (!wsClient) {
        console.error("WebSocketClient is not available");
        return null;
    }

    if (!user) {
        return (
            <>
            <h1>Loading...</h1>
            </>
        )
    }


    return (
        <div className={classes.container}>
            <NavigationBar authButtons={false} />
            <DashUserCard name={user.name} avatarUrl={user.avatar} />
            <Matchmaker />
            <Footer />
        </div>
    );
};

export default Dashboard;