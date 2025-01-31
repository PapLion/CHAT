import sqlite3 from "sqlite3"
import { open } from "sqlite"

let db: any = null

async function openDb() {
  if (!db) {
    db = await open({
      filename: "./chat.db",
      driver: sqlite3.Database,
    })

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT,
        role TEXT,
        course_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_banned BOOLEAN DEFAULT 0,
        is_muted BOOLEAN DEFAULT 0,
        FOREIGN KEY (course_id) REFERENCES courses(id)
      );

      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        parallel TEXT,
        year TEXT,
        specialization TEXT,
        UNIQUE(name, parallel, year, specialization)
      );

      CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        type TEXT,
        course_id INTEGER,
        UNIQUE(type, course_id),
        FOREIGN KEY (course_id) REFERENCES courses(id)
      );

      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER,
        content TEXT,
        chat_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id),
        FOREIGN KEY (chat_id) REFERENCES chats(id)
      );

      CREATE TABLE IF NOT EXISTS parent_student_relations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        parent_id INTEGER,
        student_id INTEGER,
        UNIQUE(parent_id, student_id),
        FOREIGN KEY (parent_id) REFERENCES users(id),
        FOREIGN KEY (student_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS parent_course_access (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        parent_id INTEGER,
        course_id INTEGER,
        UNIQUE(parent_id, course_id),
        FOREIGN KEY (parent_id) REFERENCES users(id),
        FOREIGN KEY (course_id) REFERENCES courses(id)
      );

      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by INTEGER,
        FOREIGN KEY (created_by) REFERENCES users(id)
      );
    `)

    // Insertar cursos predeterminados solo si no existen
    const defaultCourses = [
      { name: "Octavo", parallel: "A", year: "2023", specialization: "General" },
      { name: "Octavo", parallel: "B", year: "2023", specialization: "General" },
      { name: "Octavo", parallel: "C", year: "2023", specialization: "General" },
      { name: "Noveno", parallel: "A", year: "2023", specialization: "General" },
      { name: "Noveno", parallel: "B", year: "2023", specialization: "General" },
      { name: "Noveno", parallel: "C", year: "2023", specialization: "General" },
      { name: "Décimo", parallel: "A", year: "2023", specialization: "General" },
      { name: "Décimo", parallel: "B", year: "2023", specialization: "General" },
      { name: "Décimo", parallel: "C", year: "2023", specialization: "General" },
      { name: "Primero de Bachiller", parallel: "A", year: "2023", specialization: "Informática" },
      { name: "Primero de Bachiller", parallel: "B", year: "2023", specialization: "Informática" },
      { name: "Primero de Bachiller", parallel: "C", year: "2023", specialization: "Contabilidad" },
      { name: "Segundo de Bachiller", parallel: "A", year: "2023", specialization: "Informática" },
      { name: "Segundo de Bachiller", parallel: "B", year: "2023", specialization: "Informática" },
      { name: "Segundo de Bachiller", parallel: "C", year: "2023", specialization: "Contabilidad" },
      { name: "Tercero de Bachiller", parallel: "A", year: "2023", specialization: "Informática" },
      { name: "Tercero de Bachiller", parallel: "B", year: "2023", specialization: "Informática" },
      { name: "Tercero de Bachiller", parallel: "C", year: "2023", specialization: "Contabilidad" },
    ]

    for (const course of defaultCourses) {
      try {
        await db.run("INSERT OR IGNORE INTO courses (name, parallel, year, specialization) VALUES (?, ?, ?, ?)", [
          course.name,
          course.parallel,
          course.year,
          course.specialization,
        ])
      } catch (error) {
        console.error("Error inserting course:", error)
      }
    }

    // Crear chats predeterminados para cada curso
    const courses = await db.all("SELECT * FROM courses")
    for (const course of courses) {
      try {
        await db.run("INSERT OR IGNORE INTO chats (name, type, course_id) VALUES (?, ?, ?)", [
          `Chat de ${course.name} ${course.parallel} - ${course.specialization}`,
          "course",
          course.id,
        ])
      } catch (error) {
        console.error("Error creating course chat:", error)
      }
    }

    // Crear chat para padres
    try {
      await db.run("INSERT OR IGNORE INTO chats (name, type) VALUES (?, ?)", ["Chat General de Padres", "parents"])
    } catch (error) {
      console.error("Error creating parents chat:", error)
    }

    // Crear chat para autoridades
    try {
      await db.run("INSERT OR IGNORE INTO chats (name, type) VALUES (?, ?)", ["Chat de Autoridades", "authorities"])
    } catch (error) {
      console.error("Error creating authorities chat:", error)
    }
  }
  return db
}

export { openDb }

