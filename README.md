# 📁 Promotion Manager

<div align="center">

![Promotion Manager Logo](https://img.shields.io/badge/Promotion-Manager-blue?style=for-the-badge&logo=files&logoColor=white)

**홍보 자료 통합 관리 시스템**

이 프로젝트는 마케팅/홍보 자료들을 체계적으로 관리할 수 있는 풀스택 웹 애플리케이션입니다.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

</div>

---

## 🚀 기술 스택

<table>
<tr>
<td align="center" width="50%">

### 🔧 Backend
- **NestJS** - Node.js 프레임워크
- **MongoDB** - NoSQL 데이터베이스
- **Mongoose** - MongoDB ODM
- **AWS S3/R2** - 파일 스토리지
- **Swagger** - API 문서화

</td>
<td align="center" width="50%">

### 🎨 Frontend
- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 스타일링
- **React Query** - 상태 관리
- **Tabler Icons** - 아이콘

</td>
</tr>
</table>

---

## ✨ 주요 기능

### 📂 파일 관리
- **폴더 구조 관리**: 계층적 폴더 구조로 파일을 체계적으로 정리
- **파일 업로드**: PDF, PPT, Word, Excel, 이미지 파일 지원 (최대 5개 동시 업로드)
- **파일 검색**: 파일명 기반 실시간 검색 기능
- **파일 다운로드**: 개별 파일 다운로드 및 폴더 전체 압축 다운로드
- **파일 관리**: 복사, 이동, 삭제, 이름 변경 등 기본적인 파일 관리 기능

### 🌐 사이트 바로가기
- **바로가기 등록**: 자주 사용하는 웹사이트 바로가기 등록
- **바로가기 관리**: 사이트 정보 수정, 삭제
- **홈페이지 표시**: 메인 페이지에서 등록된 사이트들을 카드 형태로 표시

### 🔧 기타 기능
- **최근 문서**: 최근 업로드된 파일 4개를 메인 페이지에 표시
- **권한 관리**: 허용된 사용자만 접근할 수 있는 권한 시스템
- **반응형 디자인**: 데스크톱, 태블릿, 모바일 모든 기기에서 사용 가능

---

## 📁 프로젝트 구조

```
promotion-manager/
├── 🔧 backend/                    # NestJS 백엔드 애플리케이션
│   ├── src/
│   │   ├── api/
│   │   │   ├── promotion-management/   # 홍보 관리 API
│   │   │   │   ├── dto/               # 데이터 전송 객체
│   │   │   │   ├── promotion-management.controller.ts
│   │   │   │   ├── promotion-management.service.ts
│   │   │   │   ├── promotion-management.repository.ts
│   │   │   │   └── promotion-management.module.ts
│   │   │   └── storage/               # 파일 저장소 서비스
│   │   ├── db/
│   │   │   └── schema/                # MongoDB 스키마
│   │   ├── main.ts                    # 애플리케이션 진입점
│   │   └── app.module.ts              # 루트 모듈
│   ├── package.json
│   └── env.example                    # 환경 변수 예시
├── 🎨 frontend/                   # Next.js 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # 메인 페이지
│   │   │   ├── files/
│   │   │   │   └── page.tsx          # 파일 관리 페이지
│   │   │   ├── layout.tsx            # 레이아웃 컴포넌트
│   │   │   └── globals.css           # 전역 스타일
│   │   ├── interfaces/               # TypeScript 인터페이스
│   │   └── libs/                     # 유틸리티 라이브러리
│   ├── package.json
│   └── next.config.js
├── 🚀 setup.sh                    # 초기 설정 스크립트
├── ▶️ start.sh                    # 개발 서버 시작 스크립트
└── 📖 README.md
```

---

## 🛠️ 설치 및 실행

### 1️⃣ 저장소 클론
```bash
git clone <저장소-주소>
cd promotion-manager
```

### 2️⃣ 초기 설정
```bash
chmod +x setup.sh
./setup.sh
```

> 💡 **이 스크립트는 다음 작업을 수행합니다:**
> - 환경 변수 파일 생성 (.env, .env.local)
> - 백엔드 및 프론트엔드 의존성 설치
> - 실행 권한 설정

### 3️⃣ 환경 변수 설정

<details>
<summary>📋 백엔드 설정 (backend/.env)</summary>

```bash
# 데이터베이스 설정
MONGODB_URI=mongodb://localhost:27017/promotion-manager

# 서버 설정
PORT=3001
NODE_ENV=development

# AWS S3 설정 (선택사항 - 로컬 저장소 사용 시 생략 가능)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-northeast-2
AWS_BUCKET_NAME=promotion-files

# 파일 업로드 제한
MAX_FILE_SIZE=10485760  # 10MB
```

</details>

<details>
<summary>📋 프론트엔드 설정 (frontend/.env.local)</summary>

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

</details>

### 4️⃣ MongoDB 설치 및 실행

<table>
<tr>
<td align="center" width="33%">

**🍎 macOS**
```bash
brew install mongodb-community
brew services start mongodb-community
```

</td>
<td align="center" width="33%">

**🐧 Ubuntu**
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
```

</td>
<td align="center" width="33%">

**🪟 Windows**
MongoDB 공식 웹사이트에서
설치 프로그램 다운로드

</td>
</tr>
</table>

### 5️⃣ 개발 서버 실행
```bash
./start.sh
```

**또는 수동으로 실행:**

```bash
# 백엔드 실행
cd backend
npm run start:dev

# 새 터미널에서 프론트엔드 실행
cd frontend
npm run dev
```

### 6️⃣ 접속 확인
<div align="center">

| 서비스 | URL | 설명 |
|--------|-----|------|
| 🌐 **프론트엔드** | http://localhost:3000 | 메인 웹 애플리케이션 |
| 🔧 **백엔드 API** | http://localhost:3001 | REST API 서버 |
| 📚 **API 문서** | http://localhost:3001/api | Swagger UI |

</div>

---

## 💡 사용법

### 📤 파일 업로드
1. 메인 페이지 하단의 **"파일 관리하기"** 버튼 클릭
2. 파일 관리 페이지에서 **"파일 업로드"** 버튼 클릭
3. 업로드할 파일 선택 (최대 5개)
4. 업로드 완료 후 목록에서 확인

### 📁 폴더 생성
1. 파일 관리 페이지에서 **"새 폴더"** 버튼 클릭
2. 폴더 이름 입력
3. 생성된 폴더를 목록에서 확인

### 🔗 바로가기 사이트 등록
1. 메인 페이지의 **"홈페이지 바로가기"** 섹션에서 관리
2. 사이트 정보 입력 (이름, 설명, URL)
3. 등록된 사이트는 카드 형태로 표시

### 🔍 파일 검색
1. 메인 페이지 상단의 검색창에 키워드 입력
2. 엔터키 또는 검색 버튼 클릭
3. 검색 결과가 바로 아래에 표시

---

## 📚 API 문서

> 🔗 **서버 실행 후 http://localhost:3001/api 에서 Swagger UI를 통해 전체 API 문서를 확인할 수 있습니다.**

### 🌐 주요 API 엔드포인트

<details>
<summary>🔗 사이트 관리 API</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/promotion-management/site` | 사이트 목록 조회 |
| `POST` | `/promotion-management/site` | 새 사이트 등록 |
| `PATCH` | `/promotion-management/site/:id` | 사이트 정보 수정 |
| `DELETE` | `/promotion-management/site/:id` | 사이트 삭제 |

</details>

<details>
<summary>📁 파일/폴더 관리 API</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/promotion-management/node` | 전체 파일/폴더 목록 조회 |
| `GET` | `/promotion-management/node/:id` | 특정 파일/폴더 조회 |
| `POST` | `/promotion-management/node/directory` | 새 폴더 생성 |
| `POST` | `/promotion-management/node/file` | 파일 업로드 |
| `PATCH` | `/promotion-management/node/:id` | 파일/폴더 이름 수정 |
| `DELETE` | `/promotion-management/node/:id` | 파일/폴더 삭제 |
| `GET` | `/promotion-management/node/search` | 파일 검색 |
| `POST` | `/promotion-management/node/copy/:id` | 파일/폴더 복사 |

</details>

---

## 🆘 문제 해결

<details>
<summary>❌ MongoDB 연결 오류</summary>

**오류 메시지:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**💡 해결방법:** 
MongoDB가 실행되지 않은 상태입니다. MongoDB를 먼저 실행해주세요.

</details>

<details>
<summary>❌ 파일 업로드 실패</summary>

**확인 사항:**
- 지원하지 않는 파일 형식인지 확인
- 파일 크기가 10MB를 초과하는지 확인
- AWS S3 설정이 올바른지 확인 (클라우드 저장소 사용 시)

</details>

<details>
<summary>❌ 환경 변수 오류</summary>

**확인 사항:**
- `.env` 파일이 올바른 위치에 있는지 확인
- 환경 변수 이름과 값이 정확한지 확인

</details>

<details>
<summary>❌ 포트 충돌</summary>

**오류 메시지:**
```
Error: listen EADDRINUSE :::3000
```

**💡 해결방법:** 
다른 애플리케이션이 해당 포트를 사용 중입니다. 다른 포트를 사용하거나 실행 중인 애플리케이션을 종료하세요.

</details>

---

## 🔧 개발 참고사항

### 💾 파일 저장소 설정
시스템은 두 가지 저장소를 지원합니다:

| 저장소 유형 | 설명 | 설정 필요 여부 |
|-------------|------|----------------|
| 🏠 **로컬 저장소** | 서버 로컬에 파일 저장 | ❌ 별도 설정 불필요 |
| ☁️ **클라우드 저장소** | AWS S3 또는 Cloudflare R2 사용 | ✅ AWS 설정 필요 |

### 🗄️ 데이터베이스 스키마
- **PromotionNodes**: 파일 및 폴더 정보
- **PromotionSites**: 바로가기 사이트 정보  
- **PromotionAuth**: 권한 사용자 정보

### 🚀 확장 가능한 구조
- 새로운 파일 형식 지원은 `promotion-management.controller.ts`의 fileFilter에서 설정
- 추가 기능은 각 모듈별로 분리되어 있어 확장이 용이
- API 버전 관리를 위한 구조 준비

---