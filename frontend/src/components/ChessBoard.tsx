import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";
import pawn from "../assets/p.png";
import Pawn from "../assets/P.copy.png";
import rook from "../assets/r.png";
import Rook from "../assets/R.copy.png";
import night from "../assets/n.png";
import Night from "../assets/N.copy.png";
import bishop from "../assets/b.png";
import Bishop from "../assets/B.copy.png";
import king from "../assets/k.png";
import King from "../assets/K.copy.png";
import queen from "../assets/q.png";
import Queen from "../assets/Q.copy.png";

const getPieceImg = (color: any, piece: any) => {

    switch(piece) {
        case 'p':
            return color === 'w' ? Pawn : pawn;
        case 'r':
            return color === 'w' ? Rook : rook;
        case 'n':
            return color === 'w' ? Night : night;
        case 'b':
            return color === 'w' ? Bishop : bishop;
        case 'k':
            return color === 'w' ? King : king;
        case 'q':
            return color === 'w' ? Queen : queen;
    }
    return pawn;
}

export const ChessBoard = ({board, socket, rotate}: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][],
    socket: WebSocket,
    rotate: boolean
}) => {
    const [from, setFrom] = useState<null | Square>(null);
    console.log(board);

    return <div className={`text-white-200 ${rotate ? 'rotate-180 transition-transform duration-500 ease-in-out' : ''}`}>
        {board.map((row, i) => {
            return <div key={i} className="flex">
                {row.map((square, j) => {
                    const squareRepresentation = String.fromCharCode(97 + j) + "" + (8 - i) as Square;
                    return <div onClick={() => {
                        if (!from) {
                            setFrom(squareRepresentation);
                        } else {
                            console.log({
                                from: from,
                                to: squareRepresentation
                            })
                            console.log(square);
                            socket.send(JSON.stringify({
                                type: MOVE,
                                move: {
                                    from: from,
                                    to: squareRepresentation
                                }
                            }))
                            setFrom(null);
                        }
                    }} key={j} className={`w-16 h-16 ${(i + j) % 2 == 0 ? 'bg-green-500' : 'bg-slate-500'} ${rotate ? 'rotate-180' : ''}`}>
                        <div className="w-full justify-center flex h-full">
                            <div className="h-full justify-center flex flex-col">
                                {square ? <div>
                                    <img className="w-4" src={getPieceImg(square?.color, square?.type)} />
                                </div> : ""}
                            </div>
                        </div>
                    </div>
                })}
            </div>
        })}
    </div>
}