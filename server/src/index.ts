import express, {type Request, type Response} from 'express'
const app = express()
const port = 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Im serving requests')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
