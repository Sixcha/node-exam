import 'dotenv/config'
import http from 'node:http'
import path from 'node:path'
import fs from "node:fs";

const{APP_PORT, APP_HOST} = process.env


const viewPath = path.join(import.meta.dirname, 'view') 
const dataPath = path.join(import.meta.dirname, 'Data') 
const assetsPath = path.join(import.meta.dirname, "assets", 'css')

const students = [
    { name : "Sonia", birth : "2019-14-05"},
    { name : "Antoine", birth : "2000-12-05"},
    { name : "Alice", birth : "1990-14-09"},
    { name : "Sophie", birth : "2001-10-02"},
    { name : "Bernard", birth : "1980-21-08"}
]; 

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
        res.writeHead(200, {
            "Content-Type": "text/html"
          })
          res.end(usersPage)
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
          const notesArray = newStudent.notes.split(',')
          const notes = notesArray.map(note => parseInt(note.replace(" ", "")))
          if (notes.includes(NaN)) {
            res.writeHead(500, {
              "Content-Type": "text/plain"
            })
            return res.end("Merci de ne saisir que des valeurs numérique pour les notes, séparée d'une virgule")
          }
          newStudent.name = newStudent.name.replace(" ", "")
          newStudent.notes = notes;
          const fileName = `${newStudent.name.toLowerCase()}.json`;
          //Creation du fichier json pour newStudent
          fs.writeFile(path.join(dataPath, fileName), JSON.stringify(newStudent, null, 2), (err) => {
            if (err) {
              res.writeHead(500, {
                "Content-Type": "text/plain"
              })
              res.end(err.message)
              return
            }
            
            const all = JSON.parse(fs.readFileSync(path.join(dataPath, "all.json"), {encoding: 'utf8'}))
            all.student.push(newStudent)
            fs.writeFileSync(path.join(dataPath, "all.json"), JSON.stringify(all, null, 2))
            
            res.writeHead(301, {
              "Location": "/"
            })
            res.end()
          })
        })
      }
      
      return
    }
    
    // if (req.url === '/users') {
    //   let html;
    //   const all = fs.readFileSync(path.join(dataPath, "all.json"), {encoding: "utf8"})
    //   const {student} = JSON.parse(all)
      
    //   pug.renderFile(path.join(viewPath, 'users.pug'), {students: student}, (err, data) => {
    //     if (err) {
    //       res.writeHead(500, {
    //         "Content-Type": "text/plain"
    //       })
    //       return res.end(err.message)
    //     }
        
    //     res.writeHead(200, {
    //       "Content-Type": "text/html"
    //     })
    //     return res.end(data)
    //   })
    //   return
    // }
    
    // res.writeHead(404, {
    //   "Content-Type" : "text/html"
    // })
    // const page404 = fs.readFileSync(path.join(viewPath, "404.html"), {encoding: "utf8"})
    // res.end(page404)
  })
  
  server.listen(APP_PORT, APP_HOST, () => {
    console.log(`Server listening at http://${APP_HOST}:${APP_PORT}`)
  })