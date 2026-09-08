import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    // GitHub Actions supplies the actual Pages origin at build time.
    url: process.env.SITE_URL || "http://localhost:4321/",
    title: "yyjun.dev",
    description: "배운 것을 기록하고, 경험을 나누는 기술 블로그.",
    author: "블로그 작성자",
    lang: "ko",
    timezone: "Asia/Seoul",
    dir: "ltr",
  },
  posts: { perPage: 8, perIndex: 4, scheduledPostMargin: 0 },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    {
      name: "github",
      url: "https://github.com/Yun-YeoJun",
      linkTitle: "윤여준의 GitHub 프로필",
    },
    {
      name: "linkedin",
      url: "https://www.linkedin.com/in/%EC%97%AC%EC%A4%80-%EC%9C%A4-21784b230/",
      linkTitle: "윤여준의 LinkedIn 프로필",
    },
  ],
  shareLinks: [],
});
