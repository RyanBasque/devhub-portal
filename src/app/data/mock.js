export const MOCK_USERS = [
  {
    id: 1,
    username: "sarah_dev",
    displayName: "Sarah Chen",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    bio: "Frontend engineer • React & Three.js enthusiast • Building cool stuff",
    github: "sarahchen",
    followers: 1284,
    following: 342,
  },
  {
    id: 2,
    username: "alex_codes",
    displayName: "Alex Rivera",
    avatar: "https://i.pravatar.cc/150?u=alex",
    bio: "Full-stack dev • Open source contributor • Rustacean",
    github: "arivera",
    followers: 892,
    following: 156,
  },
  {
    id: 3,
    username: "mike_builds",
    displayName: "Mike Johnson",
    avatar: "https://i.pravatar.cc/150?u=mike",
    bio: "DevOps engineer • Kubernetes wizard • Cloud native",
    github: "mikej",
    followers: 567,
    following: 89,
  },
  {
    id: 4,
    username: "lisa_designs",
    displayName: "Lisa Park",
    avatar: "https://i.pravatar.cc/150?u=lisa",
    bio: "UI/UX designer who codes • CSS artist • Accessibility advocate",
    github: "lisapark",
    followers: 2103,
    following: 445,
  },
];

export const INITIAL_POSTS = [
  {
    id: 1,
    user: MOCK_USERS[0],
    content: "Just shipped a new CLI tool for scaffolding React components with TypeScript support!",
    images: ["https://picsum.photos/seed/cli-tool/800/600"],
    link: "https://github.com/sarahchen/react-scaffold-cli",
    timestamp: "2h ago",
    likes: 42,
    comments: 7,
    likedByMe: false,
  },
  {
    id: 2,
    user: MOCK_USERS[1],
    content: "Finally migrated our entire backend from Node.js to Rust. The performance gains are insane!",
    images: [
      "https://picsum.photos/seed/rust-migration/800/600",
      "https://picsum.photos/seed/rust-code/800/600",
      "https://picsum.photos/seed/rust-performance/800/600",
    ],
    link: null,
    timestamp: "5h ago",
    likes: 128,
    comments: 23,
    likedByMe: false,
  },
  {
    id: 3,
    user: MOCK_USERS[3],
    content: "Created this pure CSS art piece inspired by cyberpunk aesthetics. CSS is truly powerful!",
    images: [
      "https://picsum.photos/seed/css-art-1/800/600",
      "https://picsum.photos/seed/css-art-2/800/600",
      "https://picsum.photos/seed/css-art-3/800/600",
      "https://picsum.photos/seed/css-art-4/800/600",
    ],
    link: "https://codepen.io/lisapark/pen/css-cyberpunk",
    timestamp: "8h ago",
    likes: 256,
    comments: 31,
    likedByMe: false,
  },
  {
    id: 4,
    user: MOCK_USERS[2],
    content: "New blog post: Scaling Microservices with Event-Driven Architecture.",
    images: [],
    link: "https://mikej.dev/blog/event-driven-microservices",
    timestamp: "1d ago",
    likes: 89,
    comments: 15,
    likedByMe: false,
  },
  {
    id: 5,
    user: MOCK_USERS[0],
    content: "Working on a new design system for our company. Here are some screenshots!",
    images: [
      "https://picsum.photos/seed/design-system-1/800/600",
      "https://picsum.photos/seed/design-system-2/800/600",
    ],
    link: null,
    timestamp: "3h ago",
    likes: 67,
    comments: 12,
    likedByMe: false,
  },
];

export const CURRENT_USER = { ...MOCK_USERS[0], id: 999 };

const fakeApiDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchPosts() {
  await fakeApiDelay(600);
  return [...INITIAL_POSTS];
}

export async function createPost(postData) {
  await fakeApiDelay(1000);
  return {
    id: Date.now(),
    user: CURRENT_USER,
    content: postData.content,
    images: postData.images || [],
    link: postData.link || null,
    timestamp: "Just now",
    likes: 0,
    comments: 0,
    likedByMe: false,
  };
}

export async function uploadImage(file) {
  await fakeApiDelay(1500);
  return URL.createObjectURL(file);
}

export async function toggleLikePost(postId, currentLiked) {
  await fakeApiDelay(300);
  return { liked: !currentLiked };
}
