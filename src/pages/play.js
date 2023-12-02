import React, {useEffect, useRef, useState} from "react"
import {Button} from "primereact/button"
import {Dialog} from "primereact/dialog"
import {InputText} from "primereact/inputtext"
import {InputNumber} from "primereact/inputnumber"
import {Toast} from "primereact/toast"
import {Card} from "primereact/card"
import {io} from "socket.io-client"
import {Chip} from "primereact/chip"
import PuntoCard from "@/components/PuntoCard"
import {createRoot} from "react-dom/client"
import {useRouter} from "next/router"

const socket = io.connect("http://localhost:4000")

export default function Home() {
    const [accessCode, setAccessCode] = useState("")
    const [decks, setDecks] = useState({})
    const [gameId, setGameId] = useState(-1)
    const [isGameCreated, setIsGameCreated] = useState(false)
    const [modalEndRound, setModalEndRound] = useState({open: false, type: "", winner: ""})
    const [openModal, setOpenModal] = useState(false)
    const [playerId, setPlayerId] = useState(-1)
    const [players, setPlayers] = useState([])
    const [playerTurn, setPlayerTurn] = useState(-1)
    const [roundId, setRoundId] = useState(-1)
    const [roundsToReach, setRoundsToReach] = useState(2)
    const [turnIndex, setTurnIndex] = useState(0)
    const [username, setUsername] = useState("")
    const router = useRouter()
    const toast = useRef(null)

    useEffect(() => {
        socket.on("playerHasJoined", (players) => {
            setPlayers(players)
        })

        socket.on("playerHasPlayed", (playerId) => {
            setPlayerTurn(playerId)
        })

        socket.on("roundEnded", (data) => {
            setModalEndRound({open: true, type: data.type, winner: data.winner})
        })

        socket.on("startNewRound", (data) => {
            document.querySelectorAll(".cell > .card").forEach(card => {card.remove()})
            setRoundId(data.roundId)
            setTurnIndex(0)
            setDecks(data.decks)
            setPlayerTurn(data.players[0].id)
            setOpenModal(false)
            setModalEndRound({open: false, type: "", winner: ""})
        })

        socket.on("updateBoard", (card) => {
            createRoot(document.querySelector(`#row-${card.x} > #cell-${card.y}`)).render(<PuntoCard card={card.card}/>)
        })
    }, [])

    const handleDisplayModal = async () => {
        if (username.trim() !== "") {
            const results = await (await fetch("/api/createPlayer", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username: username}),
            }))

            if (results.status === 200) {
                results.json()
                    .then(content => setPlayerId(content.id))
                    .then(() => setOpenModal(true))
            }
        } else {
            toast.current.show({
                severity: "error", summary: "Eh, toi là !", detail: "Tu dois entrer un pseudo pour jouer."
            })
        }
    }

    const handleGameJoin = async (action) => {
        if (action === "create") {
            const results = await (await fetch("/api/createGame", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({playerId: playerId, roundsToReach: roundsToReach}),
            }))

            if (results.status === 200) {
                results.json()
                    .then(content => {
                        setAccessCode(content.accessCode)
                        setGameId(content.gameId)
                    })
                    .then(() => setPlayers([...players, username]))
                    .then(() => setIsGameCreated(true))
            }
        } else {
            const results = await (await fetch("/api/getGame", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({accessCode: accessCode, playerId: playerId}),
            }))

            if (results.status === 204) {
                setIsGameCreated(true)
            } else if (results.status === 403) {
                toast.current.show({
                    severity: "error",
                    summary: "Trop tard !",
                    detail: "Cette partie est complète ou a déjà commencé, désolé."
                })
            } else if (results.status === 404) {
                toast.current.show({
                    severity: "error",
                    summary: "Il y a comme qui dirait un problème...",
                    detail: "Aucune partie n'a été trouvée pour ce code"
                })
            }
        }
    }

    const handleNewRound = async () => {
        const results = await (await fetch("/api/startRound", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({gameId: gameId, players: players}),
        }))

        if (results.status === 200) {
            await results.json()
                .then(content => socket.emit("startNewRound", content))
        }
    }

    const addCard = async (x, y) => {
        if (playerTurn === playerId && decks[playerId].length > 0) {
            const results = await (await fetch("/api/createCard", {
                method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
                    roundId: roundId,
                    positionX: x,
                    positionY: y,
                    color: decks[playerId][turnIndex].color,
                    value: decks[playerId][turnIndex].value,
                    playerId: playerId
                })
            }))

            if (results.status === 200 || results.status === 204) {
                createRoot(document.querySelector(`#row-${x} > #cell-${y}`)).render(<PuntoCard
                    card={decks[playerId][turnIndex]}/>)

                setTurnIndex(turnIndex + 1)

                socket.emit("playerHasPlayed", {currentPlayer: playerId, allPlayers: players})
                socket.emit("updateBoard", {card: decks[playerId][turnIndex], x: x, y: y})

                decks[playerId].splice(turnIndex, 1)

                if (results.status === 200) {
                    results.json()
                        .then(content => {
                            socket.emit("roundEnded", content)
                        })
                }
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "C'est pas comme ça que ça marche !",
                    detail: "Tu ne peux pas poser de carte ici."
                })
            }
        } else {
            toast.current.show({
                severity: "error", summary: "Attends un peu !", detail: "Ce n'est pas encore à toi de jouer."
            })
        }
    }

    return (<div className="container">
        <section id="deck-container">
            {roundId !== -1 ?
                <PuntoCard card={decks[playerId][turnIndex]}/>
                :
                <Card className="game-launcher-card">
                    <div className="game-launcher">
                        <h1>Punto</h1>

                        <div>
                            <label htmlFor="username-field">Choisis un pseudo :</label>
                            <InputText id="username-field" aria-describedby="username-help" maxLength={32}
                                       placeholder="Pseudo stylé" onChange={(e) => setUsername(e.target.value)}
                                       onKeyDown={(e) => {
                                           if (e.key === "Enter") return handleDisplayModal()
                                       }}/>
                        </div>
                        <Button label="Jouer !" onClick={handleDisplayModal}/>
                    </div>
                </Card>
            }
        </section>

        <section id="board-container">
            <div id="board">
                {[...Array(6)].map((_, i) => (<div id={`row-${i}`} key={`row-${i}`} className="row">
                    {[...Array(6)].map((_, j) => (<div id={`cell-${j}`} key={`cell-${j}`} className="cell"
                                                       onClick={() => roundId !== -1 && addCard(i, j)}></div>))}
                </div>))}
            </div>
        </section>

        <Dialog header="Jouer au Punto" visible={openModal} closable={false} style={{width: "60vw"}}
                onHide={() => setOpenModal(false)} draggable={false}>
            <div className="modal-container">
                <div className="game-creation">
                    <h3>Créer une partie</h3>
                    <label htmlFor="rounds-to-reach">Nombre de manche à atteindre pour remporter la partie :</label>
                    <InputNumber id="rounds-to-reach" value={roundsToReach}
                                 onValueChange={(e) => setRoundsToReach(e.value)} showButtons
                                 buttonLayout="horizontal" step={1} decrementButtonClassName="p-button-danger"
                                 incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus"
                                 decrementButtonIcon="pi pi-minus" min={1} disabled={isGameCreated}/>
                    {!isGameCreated &&
                        <Button className="mt-5 mb-3" label="Créer une partie" disabled={accessCode.length === 4}
                                onClick={() => handleGameJoin("create")}/>}
                </div>
                <div className="game-join">
                    <h3>Rejoindre une partie</h3>

                    {isGameCreated ? <>
                        <span>Partage ce code avec tes amis pour jouer avec eux :</span>
                        <span className="access-code">{accessCode}</span>
                        <div className="players">{players.map((player, index) => {
                            return <Chip key={index} label={player.username}/>
                        })}</div>
                        {gameId !== -1 && <Button className="mt-5 mb-3" label="Lancer la partie"
                                                        disabled={players.length <= 1 || players.length > 4}
                                                        onClick={handleNewRound}/>}
                    </> : <>
                        <label htmlFor="access-code-feld">Entre le code que tu as reçu pour jouer avec tes amis
                            :</label>
                        <InputText id="access-code-field" aria-describedby="username-help" maxLength={4}
                                   value={accessCode}
                                   onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                                   onKeyDown={(e) => {
                                       if (e.key === "Enter" && accessCode.length === 4) return handleGameJoin("join")
                                   }}/>
                        <Button className="mt-5 mb-3" label="Rejoindre une partie"
                                disabled={accessCode.length !== 4} onClick={() => handleGameJoin("join")}/>
                    </>}
                </div>
            </div>
        </Dialog>

        <Dialog header={modalEndRound.type === "round" ? "Manche terminée" : "Partie terminée"}
                visible={modalEndRound.open} closable={false} style={{width: "30vw"}}
                onHide={() => setModalEndRound({open: false, type: "", winner: ""})} draggable={false}>
            {modalEndRound.type === "round" ? <div className="align-items-center flex flex-column gap-5 pt-2">
                <span>{players.find(player => player.id === modalEndRound.winner)?.username} a remporté la manche !</span>

                {gameId !== -1 ? <Button label="Commencer la manche suivante" onClick={handleNewRound}/> :
                    <small>En attente de l'hôte pour continuer la partie...</small>}
            </div> : <div className="align-items-center flex flex-column gap-5 pt-2">
                <span>{players.find(player => player.id === modalEndRound.winner)?.username} a remporté la partie !</span>

                <Button label="Retourner à l'accueil" onClick={async () => router.reload()}/>
            </div>}
        </Dialog>

        <Toast ref={toast} position="bottom-left"/>
    </div>)
}