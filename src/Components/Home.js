import Comments from "./Comments";
import Data from "../json/data.json";
import "../styles/pages/Home.scss";

function Home() {
    let localData;

    !localStorage.length && (localData = localStorage.setItem("data", JSON.stringify(Data))); //if localStorage is empty, fill it with default Data from json
    
    //use latest version of localStorage, not from json (localStorage gets updated while using app)
    localData = localStorage.getItem('data');
    localData = JSON.parse(localData);

    return (
        <div className="home">
            {/* use mutable state, rather than using static Data directly from json */}
            <Comments comments={localData}/>          
        </div>      
    )
}

export default Home


