import NavigationBar from "@/components/NavigationBar";
import classes from "../styles/index.module.css";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function index() {
  return (
    <div className={classes.container}>
        <div className={classes.background}>
        <NavigationBar />
        <Hero title={"Welcome to Botify!"} 
        subtitle={"Unmask the Bot, Outsmart the AI, and Prove You Can Tell the Difference!"} 
        buttonText={"Get Started"} buttonLink={"/register"} />
        </div>
        <Footer />
    </div>
  );
}