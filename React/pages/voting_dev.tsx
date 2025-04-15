import Footer from '@/components/Footer';
import NavigationBar from '@/components/NavigationBar';
import React from 'react';
import { Answer } from '../../TYPES/lobbyTypes';
import classes from '../styles/voting.module.css';
import ApiClient from '@/util/api';
import Cookies from 'js-cookie';

interface VotingDevProps {
    answers: Answer[];
    userId: string;
};

const VotingDev: React.FC<VotingDevProps> = ({answers, userId}) => {

    const handleVote = (a: Answer) => {
        console.log("Voted for answer: ", a);
        const accessToken = Cookies.get("accessToken");

        if (!accessToken) {
            console.error("Access token not found");
            return;
        }
        // call api
        ApiClient.getInstance().submitVote(accessToken, a.id, a.lobbyId);
    };

    if (!answers) {
        return (
            <div>
                <NavigationBar authButtons={false} />
                <div className={classes.container}>
                    <h1>Loading...</h1>
                </div>
                <Footer />
            </div>
        );
    }
    answers = answers.filter((a) => a.user.id !== userId);
    return (
        <div>
            <NavigationBar authButtons={false} />

            <div className={classes.container}>
                <h1>Time to Vote!</h1>
                <div className={classes.answers_container}>
                    {answers.map((answer) => (
                        <div key={answer.id} className={classes.answer_card} onClick={() => handleVote(answer)}>
                            <p>
                                {answer.answer}
                            </p>
                        </div>
                    ))}
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default VotingDev;