// import express from "express";
const express = require("express");
// import path from "path";
const path = require("path");
// import cors from "cors";
const cors = require("cors");
const pool = require("./db");

const port = process.env.PORT || 8000;
const app = express();

// body parser middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes

// get all
app.get("/todos", async (req, res) => {
  try {
    const allTodo = await pool.query("SELECT * FROM todo");
    res.json(allTodo.rows);
  } catch (error) {
    console.log(error.message);
  }
});
// get one via ID
app.get("/todos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id=$1", [id]);
    res.json(todo.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// posting
app.post("/todos", async (req, res) => {
  try {
    console.log(req.body);
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

// update one via ID
app.put("/todos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { description } = req.body;
    const updatedTodo = await pool.query(
      "UPDATE todo SET description=$2 WHERE todo_id=$1",
      [id, description]
    );
    res.json("updated todo");
  } catch (error) {
    console.log(error.message);
  }
});

// delete one via ID
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id=$1", [
      id
    ]);
    res.json(`deleted entry ${id}`);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`server is running on Port:${port}`);
});
