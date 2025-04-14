import React, { useState } from "react";
import ApiClient from "@/util/api";
import NavigationBar from "@/components/NavigationBar";
import classes from "../styles/register.module.css";
import Footer from "@/components/Footer";

export default function register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (username && password) {
            ApiClient.getInstance()
            .register(username, password, email, avatar)
            .then((res) => {
                if (res.status === 201) {
                    const { accessToken, refreshToken } = res.data;
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                    window.location.href = "/application";
                } else {
                    console.error("Registration failed");
                }
            }).catch((err) => {
                console.error(err);
            });
        }

    }
    return (
        <div className={"container"}>
            <NavigationBar authButtons={false} />
            <div className={classes.form_container}>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={classes.input_group}>
                        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                        <input type="avatar" placeholder="Avatar URL" onChange={(e) => setAvatar(e.target.value)} required />
                        <button type="submit">Register</button>
                        </div>
                    </form>
                </div>
            <Footer />
        </div>
    )
};
