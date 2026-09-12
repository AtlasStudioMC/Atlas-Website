/**
 * Real Minecraft screenshots used across the site.
 *
 * Every entry is used under a Creative Commons licence its author actually granted - checked
 * one at a time, not taken off an image search. Most are Xbox Mexico's own CC BY 3.0 releases,
 * which is a licence from the rights holder's side rather than a player licensing a screenshot
 * of someone else's game.
 *
 * CC BY and CC BY-SA both require the credit to be visible with the work, and both require
 * saying so when the work has been changed - hence `note`.
 *
 * Do not add an entry without a licence URL. If the licence cannot be named, the picture
 * cannot be used.
 */
export interface Shot {
  /** basename in public/, expects <file>.webp and <file>-sm.webp */
  file: string;
  title: string;
  creator: string;
  creatorUrl?: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  /** what was changed, which CC requires stating */
  note: string;
}

export const SHOTS: Record<string, Shot> = {
  "mc-frozen-ocean": {
    "file": "mc-frozen-ocean",
    "title": "Minecraft - Frozen ocean",
    "creator": "Xbox M\u00e9xico",
    "creatorUrl": "https://www.youtube.com/@xboxmexico",
    "sourceUrl": "https://commons.wikimedia.org/w/index.php?curid=176061965",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "note": "Cropped to fit"
  },
  "mc-taiga": {
    "file": "mc-taiga",
    "title": "Minecraft - Taiga",
    "creator": "Xbox M\u00e9xico",
    "creatorUrl": "https://www.youtube.com/@xboxmexico",
    "sourceUrl": "https://commons.wikimedia.org/w/index.php?curid=176061964",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "note": "Cropped to fit"
  },
  "mc-end": {
    "file": "mc-end",
    "title": "Screenshot from the Minecraft End",
    "creator": "Xbox M\u00e9xico",
    "creatorUrl": null,
    "sourceUrl": "https://commons.wikimedia.org/w/index.php?curid=167104771",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "note": "Cropped to fit"
  },
  "mc-end-city": {
    "file": "mc-end-city",
    "title": "Minecraft - End city",
    "creator": "Xbox M\u00e9xico",
    "creatorUrl": "https://www.youtube.com/@xboxmexico",
    "sourceUrl": "https://commons.wikimedia.org/w/index.php?curid=176061956",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "note": "Cropped to fit"
  },
  "mc-deep-dark": {
    "file": "mc-deep-dark",
    "title": "Minecraft - Deep Dark",
    "creator": "Xbox M\u00e9xico",
    "creatorUrl": "https://www.youtube.com/@xboxmexico",
    "sourceUrl": "https://commons.wikimedia.org/w/index.php?curid=175978694",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "note": "HUD cropped"
  },
  "mc-jungle": {
    "file": "mc-jungle",
    "title": "Minecraft - Jungle",
    "creator": "Xbox M\u00e9xico",
    "creatorUrl": "https://www.youtube.com/@xboxmexico",
    "sourceUrl": "https://commons.wikimedia.org/w/index.php?curid=176061955",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "note": "HUD cropped"
  }
};

/** The three that appear as cards on the homepage. */
export const GALLERY: Shot[] = ["mc-end-city", "mc-deep-dark", "mc-jungle"].map((k) => SHOTS[k]);
