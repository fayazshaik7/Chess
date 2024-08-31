import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over"
export enum GAME_STATE {
    STARTED = "started",
    WAITING = "Waiting",
    NOT_STARTED = "Not started",
    GAME_OVER = "Game over"
}

interface GameState {
    state: GAME_STATE;
    color: string;
    moveCount: number;
}

export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [gameState, setGameState] = useState<GameState>({
        state: GAME_STATE.NOT_STARTED,
        color: "pink",
        moveCount: 0,
    });

    useEffect(() => {
        console.log(gameState);
    }, [gameState])
    
    useEffect(() => {
        if (!socket)
            return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("message: " + event);
            switch (message.type) {
                case INIT_GAME:
                    setChess(new Chess());
                    setBoard(chess.board());
                    setGameState({
                        moveCount: 0,
                        state: GAME_STATE.STARTED,
                        color: message.payload.color,
                    });
                    console.log("Game Initialized.");
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    setGameState((prevGameState) => ({
                        state: GAME_STATE.STARTED,
                        color: prevGameState.color,
                        moveCount: message.moveCount,
                    }));
                    console.log("Move made");
                    break;
                case GAME_OVER:
                    setGameState({
                        ...gameState,
                        state: GAME_STATE.GAME_OVER
                    });
                    console.log("Game Over");
                    break;
            }
        }
    }, [socket])

    if (!socket) return <div>Connecting...</div>

    return <div className="justify-center flex max-w-screen-lg">
        <div className="pt-8 max-w-screen-lg w-full">
            <div className="grid grid-cols-6 gap-4">
                <div className="col-span-4 w-full flex justify-center ">
                    <ChessBoard socket={socket} board={board} rotate={gameState.color === "black"} />   
                </div>
                <div className="col-span-2 bg-slate-900 bg-green-200 w-full flex justify-center">
                    <div className="pt-8">
                        {gameState.state === GAME_STATE.NOT_STARTED && <Button onClick={() => {
                            setGameState({
                                ...gameState,
                                state: GAME_STATE.WAITING
                            })
                            socket.send(JSON.stringify({
                                "type": INIT_GAME
                            }))
                        }}>
                            Play
                        </Button>}
                        {
                            gameState.state === GAME_STATE.WAITING && <h1 className="text-4xl font-bold text-white">Waiting For Opponent...</h1>
                        }
                        {
                            gameState.state === GAME_STATE.STARTED 
                            && ((gameState.moveCount % 2 === 0 
                            && gameState.color === "white") || (gameState.moveCount % 2 === 1 
                                && gameState.color === "black"
                            )
                            ? (<h1 className="text-4xl font-bold text-white">Your Turn</h1>) 
                            : (<h1 className="text-4xl font-bold text-white">Opponent Turn</h1>))
                        }
                    </div>
                    
                </div>
            </div>


        </div>
    </div>
}