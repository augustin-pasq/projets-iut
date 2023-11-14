import React, {useEffect, useRef, useState} from "react"
import {Button} from "primereact/button"
import {Dialog} from "primereact/dialog"
import {InputText} from "primereact/inputtext"
import {InputNumber} from "primereact/inputnumber"
import {Toast} from "primereact/toast"
import {Card} from "primereact/card"
import {io} from "socket.io-client"
import {Chip} from "primereact/chip"
import arrayShuffle from "array-shuffle";

const socket = io.connect("http://192.168.1.12:4000")
const colors = arrayShuffle(["#ED1D23", "#00B9F1", "#F9AE19", "#70BE44"])

export default function Home() {
    const [username, setUsername] = useState("")
    const [roundsToReach, setRoundsToReach] = useState(2)
    const [accessCode, setAccessCode] = useState("")
    const [isGameCreated, setIsGameCreated] = useState({state: false, owner: false})
    const [isGameStarted, setIsGameStarted] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [players, setPlayers] = useState([])
    const [decks, setDecks] = useState([])
    const toast = useRef(null)

    useEffect(() => {
        socket.on("playerHasJoined", (players) => {
            setPlayers(players)
        })

        socket.on("gameHasStarted", (playersNumber) => {
            let p1Colors, p2Colors, p3Colors, p4Colors
            let p1Cards = []
            let p2Cards = []
            let p3Cards = []
            let p4Cards = []

            for (let colorIndex in colors) {
                for (let i = 1; i <= 2; i++) {
                    for (let value = 1; value <= 9; value++) {
                        let color = colors[colorIndex]
                        let card = {color: color, value: value, iteration: i}

                        switch(playersNumber) {
                            case 2:
                                p1Colors = [colors[0], colors[1]]
                                p2Colors = [colors[2], colors[3]]

                                if(p1Colors.includes(color)) p1Cards.push(card)
                                else if(p2Colors.includes(color)) p2Cards.push(card)

                                setDecks([arrayShuffle(p1Cards), arrayShuffle(p2Cards)])
                                break
                            case 3:
                            case 4:
                                p1Colors = colors[0]
                                p2Colors = colors[1]
                                p3Colors = colors[2]
                                p4Colors = colors[3]

                                switch (color) {
                                    case p1Colors:
                                        p1Cards.push(card)
                                        break
                                    case p2Colors:
                                        p2Cards.push(card)
                                        break
                                    case p3Colors:
                                        p3Cards.push(card)
                                        break
                                    case p4Colors:
                                        if(playersNumber === 3) {
                                            if([1, 4, 7].includes(value)) p1Cards.push(card)
                                            if([2, 5, 8].includes(value)) p2Cards.push(card)
                                            if([3, 6, 9].includes(value)) p3Cards.push(card)

                                            setDecks([arrayShuffle(p1Cards), arrayShuffle(p2Cards), arrayShuffle(p3Cards)])
                                        } else if (playersNumber === 4) {
                                            p4Cards.push(card)

                                            setDecks([arrayShuffle(p1Cards), arrayShuffle(p2Cards), arrayShuffle(p3Cards), arrayShuffle(p4Cards)])
                                        }

                                        break
                                }
                                break
                        }
                    }
                }
            }

            setOpenModal(false)
            setIsGameStarted(true)
        })

    }, [])

    const handleDisplayModal = async () => {
        if (username.trim() !== "") {
            const results = await (await fetch("/api/createUser", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username: username}),
            }))

            if (results.status === 200) {
                results.json()
                    .then(content => sessionStorage.setItem("player_id", content.id))
                    .then(() => setOpenModal(true))
            }
        } else {
            toast.current.show({
                severity: "error", summary: "Eh, toi là !", detail: "Tu dois entrer un pseudo pour jouer."
            })
        }
    }

    const handleGameLaunch = async (action) => {
        if (action === "created") {
            const results = await (await fetch("/api/createGame", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({playerId: sessionStorage.getItem("player_id"), roundsToReach: roundsToReach}),
            }))

            if (results.status === 200) {
                results.json()
                    .then(content => setAccessCode(content.accessCode))
                    .then(() => setPlayers([...players, username]))
                    .then(() => setIsGameCreated({state: true, owner: true}))
            }
        } else {
            const results = await (await fetch("/api/getGame", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({accessCode: accessCode, playerId: sessionStorage.getItem("player_id")}),
            }))

            if (results.status === 204) setIsGameCreated({state: true, owner: false})
            else if(results.status === 403) toast.current.show({severity: "error", summary: "Trop tard !", detail: "Cette partie est complète, désolé."})
            else if(results.status === 404) toast.current.show({severity: "error", summary: "Il y a comme qui dirait un problème...", detail: "Aucune partie n'a été trouvée pour ce code."})
        }
    }

    const addCard = async (x, y) => {
        let htmlCard = document.createElement("div");
        htmlCard.classList.add("card");

        const results = await (await fetch("/api/createCard", {
            method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({
                accessCode: accessCode,
                positionX: x,
                positionY: y,
                color: "#ED1D23",
                value: 1,
                playerId: sessionStorage.getItem("player_id")
            }),
        }))

        if (results.status === 204) {
            document.querySelector(`#row-${x} > #cell-${y}`).appendChild(htmlCard)
        } else {
            toast.current.show({
                severity: "error",
                summary: "C'est pas comme ça que ça marche !",
                detail: "Tu ne peux pas poser de cartes ici."
            })
        }

        // TODO : generate new card
    }

    console.log(decks)
    return (<div className="container">
        <section id="deck-container">
            {isGameStarted ? <>
                <div className="card card-reversed">

                </div>
            </> : <Card className="game-launcher-card">
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
            </Card>}

        </section>

        <section id="board-container">
            <div id="board">
                {[...Array(6)].map((_, i) => (<div id={`row-${i}`} key={`row-${i}`} className="row">
                    {[...Array(6)].map((_, j) => (<div id={`cell-${j}`} key={`cell-${j}`} className="cell"
                                                       onClick={() => isGameStarted && addCard(i, j)}></div>))}
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
                                 decrementButtonIcon="pi pi-minus" min={1} disabled={isGameCreated.state}/>
                    {!isGameCreated.state &&
                        <Button className="mt-5 mb-3" label="Créer une partie" disabled={accessCode.length === 4}
                                onClick={() => handleGameLaunch("created")}/>}
                </div>
                <div className="game-join">
                    <h3>Rejoindre une partie</h3>

                    {isGameCreated.state ? <>
                        <span>Partage ce code avec tes amis pour jouer avec eux :</span>
                        <span className="access-code">{accessCode}</span>
                        <div className="players">{players.map((player, index) => {
                            return <Chip key={index} label={player}/>
                        })}</div>
                        {isGameCreated.owner && <Button className="mt-5 mb-3" label="Lancer la partie"
                                                        disabled={players.length <= 1 || players.length > 4}
                                                        onClick={() => socket.emit("gameHasStarted", players.length)}/>}
                    </> : <>
                        <label htmlFor="access-code-feld">Entre le code que tu as reçu pour jouer avec tes amis
                            :</label>
                        <InputText id="access-code-field" aria-describedby="username-help" maxLength={4}
                                   value={accessCode}
                                   onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                                   onKeyDown={(e) => {
                                       if (e.key === "Enter") return handleGameLaunch("joined")
                                   }}/>
                        <Button className="mt-5 mb-3" label="Rejoindre une partie"
                                disabled={accessCode.length !== 4} onClick={() => handleGameLaunch("joined")}/>
                    </>}
                </div>
            </div>
        </Dialog>

        <Toast ref={toast} position="bottom-left"/>
    </div>)
}