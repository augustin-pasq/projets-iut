import {useEffect, useState} from "react";
import {Card} from 'primereact/card';
import {Tag} from "primereact/tag";
import {MultiSelect} from "primereact/multiselect";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";

export default function Home() {
    const [data, setData] = useState({})
    const [values, setValues] = useState({})
    const [filters, setFilters] = useState({})
    const [properties, setProperties] = useState({})
    const [visible, setVisible] = useState(false)
    const [action, setAction] = useState("")

    useEffect(() => {
        updateData()
    }, [])

    const updateData = () => {
        getData()
            .then((result) => {
                setData(result)
                setValues(result.values)
            })
            .catch(error => console.error(error))
    }

    const getData = async () => {
        return await (await fetch('/api/getData', {
            method: 'GET', headers: {'Content-Type': 'application/json'},
        })).json()
    }

    const search = async () => {
        let arrangedFilters = JSON.parse(JSON.stringify(filters))
        for (let category in arrangedFilters) {
            for (let filter in arrangedFilters[category]) {
                arrangedFilters[category][filter] = arrangedFilters[category][filter].name
            }
        }

        let results = await (await fetch('/api/getDataWithFilters', {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(arrangedFilters)
        })).json()

        setData(results)
    }

    const submitInput = (action, filter, value) => {
        if (action === "filter") {
            let dataCopy = {...filters}
            typeof value === "string" && value === "" || value.length === 0 ? delete dataCopy[filter] : dataCopy[filter] = value
            setFilters(dataCopy)
        } else if (action === "edit") {
            let dataCopy = {...properties}
            value === "" || value.length === 0 ? delete dataCopy[filter] : dataCopy[filter] = value
            setProperties(dataCopy)
        }
    }

    const handleEdit = (id) => {
        let car = data.cars.find(car => car.id === id)
        let garantie
        if (car.sous_garantie) garantie = "Oui"
        else garantie = "Non"

        const carFormatted = {
            id: car.id,
            annee_production: car.annee_production,
            boite_vitesse: {name: car.boite_vitesse},
            categorie: {name: car.categorie},
            couleur: {name: car.couleur},
            date_publication: car.date_publication,
            etat: car.etat,
            kilometrage: car.kilometrage,
            marque: car.marque,
            modele: car.modele,
            prix: car.prix,
            sous_garantie: {name: garantie},
            transmission: {name: car.transmission},
            capacite_moteur: car.moteur.capacite_moteur,
            carburant: {name: car.moteur.carburant}
        }

        setProperties(carFormatted)
        setAction("edit")
        setVisible(true)
    }

    const handleSubmit = async () => {
        await (await fetch('/api/sendData', {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({action: action, properties: properties})
        })).json()

        updateData()
        setProperties({})
        setVisible(false)
    }

    const handleDelete = async (id) => {
        await (await fetch('/api/deleteData', {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id: id})
        })).json()

        updateData()
    }

    return (<>
        <header>
            <Card className="mb-5">
                <div className="flex flex-row flex-wrap justify-content-center gap-3">
                    <MultiSelect value={filters.marque}
                                 onChange={(e) => submitInput("filter", "marque", e.value)}
                                 options={values.marques} optionLabel="name"
                                 display="chip" filter placeholder="Marque"/>
                    <InputText value={filters.modele}
                               onChange={(e) => submitInput("filter", "modele", e.target.value)} placeholder="Modèle"
                    />
                    <InputText value={filters.annee_production}
                               onChange={(e) => submitInput("filter", "annee_production", e.target.value)}
                               keyfilter="int"  placeholder="Année de production"/>
                    <MultiSelect value={filters.categorie}
                                 onChange={(e) => submitInput("filter", "categorie", e.value)}
                                 options={values.categories} optionLabel="name"
                                 display="chip" filter placeholder="Catégorie"/>
                    <InputText id="kilometrage" value={filters.kilometrage}
                               onChange={(e) => submitInput("edit", "kilometrage", e.target.value)}
                               keyfilter="int" placeholder="Kilométrage"
                    />
                    <InputText id="capacite_moteur" value={filters.capacite_moteur}
                               onChange={(e) => submitInput("edit", "capacite_moteur", e.target.value)}
                               keyfilter="num"  placeholder="Capacité du moteur"/>
                    <MultiSelect value={filters.carburant}
                                 onChange={(e) => submitInput("filter", "carburant", e.value)}
                                 options={values.carburants} optionLabel="name"
                                 display="chip" filter placeholder="Carburant"/>
                    <MultiSelect value={filters.boite_vitesse}
                                 onChange={(e) => submitInput("filter", "boite_vitesse", e.value)}
                                 options={values.boites_vitesse} optionLabel="name"
                                 display="chip" filter placeholder="Boite de vitesse"/>
                    <MultiSelect value={filters.transmission}
                                 onChange={(e) => submitInput("filter", "transmission", e.value)}
                                 options={values.transmissions} optionLabel="name"
                                 display="chip" filter placeholder="Transmission"/>
                    <MultiSelect value={filters.couleur}
                                 onChange={(e) => submitInput("filter", "couleur", e.value)}
                                 options={values.couleurs} optionLabel="name"
                                 display="chip" filter placeholder="Couleur"/>
                    <MultiSelect value={filters.sous_garantie}
                                 onChange={(e) => submitInput("filter", "sous_garantie", e.value)}
                                 options={values.garanties} optionLabel="name"
                                 display="chip" filter placeholder="Garantie"/>
                    <InputText id="prix" value={filters.prix}
                               onChange={(e) => submitInput("edit", "prix", e.target.value)}
                               keyfilter="money" placeholder="Prix"/>
                    
                    <Button label="Rechercher" icon="pi pi-search" onClick={search}/>
                </div>
            </Card>
        </header>
        <main className="flex flex-column gap-3">
            {data.cars && data.cars.map((car, key) => <Card className="px-2 py-2" key={key}>
                <div className="absolute right-0 pr-4">
                    <Button className="w-2rem h-2rem mr-2" icon="pi pi-pencil" rounded outlined
                            severity="secondary" aria-label="Modifier les informations"
                            onClick={() => handleEdit(car.id)}/>
                    <Button className="w-2rem h-2rem" icon="pi pi-trash" rounded outlined severity="danger"
                            aria-label="Supprimer du catalogue" onClick={() => handleDelete(car.id)}/>
                </div>
                <div className="grid flex-column md:flex-row pt-3">
                    <div className="relative col-2">
                        <img className="absolute w-full h-full"
                             src="https://bdd.worldofcars-forum.fr/bddcars/images/personnages/mcquee12.png"
                             alt="Photo du véhicule"/>
                    </div>
                    <div className="md:col-8">
                        <span className="text-4xl font-bold mt-0">{car.marque} {car.modele}</span>
                        <div className="flex flex-row flex-wrap gap-2 pt-3 pb-2">
                            <Tag icon="pi pi-car" severity="info" value={car.categorie}></Tag>
                            <Tag icon="pi pi-bolt" severity="warning" value={car.moteur.carburant}></Tag>
                            <Tag icon="pi pi-sitemap" severity="danger" value={car.boite_vitesse}></Tag>
                            <Tag icon="pi pi-undo" severity="success" value={car.transmission}></Tag>
                        </div>
                        <div className="flex flex-wrap row-gap-2 column-gap-6 pt-4">
                            <span><b>Kilométrage : </b>{new Intl.NumberFormat('fr-FR').format(car.kilometrage)} km</span>
                            <span><b>Année de production : </b>{car.annee_production}</span>
                            <span><b>Capacité du moteur : </b>{car.moteur.capacite_moteur} L</span>
                            <span><b>Couleur : </b>{car.couleur}</span>
                            <span><b>Garantie : </b>{car.sous_garantie ? "oui" : "non"} </span>
                        </div>
                    </div>
                    <div className="col-2 flex flex-row text-center align-items-center">
                                <span className="text-5xl font-bold">{new Intl.NumberFormat('fr-FR', {
                                    style: 'currency', currency: 'EUR'
                                }).format(car.prix)}</span>
                    </div>
                </div>
                <span
                    className="flex justify-content-end text-xs font-italic">Publié le {new Date(car.date_publication).toLocaleDateString('fr-FR', {
                    year: 'numeric', month: 'long', day: 'numeric'
                })}</span>
            </Card>)}

            <Dialog className="w-10" header={action === "add" ? "Ajouter un véhicule" : "Modifier les informations"} visible={visible}
                    onHide={() => {
                        setProperties({})
                        setVisible(false)
                    }} draggable={false} blockScroll={true} dismissableMask={true}>
                <div className="grid gap-4 p-5 justify-content-center">
                    <span className="p-float-label col-3">
                        <InputText className="w-full" id="marque" value={properties.marque}
                                   onChange={(e) => submitInput("edit", "marque", e.target.value)}
                        />
                        <label className="pl-2" htmlFor="marque">Marque</label>
                    </span>
                    <span className="p-float-label col-3">
                        <InputText className="w-full" id="modele" value={properties.modele}
                                   onChange={(e) => submitInput("edit", "modele", e.target.value)}
                        />
                        <label className="pl-2" htmlFor="modele">Modèle</label>
                    </span>
                    <span className="p-float-label col-3">
                        <InputText className="w-full" id="annee_production" value={properties.annee_production}
                                   onChange={(e) => submitInput("edit", "annee_production", e.target.value)}
                                   keyfilter="int"/>
                        <label className="pl-2" htmlFor="annee_production">Année de production</label>
                    </span>
                    <span className="p-float-label col-3">
                        <Dropdown className="w-full" id="categorie" value={properties.categorie}
                                  onChange={(e) => submitInput("edit", "categorie", e.value)}
                                  options={values.categories} optionLabel="name"
                                  display="chip" filter/>
                        <label className="pl-2" htmlFor="categorie">Catégorie</label>
                    </span>
                    <span className="p-float-label col-3">
                        <InputText className="w-full" id="kilometrage" value={properties.kilometrage}
                                   onChange={(e) => submitInput("edit", "kilometrage", e.target.value)}
                                   keyfilter="int"
                        />
                        <label className="pl-2" htmlFor="kilometrage">Kilométrage</label>
                    </span>
                    <span className="p-float-label col-3">
                        <InputText className="w-full" id="capacite_moteur" value={properties.capacite_moteur}
                                   onChange={(e) => submitInput("edit", "capacite_moteur", e.target.value)}
                                   keyfilter="num"/>
                        <label className="pl-2" htmlFor="capacite_moteur">Capacité du moteur</label>
                    </span>
                    <span className="p-float-label col-3">
                        <Dropdown className="w-full" id="carburant" value={properties.carburant}
                                  onChange={(e) => submitInput("edit", "carburant", e.value)}
                                  options={values.carburants} optionLabel="name"
                                  display="chip" filter/>
                        <label className="pl-2" htmlFor="carburant">Carburant</label>
                    </span>
                    <span className="p-float-label col-3">
                        <Dropdown className="w-full" id="boite_vitesse" value={properties.boite_vitesse}
                                  onChange={(e) => submitInput("edit", "boite_vitesse", e.value)}
                                  options={values.boites_vitesse} optionLabel="name"
                                  display="chip" filter/>
                        <label className="pl-2" htmlFor="boite_vitesse">Boite de vitesse</label>
                    </span>
                    <span className="p-float-label col-3">
                        <Dropdown className="w-full" id="boite_vitesse" value={properties.transmission}
                                  onChange={(e) => submitInput("edit", "transmission", e.value)}
                                  options={values.transmissions} optionLabel="name"
                                  display="chip" filter/>
                        <label className="pl-2" htmlFor="transmission">Transmission</label>
                    </span>
                    <span className="p-float-label col-3">
                        <Dropdown className="w-full" id="couleur" value={properties.couleur}
                                  onChange={(e) => submitInput("edit", "couleur", e.value)} options={values.couleurs}
                                  optionLabel="name"
                                  display="chip" filter/>
                        <label className="pl-2" htmlFor="couleur">Couleur</label>
                    </span>
                    <span className="p-float-label col-3">
                        <Dropdown className="w-full" id="sous_garantie" value={properties.sous_garantie}
                                  onChange={(e) => submitInput("edit", "sous_garantie", e.value)}
                                  options={values.garanties} optionLabel="name"
                                  display="chip" filter/>
                        <label className="pl-2" htmlFor="sous_garantie">Garantie</label>
                    </span>
                    <span className="p-float-label col-3">
                        <InputText className="w-full" id="prix" value={properties.prix}
                                   onChange={(e) => submitInput("edit", "prix", e.target.value)}
                                   keyfilter="money"/>
                        <label className="pl-2" htmlFor="prix">Prix</label>
                    </span>
                </div>
                <div className="flex justify-content-center">
                    <Button label="Valider" icon="pi pi-check" onClick={() => handleSubmit(action)}/>
                </div>
            </Dialog>

            <Button className="fixed bottom-0 right-0 m-4" size="large" icon="pi pi-plus" rounded label="Ajouter une voiture" onClick={() => {
                setAction("add")
                setVisible(true)
            }} />
        </main>
    </>)
}
