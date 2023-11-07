import React, {useState} from "react"
import {Button} from "primereact/button"
import {Dialog} from "primereact/dialog"
import {InputText} from "primereact/inputtext"
import {InputNumber} from "primereact/inputnumber";

export default function Home(props) {
    const [username, setUsername] = useState("")
    const [roundsToReach, setRoundsToReach] = useState(0)
    const [accessCode, setAccessCode] = useState("")
    const [isGameCreated, setIsGameCreated] = useState({state: false, owner: false})
    const [openModal, setOpenModal] = useState(false)

    const handleDisplayModal = async () => {
        if (username !== "") {
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
            // TODO: handle empty username
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
            setIsGameCreated({state: true, owner: false})
        }
    }

    return (
        <div className="container">
            <section id="deck-container">
                <div className="game-launcher">
                    <div>
                        <label htmlFor="username-field">Choisis un pseudo :</label>
                        <InputText id="username-field" aria-describedby="username-help" placeholder="Pseudo stylé" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <Button label="Jouer !" onClick={handleDisplayModal}/>
                </div>
            </section>

            <section id="board-container">
                <div id="board">
                    {[...Array(6)].map((_, i) => (
                        <div id={`row-${i}`} key={`row-${i}`} className="row">
                            {[...Array(6)].map((_, j) => (
                                <div id={`cell-${j}`} key={`cell-${j}`} className="cell"></div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            <Dialog header="Jouer au Punto" visible={openModal} dismissableMask={true} style={{ width: '60vw' }} onHide={() => setOpenModal(false)} draggable={false}>
                <div className="modal-container">
                    <div className="game-creation">
                        <h3>Créer une partie</h3>
                        <label htmlFor="rounds-to-reach">Nombre de manche à atteindre pour remporter la partie :</label>
                        <InputNumber id="rounds-to-reach" value={roundsToReach} onValueChange={(e) => setRoundsToReach(e.value)} showButtons buttonLayout="horizontal" step={1}
                                     decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" min={1} disabled={isGameCreated.state}/>
                        {!isGameCreated.state && <Button className="mt-5 mb-3" label="Créer une partie" onClick={() => handleGameLaunch("created")}/>}
                    </div>
                    <div className="game-join">
                        <h3>Rejoindre une partie</h3>

                        {isGameCreated.state ?
                            <>
                                <span>Partage ce code avec tes amis pour jouer avec eux :</span>
                                <span className="access-code">{accessCode}</span>
                                {isGameCreated.owner && <Button className="mt-5 mb-3" label="Lancer la partie" onClick={() => handleGameLaunch("joined")}/>}
                            </>
                        :
                            <>
                                <label htmlFor="access-code-feld">Entre le code que tu as reçu pour jouer avec tes amis :</label>
                                <InputText id="access-code-field" aria-describedby="username-help" onChange={(e) => setAccessCode(e.target.value.toUpperCase())} />
                                <Button className="mt-5 mb-3" label="Rejoindre une partie" onClick={() => handleGameLaunch("joined")}/>
                            </>
                        }
                    </div>
                </div>
            </Dialog>
        </div>
    );
}