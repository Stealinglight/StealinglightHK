// CloudFront CDN base URL for video assets (configurable via env var, fallback for local dev)
export const CDN_BASE_URL =
  import.meta.env.VITE_CDN_BASE_URL || 'https://dvah6thz8csbd.cloudfront.net';

interface VideoProject {
  id: number;
  title: string;
  category: string;
  description: string;
  duration: string;
  videoUrl: string;
  posterUrl: string;
  featured?: boolean;
  /** Withheld from the rendered grid (data kept). Flip to re-include. */
  hideFromGrid?: boolean;
  /**
   * Seconds into the video where hover-preview playback begins. Most of these films
   * open on black or a logo card, so previewing from 0 shows a void tile; this is a
   * vetted in-point. For every project except the featured reel it is the exact frame
   * the poster was pulled from, so poster and first preview frame match seamlessly.
   */
  previewStart?: number;
  /**
   * Additional stills from the same film. The grid is a mosaic of FRAMES, not of
   * projects: every tile opens this project's modal, and tiles share its metadata.
   */
  extraStills?: string[];
  /**
   * Suppress the hover-preview video. Set when the film carries burned-in subtitles or
   * supers: playback would put export text on a grid tile within seconds. The still and
   * the click-through modal are unaffected.
   */
  disableHoverPreview?: boolean;
}

