import React from "react"
import {Button} from "primereact/button"
import {useRouter} from "next/router"

export default function Home() {
    const router = useRouter()

    const handleDatabaseChoice = async (database) => {
        const results = await fetch("api/getDatabase", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({database: database}),
        })

        if (results.status === 204) {
            await router.push({
                pathname: "/play",
            }, "/play")
        }
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