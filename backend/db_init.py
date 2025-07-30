from backend.app import app, db
from backend.models import Todo
from datetime import datetime

def init_db():
    """데이터베이스 초기화"""
    with app.app_context():
        # 테이블 생성
        db.create_all()
        print("데이터베이스 테이블이 생성되었습니다.")

def add_sample_data():
    """샘플 데이터 추가"""
    with app.app_context():
        # 기존 데이터 확인
        if Todo.query.count() == 0:
            sample_todos = [
                Todo(text="React 공부하기", completed=False),
                Todo(text="Flask 백엔드 구현하기", completed=True),
                Todo(text="데이터베이스 연동하기", completed=False),
                Todo(text="UI/UX 개선하기", completed=False)
            ]
            
            for todo in sample_todos:
                db.session.add(todo)
            
            db.session.commit()
            print("샘플 데이터가 추가되었습니다.")
        else:
            print("이미 데이터가 존재합니다.")

def show_all_todos():
    """모든 할 일 조회"""
    with app.app_context():
        todos = Todo.query.order_by(Todo.created_at.desc()).all()
        print(f"\n총 {len(todos)}개의 할 일이 있습니다:")
        for todo in todos:
            status = "✅ 완료" if todo.completed else "⏳ 진행중"
            print(f"[{todo.id}] {todo.text} - {status}")

def clear_db():
    """데이터베이스 초기화"""
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("데이터베이스가 초기화되었습니다.")

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == 'init':
            init_db()
        elif command == 'sample':
            add_sample_data()
        elif command == 'show':
            show_all_todos()
        elif command == 'clear':
            clear_db()
        else:
            print("사용법: python db_init.py [init|sample|show|clear]")
    else:
        print("사용법: python db_init.py [init|sample|show|clear]")
        print("  init: 데이터베이스 초기화")
        print("  sample: 샘플 데이터 추가")
        print("  show: 모든 할 일 조회")
        print("  clear: 데이터베이스 초기화") 