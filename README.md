# yyjun.dev

AstroPaper 기반 기술 블로그입니다. 옵시디언에서 표준 Markdown으로 작성하고 GitHub의 `main` 브랜치에 푸시하면 GitHub Actions가 검사·빌드한 뒤 GitHub Pages에 배포합니다.

## 로컬에서 실행

Node.js 24와 npm을 사용합니다.

```sh
npm ci
npm run dev
```

브라우저에서 `http://localhost:4321`을 엽니다. 검색은 빌드된 색인을 사용하므로 처음에는 아래 명령을 실행하세요.

```sh
npm run build
npm run preview
```

`npm test`는 시리즈 정렬·초안 제외·유효성 검사·Markdown 링크 변환을 검사합니다. `npm run lint`는 소스 검사를 수행합니다. `npm run build`는 타입 검사, 정적 페이지 생성, 검색 색인 생성과 내부 링크·이미지·제목 앵커 검사를 수행합니다.

## 옵시디언에서 글 작성

옵시디언의 **폴더를 보관함으로 열기**에서 이 프로젝트의 **`src/content`**를 선택합니다. 글뿐 아니라 시리즈 소개도 함께 편집할 수 있습니다.

```text
src/content/
├── .obsidian/       공유 작성 설정
├── _templates/     일반 글·시리즈 글·시리즈 소개 템플릿
├── posts/          블로그 글과 첨부 이미지
├── series/         시리즈별 소개 Markdown
└── pages/about.md  소개 페이지
```

보관함 설정은 새 노트를 `posts/`에 만들고, 위키링크 사용을 끄고, 상대 경로 Markdown 링크를 만들도록 되어 있습니다. 이미지는 현재 글 옆의 `_assets/`에 저장합니다. 옵시디언 명령 팔레트의 **템플릿 삽입**으로 `_templates/post` 또는 `_templates/series-post`를 선택하세요. 템플릿은 옵시디언 기본 Templates 기능으로 날짜와 시간을 채웁니다.

```yaml
---
title: "쿠버네티스 시작하기"
description: "클러스터의 기본 구조를 살펴봅니다."
pubDatetime: 2026-09-07T09:00:00+09:00
tags:
  - kubernetes
draft: true
---
```

- 글 본문은 `.md` 파일로 작성합니다. MDX·위키링크·노트 임베드·옵시디언 전용 콜아웃은 사용하지 않습니다.
- 링크는 `[다음 글](02-next.md)`, 이미지는 `![설명](_assets/example.png)`처럼 작성합니다. 글 링크는 빌드할 때 발행 주소로 바뀌며 `#제목` 앵커도 유지됩니다.
- 파일명과 공개 폴더명은 `kubernetes-basics.md`처럼 영문 소문자와 하이픈을 추천합니다. **글 주소는 파일 경로에서 만들어지므로 공개 후 파일명·폴더를 바꾸지 마세요.** `title`만 바꾸면 주소는 유지됩니다.
- 글 제목은 메타데이터에 적고 본문은 `#`부터 시작합니다. 본문의 `#`은 `<h2>`, `##`는 `<h3>`처럼 한 단계 내려서 표시하며, `#####`와 `######`는 모두 `<h6>`으로 표시합니다. `# 목차`를 넣으면 본문 제목 목록을 생성합니다.
- 본문 수정 시 `modDatetime: 2026-09-08T09:00:00+09:00`을 추가할 수 있습니다.
- 글을 공개하려면 `draft: false`로 바꾸고 작성일을 확인한 뒤 푸시합니다. 초안과 미래 날짜 글은 페이지·시리즈·RSS·검색에 포함되지 않습니다. **작성일에 자동 빌드되는 예약 작업은 없으며 다음 푸시 또는 수동 배포 때 반영됩니다.**
- 공개 글에서 초안이나 존재하지 않는 글로 향하는 링크는 빌드를 실패시킵니다. 초안끼리는 아직 작성 중인 글을 연결할 수 있습니다.

`draft`는 사이트 게시 여부입니다. **공개 GitHub 저장소에 푸시한 초안 파일은 저장소에서 읽을 수 있습니다.** 개인 노트는 다른 보관함에 두세요.

## 시리즈 연재

먼저 `series/kubernetes-basics.md`를 만듭니다. 파일명은 시리즈 식별자이며 영문 소문자·숫자·하이픈을 사용합니다.

```markdown
---
title: "쿠버네티스 기초"
description: "클러스터 구성부터 애플리케이션 배포까지 배웁니다."
---

컨테이너 기초 지식이 있는 개발자를 위한 연재입니다.
```

