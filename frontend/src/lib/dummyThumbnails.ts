/**
 * Real YouTube Video Thumbnails served directly from YouTube's official image CDN (i.ytimg.com).
 * Used whenever a user hasn't uploaded a custom thumbnail yet (for primary or other videos/shorts/posts).
 */

export function extractYouTubeVideoId(input: string): string | null {
  const cleaned = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) {
    return cleaned;
  }
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|i\.ytimg\.com\/vi\/)([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function getYouTubeThumbnailUrl(
  videoIdOrUrl: string,
  quality: "maxresdefault" | "hqdefault" | "sddefault" = "maxresdefault"
): string {
  const trimmed = videoIdOrUrl.trim();
  const extractedId = extractYouTubeVideoId(trimmed) || trimmed;
  return `https://i.ytimg.com/vi/${extractedId}/${quality}.jpg`;
}

export interface RealYouTubeVideoPreset {
  videoId: string;
  title: string;
  channel: string;
  views: string;
  time: string;
  duration: string;
  category: string;
  thumbUrl: string;
}

export const REAL_YOUTUBE_VIDEO_POOL: RealYouTubeVideoPreset[] = [
  {
    videoId: "Zq5fmkH0T78",
    title: "Next.js 15 Crash Course | Build and Deploy a Production-Ready Full Stack App",
    channel: "JavaScript Mastery",
    views: "642K views",
    time: "2 weeks ago",
    duration: "3:14:42",
    category: "Technology",
    thumbUrl: "https://i.ytimg.com/vi/Zq5fmkH0T78/maxresdefault.jpg",
  },
  {
    videoId: "Tn6-PIqc4UM",
    title: "React in 100 Seconds",
    channel: "Fireship",
    views: "1.4M views",
    time: "3 days ago",
    duration: "2:08",
    category: "AI",
    thumbUrl: "https://i.ytimg.com/vi/Tn6-PIqc4UM/maxresdefault.jpg",
  },
  {
    videoId: "Mus_vwhTCq0",
    title: "JavaScript Pro Tips - Code This, NOT That",
    channel: "Fireship",
    views: "2.3M views",
    time: "1 week ago",
    duration: "12:19",
    category: "Design",
    thumbUrl: "https://i.ytimg.com/vi/Mus_vwhTCq0/maxresdefault.jpg",
  },
  {
    videoId: "W6NZfCO5SIk",
    title: "JavaScript Course for Beginners – Your First Step to Web Development",
    channel: "Programming with Mosh",
    views: "12M views",
    time: "2 months ago",
    duration: "48:17",
    category: "Marketing",
    thumbUrl: "https://i.ytimg.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
  },
  {
    videoId: "SqcY0GlETPk",
    title: "React Tutorial for Beginners - Full Modern Frontend Masterclass",
    channel: "Programming with Mosh",
    views: "4.1M views",
    time: "3 weeks ago",
    duration: "1:20:04",
    category: "Design",
    thumbUrl: "https://i.ytimg.com/vi/SqcY0GlETPk/maxresdefault.jpg",
  },
  {
    videoId: "wm5gMKuwSYk",
    title: "Next.js Full Course | Build and Deploy a Full Stack SaaS App",
    channel: "JavaScript Mastery",
    views: "1.1M views",
    time: "1 month ago",
    duration: "4:18:10",
    category: "AI",
    thumbUrl: "https://i.ytimg.com/vi/wm5gMKuwSYk/maxresdefault.jpg",
  },
  {
    videoId: "aircAruvnKk",
    title: "But what is a neural network? | Deep learning chapter 1",
    channel: "3Blue1Brown",
    views: "16M views",
    time: "4 months ago",
    duration: "19:13",
    category: "AI",
    thumbUrl: "https://i.ytimg.com/vi/aircAruvnKk/maxresdefault.jpg",
  },
  {
    videoId: "DHvZLI7Db8E",
    title: "JavaScript Promises In 10 Minutes - Clean Async Architecture",
    channel: "Web Dev Simplified",
    views: "1.9M views",
    time: "2 weeks ago",
    duration: "11:32",
    category: "Technology",
    thumbUrl: "https://i.ytimg.com/vi/DHvZLI7Db8E/maxresdefault.jpg",
  },
  {
    videoId: "bMknfKXIFA8",
    title: "React Course - Beginner's Tutorial for React JavaScript Library",
    channel: "freeCodeCamp.org",
    views: "3.7M views",
    time: "1 month ago",
    duration: "11:55:27",
    category: "Technology",
    thumbUrl: "https://i.ytimg.com/vi/bMknfKXIFA8/maxresdefault.jpg",
  },
  {
    videoId: "zJSY8tbf_ys",
    title: "Frontend Web Development Bootcamp Course (JavaScript, HTML, CSS)",
    channel: "freeCodeCamp.org",
    views: "2.8M views",
    time: "2 months ago",
    duration: "21:14:41",
    category: "Design",
    thumbUrl: "https://i.ytimg.com/vi/zJSY8tbf_ys/maxresdefault.jpg",
  },
  {
    videoId: "G3e-cpL7ofc",
    title: "HTML & CSS Full Course - Beginner to Pro UI Engineering",
    channel: "SuperSimpleDev",
    views: "9.4M views",
    time: "3 months ago",
    duration: "6:31:24",
    category: "Design",
    thumbUrl: "https://i.ytimg.com/vi/G3e-cpL7ofc/maxresdefault.jpg",
  },
  {
    videoId: "1Rs2ND1ryYc",
    title: "CSS Tutorial - Zero to Hero (Complete Visual Design Course)",
    channel: "freeCodeCamp.org",
    views: "4.5M views",
    time: "5 months ago",
    duration: "6:18:37",
    category: "Design",
    thumbUrl: "https://i.ytimg.com/vi/1Rs2ND1ryYc/maxresdefault.jpg",
  },
  {
    videoId: "Ke90Tje7VS0",
    title: "React JS - React Tutorial for Beginners",
    channel: "Programming with Mosh",
    views: "6.2M views",
    time: "4 months ago",
    duration: "2:25:26",
    category: "Technology",
    thumbUrl: "https://i.ytimg.com/vi/Ke90Tje7VS0/maxresdefault.jpg",
  },
  {
    videoId: "arj7oStGLkU",
    title: "Inside the Mind of a Master Procrastinator | Tim Urban | TED",
    channel: "TED",
    views: "42M views",
    time: "6 months ago",
    duration: "14:04",
    category: "Podcasts",
    thumbUrl: "https://i.ytimg.com/vi/arj7oStGLkU/maxresdefault.jpg",
  },
  {
    videoId: "8jPQjjsBbIc",
    title: "How to stay calm when you know you'll be stressed | Daniel Levitin | TED",
    channel: "TED",
    views: "15M views",
    time: "5 months ago",
    duration: "12:20",
    category: "Podcasts",
    thumbUrl: "https://i.ytimg.com/vi/8jPQjjsBbIc/maxresdefault.jpg",
  },
  {
    videoId: "PkZNo7MFNFg",
    title: "Learn JavaScript - Full Course for Beginners",
    channel: "freeCodeCamp.org",
    views: "17M views",
    time: "3 months ago",
    duration: "3:26:42",
    category: "Technology",
    thumbUrl: "https://i.ytimg.com/vi/PkZNo7MFNFg/maxresdefault.jpg",
  },
  {
    videoId: "rfscVS0vtbw",
    title: "Learn Python - Full Course for Beginners [Tutorial]",
    channel: "freeCodeCamp.org",
    views: "45M views",
    time: "8 months ago",
    duration: "4:26:52",
    category: "AI",
    thumbUrl: "https://i.ytimg.com/vi/rfscVS0vtbw/maxresdefault.jpg",
  },
  {
    videoId: "0fYi8SGA20k",
    title: "Build and Deploy an Amazing 3D Web Developer Portfolio in React JS | Three.js Tutorial",
    channel: "JavaScript Mastery",
    views: "1.8M views",
    time: "5 days ago",
    duration: "2:53:18",
    category: "Design",
    thumbUrl: "https://i.ytimg.com/vi/0fYi8SGA20k/maxresdefault.jpg",
  },
];

export const DUMMY_THUMBNAILS = {
  // Primary fallback when user hasn't uploaded their own thumbnail yet (real YouTube 1280x720 thumbnail)
  userPrimary16x9: "https://i.ytimg.com/vi/0fYi8SGA20k/maxresdefault.jpg",

  // Home feed competitor videos (real YouTube 1280x720 thumbnails)
  comp1: "https://i.ytimg.com/vi/Zq5fmkH0T78/maxresdefault.jpg",
  comp2: "https://i.ytimg.com/vi/Tn6-PIqc4UM/maxresdefault.jpg",
  comp3: "https://i.ytimg.com/vi/Mus_vwhTCq0/maxresdefault.jpg",
  comp4: "https://i.ytimg.com/vi/W6NZfCO5SIk/maxresdefault.jpg",
  comp5: "https://i.ytimg.com/vi/SqcY0GlETPk/maxresdefault.jpg",

  // Search feed competitor videos (real YouTube 1280x720 thumbnails)
  searchComp1: "https://i.ytimg.com/vi/wm5gMKuwSYk/maxresdefault.jpg",
  searchComp2: "https://i.ytimg.com/vi/aircAruvnKk/maxresdefault.jpg",
  searchComp3: "https://i.ytimg.com/vi/DHvZLI7Db8E/maxresdefault.jpg",

  // Channel videos tab (real YouTube 1280x720 thumbnails)
  chanVid2: "https://i.ytimg.com/vi/bMknfKXIFA8/maxresdefault.jpg",
  chanVid3: "https://i.ytimg.com/vi/zJSY8tbf_ys/maxresdefault.jpg",
  chanVid4: "https://i.ytimg.com/vi/G3e-cpL7ofc/maxresdefault.jpg",

  // Shorts / Vertical thumbnails (real YouTube thumbnails)
  shortPrimary: "https://i.ytimg.com/vi/Tn6-PIqc4UM/maxresdefault.jpg",
  short2: "https://i.ytimg.com/vi/Mus_vwhTCq0/maxresdefault.jpg",
  short3: "https://i.ytimg.com/vi/1Rs2ND1ryYc/maxresdefault.jpg",
  short4: "https://i.ytimg.com/vi/Ke90Tje7VS0/maxresdefault.jpg",
  short5: "https://i.ytimg.com/vi/arj7oStGLkU/maxresdefault.jpg",
  short6: "https://i.ytimg.com/vi/8jPQjjsBbIc/maxresdefault.jpg",
};
