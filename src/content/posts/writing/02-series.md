---
title: "시리즈로 글 묶기"
description: "시리즈 식별자와 회차를 지정해 연재 순서를 관리합니다."
pubDatetime: 2026-01-03T09:00:00+09:00
tags:
  - 블로그
series: writing-guide
seriesOrder: 2
draft: false
---

여러 글이 하나의 주제를 이어 간다면 시리즈로 묶을 수 있습니다.
글의 작성 날짜와 읽는 순서가 달라도 회차 기준으로 연결됩니다.

## 시리즈 지정하기

글 상단의 메타데이터에 다음 두 항목을 추가합니다.

```yaml
series: writing-guide
seriesOrder: 2
```

시리즈 이름과 소개는 보관함의 `series/writing-guide.md`에서 관리합니다.
각 회차에는 같은 식별자와 서로 다른 양의 정수 회차를 사용합니다.

## 글 공개하기

작성이 끝나면 `draft: false`로 바꾸고 GitHub에 푸시합니다.
빌드가 성공하면 공개된 글만 시리즈 목차와 이전·다음 회차 링크에 반영됩니다.

기본 문법은 [첫 번째 글](01-markdown.md#코드-남기기)에서 다시 볼 수 있습니다.
