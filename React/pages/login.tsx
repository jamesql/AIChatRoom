import React, { useState } from "react";
import NavigationBar from "@/components/NavigationBar";
import classes from "../styles/login.module.css";
import Footer from "@/components/Footer";
import ApiClient from "@/util/api";
import Cookies from "js-cookie";

export default function login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (username && password) {
            ApiClient.getInstance()
            .login(username, password)
            .then((res) => {
                if (res.status === 200) {
                    const { accessToken, refreshToken } = res.data;
                    Cookies.set("accessToken", accessToken, { expires: 1 });
                    Cookies.set("refreshToken", refreshToken, { expires: 7 });
                    window.location.href = "/application";
                } else {
                    console.error("Login failed");
                }
            }).catch((err) => {
                console.error(err);
            });
        }

    }

    return (
        <div className={classes.container}>
            <NavigationBar authButtons={false} />
                <div className={classes.form_container}>
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={classes.input_group}>
                        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                        <button type="submit">Login</button>
                        </div>
                    </form>
                </div>
            <Footer />
        </div>
    )
};
