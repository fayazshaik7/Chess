import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess
    private startTime: Date;
    private moveCount: number;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.moveCount = 0;

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }

    makeMove(socket: WebSocket, move: {
        from: string,
        to: string
    }) {
        // Validation here
        // Is it this users move
        console.log("make move -->");
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            return;
        }

        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            return;
        }

        console.log("making move ");
        // Is the move valid
        try {
            this.board.move(move);
        } catch(e) {
            console.log(e);
            return;
        }

        console.log("is game over");
        // Check is the game is over
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }

        console.log("update boards");
        const mo = this.moveCount + 1;
        // if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move,
                moveCount: mo
            }))
        // } else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move,
                moveCount: mo
            }))
        // }

        this.moveCount += 1
        

        // Send the updated board to both players
    }
}