// Video project data matching the Wix site portfolio
export const videoProjects: VideoProject[] = [
  {
    id: 1,
    title: 'BLNK Media (Shanghai) Reel',
    category: 'Company Reel',
    description: 'A showcase of recent production work from BLNK Media',
    duration: '2:15',
    videoUrl: `${CDN_BASE_URL}/Reels/Company/BLNK_2020-Reel.mp4`,
    // Largest tile on the page, so it carries the highest bar: t=16, the backlit car
    // interior -- hard low sun through the windscreen rimming a lit human, bounce filling
    // the face, deep falloff on the near side. Measured mean 96.0 / stddev 68.5 against
    // 165.6 / 47.8 for the flat reflection portrait it replaces.
    //
    // Two BLNK frames are off limits because the hero already owns them and a repeat
    // across sections reads as a near-duplicate: the eye-on-palm macro and the
    // yellow-silk portrait (t~17.8, itself a stronger portrait but spoken for).
    //
    // Exported with this shot's own letterbox crop (h=800 y=140) -- the reel is NOT
    // uniformly letterboxed, measured active heights run 680..1076 -- so the frame fills
    // the 16:9 tile with zero black band (verified 0px/0px on the live CDN bytes).
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/frames/01-blnk-featured-f.jpg`,
    previewStart: 16,
    featured: true,
  },
  {
    id: 2,
    title: 'Mario Botta: The Space Beyond',
    category: 'Documentary',
    description:
      'Official trailer for the architectural documentary exploring the work of Swiss architect Mario Botta',
    duration: '2:55',
    videoUrl: `${CDN_BASE_URL}/Documentaries/Mario%20Botta.%20The%20Space%20Beyond.%20Official%20Trailer%20(English.mp4`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/02-mario-botta.jpg`,
    previewStart: 131,
    disableHoverPreview: true,
    extraStills: [
      // v3. The interior-visitors frame was cut: a blind judge read it as a tourist
      // snapshot, and no measured stat outranks that read.
      `${CDN_BASE_URL}/thumbnails/v3/02-botta-vault.jpg`,
    ],
  },
  {
    id: 3,
    title: 'BOSCH TVC - Directors Cut',
    category: 'Commercial',
    description:
      'Washing machine commercial directed by Olivier Hero Dressen, camera operation by Chris McMillon for Douyin (TikTok)',
    duration: '1:01',
    videoUrl: `${CDN_BASE_URL}/Commercials/Automotive/BOSCH_DirectorsCut_VIMEO2K.mp4`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/03-bosch-b.jpg`,
    previewStart: 24,
  },
  {
    id: 4,
    title: 'The Millennial Gentleman',
    category: 'Film',
    description: 'A House of X production with Chris McMillon as Director of Photography',
    duration: '1:34',
    videoUrl: `${CDN_BASE_URL}/Short_Films/Narrative/THE%20MILLENNIAL%20GENTLEMAN.mp4`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/04-millennial-gentleman-b.jpg`,
    previewStart: 66,
    // Back as a frame contributor: the mined t=66 frame (silhouette against the pink
    // mural) was approved by the adversarial pool review.
    extraStills: [`${CDN_BASE_URL}/thumbnails/v3/04-gentleman-mural.jpg`],
  },
  {
    id: 5,
    title: 'The Fighter',
    category: 'Documentary',
    description:
      'A narrative documentary following boxer Thun Visuttirattanaporn, shot in Phuket,Thailand',
    duration: '5:32',
    videoUrl: `${CDN_BASE_URL}/Documentaries/Team%2018%20-%20The%20Fighter_Web.mp4`,
    // Poster is the mined t=269 frame -- the highest-scoring frame in the whole pool.
    posterUrl: `${CDN_BASE_URL}/thumbnails/v3/05-fighter-punch.jpg`,
    previewStart: 269,
  },
  {
    id: 6,
    title: 'Shanghai SpinExpo',
    category: 'Documentary',
    description: 'Promotional video coverage of the Shanghai SpinExpo trade show',
    duration: '2:10',
    videoUrl: `${CDN_BASE_URL}/Events/Shanghai%20SpinExpo.mp4`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/06-spinexpo-b.jpg`,
    previewStart: 65,
  },
  {
    id: 7,
    title: 'Coach Pre Fall 2019',
    category: 'Commercial',
    description: 'Coach Lights Up Shanghai - Pre Fall 2019 collection event coverage',
    duration: '1:30',
    videoUrl: `${CDN_BASE_URL}/Commercials/Fashion/Coach%20Lights%20Up%20Shanghai%20%7C%20Pre%20Fall%202019.mp4`,
    // The runway light shaft (v2/07-coach.jpg) is the HERO's image, so it is gone from this
    // file entirely rather than left here where a future mosaic entry could resurface it.
    // previewStart moves to the fur-hood moment too: a hover preview seeking to the runway
    // would put the hero's exact frame on a grid tile within a second.
    posterUrl: `${CDN_BASE_URL}/thumbnails/v3/07-coach-fur.jpg`,
    previewStart: 27,
  },
  {
    id: 8,
    title: 'Phorm x Wancaoyi Fall 2018',
    category: 'Commercial',
    description: '30-second teaser for Phorm and Wancaoyi Fall 2018 collections, shot in Hangzhou',
    duration: '0:30',
    videoUrl: `${CDN_BASE_URL}/Commercials/Fashion/30_Second_new_new.mp4`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/08-phorm-wancaoyi-b.jpg`,
    previewStart: 5,
    // Back as a frame contributor: the mined t=5 beauty close-up (yellow fabric slicing
    // the frame) was approved by the adversarial pool review. -b: re-cropped to the
    // frame's true 16:9 active area (the master is letterboxed; the first export baked
    // the matte into the tile).
    extraStills: [`${CDN_BASE_URL}/thumbnails/v3/08-phorm-beauty-b.jpg`],
  },
  {
    id: 9,
    title: 'China Citic Bank',
    category: 'Commercial',
    description: 'Commercial advertisement for China Citic Bank',
    duration: '1:31',
    videoUrl: `${CDN_BASE_URL}/Commercials/Financial/China%20Citic%20Bank%20Commercial.mp4`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/09-citic-bank.jpg`,
    previewStart: 13,
    // One still only, by the owner's instruction: this was a small credit and must not be
    // over-represented. The 4K night-car frame is a production still from the campaign
    // (archive TVC_Stills), owner-attributed; the campaign's other archive stills are
    // deliberately unused.
    extraStills: [`${CDN_BASE_URL}/thumbnails/v4/09-citic-night-car.jpg`],
  },
  {
    id: 10,
    title: 'Gin Mare - Trailer',
    category: 'Commercial',
    description: 'Trailer for Gin Mare premium gin brand',
    duration: '0:35',
    videoUrl: `${CDN_BASE_URL}/Commercials/Beverage/Gin%20Mare%20-%20Trailer%20HD.mov`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/10-gin-mare-b.jpg`,
    previewStart: 20,
  },
  {
    id: 11,
    title: 'CMPC 2019',
    category: 'Documentary',
    description:
      'Promotional video for CMPC 2019 event, CMPC (Compañía Manufacturera de Papeles y Cartones) is a pulp and paper company in Santiago de Chile',
    duration: '6:59',
    videoUrl: `${CDN_BASE_URL}/Events/CMPC%202019.mp4`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/11-cmpc-e.jpg`,
    previewStart: 140,
  },
  {
    id: 12,
    title: 'NIU eScooters - All New NGT and M+',
    category: 'Commercial',
    description:
      'Product launch video for NIU electric scooters NGT and M+ models (European Market)',
    duration: '3:04',
    videoUrl: `${CDN_BASE_URL}/Commercials/Automotive/NIU%20eScooters%20-%20All%20New%20NGT%20and%20M%2B.mov`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/12-niu-c.jpg`,
    previewStart: 92,
  },
  {
    id: 13,
    title: 'Shanghai 48HFP 2018: A Bullet, A Blank, A Piggybank',
    category: 'Film',
    description: 'Western genre entry for the 2018 Shanghai 48 Hour Film Project',
    duration: '7:45',
    videoUrl: `${CDN_BASE_URL}/Short_Films/48HFP/BLNK_ABULLETABLACKANDAPIGGYBANK_WESTERN.mp4`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/13-48hfp-2018.jpg`,
    previewStart: 80,
    // Back in the grid as a frame contributor: its own poster stays withheld, but the mined
    // t=80 frame was approved -- amber key on the face against a violet wall, and crucially
    // it still reads as a portrait at the ~404px the tile actually renders at.
    extraStills: [`${CDN_BASE_URL}/thumbnails/v3/13-48hfp-profile.jpg`],
  },
  {
    id: 14,
    title: 'Shanghai 48HFP 2017: Tales From The Penn',
    category: 'Film',
    description: '3rd place winner - Tales From The Penn Vol 37: An Unorthodox Fable',
    duration: '6:33',
    videoUrl: `${CDN_BASE_URL}/Short_Films/48HFP/TALES_FROM_THE_PENN_FINAL_BLNK.mp4`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/14-48hfp-2017.jpg`,
    previewStart: 340,
  },
  {
    id: 15,
    title: 'Zhen Ai (Altay Teaser)',
    category: 'Film',
    description: 'Teaser trailer for Zhen Ai, shot in Altay',
    duration: '0:51',
    videoUrl: `${CDN_BASE_URL}/Short_Films/Narrative/Zhen%20Ai%20-%20Insta2.mp4`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/15-zhen-ai-b.jpg`,
    previewStart: 26,
  },
  {
    id: 16,
    title: 'DP Reel (Operator)',
    category: 'Reels',
    description: "Chris McMillon's Director of Photography showreel",
    duration: '2:27',
    videoUrl: `${CDN_BASE_URL}/Reels/Personal/DP%20Reel%202018.mp4`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/16-dp-reel-d.jpg`,
    previewStart: 38,
    // Two distinct looks from the same reel: a teal-keyed profile close-up with red practical
    // detail (t=118, top-scoring in the mined pool) and the magenta opera-mask group, which is
    // the same image as this project's v2 poster, re-served from the v3 namespace.
    extraStills: [
      `${CDN_BASE_URL}/thumbnails/v3/16-dpreel-profile.jpg`,
      `${CDN_BASE_URL}/thumbnails/v3/16-dpreel-masks.jpg`,
    ],
  },
  {
    id: 17,
    title: 'Aerial Reel',
    category: 'Reels',
    description: "Chris McMillon's aerial cinematography showreel",
    duration: '2:05',
    videoUrl: `${CDN_BASE_URL}/Reels/Drone/Drone%20Reel%202018_1.mp4`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/17-drone-reel-e.jpg`,
    previewStart: 42,
    extraStills: [`${CDN_BASE_URL}/thumbnails/v2/frames/17-drone-reel-3.jpg`],
  },
  {
    id: 18,
    title: 'Jimmer Fredette - Monster Energy',
    category: 'Commercial',
    description: 'Monster Energy commercial featuring NBA player Jimmer Fredette',
    duration: '2:11',
    videoUrl: `${CDN_BASE_URL}/Commercials/Food_Beverage/Jimmer_FinalV2.mp4`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/18-jimmer-c.jpg`,
    previewStart: 70,
  },
  {
    id: 19,
    title: 'Huawei: See The Unseen',
    category: 'Commercial',
    description: 'TVC for Huawei technology',
    duration: '0:37',
    videoUrl: `${CDN_BASE_URL}/Commercials/Tech/Huawei_See_the_Unseen.mp4`,
    posterUrl: `${CDN_BASE_URL}/thumbnails/v2/19-huawei-c.jpg`,
    previewStart: 10,
  },
];

// Hero showreel: 6.0s micro-montage, 1920x804 at 5.2 Mbps (crf 17). Three segments, hard
// cuts, every one a lit human subject: opens on the yellow-silk portrait (BLNK reel,
// 17.9 Mbps master, tack sharp at 1:1), then the watchmakers' bench (China Citic Bank).
// Measured YAVG 82-118, YMAX 243-255 across the loop. The eye-on-palm frame deliberately
// is NOT in this cut — it is the lead STILL in the hero's evidence row, where a screenshot
// cannot miss it, and having it in both places would show the same picture twice.
export const heroVideo = {
  src: `${CDN_BASE_URL}/hero/v9/hero.mp4`,
  poster: `${CDN_BASE_URL}/hero/v9/poster.jpg`,
};

// Get featured video for the portfolio section
export const featuredVideo = videoProjects.find((v) => v.featured) ?? videoProjects[0];

/**
 * The mosaic, in render order: [projectId, stillIndex] where 0 is the project's own
 * posterUrl and 1..n index into its extraStills. Several tiles CAN resolve to one
 * project, but by the owner's direction the grid is one tile per project, in the
 * original portfolio order: the BLNK reel leads as the featured highlight, then the
 * projects run down the list in the order that reflects the owner's DP credit and
 * stake. Each tile shows that project's best vetted frame (its posterUrl).
 *
 * Render order fills the column beside the featured first, then subsequent rows three
 * at a time. On mobile the render order IS the visual order.
 */
const GRID_MOSAIC: ReadonlyArray<readonly [number, number]> = [
  [2, 0], // mario botta
  [3, 0], // bosch tvc
  [4, 0], // the millennial gentleman
  [5, 0], // the fighter
  [6, 0], // shanghai spinexpo
  [7, 0], // coach pre fall 2019
  [8, 0], // phorm x wancaoyi
  [9, 0], // china citic bank
  [10, 0], // gin mare
  [11, 0], // cmpc 2019
  [12, 0], // niu escooters
  [13, 0], // 48hfp 2018
  [14, 0], // 48hfp 2017
  [15, 0], // zhen ai
  [16, 0], // dp reel
  [17, 0], // aerial reel
  [18, 0], // jimmer fredette
  [19, 0], // huawei
];

/** One tile of the mosaic. Several tiles can resolve to the same project. */
export interface GridTile extends VideoProject {
  /** Unique per tile, since a project can appear more than once. */
  tileKey: string;
}

// Membership is curated: a producer's ceiling judgement forms on the weakest frame on
// screen, so projects whose best available frame does not hold up are withheld (data
// kept) rather than included for density.
export const gridVideos: GridTile[] = GRID_MOSAIC.flatMap(([id, still]) => {
  const project = videoProjects.find((v) => v.id === id);
  if (!project || project.featured || project.hideFromGrid) return [];
  const posterUrl = still === 0 ? project.posterUrl : project.extraStills?.[still - 1];
  if (!posterUrl) return [];
  return [{ ...project, posterUrl, tileKey: `${id}-${still}` }];
});

export type { VideoProject };
