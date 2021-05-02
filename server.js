const http = require("http")
const https = require("https")
const fs = require("fs")

const hostname = "127.0.0.1"
const port = 3456

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "text/plain")

  let url = "https://jsonplaceholder.typicode.com/posts"
  https
    .get(url, (response) => {
      let posts = ""

      // Fetch the posts' data response in chunks
      response.on("data", (chunk) => {
        posts += chunk
      })

      response.on("end", () => {
        const filePath = "result/posts.json"
        // Save the retrieved 'posts' to a posts.json
        fs.writeFile(filePath, posts, (err) => {
          if (err) {
            console.error(err)
            res.end(
              JSON.stringify({
                error: true,
                message: "Can't save posts to file",
              })
            )
            return
          }

          // Return Success message if file is written successfully
          res.statusCode = 200
          res.end(
            JSON.stringify({
              success: true,
              url: `http://${hostname}:${port}/${filePath}`,
              message: "Posts saved successfully",
            })
          )
        })
      })
    })
    .on("error", (error) => {
      console.error(error.message)
      // Return error message if url is not reachable
      res.statusCode = 404
      res.end(JSON.stringify({ error: true, message: "Posts not found" }))
      return
    })
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
