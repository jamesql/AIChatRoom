import NavigationBar from "@/components/NavigationBar";
import classes from "../styles/index.module.css";
import Hero from "@/components/Hero";

export default function index() {
  return (
    <div className={classes.container}>
        <div className={classes.background}>
        <NavigationBar />
        <Hero />
        </div>
    </div>
  );
}