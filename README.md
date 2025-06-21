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