import { useNavigate } from "react-router-dom";
import LandingImage from "../assets/chess.jpeg";
import { Button } from "../components/Button";

export const Landing = () => {
    const navigate = useNavigate();
    return <div>
        <div className="pt-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex justify-center">
                    <img src={LandingImage} className="max-w-96" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-white">Play chess online on the #3 Site!</h1>
                    <div className="mt-4">
                        <Button onClick={() => {
                            navigate("/game");
                        }} >
                            Play 
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}