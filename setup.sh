#!/bin/bash

echo "🔧 Promotion Manager 초기 설정"

# 스크립트 실행 권한 부여
chmod +x start.sh
chmod +x setup.sh

# 환경 변수 파일 생성
echo "📝 환경 변수 파일 생성..."

if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "✅ backend/.env 파일이 생성되었습니다."
else
    echo "⚠️  backend/.env 파일이 이미 존재합니다."
fi

# 프론트엔드 환경 변수 파일 생성
if [ ! -f "frontend/.env.local" ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > frontend/.env.local
    echo "✅ frontend/.env.local 파일이 생성되었습니다."
else
    echo "⚠️  frontend/.env.local 파일이 이미 존재합니다."
fi

# 의존성 설치
echo "📦 패키지 설치 중..."

echo "🔧 백엔드 패키지 설치..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ 백엔드 패키지 설치 완료"
else
    echo "❌ 백엔드 패키지 설치 실패"
    exit 1
fi
cd ..

echo "🎨 프론트엔드 패키지 설치..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ 프론트엔드 패키지 설치 완료"
else
    echo "❌ 프론트엔드 패키지 설치 실패"
    exit 1
fi
cd ..

echo ""
echo "✅ 초기 설정이 완료되었습니다!"
echo ""
echo "📝 다음 단계:"
echo "1. MongoDB를 설치하고 실행하세요:"
echo "   - macOS: brew install mongodb-community && brew services start mongodb-community"
echo "   - Ubuntu: sudo apt install mongodb && sudo systemctl start mongodb"
echo "   - Windows: MongoDB 공식 사이트에서 다운로드"
echo ""
echo "2. backend/.env 파일을 열어 필요한 설정을 변경하세요:"
echo "   - MongoDB 연결 정보 (기본값: mongodb://localhost:27017/promotion-manager)"
echo "   - AWS S3 설정 (선택사항, 로컬 저장소 사용 시 생략 가능)"
echo ""
echo "3. ./start.sh를 실행하여 개발 서버를 시작하세요"
echo ""
echo "🔗 접속 주소:"
echo "   프론트엔드: http://localhost:3000"
echo "   백엔드 API: http://localhost:3001"
echo "   API 문서: http://localhost:3001/api" 