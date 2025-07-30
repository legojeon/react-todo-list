from flask import Flask
from flask_cors import CORS
from backend.models import db
from backend.controllers import bp
import os
from flask import Flask, send_from_directory 


app = Flask(__name__, static_folder='dist', static_url_path='')
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance', 'todos.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'learnsteam'  # session을 위한 secret key 추가

# CORS 설정 - 쿠키 허용
CORS(app, supports_credentials=True, origins=['http://localhost:8001'])

db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(bp)

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)