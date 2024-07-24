import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
const server = http.createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())



const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        
        
    ],
    credentials: true
}
app.use(cors(corsOptions))

import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'

import { accountRoutes } from './api/account/account.routes.js'
import { setupSocketAPI } from './services/socket.service.js'

// routes
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'
app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/account', accountRoutes)
setupSocketAPI(server)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/account/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue/react-router to take it from there
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))

    // res.redirect('https://tal0311.github.io/accounts-keeper/')
})


import { logger } from './services/logger.service.js'
const port = process.env.PORT || 3030
server.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})