import React, {useRef, useState} from "react"
import {Button} from "primereact/button"
import {Dialog} from "primereact/dialog"
import {InputText} from "primereact/inputtext"
import {InputNumber} from "primereact/inputnumber"
import {Toast} from "primereact/toast"
import {Card} from "primereact/card"

export default function Home() {
    const [username, setUsername] = useState("")
    const [roundsToReach, setRoundsToReach] = useState(2)
    const [accessCode, setAccessCode] = useState("")
    const [isGameCreated, setIsGameCreated] = useState({state: false, owner: false})
    const [isGameStarted, setIsGameStarted] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const toast = useRef(null)

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
                severity: "error",
                summary: "Eh, toi là !",
                detail: "Tu dois entrer un pseudo pour jouer."
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
                    .then(() => setIsGameCreated({state: true, owner: true}))
            }
        } else {
            // TODO : handle game join

            setIsGameCreated({state: true, owner: false})
        }
    }

    const startGame = () => {
        setOpenModal(false)
        setIsGameStarted(true)
    }

    const addCard = async (x, y) => {
        let htmlCard = document.createElement("div");
        htmlCard.classList.add("card");

        const results = await (await fetch("/api/createCard", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                accessCode: "FC11", //accessCode
                positionX: x,
                positionY: y,
                color: "#ED1D23",
                value: 1,
                playerId: 22, //sessionStorage.getItem("player_id")
            }),
        }))

        if (results.status === 204) {
            document.querySelector(`#row-${x} > #cell-${y}`).appendChild(htmlCard)
        } else {
        }

        // TODO : generate new card
    }

    return (
        <div className="container">
            <section id="deck-container">
                {isGameStarted ?
                    <>
                        <div className="card card-reversed">

                        </div>
                    </>
                    :
                    <Card className="game-launcher-card">
                        <div className="game-launcher">
                            <h1>Punto</h1>

                            <div>
                                <label htmlFor="username-field">Choisis un pseudo :</label>
                                <InputText id="username-field" aria-describedby="username-help" maxLength={32}
                                           placeholder="Pseudo stylé" onChange={(e) => setUsername(e.target.value)}/>
                            </div>
                            <Button label="Jouer !" onClick={handleDisplayModal}/>
                        </div>
                    </Card>
                }

            </section>

            <section id="board-container">
                <div id="board">
                    {[...Array(6)].map((_, i) => (
                        <div id={`row-${i}`} key={`row-${i}`} className="row">
                            {[...Array(6)].map((_, j) => (
                                <div id={`cell-${j}`} key={`cell-${j}`} className="cell"
                                     onClick={() => isGameStarted && addCard(i, j)}></div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            <Dialog header="Jouer au Punto" visible={openModal} dismissableMask={true} style={{width: '60vw'}}
                    onHide={() => setOpenModal(false)} draggable={false}>
                <div className="modal-container">
                    <div className="game-creation">
                        <h3>Créer une partie</h3>
                        <label htmlFor="rounds-to-reach">Nombre de manche à atteindre pour remporter la partie :</label>
                        <InputNumber id="rounds-to-reach" value={roundsToReach}
                                     onValueChange={(e) => setRoundsToReach(e.value)} showButtons
                                     buttonLayout="horizontal" step={1}
                                     decrementButtonClassName="p-button-danger"
                                     incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus"
                                     decrementButtonIcon="pi pi-minus" min={1} disabled={isGameCreated.state}/>
                        {!isGameCreated.state && <Button className="mt-5 mb-3" label="Créer une partie"
                                                         onClick={() => handleGameLaunch("created")}/>}
                    </div>
                    <div className="game-join">
                        <h3>Rejoindre une partie</h3>

                        {isGameCreated.state ?
                            <>
                                <span>Partage ce code avec tes amis pour jouer avec eux :</span>
                                <span className="access-code">{accessCode}</span>
                                {isGameCreated.owner && <Button className="mt-5 mb-3" label="Lancer la partie"
                                                                onClick={() => startGame()}/>}
                            </>
                            :
                            <>
                                <label htmlFor="access-code-feld">Entre le code que tu as reçu pour jouer avec tes amis
                                    :</label>
                                <InputText id="access-code-field" aria-describedby="username-help"
                                           onChange={(e) => setAccessCode(e.target.value.toUpperCase())}/>
                                <Button className="mt-5 mb-3" label="Rejoindre une partie"
                                        onClick={() => handleGameLaunch("joined")}/>
                            </>
                        }
                    </div>
                </div>
            </Dialog>

            <Toast ref={toast} position="bottom-left"/>
        </div>
    )
}