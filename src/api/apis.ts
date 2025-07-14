//api/api.ts

/**
 Base URL
 **/

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const endpoints = {
  //auth
  register: process.env.NEXT_PUBLIC_REGISTER,
  refresh: process.env.NEXT_PUBLIC_REFRESH,
  changePassword: process.env.NEXT_PUBLIC_CHANGE_PASSWORD,
  codePassword: process.env.NEXT_PUBLIC_RESET_PASSWORD,
  verifyCode: process.env.NEXT_PUBLIC_VERIFY_CODE,
  logout: process.env.NEXT_PUBLIC_LOGOUT,
  login: process.env.NEXT_PUBLIC_LOGIN,

  //current user lgin
  updateProfile: process.env.NEXT_PUBLIC_UPDATE_PROFILE,
  currentUser: process.env.NEXT_PUBLIC_CURRENT_USER,

  //user
  users: process.env.NEXT_PUBLIC_USERS,
  blocked: process.env.NEXT_PUBLIC_BLOCKED,

  //queue
  queueApprove: process.env.NEXT_PUBLIC_QUEUE_BROWSE,
  activeUser: process.env.NEXT_PUBLIC_ACTIVE_USER,
  queues: process.env.NEXT_PUBLIC_QUEUES,

  //category(thể loại)
  category: process.env.NEXT_PUBLIC_CATEGORY,
  categories: process.env.NEXT_PUBLIC_CATEGORIES,

  //role
  roles: process.env.NEXT_PUBLIC_ROLES,
  roleAddUserToManager: process.env.NEXT_PUBLIC_ADD_MANAGER,
  blockUser: process.env.NEXT_PUBLIC_BLOCKED,

  //group
  groups: process.env.NEXT_PUBLIC_GROUPS,
  group: process.env.NEXT_PUBLIC_GROUP,
  groupMember: process.env.NEXT_PUBLIC_GROUP_MEMBER,
  groupRole: process.env.NEXT_PUBLIC_GROUP_ROLE,

  //Doc
  documents: process.env.NEXT_PUBLIC_DOCUMENTS,
  document: process.env.NEXT_PUBLIC_DOCUMENT,

  //News
  news: process.env.NEXT_PUBLIC_NEWS,
  new: process.env.NEXT_PUBLIC_NEW,

  //blog
  blogs: process.env.NEXT_PUBLIC_BLOGS,
  blog: process.env.NEXT_PUBLIC_BLOG,

  //event

  events: process.env.NEXT_PUBLIC_EVENTS,
  event: process.env.NEXT_PUBLIC_EVENT,
  eventForm: process.env.NEXT_PUBLIC_EVENT_FORM,
  eventRegister: process.env.NEXT_PUBLIC_EVENT_REGISTER,

  //mission

  missions: process.env.NEXT_PUBLIC_MISSIONS,
  mission: process.env.NEXT_PUBLIC_MISSION,

  //schedule

  schedules: process.env.NEXT_PUBLIC_SCHEDULES,
  schedule: process.env.NEXT_PUBLIC_SCHEDULE,

  //nha dong

  nhaDong: process.env.NEXT_PUBLIC_NHA_DONG,
  nhaDongDetail: process.env.NEXT_PUBLIC_NHA_DONG_DETAIL,

  // donation
  donations: process.env.NEXT_PUBLIC_DONATIONS,
  donation: process.env.NEXT_PUBLIC_DONATE,

  // chatAI

  chatHistory: process.env.NEXT_PUBLIC_CHAT_HISTORY,
  chat: process.env.NEXT_PUBLIC_CHAT,

  //statistical
  statistical: process.env.NEXT_PUBLIC_STATICAL,
  userStatistical: process.env.NEXT_PUBLIC_USER_STATICAL,
  //thu vien
  galery: process.env.NEXT_PUBLIC_GALERY,

  //thu dang sang lap
  messages: process.env.NEXT_PUBLIC_MESSAGES,
  message: process.env.NEXT_PUBLIC_MESSAGE,

  vocation: process.env.NEXT_PUBLIC_VOCATIONS,

  //video
  videos: process.env.NEXT_PUBLIC_VIDEOS,
  video: process.env.NEXT_PUBLIC_VIDEO,

  //banner
  banners: process.env.NEXT_PUBLIC_BANNERS,
  banner: process.env.NEXT_PUBLIC_BANNER,
};

export { baseURL, endpoints };