각 글에는 다음 두 필드를 **함께** 추가합니다.

```yaml
series: kubernetes-basics
seriesOrder: 1
```

`seriesOrder`는 1 이상의 정수이며 같은 시리즈에서 중복될 수 없습니다. 초안의 회차도 중복 검사를 받습니다. 발행 날짜와 관계없이 이 숫자로 정렬합니다. 일반 글은 두 필드를 모두 생략합니다.

- `/series/`: 공개된 회차가 있는 시리즈와 글 수
- `/series/kubernetes-basics/`: 소개와 공개 회차 목차
- 연재 글: 현재 회차 표시, 전체 목차, 이전·다음 공개 회차 링크

공개된 회차가 없는 시리즈에는 아직 페이지가 생성되지 않습니다. 샘플 `writing-guide`에는 공개 글 2편과 초안 1편이 들어 있습니다. 샘플을 지울 때는 관련 시리즈 소개와 `start-here.md`의 링크도 함께 정리하세요.

## 블로그 이름과 프로필

`astro-paper.config.ts`에서 `site.title`, `site.description`, `site.author`를 바꿉니다. 현재 이름은 **yyjun.dev**, 작성자는 **블로그 작성자**입니다. GitHub 등 외부 링크는 `socials`에 넣고 자기소개는 `src/content/pages/about.md`에서 편집하세요.

한국어 UI, 서울 시간대, 다크 모드, 코드 강조·복사, RSS, 사이트맵, 검색을 제공합니다. OG 공유 이미지는 저장소에 포함된 나눔고딕 폰트로 빌드하므로 한글을 표시하며 외부 폰트 서버를 호출하지 않습니다. Pagefind는 한국어 검색을 지원하지만 조사·어미를 분석하는 형태소 검색은 제공하지 않습니다.

## GitHub Pages 최초 배포

1. GitHub에 저장소를 만들고 이 프로젝트의 소스를 올립니다. `package-lock.json`과 `.github/workflows/deploy.yml`도 포함해야 합니다. `node_modules/`, `dist/`, `.astro/`는 올리지 않습니다.
2. 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 선택합니다.
3. `main`에 푸시하거나 **Actions → Build and deploy blog → Run workflow**를 실행합니다.
4. 성공한 워크플로의 배포 주소로 접속합니다. 이후 글을 수정하고 `main`에 푸시할 때마다 자동 배포됩니다. PR에서는 검증만 실행합니다.

새로운 로컬 Git 저장소라면 다음과 같이 연결할 수 있습니다. 아래 주소를 본인의 실제 저장소 주소로 바꾸세요.

```sh
git init -b main
git add .
git commit -m "Set up AstroPaper blog"
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

워크플로가 GitHub Pages에서 `SITE_URL`과 `BASE_PATH`를 읽어 설정합니다. `USERNAME.github.io` 저장소의 루트 배포와 일반 저장소의 `/REPOSITORY/` 배포를 모두 지원합니다. 별도의 개인 액세스 토큰은 필요하지 않습니다. Pages를 활성화하기 전에 실행하면 설정 조회 단계에서 실패할 수 있습니다.

개인 도메인은 GitHub Pages의 **Custom domain**과 DNS를 먼저 설정한 뒤 다시 배포하세요. Pages가 알려주는 도메인이 사이트맵·RSS·공유 주소에 반영됩니다.

하위 경로 배포를 로컬에서 확인할 때는 macOS/Linux에서 다음과 같이 실행합니다.

```sh
SITE_URL=https://example.github.io BASE_PATH=/blog npm run build
BASE_PATH=/blog npm run preview
```

이 작업 환경에는 연결된 원격 저장소와 쓰기 가능한 Git 메타데이터가 없어 실제 커밋·푸시·원격 배포는 수행하지 않았습니다. 위 설정을 마친 후 첫 배포를 실행하세요.

## 기반 테마와 라이선스

- [AstroPaper](https://github.com/satnaing/astro-paper), v6.1.0 소스 커밋 `35cfa7fbe0b897306d27670d3819e55d5205f3dd` 기반. MIT 라이선스는 `LICENSE`에 보존했습니다.
- 나눔고딕 폰트: [Google Fonts](https://github.com/google/fonts/tree/main/ofl/nanumgothic), SIL Open Font License (`src/assets/fonts/OFL.txt`).
- [Astro GitHub Pages 배포 안내](https://docs.astro.build/en/guides/deploy/github/)
