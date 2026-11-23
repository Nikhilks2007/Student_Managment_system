const express = require("express");
const router = express.Router();
const students = require("../data/students");

// GET /students - return all students
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

// GET /students/:id - return one student
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Student ID must be a positive integer." });
  }

  const student = students.find((item) => item.id === id);
  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }

  return res.status(200).json({ success: true, data: student });
});

// POST /students - create a student
router.post("/", (req, res) => {
  const { name, email, course, age } = req.body;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof course !== "string" || !course.trim() ||
    age === undefined || !Number.isInteger(Number(age)) || Number(age) <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid name, email, course, and positive integer age."
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailExists = students.some((student) => student.email.toLowerCase() === normalizedEmail);
  if (emailExists) {
    return res.status(400).json({ success: false, message: "A student with this email already exists." });
  }

  const newStudent = {
    id: students.length ? Math.max(...students.map((student) => student.id)) + 1 : 1,
    name: name.trim(),
    email: normalizedEmail,
    course: course.trim(),
    age: Number(age)
  };

  students.push(newStudent);
  return res.status(201).json({
    success: true,
    message: "Student created successfully.",
    data: newStudent
  });
});

// PUT /students/:id - update an existing student
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Student ID must be a positive integer." });
  }

  const student = students.find((item) => item.id === id);
  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }

  const { name, email, course, age } = req.body;
  if (name === undefined && email === undefined && course === undefined && age === undefined) {
    return res.status(400).json({ success: false, message: "Provide at least one field to update." });
  }

  if (name !== undefined && (typeof name !== "string" || !name.trim())) {
    return res.status(400).json({ success: false, message: "Name must be a non-empty string." });
  }
  if (email !== undefined && (typeof email !== "string" || !email.trim())) {
    return res.status(400).json({ success: false, message: "Email must be a non-empty string." });
  }
  if (course !== undefined && (typeof course !== "string" || !course.trim())) {
    return res.status(400).json({ success: false, message: "Course must be a non-empty string." });
  }
  if (age !== undefined && (!Number.isInteger(Number(age)) || Number(age) <= 0)) {
    return res.status(400).json({ success: false, message: "Age must be a positive integer." });
  }

  if (email !== undefined) {
    const normalizedEmail = email.trim().toLowerCase();
    const duplicate = students.some((item) => item.id !== id && item.email.toLowerCase() === normalizedEmail);
    if (duplicate) {
      return res.status(400).json({ success: false, message: "Another student already uses this email." });
    }
    student.email = normalizedEmail;
  }

  if (name !== undefined) student.name = name.trim();
  if (course !== undefined) student.course = course.trim();
  if (age !== undefined) student.age = Number(age);

  return res.status(200).json({
    success: true,
    message: "Student updated successfully.",
    data: student
  });
});

// DELETE /students/:id - delete a student
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Student ID must be a positive integer." });
  }

  const index = students.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }

  const deletedStudent = students.splice(index, 1)[0];
  return res.status(200).json({
    success: true,
    message: "Student deleted successfully.",
    data: deletedStudent
  });
});

module.exports = router;
