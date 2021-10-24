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
    app.use('/', express.static(path.join(__dirname, 'public')))

    app.use('/', router)

    const httpServer = http.createServer(app)

    const server = new ApolloServer({
        schema: getSchema(),
        playground: true,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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
