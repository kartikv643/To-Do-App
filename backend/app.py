from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL, sslmode='require')
    return conn

def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
            text TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT FALSE
        )
    ''')
    conn.commit()
    cur.close()
    conn.close()

init_db()

@app.route('/api/todos', methods=['GET'])
def get_todos():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, text, completed FROM todos")
    rows = cur.fetchall()
    todos = [{"id": r[0], "text": r[1], "completed": r[2]} for r in rows]
    cur.close()
    conn.close()
    return jsonify(todos)

@app.route('/api/todos', methods=['POST'])
def add_todo():
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO todos (text, completed) VALUES (%s, %s)",
                (data['text'], data['completed']))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Todo added'}), 201

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM todos WHERE id = %s", (todo_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Todo deleted'})

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE todos SET completed = %s WHERE id = %s",
                (data['completed'], todo_id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Todo updated'})

if __name__ == '__main__':
    app.run()