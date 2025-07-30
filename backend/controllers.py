from flask import Blueprint, request, jsonify, render_template, session
from datetime import datetime
from backend.models import db, Todo, User
from werkzeug.security import generate_password_hash, check_password_hash

bp = Blueprint('todo', __name__)

# @bp.route('/')
# def index():
#     return render_template('index.html')

@bp.route('/api/check-session', methods=['GET'])
def check_session():
    """현재 로그인 상태 확인"""
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            return jsonify({
                'isLoggedIn': True,
                'user_id': user.id,
                'username': user.username
            })
    return jsonify({'isLoggedIn': False}), 401

@bp.route('/api/todos', methods=['GET'])
def get_todos():
    if 'user_id' not in session:
        return jsonify({'error': '로그인이 필요합니다.'}), 401
    user_id = session['user_id']
    todos = Todo.query.filter_by(user_id=user_id).order_by(Todo.created_at.desc()).all()
    return jsonify([todo.to_dict() for todo in todos])

@bp.route('/api/todos', methods=['POST'])
def create_todo():
    if 'user_id' not in session:
        return jsonify({'error': '로그인이 필요합니다.'}), 401
    user_id = session['user_id']
    
    data = request.get_json()
    text = data.get('text', '').strip()
    created_at_str = data.get('created_at')
    due_date_str = data.get('due_date')
    if not text:
        return jsonify({'error': '할 일 내용을 입력해주세요'}), 400
    created_at = None
    if created_at_str:
        try:
            created_at = datetime.fromisoformat(created_at_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': '잘못된 생성 날짜 형식입니다'}), 400
    due_date = None
    if due_date_str:
        try:
            due_date = datetime.fromisoformat(due_date_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': '잘못된 마감 날짜 형식입니다'}), 400
    new_todo = Todo(
        text=text, 
        completed=False,
        created_at=created_at,
        due_date=due_date,
        user_id=user_id
    )
    db.session.add(new_todo)
    db.session.commit()
    return jsonify(new_todo.to_dict()), 201

@bp.route('/api/todos/<int:todo_id>/toggle', methods=['PUT'])
def toggle_todo(todo_id):
    if 'user_id' not in session:
        return jsonify({'error': '로그인이 필요합니다.'}), 401
    user_id = session['user_id']
    
    todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()
    if not todo:
        return jsonify({'error': '해당 사용자의 할 일이 없습니다.'}), 404
    todo.completed = not todo.completed
    todo.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify(todo.to_dict())

@bp.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    if 'user_id' not in session:
        return jsonify({'error': '로그인이 필요합니다.'}), 401
    user_id = session['user_id']
    
    todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()
    if not todo:
        return jsonify({'error': '해당 사용자의 할 일이 없습니다.'}), 404
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'message': '삭제되었습니다'})

@bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    if not username or not password:
        return jsonify({'error': '아이디와 비밀번호를 입력해주세요.'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'error': '이미 존재하는 아이디입니다.'}), 400
    hashed_pw = generate_password_hash(password)
    new_user = User(username=username, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': '회원가입이 완료되었습니다.'}), 201

@bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    if not username or not password:
        return jsonify({'error': '아이디와 비밀번호를 입력해주세요.'}), 400
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': '아이디 또는 비밀번호가 올바르지 않습니다.'}), 401
    
    # session에 user_id 저장
    session['user_id'] = user.id
    return jsonify({'message': '로그인 성공', 'user_id': user.id, 'username': user.username}), 200

@bp.route('/api/logout', methods=['POST'])
def logout():
    """로그아웃 - session 삭제"""
    session.pop('user_id', None)
    return jsonify({'message': '로그아웃되었습니다.'}), 200 