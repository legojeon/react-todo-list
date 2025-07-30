# React Todo List (TODODODO)

## 📖 프로젝트 소개
이 프로젝트는 React의 기본 개념과 Hooks 사용법을 익히기 위해 만든 저의 첫 번째 웹 애플리케이션입니다.
기존의 투두리스트와 달리 시작일과 마감일에 각각 다른색의 이벤트 블록을 넣어, 기한이 있는 과제나 일정을 좀 더 손쉽게 관리할 수 있도록 했습니다. 

---

## ✨ 주요 기능

### 🔐 사용자 인증
- 회원가입 및 로그인 기능
- 세션 기반 인증
- 사용자별 Todo 관리

### 📝 Todo 관리
- 할 일 추가, 수정, 삭제
- 완료/미완료 상태 토글
- 마감일 설정 및 관리
- 우선순위별 정렬 (마감일 기준)

### 📅 캘린더 뷰
- 월별 캘린더로 Todo 확인
- 마감일이 있는 Todo를 캘린더에 표시
- 월 이동 기능

---

## 🖼️ 실행 화면
(여기에 프로젝트 실행 화면 스크린샷을 넣어주세요!)

![프로젝트 실행 화면](여기에-이미지-링크를-넣어주세요.png)

*💡 팁: 스크린샷 이미지를 GitHub 저장소에 업로드한 후, 그 파일의 링크를 사용하면 편리합니다.*

---

## 🛠 기술 스택

### 프론트엔드
- **React 19** - 최신 React 버전
- **Material-UI (MUI)** - UI 컴포넌트 라이브러리
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **Day.js** - 날짜 처리 라이브러리
- **React Big Calendar** - 캘린더 컴포넌트

### 백엔드
- **Flask** - Python 웹 프레임워크
- **SQLAlchemy** - ORM
- **SQLite** - 데이터베이스
- **Flask-CORS** - CORS 지원
- **Werkzeug** - 보안 기능 (비밀번호 해싱)

---

## 📁 프로젝트 구조
```
todo_react/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/      # React 컴포넌트
│   │   │   ├── TodoForm.jsx     # Todo 입력 폼
│   │   │   ├── TodoList.jsx     # Todo 목록
│   │   │   ├── TodoItem.jsx     # 개별 Todo 아이템
│   │   │   ├── Calendar.jsx     # 캘린더 뷰
│   │   │   └── ProfileDialog.jsx # 프로필 다이얼로그
│   │   ├── App.jsx         # 메인 앱 컴포넌트
│   │   └── main.jsx        # 앱 진입점
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Flask 백엔드
│   ├── app.py              # Flask 앱 설정
│   ├── controllers.py      # API 엔드포인트
│   ├── models.py           # 데이터베이스 모델
│   ├── db_init.py          # 데이터베이스 초기화
│   ├── requirements.txt    # Python 의존성
│   └── instance/
│       └── todos.db        # SQLite 데이터베이스
└── README.md
```

---
## 🚀 실행 방법

### 1. 백엔드 설정
```bash
# Python 의존성 설치
cd backend
python3 -m pip install -r requirements.txt

# 데이터베이스 초기화
PYTHONPATH=. python3 db_init.py init
```

### 2. 프론트엔드 설정
```bash
# Node.js 의존성 설치
cd frontend
npm install
```

### 3. 애플리케이션 실행

#### 백엔드 실행 (터미널 1)
```bash
cd backend
PYTHONPATH=. python3 app.py
```

#### 프론트엔드 실행 (터미널 2)
```bash
cd frontend
npm run dev
```
### 4. 브라우저에서 접속
- 프론트엔드: http://localhost:8001
- 백엔드 API: http://localhost:5001
  
---
## 📡 API 엔드포인트

### 인증 관련
- `GET /api/check-session` - 세션 확인
- `POST /api/signup` - 회원가입
- `POST /api/login` - 로그인
- `POST /api/logout` - 로그아웃

### Todo 관리
- `GET /api/todos` - 사용자의 모든 Todo 조회
- `POST /api/todos` - 새 Todo 생성
- `PUT /api/todos/{id}/toggle` - Todo 완료 상태 토글
- `DELETE /api/todos/{id}` - Todo 삭제
