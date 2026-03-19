import os
from flask import Flask, request, render_template, redirect, url_for, send_from_directory, session
from dotenv import load_dotenv # Nueva librería

load_dotenv() # Carga los datos del archivo .env

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY') # Necesario para las sesiones

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- RUTAS DE LOGIN ---

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form.get('username')
        password = request.form.get('password')
        
        if usuario == os.getenv('ADMIN_USER') and password == os.getenv('ADMIN_PASS'):
            session['admin_logged_in'] = True
            return redirect(url_for('index'))
        else:
            return "Credenciales incorrectas", 401
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('login'))


@app.route('/', methods=['GET', 'POST'])
def index():
    if not session.get('admin_logged_in'):
        return redirect(url_for('login'))
        
    if request.method == 'POST':
        file = request.files.get('file')
        if file and file.filename != '':
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
            return redirect(url_for('index'))

    archivos_guardados = os.listdir(app.config['UPLOAD_FOLDER'])
    return render_template('index.html', files=archivos_guardados)

@app.route('/descargar/<nombre_archivo>')
def descargar(nombre_archivo):
    if not session.get('admin_logged_in'): return redirect(url_for('login'))
    return send_from_directory(app.config['UPLOAD_FOLDER'], nombre_archivo, as_attachment=True)

@app.route('/eliminar/<nombre_archivo>', methods=['POST'])
def eliminar(nombre_archivo):
    if not session.get('admin_logged_in'): return redirect(url_for('login'))
    ruta_archivo = os.path.join(app.config['UPLOAD_FOLDER'], nombre_archivo)
    if os.path.exists(ruta_archivo):
        os.remove(ruta_archivo)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)