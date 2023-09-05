const express = require("express");
const bodyParser = require("body-parser");
const db = require("./ultils/database");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// POST
app.post("/api/v1/users", async (req, res) => {
  let { name, email, age } = req.body;
  let createUser = await db.execute(
    "INSERT INTO users (name, email, age) VALUES (?,?,?)",
    [name, email, age]
  );

  res.json({ createUser, message: "Create user success" });
});

//GET ALL
app.get("/api/v1/users", async (req, res) => {
  try {
    let users = await db.execute("SELECT * FROM users ");
    let rowUser = users[0];
    console.log(rowUser);
    res.json({
      users: rowUser,
      message: "Lấy toàn bộ user",
    });
  } catch (error) {
    res.json({
      messenge: "K thấy user",
    });
  }
});

// GET ONE
app.get("/api/v1/users/:id", async (req, res) => {
  let { id } = req.params;
  let findUser = await db.execute(`SELECT * FROM users WHERE userid = ${id}`);
  let rowUser = findUser[0];
  console.log(rowUser);
  if (rowUser === 0) {
    res.json({
      message: ` User với id = ${id} k tồn tại`,
    });
  } else {
    res.json(rowUser);
  }
});

//PATCH
app.patch("/api/v1/users/:id", async (req, res) => {
  let { id } = req.params;
  let { name, email, age } = req.body;
  try {
    let updateUser = await db.execute(`SELECT * FROM users WHERE userid = ?`, [
      id,
    ]);
    let rowUser = updateUser[0];
    console.log(rowUser);
    if (rowUser === 0) {
      res.json({
        message: `User với id = ${id} k tồn tại`,
      });
    } else {
      await db.execute(
        `UPDATE users SET name = ?, email = ?,age = ? WHERE userid = ?`,
        [
          name || rowUser[0].name,
          email || rowUser[0].email,
          age || rowUser[0].age,
          id,
        ]
      );
      res.json({
        message: "Update success",
      });
    }
  } catch (error) {
    res.json({
      messenge: "Update not success",
    });
  }
});

// DELETE
app.delete("/api/v1/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM users WHERE userid = ?", [id]);
    let data = await db.execute("SELECT * FROM users");
    res.json({
      message: "Đã delete thành công",
      user: data[0],
    });
  } catch (error) {
    res.json({
      message: "Delete not success",
    });
  }
});
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
