/**
 * Community builds shown on the homepage.
 *
 * These are real Minecraft screenshots, not our generated scenes, and every one is used under a
 * Creative Commons licence its photographer actually granted - not pulled off an image search.
 * CC BY and CC BY-SA both require the credit to be visible next to the work, which is why the
 * attribution lives in the card rather than buried in a footer. Images are cropped to a common
 * card shape and otherwise unmodified.
 *
 * Do not add an entry here without a licence URL. If you cannot name the licence, we cannot use
 * the picture.
 */
export interface GalleryItem {
  /** basename in public/, expects <file>.webp and <file>-sm.webp */
  file: string;
  title: string;
  creator: string;
  creatorUrl?: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
}

export const GALLERY: GalleryItem[] = [
  {
    file: "build-planetoids",
    title: "Minecraft - Planetoids",
    creator: "colmmcsky",
    creatorUrl: "https://www.flickr.com/photos/8166986@N04",
    sourceUrl: "https://www.flickr.com/photos/8166986@N04/6020666456",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/"
  },
  {
    file: "build-village",
    title: "Render Image of our Minecraft Village",
    creator: "post-apocalyptic research institute",
    creatorUrl: "https://www.flickr.com/photos/73282154@N08",
    sourceUrl: "https://www.flickr.com/photos/73282154@N08/6730900775",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/"
  },
  {
    file: "build-pagoda",
    title: "Minecraft Screenshots\uff0d\u300c\u5510\u98a8\u6b78\u4f86\u8e0f\u6e05\u79cb\u8eca\u7ad9\u300d",
    creator: "kenming Wang",
    creatorUrl: "https://www.flickr.com/photos/12882975@N00",
    sourceUrl: "https://www.flickr.com/photos/12882975@N00/5701500611",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/"
  }
];
