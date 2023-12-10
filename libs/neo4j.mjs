import "dotenv/config.js"
import neo4j from 'neo4j-driver'

const URI = process.env.NEO4J_URL
const USER = process.env.NEO4J_USER
const PASSWORD = process.env.NEO4J_PASSWORD

let driver

try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
} catch (err) {
    console.log(err)
}

export default driver