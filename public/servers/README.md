Logos for the "Who's running it" row on the homepage.

Drop a file here (WebP or PNG, transparent background, around 120px tall), then add the entry to
`src/data/servers.ts`:

    { name: "Their Server", logo: "/servers/their-server.webp", href: "https://theirsite.net" }

Only add a server whose operator has agreed to be listed. The mark is theirs; a logo row implies
an endorsement, so it needs to be one they actually gave.

An entry with no `logo` renders the name as text, which is a fine way to list a server that has no
mark or has not sent one.
