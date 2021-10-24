import { ApolloServer } from 'apollo-server'
import { getSchema } from './utils/getSchema'
import { startTheBot } from './bot'
import { startDB } from './utils/db'

const server = new ApolloServer({ schema: getSchema(), playground: true })

server.listen({ port: process.env.PORT || 8000 }).then(async ({ url }) => {
    console.log(`🚀 Server is ready at ${url}`)
    await startDB()
    await runBot()
})

const runBot = async () => {
    while (1) {
        await startTheBot()
    }
}
