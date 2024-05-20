import 'dotenv/config'
import http from 'node:http'
import path from 'node:path'
import fs from "node:fs";
import querystring from "querystring";
import {join} from 'node:path'

const{APP_PORT, APP_HOST} = process.env


const viewPath = path.join(import.meta.dirname, 'view') 
const dataPath = path.join(import.meta.dirname, 'Data') 
const assetsPath = path.join(import.meta.dirname, "assets", 'css')


const server = http.createServer((req, res) => {

    
    if (req.url === "/style") {
      const css = fs.readFileSync(path.join(assetsPath, "style.css"), {encoding: "utf8"})
      res.writeHead(200, {
        "Content-Type": "text/css"
      })
      return res.end(css)
    }

    if (req.url === "/users") {
        const usersPage = fs.readFileSync(path.join(viewPath, "users.html"), {encoding: "utf8"})
        const data = fs.readFileSync(path.join(dataPath, "data.json"), {encoding: "utf8"})
        const {students} = JSON.parse(data)
        console.log(students)
        let html = usersPage;
        for (let i = 0; i < students.length; i++) {
          console.log(Object.entries(students))
          html += "<li>" + students[i].name + " , " + students[i].birth  + "</li>"
          
        }

        html += "</ul> </body></html>";

        res.writeHead(200, {
            "Content-Type": "text/html"
          })
          res.end(html)
      }
    
    if(req.url === '/') {
    const homePage = fs.readFileSync(path.join(viewPath, "home.html"), {encoding: "utf8"})
      if(req.method === 'GET') {

          
          res.writeHead(200, {
            "Content-Type": "text/html"
          })
          res.end(homePage)
      }
      
      if(req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString()
        })
        req.on("end", () => {
          const newStudent = querystring.parse(body)

            
          if (newStudent.name && newStudent.birthday) {
            const students = JSON.parse(fs.readFileSync(join(dataPath, "data.json"), {encoding: 'UTF-8'}))
            const name = newStudent.name.trim()
            const birth = newStudent.birthday

            students.students.push({name,birth})
            console.log(students)
            fs.writeFileSync(join(dataPath, "data.json"), JSON.stringify(students, null, 2))
            
            res.writeHead(301, {
              "Location": "/"
            })
            res.end()
          }

          
        })
      }
      
      return
    }
    

  })
  
  server.listen(APP_PORT, APP_HOST, () => {
    console.log(`Server listening at http://${APP_HOST}:${APP_PORT}`)
  })