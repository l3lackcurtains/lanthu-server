import { TokenModal } from '../../utils/db'

export default {
    Query: {
        getTokens: async (_, args, ctx) => {
            try {
                const tokens = await TokenModal.find().sort({ updatedAt: -1 })
                return { result: tokens }
            } catch (e) {
                return { error: `No tokens found.` }
            }
        },
    },
}
