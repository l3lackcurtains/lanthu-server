import { getSchema } from './utils/getSchema'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import http from 'http'
import { startTheBot } from './bot'
import { startDB } from './utils/db'
import helmet from 'helmet'
import path from 'path'
import { router } from './api'

const PORT = process.env.PORT || 8000
const HOST = 'localhost'
async function startApolloServer() {
    const app = express()

    app.use(express.json({ limit: '50mb' }))

    app.use(
        express.urlencoded({
            limit: '50mb',
            extended: false,
            parameterLimit: 50000,
        })
    )
    app.use(helmet())
    app.use('/', (req, res) => {
        return res.status(200).json({ name: 'Lanthu Bot', status: 'Running' })
    })

    app.use('/', router)

    const httpServer = http.createServer(app)
    const corsOptions = {
        origin: `http://${HOST}:${PORT}`,
        credentials: true,
    }
    const server = new ApolloServer({
        schema: getSchema(),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        playground: true,
        introspection: true,
        cors: corsOptions,
    })

    await server.start()
    server.applyMiddleware({
        app,
        path: '/graphql',
    })

    // Modified server startup
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve))
    console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )

    await startDB()
    await runBot()
}

const runBot = async () => {
    while (1) {
        await startTheBot()
    }
}

startApolloServer()
