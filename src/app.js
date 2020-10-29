const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
let count = 0

const validateId = (req, resp, next) => {
  const { id } = req.params
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0){
    return resp.status(400).json({error: "Repository not found"})
  }
  next()
}

app.get("/repositories", (request, response) => {
  const { title, url, techs } = request.query;

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs  } = request.body;

  const repositorie = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repositorie); 
  
  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({Error: 'Project not found'})
  }

  const repositorie = {
    id, 
    title, 
    url,
    techs,
    likes: 1,
  };

  repositories[repositorieIndex] = repositorie;
  return response.json(repositorie);
  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositorieIndex < 0) {
    return response.status(400).json({Error: 'Project not found'})
  }

  repositories.splice(repositorieIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateId, (request, response) => { count += 1;
  const liked = { likes: count }; return response.json(liked)});

module.exports = app;
