import React, {useEffect, useRef, useState} from "react"
import {Button} from "primereact/button"
import {Dialog} from "primereact/dialog"
import {MultiSelect} from "primereact/multiselect"
import {FileUpload} from "primereact/fileupload"
import {ConfirmDialog} from "primereact/confirmdialog"
import {Toast} from "primereact/toast"
import {Dropdown} from "primereact/dropdown";

export default function Admin() {
    const [loading, setLoading] = useState(false);
    const [exportModal, setExportModal] = useState(false)
    const [importModal, setImportModal] = useState(false)
    const [clearModal, setClearModal] = useState(false)
    const [selectedTables, setSelectedTables] = useState([])
    const [uploadedFiles, setUploadedFiles] = useState(null)
    const tables = ["Joueurs", "Parties", "Manches", "Cartes", "Séries"]
    const toast = useRef(null);

    useEffect(() => {
        if(!importModal || !exportModal) {
            setSelectedTables( [])
        }
    }, [importModal, exportModal])

    const handleExport = async () => {
        setLoading(true)
        const results = await (await fetch("/api/exportData", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({tables: selectedTables}),
        }))

        if(results.status === 200) {
            const content = await results.json()
            const link = document.createElement('a')
            link.href = content.fileName

            link.click()
        }

        setLoading(false)
        setExportModal(false)
    }

    const handleClearDatabase = async () => {
        setLoading(true)
        const results = await (await fetch("/api/clearDatabase", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        }))

        if(results.status === 204) {
            toast.current.show({ severity: "success", summary: "Opération réussie", detail: "La base de données a été réinitialisée.", life: 3000 })
        }

        setLoading(false)
    }

    const handleImport = async () => {
        setLoading(true)

        const formData = new FormData()
        formData.append("file", uploadedFiles)
        formData.append("table", selectedTables)

        const results = await fetch("/api/importData", {
            method: "POST",
            body: formData
        })

        if(results.status === 204) {
            toast.current.show({ severity: "success", summary: "Opération réussie", detail: "Les données ont été importées.", life: 3000 })
        } else if (results.status === 400) {
            toast.current.show({ severity: "warn", summary: "Fichier incompatible", detail: "Le contenu du fichier n'est pas compatible.", life: 3000 })
        } else if (results.status === 409) {
            toast.current.show({ severity: "error", summary: "Opération échouée", detail: "Les données du fichier existent déjà en base.", life: 3000 })
        }

        setUploadedFiles(null)
        setLoading(false)
        setImportModal(false)
    }

    return (<div className="selector-container">
        <h1>Administration</h1>

        <div className="buttons-container">
            <Button label="Exporter des données" loading={loading} onClick={() => {setExportModal(true)}}/>
            <Button label="Importer des données" loading={loading} onClick={() => {setImportModal(true)}}/>
            <Button label="Réinitialiser la base de données" loading={loading} onClick={() => {setClearModal(true)}}/>
        </div>

        <Dialog header="Exporter des données" visible={exportModal} style={{width: "38vw"}}
                onHide={() => setExportModal(false)} draggable={false} >
            <div className="align-items-center flex flex-column gap-5 pt-2">
                <MultiSelect value={selectedTables} onChange={(e) => setSelectedTables(e.value)} options={tables}
                             display="chip" filter placeholder="Sélectionner les tables" className="w-full"/>
                <Button label="Exporter" disabled={selectedTables.length === 0} loading={loading} onClick={handleExport}/>
            </div>

        </Dialog>

        <Dialog header="Importer des données" visible={importModal} style={{width: "38vw"}}
                onHide={() => setImportModal(false)} draggable={false}>
            <div className="align-items-center flex flex-column gap-5">
                <div className="align-items-center flex flex-column gap-6 pt-2">
                    <div className="align-items-center flex font-bold gap-5 text-lg">
                        <div className="flex flex-column gap-2">
                            <label>Fichier</label>
                            <FileUpload mode="basic" accept="text/csv" chooseLabel="Ajouter" onSelect={(e) => setUploadedFiles(e.files[0])} customUpload uploadHandler={() => {}} />
                        </div>
                        <div className="flex flex-column gap-2">
                            <label>Table</label>
                            <Dropdown value={selectedTables} onChange={(e) => setSelectedTables(e.value)} options={tables}
                                         display="chip" filter placeholder="Sélectionner les tables" className="w-full"/>
                        </div>
                    </div>
                </div>

                <Button label="Importer" disabled={uploadedFiles === null || selectedTables.length === 0} loading={loading} onClick={handleImport}/>
            </div>
        </Dialog>

        <Toast ref={toast} />
        <ConfirmDialog visible={clearModal} draggable={false} acceptLabel="Oui" acceptClassName="p-button-danger" rejectLabel="Non" onHide={() => setClearModal(false)} message="Êtes vous sûr de vouloir supprimer toutes les données ?"
                       header="Confirmation" icon="pi pi-exclamation-triangle" accept={handleClearDatabase} reject={() => setClearModal(false)} />
    </div>)
}