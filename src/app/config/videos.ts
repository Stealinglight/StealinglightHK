// CloudFront CDN base URL for video assets
export const CDN_BASE_URL = 'https://d2fc83sck42gx7.cloudfront.net';

// Video project data matching the Wix site portfolio
export const videoProjects = [
  {
    id: 1,
    title: 'BLNK Media Reel 2020',
    category: 'Company Reel',
    description: 'A showcase of recent production work from BLNK Media',
    duration: '2:15',
    videoUrl: `${CDN_BASE_URL}/Reels/Company/BLNK_2020-Reel.mp4`,
    featured: true,
  },
  {
    id: 2,
    title: 'Mario Botta: The Space Beyond',
    category: 'Documentary',
    description: 'Official trailer for the architectural documentary exploring the work of Swiss architect Mario Botta',
    duration: '2:55',
    videoUrl: `${CDN_BASE_URL}/Documentaries/Mario%20Botta.%20The%20Space%20Beyond.%20Official%20Trailer%20(English.mp4`,
  },
  {
    id: 3,
    title: 'BOSCH TVC - Directors Cut',
    category: 'Commercial',
    description: 'Automotive commercial directed by Olivier Hero Dressen, camera operation by Chris McMillon',
    duration: '1:01',
    videoUrl: `${CDN_BASE_URL}/Commercials/Automotive/BOSCH_DirectorsCut_VIMEO2K.mp4`,
  },
  {
    id: 4,
    title: 'The Millennial Gentleman',
    category: 'Short Film',
    description: 'A House of X production with Chris McMillon as Director of Photography',
    duration: '1:34',
    videoUrl: `${CDN_BASE_URL}/Short_Films/Narrative/THE%20MILLENNIAL%20GENTLEMAN.mp4`,
  },
  {
    id: 5,
    title: 'The Fighter',
    category: 'Documentary',
    description: 'A narrative documentary following boxer Thun Visuttirattanaporn, shot in Thailand',
    duration: '5:32',
    videoUrl: `${CDN_BASE_URL}/Documentaries/Team%2018%20-%20The%20Fighter_Web.mp4`,
  },
  {
    id: 6,
    title: 'Shanghai SpinExpo',
    category: 'Event',
    description: 'Promotional video coverage of the Shanghai SpinExpo trade show',
    duration: '2:10',
    videoUrl: `${CDN_BASE_URL}/Events/Shanghai%20SpinExpo.mp4`,
  },
  {
    id: 7,
    title: 'Coach Pre Fall 2019',
    category: 'Fashion',
    description: 'Coach Lights Up Shanghai - Pre Fall 2019 collection event coverage',
    duration: '1:30',
    videoUrl: `${CDN_BASE_URL}/Commercials/Fashion/Coach%20Lights%20Up%20Shanghai%20%7C%20Pre%20Fall%202019.mp4`,
  },
  {
    id: 8,
    title: 'Phorm x Wancaoyi Fall 2018',
    category: 'Fashion',
    description: '30-second teaser for Phorm and Wancaoyi Fall 2018 collections, shot in Hangzhou',
    duration: '0:30',
    videoUrl: `${CDN_BASE_URL}/Commercials/Fashion/30_Second_new_new.mp4`,
  },
  {
    id: 9,
    title: 'China Citic Bank',
    category: 'Commercial',
    description: 'Commercial advertisement for China Citic Bank',
    duration: '1:31',
    videoUrl: `${CDN_BASE_URL}/Commercials/Financial/China%20Citic%20Bank%20Commercial.mp4`,
  },
] as const;

// Hero background video
export const heroVideo = {
  src: `${CDN_BASE_URL}/Reels/Company/BLNK_2020-Reel.mp4`,
};

// Get featured video for the portfolio section
export const featuredVideo = videoProjects.find((v) => v.featured) ?? videoProjects[0];

// Get non-featured videos for the grid
export const gridVideos = videoProjects.filter((v) => !v.featured);
