import React from "react"
import {Button} from "primereact/button"
import {useRouter} from "next/router"

export default function Home() {
    const router = useRouter()

    const handleDatabaseChoice = async (database) => {
        document.cookie = `database=${database}`
        await router.push("/play")
    }

    return (<div className="database-selector-container">
        <h1>Choisir une base de données</h1>

        <div className="buttons-container">
            <Button label="MySQL" onClick={() => handleDatabaseChoice("mysql")} />
            <Button label="MongoDB" onClick={() => handleDatabaseChoice("mongodb")} />
            <Button label="SQLite" onClick={() => handleDatabaseChoice("sqlite")} />
        </div>
    </div>)
}