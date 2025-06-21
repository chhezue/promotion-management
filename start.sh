#!/bin/bash

echo "🚀 Promotion Manager 개발 환경 시작"

# 환경 변수 파일 확인
if [ ! -f "backend/.env" ]; then
    echo "📝 백엔드 환경 변수 파일을 생성하세요:"
    echo "cp backend/env.example backend/.env"
    echo "그리고 필요한 값들을 설정하세요."
    exit 1
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "📝 프론트엔드 환경 변수 파일을 생성하세요:"
    echo "cp frontend/.env.local.example frontend/.env.local"
    exit 1
fi

# MongoDB 실행 확인
echo "🔍 MongoDB 연결 확인 중..."
if ! mongo --eval "db.runCommand('ping').ok" localhost:27017/test > /dev/null 2>&1; then
    echo "⚠️  MongoDB가 실행되지 않았습니다."
    echo "MongoDB를 먼저 실행해주세요:"
    echo "  - macOS: brew services start mongodb-community"
    echo "  - Ubuntu: sudo systemctl start mongodb"
    echo "  - Windows: MongoDB Compass 또는 서비스에서 실행"
    exit 1
fi

echo "✅ MongoDB 연결 확인됨"

# 백엔드 시작
echo "🔧 백엔드 서버 시작..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 백엔드 패키지 설치 중..."
    npm install
fi

echo "🔧 백엔드 개발 서버 시작..."
npm run start:dev &
BACKEND_PID=$!

cd ..

# 프론트엔드 시작
echo "🎨 프론트엔드 서버 시작..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 프론트엔드 패키지 설치 중..."
    npm install
fi

echo "🎨 프론트엔드 개발 서버 시작..."
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "✅ 개발 서버가 시작되었습니다!"
echo "🌐 프론트엔드: http://localhost:3000"
echo "🔧 백엔드 API: http://localhost:3001"
echo "📚 API 문서: http://localhost:3001/api"
echo ""
echo "종료하려면 Ctrl+C를 누르세요."

# Ctrl+C 처리
trap 'echo ""; echo "🛑 서버를 종료합니다..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT

# 프로세스가 종료될 때까지 대기
wait 